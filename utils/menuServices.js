// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
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

// Function to add a new menu item
export const addNewMenuItem = async (menuData) => {
  try {
    // Get stall data to construct image path
    const stallSnap = await getDoc(doc(db, "stalls", menuData.stall_id));
    const stallData = stallSnap.data();
    if (!stallData) throw new Error("Stall not found for the given stall_id");
    const location = stallData.location.toLowerCase().replace(/\s+/g, ""); // remove spaces
    const name = stallData.name.toLowerCase().replace(/\s+/g, ""); // remove spaces
    // Fetch existing menu items to determine next item number
    const menuItems = await fetchMenuItemsByStallId(menuData.stall_id);
    const nextItemNumber = menuItems.length + 1;

    // Upload menu item image and get URL
    const path = `eatWHAT/menu-${location}-${name}-${nextItemNumber}.jpeg`;
    const imageUrl = await uploadImageAsync(menuData.image, path);
    menuData.image = imageUrl;

    // Add likes = 0 by default
    menuData.likes = 0;

    // Add timestamp
    menuData.created_at = serverTimestamp();

    console.log("Adding new menu item with data: ", menuData);
    const menuCollection = collection(db, "menus");
    await addDoc(menuCollection, menuData);
    return true;
  } catch (error) {
    console.error("Error adding new menu item: ", error);
    return false;
  }
};

// Function to fetch menu items for a specific stall
export const fetchMenuItemsByStallId = async (stallId) => {
  try {
    const menuRef = collection(db, "menus");
    const q = query(menuRef, where("stall_id", "==", stallId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching menu items: ", error);
    return [];
  }
};
