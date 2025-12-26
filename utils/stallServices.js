// Firebase imports
import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";

// Function to fetch stall data
const fetchStallData = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "stalls"));
    const stallsData = querySnapshot.docs.map((doc) => doc.data());
    return stallsData;
  } catch (error) {
    console.error("Error fetching stall data: ", error);
    return [];
  }
};

// Function to add a new stall
const addNewStall = async (stallData) => {
  try {
    console.log("Adding new stall with data: ", stallData);
    const stallsCollection = collection(db, "stalls");
    await addDoc(stallsCollection, stallData);
    return true;
  } catch (error) {
    console.error("Error adding new stall: ", error);
    return false;
  }
};

// Function to update stall data
const updateStallData = async (stallId, updatedData) => {
  try {
    const stallRef = doc(db, "stalls", stallId);
    await updateDoc(stallRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating stall data: ", error);
    return false;
  }
};

export { addNewStall, fetchStallData, updateStallData };
