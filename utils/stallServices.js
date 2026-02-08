// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Function to add a new stall
export const addNewStall = async (stallData) => {
  try {
    // Upload stall image and get URL
    const location = stallData.location.toLowerCase().replace(/\s+/g, ""); // remove spaces
    const name = stallData.name.toLowerCase().replace(/\s+/g, ""); // remove spaces
    const path = `eatWHAT/stall-${location}-${name}.jpeg`;
    const imageUrl = await uploadImageAsync(stallData.stall_pic, path);
    stallData.stall_pic = imageUrl;

    // Add timestamp
    stallData.created_at = serverTimestamp();

    console.log("Adding new stall with data: ", stallData);
    const stallsCollection = collection(db, "stalls");
    const docRef = await addDoc(stallsCollection, stallData);
    return docRef.id;
  } catch (error) {
    console.error("Error adding new stall: ", error);
    return false;
  }
};

// Function to fetch stall data and return both data and length
export const fetchStallData = async () => {
  try {
    const q = collection(db, "stalls");
    const querySnapshot = await getDocs(q);

    const stallsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const stallsDataWithSaves = await Promise.all(
      stallsData.map(async (stall) => {
        const saves = await fetchTotalLikesByItemId(
          "stalls_saved",
          "stall_id",
          stall.id
        );
        return { ...stall, saves };
      })
    );

    return { data: stallsDataWithSaves, length: stallsData.length };
  } catch (error) {
    console.error("Error fetching stall data: ", error);
    return { data: [], length: 0 };
  }
};

// Function to arrange stalls
export const getStallsArranged = async (arrangement, limitNum) => {
  try {
    const { data: stallsData, length } = await fetchStallData();

    let arrangedStalls = [...stallsData];

    if (arrangement === "most_saved") {
      arrangedStalls.sort((a, b) => b.saves - a.saves);
    } else if (arrangement === "alphabetical") {
      arrangedStalls.sort((a, b) => a.name.localeCompare(b.name));
    } else if (arrangement === "price_low_to_high") {
      const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
      arrangedStalls.sort(
        (a, b) => priceOrder[a.price_symbol] - priceOrder[b.price_symbol]
      );
    } else if (arrangement === "price_high_to_low") {
      const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
      arrangedStalls.sort(
        (a, b) => priceOrder[b.price_symbol] - priceOrder[a.price_symbol]
      );
    }

    if (typeof limitNum === "number" && limitNum > 0) {
      arrangedStalls = arrangedStalls.slice(0, limitNum);
    }

    return { data: arrangedStalls, length };
  } catch (error) {
    console.error("Error arranging stalls: ", error);
    return { data: [], length: 0 };
  }
};

// Function to get stall data by ID
export const getStallDataById = async (stallId) => {
  try {
    const stallRef = doc(db, "stalls", stallId);
    const stallSnap = await getDoc(stallRef);
    if (stallSnap.exists()) {
      const data = stallSnap.data();
      return {
        id: stallSnap.id,
        name: data.name,
        description: data.description,
        location: data.location,
        price_symbol: data.price_symbol,
        stall_pic: data.stall_pic,
        halal: data.halal ?? false,
        vegetarian: data.vegetarian ?? false,
      };
    } else {
      console.log("No such stall!");
      return null;
    }
  } catch (error) {
    console.error("Error getting stall data by ID: ", error);
    return null;
  }
};

// Function to update stall data
export const updateStallById = async (stallId, updatedData) => {
  try {
    const stallRef = doc(db, "stalls", stallId);
    // add timestamp
    updatedData.updated_at = serverTimestamp();

    await updateDoc(stallRef, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating stall data: ", error);
    return false;
  }
};

// Function to search stalls by name
export const searchStallsByName = async (searchTerm) => {
  try {
    const q = query(collection(db, "stalls"));
    const querySnapshot = await getDocs(q);
    const stallsData = querySnapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((stall) =>
        stall.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return stallsData;
  } catch (error) {
    console.error("Error searching stalls by name: ", error);
    return [];
  }
};
