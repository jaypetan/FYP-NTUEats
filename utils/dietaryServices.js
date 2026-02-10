// Firebase imports
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

// Dietary Services for stalls
// Function to get dietary preferences by stall id
export const fetchDietaryByStallId = async (stall_id) => {
  try {
    const dietaryRef = collection(db, "stalls_dietary");
    const q = query(dietaryRef, where("stall_id", "==", stall_id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return {
        id: null,
        stall_id: stall_id,
        halal: false,
        vegetarian: false,
      };
    }
  } catch (error) {
    console.error("Error fetching dietary preferences: ", error);
    return {
      id: null,
      stall_id: stall_id,
      halal: false,
      vegetarian: false,
    };
  }
};

// Function to update dietary info for a stall
export const updateStallDietary = async (stall_id, dietaryInfo) => {
  try {
    const dietaryRef = collection(db, "stalls_dietary");
    const q = query(dietaryRef, where("stall_id", "==", stall_id));
    const querySnapshot = await getDocs(q);

    const isEmpty = !dietaryInfo?.halal && !dietaryInfo?.vegetarian;

    if (isEmpty) {
      // Delete all matching documents
      const deletePromises = querySnapshot.docs.map((d) =>
        deleteDoc(doc(db, "stalls_dietary", d.id))
      );
      await Promise.all(deletePromises);
      return "deleted";
    } else {
      if (!querySnapshot.empty) {
        // Update the first matching document
        const docId = querySnapshot.docs[0].id;
        await setDoc(doc(db, "stalls_dietary", docId), {
          stall_id,
          halal: !!dietaryInfo.halal,
          vegetarian: !!dietaryInfo.vegetarian,
        });
      } else {
        // Add new document
        await addDoc(dietaryRef, {
          stall_id,
          halal: !!dietaryInfo.halal,
          vegetarian: !!dietaryInfo.vegetarian,
        });
      }
      return "updated";
    }
  } catch (error) {
    console.error("Error updating stall dietary info:", error);
    return "error";
  }
};

// Function to fetch all stalls with a selected dietary restriction
export const fetchAllStallsWithSelectedRestriction = async (
  selectedRestriction
) => {
  try {
    const dietaryRef = collection(db, "stalls_dietary");
    const q = query(dietaryRef, where(selectedRestriction, "==", true));
    const querySnapshot = await getDocs(q);

    const stallsWithSelectedRestriction = querySnapshot.docs.map((doc) => ({
      id: doc.data().stall_id,
    }));
    return stallsWithSelectedRestriction;
  } catch (error) {
    console.error("Error fetching stalls with selected restriction: ", error);
    return [];
  }
};

// Dietary Services for recipes
// Function to get dietary preferences by recipe id
export const fetchDietaryByRecipeId = async (recipe_id) => {
  try {
    const dietaryRef = collection(db, "recipes_dietary");
    const q = query(dietaryRef, where("recipe_id", "==", recipe_id));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      return {
        id: null,
        recipe_id: recipe_id,
        halal: false,
        vegetarian: false,
      };
    }
  } catch (error) {
    console.error("Error fetching dietary preferences: ", error);
    return {
      id: null,
      recipe_id: recipe_id,
      halal: false,
      vegetarian: false,
    };
  }
};

// Function to update dietary info for a recipe
export const updateRecipeDietary = async (recipe_id, dietaryInfo) => {
  try {
    const dietaryRef = collection(db, "recipes_dietary");
    const q = query(dietaryRef, where("recipe_id", "==", recipe_id));
    const querySnapshot = await getDocs(q);

    const isEmpty = !dietaryInfo?.halal && !dietaryInfo?.vegetarian;

    if (isEmpty) {
      // Delete all matching documents
      const deletePromises = querySnapshot.docs.map((d) =>
        deleteDoc(doc(db, "recipes_dietary", d.id))
      );
      await Promise.all(deletePromises);
      return "deleted";
    } else {
      if (!querySnapshot.empty) {
        // Update the first matching document
        const docId = querySnapshot.docs[0].id;
        await setDoc(doc(db, "recipes_dietary", docId), {
          recipe_id,
          halal: !!dietaryInfo.halal,
          vegetarian: !!dietaryInfo.vegetarian,
        });
      } else {
        // Add new document
        await addDoc(dietaryRef, {
          recipe_id,
          halal: !!dietaryInfo.halal,
          vegetarian: !!dietaryInfo.vegetarian,
        });
      }
      return "updated";
    }
  } catch (error) {
    console.error("Error updating recipe dietary info:", error);
    return "error";
  }
};
