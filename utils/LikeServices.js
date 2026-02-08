// Firebase imports
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

// Function to get sum of likes for a specific item
export const fetchTotalLikesByItemId = async (
  collectionName,
  itemIdField,
  itemId
) => {
  try {
    const likeRef = collection(db, collectionName);
    const q = query(likeRef, where(itemIdField, "==", itemId));
    const querySnapshot = await getDocs(q);
    let totalLikes = 0;
    querySnapshot.forEach(() => {
      totalLikes += 1;
    });
    return totalLikes;
  } catch (error) {
    console.error("Error fetching likes: ", error);
    return 0;
  }
};

// Function to get liked items by a specific user, limited by input, and return max length
export const fetchLikedItemsByUserId = async (
  collectionName,
  itemIdField,
  user_id,
  limitCount
) => {
  try {
    const likeRef = collection(db, collectionName);
    const q = query(likeRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);
    const likedItems = [];
    querySnapshot.forEach((doc) => {
      likedItems.push(doc.data()[itemIdField]);
    });
    const maxLength = likedItems.length;
    return {
      items: likedItems.slice(0, limitCount),
      maxLength,
    };
  } catch (error) {
    console.error("Error fetching liked items: ", error);
    return {
      items: [],
      maxLength: 0,
    };
  }
};

// Function to check if a user has liked a specific item
export const hasUserLikedItem = async (
  collectionName,
  itemIdField,
  itemId,
  user_id
) => {
  try {
    const likeRef = collection(db, collectionName);
    const q = query(
      likeRef,
      where(itemIdField, "==", itemId),
      where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user liked item: ", error);
    return false;
  }
};

// Function to like an item
export const likeItem = async (
  collectionName,
  itemIdField,
  itemId,
  user_id
) => {
  try {
    const likeRef = collection(db, collectionName);
    const hasLiked = await hasUserLikedItem(
      collectionName,
      itemIdField,
      itemId,
      user_id
    );
    if (!hasLiked) {
      await addDoc(likeRef, {
        [itemIdField]: itemId,
        user_id,
        timestamp: serverTimestamp(),
      });
      return true;
    } else {
      console.log("User has already liked this item.");
      return false;
    }
  } catch (error) {
    console.error("Error liking item:", error);
    return false;
  }
};

// Function to unlike an item
export const unlikeItem = async (
  collectionName,
  itemIdField,
  itemId,
  user_id
) => {
  try {
    const likeRef = collection(db, collectionName);
    const q = query(
      likeRef,
      where(itemIdField, "==", itemId),
      where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) {
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, collectionName, docId));
      return true;
    } else {
      console.log("No existing like found for this user on this item.");
      return false;
    }
  } catch (error) {
    console.error("Error unliking item:", error);
    return false;
  }
};

// Get ID of like document
