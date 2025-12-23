// Firebase imports
import { db } from "@/utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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
  role: string;
}

// Function to fetch a single user by clerk_id field
const fetchUserByClerkId = async (clerk_id: string) => {
  try {
    console.log("Fetching user with clerk_id:", clerk_id);
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

export { fetchUserByClerkId, fetchUserData };
