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

// Function to get sum of likes for a specific review
export const fetchTotalLikesByReviewId = async (reviewId) => {
  try {
    const reivewRed = collection(db, "reviews_likes");
    const q = query(reivewRed, where("review_id", "==", reviewId));
    const querySnapshot = await getDocs(q);
    let totalLikes = 0;
    querySnapshot.forEach((doc) => {
      totalLikes += 1;
    });
    return totalLikes;
  } catch (error) {
    console.error("Error fetching likes: ", error);
    return 0;
  }
};

// Function to get liked reviews by a specific user
export const fetchLikedReviewsByUserId = async (user_id) => {
  try {
    const reviewLikeRef = collection(db, "reviews_likes");
    const q = query(reviewLikeRef, where("user_id", "==", user_id));
    const querySnapshot = await getDocs(q);
    const likedReviews = [];
    querySnapshot.forEach((doc) => {
      likedReviews.push(doc.data().review_id);
    });
    return likedReviews;
  } catch (error) {
    console.error("Error fetching liked reviews: ", error);
    return [];
  }
};

// Function to check if a user has liked a specific review
export const hasUserLikedReview = async (review_id, user_id) => {
  try {
    const reviewLikeRef = collection(db, "reviews_likes");
    const q = query(
      reviewLikeRef,
      where("review_id", "==", review_id),
      where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error checking if user liked review: ", error);
    return false;
  }
};

// Function to like a review
export const likeReview = async (review_id, user_id) => {
  try {
    const reviewLikeRef = collection(db, "reviews_likes");
    const hasLiked = await hasUserLikedReview(review_id, user_id);
    // Check if the user has already liked the review
    if (!hasLiked) {
      // If no existing like document, create one'
      await addDoc(reviewLikeRef, {
        review_id,
        user_id,
        timestamp: serverTimestamp(),
      });
      return true;
    } else {
      console.log("User has already liked this review.");
      return false;
    }
  } catch (error) {
    console.error("Error liking review: ", error);
    return false;
  }
};

// Function to unlike a review
export const unlikeReview = async (review_id, user_id) => {
  try {
    const reviewLikeRef = collection(db, "reviews_likes");
    const q = query(
      reviewLikeRef,
      where("review_id", "==", review_id),
      where("user_id", "==", user_id)
    );
    const querySnapshot = await getDocs(q);
    const hasLiked = await hasUserLikedReview(review_id, user_id);
    if (hasLiked) {
      // If existing like document found, delete it
      const docId = querySnapshot.docs[0].id;
      await deleteDoc(doc(db, "reviews_likes", docId));
      return true;
    } else {
      console.log("No existing like found for this user on this review.");
      return false;
    }
  } catch (error) {
    console.error("Error unliking review: ", error);
    return false;
  }
};
