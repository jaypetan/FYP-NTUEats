// Firebase imports
import { db } from "@/utils/firebase";
import {
    Timestamp,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from "firebase/firestore";

// Function to add user logs
export const addUserLog = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);

    await setDoc(
      userDocRef,
      {
        latest_log_at: Timestamp.now(),
      },
      { merge: true },
    );
  } catch (error) {
    console.error("Error adding user log: ", error);
  }
};

// Function to check recipe like notifications since latest log timestamp
export const checkRecipeLikeNotificationTimestamp = async (userId) => {
  return checkLikesSinceLatestLog({
    userId,
    sourceCollectionName: "recipes",
    ownerField: "user_id",
    likesCollectionName: "recipes_likes",
    likeTargetField: "recipe_id",
    idKey: "recipe_id",
  });
};

// Function to check review likes since latest log timestamp
export const checkReviewLikeNotificationTimestamp = async (userId) => {
  return checkLikesSinceLatestLog({
    userId,
    sourceCollectionName: "reviews",
    ownerField: "user_id",
    likesCollectionName: "reviews_likes",
    likeTargetField: "review_id",
    idKey: "review_id",
  });
};

// Function to check recipe comment likes since latest log timestamp
export const checkRecipeCommentLikeNotificationTimestamp = async (userId) => {
  return checkLikesSinceLatestLog({
    userId,
    sourceCollectionName: "recipe_comments",
    ownerField: "user_id",
    likesCollectionName: "recipe_comments_likes",
    likeTargetField: "recipe_comment_id",
    idKey: "recipe_comment_id",
  });
};

const checkLikesSinceLatestLog = async ({
  userId,
  sourceCollectionName,
  ownerField,
  likesCollectionName,
  likeTargetField,
  idKey,
}) => {
  try {
    // Validate userId
    if (typeof userId !== "string" || !userId.trim()) {
      return {
        countsByItem: {},
        countsByItemArray: [],
        totalLikesSinceLastLog: 0,
      };
    }

    // Fetch the user's latest log timestamp
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    const latestLogAt = userDoc.exists()
      ? userDoc.data().latest_log_at || Timestamp.fromMillis(0)
      : Timestamp.fromMillis(0);

    // Fetch the IDs of the items owned by the user
    const sourceRef = collection(db, sourceCollectionName);
    const sourceQuery = query(sourceRef, where(ownerField, "==", userId));
    const sourceSnapshot = await getDocs(sourceQuery);
    const ownedIds = sourceSnapshot.docs.map((sourceDoc) => sourceDoc.id);

    console.log("Owned item IDs for", sourceCollectionName, ownedIds);

    // If the user doesn't own any items, return early with empty counts
    if (ownedIds.length === 0) {
      return {
        countsByItem: {},
        countsByItemArray: [],
        totalLikesSinceLastLog: 0,
      };
    }

    // Fetch likes for the owned items since the latest log timestamp
    const likesRef = collection(db, likesCollectionName);
    const countsByItem = {};
    const latestLogMillis =
      latestLogAt instanceof Timestamp ? latestLogAt.toMillis() : 0;

    for (let index = 0; index < ownedIds.length; index += 10) {
      const idChunk = ownedIds.slice(index, index + 10); // Firestore 'in' queries can only handle up to 10 items
      const likesQuery = query(likesRef, where(likeTargetField, "in", idChunk));
      const likesSnapshot = await getDocs(likesQuery);
      console.log(
        `Fetched likes for ${sourceCollectionName} items with IDs:`,
        idChunk,
        "Total likes fetched:",
        likesSnapshot.size,
      );

      // Count likes by item ID
      likesSnapshot.forEach((likeDoc) => {
        const likeData = likeDoc.data();
        const likeTimestamp = likeData.timestamp;
        const likeTimestampMillis =
          likeTimestamp instanceof Timestamp ? likeTimestamp.toMillis() : 0;

        // Only count likes that occurred after the latest log timestamp
        if (likeTimestampMillis <= latestLogMillis) {
          return;
        }

        const itemId = likeData[likeTargetField];
        countsByItem[itemId] = (countsByItem[itemId] || 0) + 1;
      });
    }

    // Convert countsByItem to an array format for easier processing in the frontend
    const countsByItemArray = Object.entries(countsByItem).map(
      ([itemId, likes_count]) => ({
        [idKey]: itemId,
        likes_count,
      }),
    );

    // Calculate total likes since the last log
    const totalLikesSinceLastLog = countsByItemArray.reduce(
      (sum, item) => sum + item.likes_count,
      0,
    );

    return {
      countsByItem,
      countsByItemArray,
      totalLikesSinceLastLog,
    };
  } catch (error) {
    console.error("Error checking notification timestamps: ", error);
    return {
      countsByItem: {},
      countsByItemArray: [],
      totalLikesSinceLastLog: 0,
    };
  }
};
