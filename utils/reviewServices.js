// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchUserByClerkId } from "@/utils/userServices";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

// Function to add a new review
export const addNewReview = async (reviewData) => {
  try {
    // Upload review image and get URL if review_pic exists
    if (reviewData.review_pic) {
      // Get stall data to construct image path
      const stallSnap = await getDoc(doc(db, "stalls", reviewData.stall_id));
      const stallData = stallSnap.data();
      if (!stallData) throw new Error("Stall not found for the given stall_id");
      const location = stallData.location.toLowerCase().replace(/\s+/g, ""); // remove spaces
      const name = stallData.name.toLowerCase().replace(/\s+/g, ""); // remove spaces
      // Fetch existing reviews to determine next review number
      const reviews = await fetchReviewsByStallId(reviewData.stall_id);
      const nextReviewNumber = reviews.length + 1;

      // Upload review image and get URL
      const path = `eatWHAT/review-${location}-${name}-${nextReviewNumber}.jpeg`;
      const imageUrl = await uploadImageAsync(reviewData.review_pic, path);
      reviewData.review_pic = imageUrl;
    }

    // Convert clerk_id to user_id
    const userData = await fetchUserByClerkId(reviewData.user_id);
    if (!userData) throw new Error("User not found for the given clerk_id");
    reviewData.user_id = userData.id;

    // Add timestamp
    reviewData.timestamp = serverTimestamp();

    console.log("Adding new review with data: ", reviewData);
    const reviewsCollection = collection(db, "reviews");
    await addDoc(reviewsCollection, reviewData);
    return true;
  } catch (error) {
    console.error("Error adding new review: ", error);
    return false;
  }
};

// Function to fetch reviews for a specific stall
export const fetchReviewsByStallId = async (stallId) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("stall_id", "==", stallId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

// Function to get review data by ID
export const getReviewDataById = async (reviewId) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    const reviewSnap = await getDoc(reviewRef);
    if (reviewSnap.exists()) {
      return {
        id: reviewSnap.id,
        ...reviewSnap.data(),
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
export const fetchReviewImagesByStallId = async (stallId) => {
  try {
    const reviews = await fetchReviewsByStallId(stallId);
    return reviews.map((review) => review.review_pic).filter((url) => url); // Filter out undefined or null URLs
  } catch (error) {
    console.error("Error fetching review images: ", error);
    return [];
  }
};
