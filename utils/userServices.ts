// Firebase imports
import { db } from "@/utils/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// Function to fetch user data
export const fetchUserData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersData = querySnapshot.docs.map((doc) => doc.data());
    return usersData;
  } catch (error) {
    console.error("Error fetching user data: ", error);
    return [];
  }
};

interface UserData {
  id: string;
  clerk_id: string;
  username: string;
  role: string;
}

// Function to fetch a single user by clerk_id field
export const fetchUserByClerkId = async (clerk_id: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("clerk_id", "==", clerk_id));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      // Return the first matching user
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as UserData;
    } else {
      console.error("No user with that clerk_id!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by clerk_id: ", error);
    return null;
  }
};

// Function to fetch user data by document ID
export const fetchUserByDocId = async (docId: string) => {
  try {
    const userDocRef = doc(db, "users", docId);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      return {
        id: userDocSnap.id,
        ...userDocSnap.data(),
      } as UserData;
    } else {
      console.error("No user with that document ID!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by document ID: ", error);
    return null;
  }
};

// Function to create user data if it doesn't already exist
export const createUserData = async (
  clerkId: string,
  username: string,
  role: string,
) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("clerk_id", "==", clerkId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // If no user exists with that clerk_id, create a new user document
      const newUserRef = doc(usersRef);
      await setDoc(newUserRef, {
        clerk_id: clerkId,
        username: username,
        role: role,
      });
      return {
        id: newUserRef.id,
        clerk_id: clerkId,
        username: username,
        role: role,
      } as UserData;
    } else {
      // User already exists
      return null;
    }
  } catch (error) {
    console.error("Error creating user data: ", error);
    return null;
  }
};

// Dietry restriction options
// Function to edit dietary restriction for a user
export const editDietaryRestrictions = async (
  userId: string,
  restriction: string,
  value: boolean,
) => {
  try {
    if (!userId) {
      console.error("User ID is required to edit dietary restrictions.");
      return null;
    }
    if (restriction !== "halal" && restriction !== "vegetarian") {
      console.error(
        "Invalid restriction type. Must be 'halal' or 'vegetarian'.",
      );
      return null;
    }
    // Check if a dietary restriction document already exists for the user
    const dietaryRef = collection(db, "users_dietary");
    const existingRestrictionQuery = query(
      dietaryRef,
      where("user_id", "==", userId),
      limit(1),
    );
    const existingRestrictionSnapshot = await getDocs(existingRestrictionQuery);

    // Reference to the document to update or create
    const restrictionRef = existingRestrictionSnapshot.empty
      ? doc(dietaryRef)
      : existingRestrictionSnapshot.docs[0].ref;

    const existingData = existingRestrictionSnapshot.empty
      ? {}
      : existingRestrictionSnapshot.docs[0].data();

    // Determine the new values for halal and vegetarian based on the input so that we can delete the document if both are false
    const nextHalal =
      restriction === "halal" ? value : Boolean(existingData.halal);
    const nextVegetarian =
      restriction === "vegetarian" ? value : Boolean(existingData.vegetarian);
    if (!nextHalal && !nextVegetarian) {
      if (!existingRestrictionSnapshot.empty) {
        await deleteDoc(restrictionRef);
      }

      return {
        id: restrictionRef.id,
        user_id: userId,
        halal: false,
        vegetarian: false,
      };
    }

    const restrictionData = {
      user_id: userId,
      halal: nextHalal,
      vegetarian: nextVegetarian,
    };

    await setDoc(restrictionRef, restrictionData, { merge: true });

    return {
      id: restrictionRef.id,
      ...restrictionData,
    };
  } catch (error) {
    console.error("Error editing dietary restriction: ", error);
    return null;
  }
};

// Function to fetch dietary restrictions for a user
export const fetchDietaryRestrictions = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, "users_dietary"));
    const restrictionsData = querySnapshot.docs
      .filter((doc) => doc.data().user_id === userId)
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    return restrictionsData;
  } catch (error) {
    console.error("Error fetching dietary restrictions: ", error);
    return [];
  }
};
