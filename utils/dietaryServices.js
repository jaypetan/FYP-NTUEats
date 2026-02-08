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
