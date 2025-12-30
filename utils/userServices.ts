// Firebase imports
import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

// Function to fetch user data
const fetchUserData = async () => {
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
const fetchUserByClerkId = async (clerk_id: string) => {
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
const fetchUserByDocId = async (docId: string) => {
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

export { fetchUserByClerkId, fetchUserByDocId, fetchUserData };
