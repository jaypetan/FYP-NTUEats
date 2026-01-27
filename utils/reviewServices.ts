// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

interface ReviewData {
  stall_id: string;
  user_id: string; // clerk_id initially, will be converted to user_id
  rating: number;
  comment: string;
  timestamp?: any;
  review_pic?: string;
}

interface ReviewWithLikes extends ReviewData {
  id: string;
  likes: number;
}

// Function to add a new review
export const addNewReview = async (
  reviewData: ReviewData
): Promise<boolean> => {
  try {
    const reviewToAdd = { ...reviewData };

    // Upload review image and get URL if review_pic exists
    if (reviewToAdd.review_pic) {
      const stallSnap = await getDoc(doc(db, "stalls", reviewToAdd.stall_id));
      const stallData = stallSnap.data();
      if (!stallData) throw new Error("Stall not found for the given stall_id");
      const location = stallData.location.toLowerCase().replace(/\s+/g, "");
      const name = stallData.name.toLowerCase().replace(/\s+/g, "");
      const reviews = await fetchReviewsByStallId(reviewToAdd.stall_id);
      const nextReviewNumber = reviews.length + 1;
      const path = `eatWHAT/review-${location}-${name}-${nextReviewNumber}.jpeg`;
      const imageUrl = await uploadImageAsync(reviewToAdd.review_pic, path);
      reviewToAdd.review_pic = imageUrl || "";
    }

    // Convert clerk_id to user_id
    const userData = await fetchUserByClerkId(reviewToAdd.user_id);
    if (!userData) throw new Error("User not found for the given clerk_id");
    reviewToAdd.user_id = userData.id;

    // Add timestamp
    reviewToAdd.timestamp = serverTimestamp();

    console.log("Adding new review with data: ", reviewToAdd);
    const reviewsCollection = collection(db, "reviews");
    await addDoc(reviewsCollection, reviewToAdd);
    return true;
  } catch (error) {
    console.error("Error adding new review: ", error);
    return false;
  }
};

// Function to fetch reviews for a specific stall
export const fetchReviewsByStallId = async (
  stallId: string
): Promise<ReviewWithLikes[]> => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("stall_id", "==", stallId));
    const querySnapshot = await getDocs(q);

    const reviews = querySnapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    })) as ReviewWithLikes[];

    // Fetch likes for each review
    const reviewsWithLikes = await Promise.all(
      reviews.map(async (review) => {
        const likes = await fetchTotalLikesByItemId(
          "reviews_likes",
          "review_id",
          review.id
        );
        return { ...review, likes };
      })
    );

    return reviewsWithLikes;
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

// Arrange by most recent review or most liked review
export const getReviewArranged = async (
  stallId: string,
  arrangeBy: "most_recent" | "most_liked" | string,
  limitNum?: number
): Promise<{ data: ReviewWithLikes[]; length: number }> => {
  const reviews = await fetchReviewsByStallId(stallId);
  let sortedReviews = [...reviews];

  if (arrangeBy === "most_recent") {
    sortedReviews = reviews.sort((a, b) => {
      const aTime =
        a.timestamp instanceof Timestamp ? a.timestamp.toMillis() : 0;
      const bTime =
        b.timestamp instanceof Timestamp ? b.timestamp.toMillis() : 0;
      return bTime - aTime;
    });
  } else if (arrangeBy === "most_liked") {
    sortedReviews = reviews.sort((a, b) => b.likes - a.likes);
  }

  if (typeof limitNum === "number" && limitNum > 0) {
    sortedReviews = sortedReviews.slice(0, limitNum);
  }

  return { data: sortedReviews, length: reviews.length };
};

// Function to get review data by ID
export const getReviewDataById = async (
  reviewId: string
): Promise<ReviewWithLikes | null> => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);
    if (reviewSnap.exists()) {
      const data = reviewSnap.data() as ReviewData;
      const likes = await fetchTotalLikesByItemId(
        "reviews_likes",
        "review_id",
        reviewSnap.id
      );
      return {
        id: reviewSnap.id,
        ...data,
        likes,
      };
    } else {
      console.log("No such review!");
      return null;
    }
  } catch (error) {
    console.error("Error getting review data: ", error);
    return null;
  }
};

// Function to fetch all images from reviews for a specific stall
export const fetchReviewImagesByStallId = async (
  stallId: string
): Promise<string[]> => {
  try {
    const reviews = await getReviewArranged(stallId, "most_liked");
    return reviews.data
      .map((review) => review.review_pic)
      .filter((url): url is string => !!url);
  } catch (error) {
    console.error("Error fetching review images: ", error);
    return [];
  }
};

// Function to fetch review image with most likes for a specific stall
export const fetchTopReviewImageByStallId = async (
  stallId: string
): Promise<string | null> => {
  try {
    const reviews = await getReviewArranged(stallId, "most_liked");
    const reviewsWithPic = reviews.data.filter(
      (r) => r.review_pic && r.review_pic !== ""
    );
    if (reviewsWithPic.length === 0) return null;
    const topReview = reviewsWithPic.reduce((max, review) =>
      review.likes > max.likes ? review : max
    );
    return topReview.review_pic || null;
  } catch (error) {
    console.error("Error fetching top review image: ", error);
    return null;
  }
};
