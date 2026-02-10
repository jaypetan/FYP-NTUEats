// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { formatDate } from "@/utils/sharedFunctions";
import { fetchUserByClerkId, fetchUserByDocId } from "@/utils/userServices";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
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

    const reviews = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch likes and user data for each review, and format date
    const updatedReviews = await Promise.all(
      reviews.map(async (review) => {
        const [likes, userData] = await Promise.all([
          fetchTotalLikesByItemId("reviews_likes", "review_id", review.id),
          fetchUserByDocId(review.user_id),
        ]);

        const userName =
          userData && userData.username ? userData.username : "Unknown User";
        const formattedDate =
          review.timestamp && review.timestamp.seconds
            ? formatDate(review.timestamp.seconds)
            : "Unknown Date";
        return {
          ...review,
          likes,
          name: userName,
          reviewDate: formattedDate,
        };
      })
    );

    return { data: updatedReviews, length: updatedReviews.length };
  } catch (error) {
    console.error("Error fetching reviews: ", error);
    return [];
  }
};

// Arrange by most recent review or most liked review
export const getReviewArranged = async (stallId, arrangeBy, limitNum) => {
  let reviews = await fetchReviewsByStallId(stallId);
  let sortedReviews = reviews.data;

  // Sort reviews based on arrangement criteria
  if (arrangeBy === "most_recent") {
    sortedReviews = sortedReviews.sort(
      (a, b) => b.timestamp?.toMillis() - a.timestamp?.toMillis()
    );
  } else if (arrangeBy === "most_liked") {
    sortedReviews = sortedReviews.sort((a, b) => b.likes - a.likes);
  } else {
    sortedReviews = sortedReviews; // No specific arrangement
  }

  // Apply limit if specified
  if (typeof limitNum === "number" && limitNum > 0) {
    sortedReviews = sortedReviews.slice(0, limitNum);
  }

  return { data: sortedReviews, length: reviews.length };
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
      return {
        id: null,
        stall_id: null,
        user_id: null,
        rating: null,
        title: null,
        content: null,
        review_pic: null,
        timestamp: null,
      };
    }
  } catch (error) {
    console.error("Error getting review data: ", error);
    return null;
  }
};

// Function to fetch all images from reviews for a specific stall
export const fetchReviewImagesByStallId = async (stallId) => {
  try {
    const reviews = await getReviewArranged(stallId, "most_liked");
    return reviews.data.map((review) => review.review_pic).filter((url) => url); // Filter out undefined or null URLs
  } catch (error) {
    console.error("Error fetching review images: ", error);
    return [];
  }
};

// Function to fetch review image with most likes for a specific stall
export const fetchTopReviewImageByStallId = async (stallId) => {
  try {
    const reviews = await getReviewArranged(stallId, "most_liked");
    // Filter reviews with a valid review_pic
    const reviewsWithPic = reviews.data.filter(
      (r) => r.review_pic && r.review_pic !== ""
    );
    if (reviewsWithPic.length === 0) return null;
    // Find the review with the maximum likes
    const topReview = reviewsWithPic.reduce((max, review) =>
      review.likes > max.likes ? review : max
    );
    return topReview.review_pic || null;
  } catch (error) {
    console.error("Error fetching top review image: ", error);
    return null;
  }
};

// Function to get reviews by a specific user
export const getReviewsByUserId = async (userId) => {
  try {
    const reviewsRef = collection(db, "reviews");
    const q = query(reviewsRef, where("user_id", "==", userId));
    const querySnapshot = await getDocs(q);

    const reviews = await Promise.all(
      querySnapshot.docs.map(async (reviewDoc) => {
        const data = reviewDoc.data();
        const likes = await fetchTotalLikesByItemId(
          "reviews_likes",
          "review_id",
          reviewDoc.id
        );
        const stallSnap = await getDoc(doc(db, "stalls", data.stall_id));
        const stallData = stallSnap.data();
        const stallName = stallData ? stallData.name : "Unknown Stall";
        return {
          id: reviewDoc.id,
          likes,
          stall_name: stallName,
          ...data,
        };
      })
    );

    return reviews;
  } catch (error) {
    console.error("Error fetching reviews by user: ", error);
    return [];
  }
};

// Arrange reviews by user ID, with sorting and limiting options
export const arrangeReviewsByUserId = async (
  userId,
  arrangementType,
  limitNum
) => {
  try {
    const reviews = await getReviewsByUserId(userId);

    // Sort by arrangementType
    if (arrangementType === "most_likes") {
      reviews.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      reviews.sort((a, b) => b.timestamp - a.timestamp);
    }

    const total = reviews.length;
    const limitedReviews =
      typeof limitNum === "number" && limitNum > 0
        ? reviews.slice(0, limitNum)
        : reviews;

    return { content: limitedReviews, total };
  } catch (error) {
    console.error("Error arranging user reviews: ", error);
    return { content: [], total: 0 };
  }
};

// Function to edit an existing review
export const editReviewById = async (reviewId, updatedData) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);

    // If there's a new review_pic, upload it
    if (updatedData.review_pic) {
      const reviewSnap = await getDoc(reviewRef);
      const reviewData = reviewSnap.data();
      if (!reviewData)
        throw new Error("Review not found for the given reviewId");

      const stallSnap = await getDoc(doc(db, "stalls", reviewData.stall_id));
      const stallData = stallSnap.data();
      if (!stallData) throw new Error("Stall not found for the given stall_id");

      const location = stallData.location.toLowerCase().replace(/\s+/g, ""); // remove spaces
      const name = stallData.name.toLowerCase().replace(/\s+/g, ""); // remove spaces

      // Use existing review number from the review data
      const reviews = await fetchReviewsByStallId(reviewData.stall_id);
      const reviewIndex = reviews.data.findIndex((r) => r.id === reviewId);
      const reviewNumber = reviewIndex + 1;

      // Upload new review image and get URL
      const path = `eatWHAT/review-${location}-${name}-${reviewNumber}.jpeg`;
      const imageUrl = await uploadImageAsync(updatedData.review_pic, path);
      updatedData.review_pic = imageUrl;
    }

    // Update the review document
    await updateDoc(reviewRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error editing review: ", error);
    return false;
  }
};

// Function to delete a review by ID
export const deleteReviewById = async (reviewId) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await deleteDoc(reviewRef);
    return true;
  } catch (error) {
    console.error("Error deleting review: ", error);
    return false;
  }
};
