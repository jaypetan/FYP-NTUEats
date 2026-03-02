// Firebase imports
import { fetchAllStallsWithSelectedRestriction } from "@/utils/dietaryServices";
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { compareDatas } from "@/utils/sharedFunctions";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

// Utility functions for randomization with seed
const getDeterministicHash = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

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
          stall.id,
        );
        return { ...stall, saves };
      }),
    );

    return { data: stallsDataWithSaves, length: stallsData.length };
  } catch (error) {
    console.error("Error fetching stall data: ", error);
    return { data: [], length: 0 };
  }
};

// Function to filter stall data with restrictions
export const getStallsWithRestrictions = async (restrictions, otherData) => {
  try {
    let stallsData = [];

    if (otherData && Array.isArray(otherData)) {
      stallsData = otherData;
    } else {
      const fetched = await fetchStallData();
      stallsData = fetched.data || [];
    }
    if (!restrictions) {
      return stallsData;
    }
    let filteredStalls = stallsData;
    // Filter stalls based on restrictions (halal, vegetarian)
    if (restrictions.halal) {
      const halalStallIds =
        await fetchAllStallsWithSelectedRestriction("halal");
      filteredStalls = compareDatas(filteredStalls, halalStallIds, "id", "id");
    }
    if (restrictions.vegetarian) {
      const vegStallIds =
        await fetchAllStallsWithSelectedRestriction("vegetarian");
      filteredStalls = compareDatas(filteredStalls, vegStallIds, "id", "id");
    }

    // Filter stalls based on canteen location
    filteredStalls = filteredStalls.filter((stall) => {
      if (restrictions.canteen && stall.location !== restrictions.canteen)
        return false;
      return true;
    });

    return filteredStalls;
  } catch (error) {
    console.error("Error filtering stalls with restrictions: ", error);
    return [];
  }
};

// Function to arrange stalls
export const getStallsArranged = async (
  arrangement,
  limitNum,
  restrictions,
  otherData,
  randomSeed,
) => {
  try {
    let resolvedOtherData = otherData;
    let resolvedRandomSeed = randomSeed;

    if (typeof otherData === "string" && randomSeed === undefined) {
      resolvedRandomSeed = otherData;
      resolvedOtherData = undefined;
    }

    // Fetch stalls with restrictions applied if restrictions exist, otherwise get all stalls.
    const stallsData = Array.isArray(resolvedOtherData)
      ? await getStallsWithRestrictions(restrictions, resolvedOtherData) // use pre-filtered data if provided (e.g., from search results)
      : await getStallsWithRestrictions(restrictions);

    // Then arrange the filtered stalls based on the selected arrangement
    let arrangedStalls = [...stallsData];
    if (arrangement === "most_saved") {
      arrangedStalls.sort((a, b) => b.saves - a.saves);
    } else if (arrangement === "alphabetical") {
      arrangedStalls.sort((a, b) => a.name.localeCompare(b.name));
    } else if (arrangement === "price_low_to_high") {
      const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
      arrangedStalls.sort(
        (a, b) => priceOrder[a.price_symbol] - priceOrder[b.price_symbol],
      );
    } else if (arrangement === "price_high_to_low") {
      const priceOrder = { $: 1, $$: 2, $$$: 3, $$$$: 4 };
      arrangedStalls.sort(
        (a, b) => priceOrder[b.price_symbol] - priceOrder[a.price_symbol],
      );
    } else {
      if (typeof resolvedRandomSeed === "string" && resolvedRandomSeed) {
        arrangedStalls.sort((a, b) => {
          const hashA = getDeterministicHash(`${resolvedRandomSeed}:${a.id}`);
          const hashB = getDeterministicHash(`${resolvedRandomSeed}:${b.id}`);
          return hashA - hashB;
        });
      }
    }

    // Get length before slicing for limit
    const length = arrangedStalls.length;
    // Apply limit if specified
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
    const lowerSearchTerm = searchTerm.toLowerCase();
    const fetchedStalls = await fetchStallData();
    const filteredStalls = fetchedStalls.data.filter((stall) =>
      stall.name.toLowerCase().includes(lowerSearchTerm),
    );
    return { data: filteredStalls };
  } catch (error) {
    console.error("Error searching stalls by name: ", error);
    return { data: [] };
  }
};

// Function to get list of canteens
export const fetchCanteenList = async () => {
  try {
    const q = collection(db, "stalls");
    const querySnapshot = await getDocs(q);

    const canteenSet = new Set();
    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      if (data.location.trim()) {
        canteenSet.add(data.location.trim());
      }
    });

    return Array.from(canteenSet);
  } catch (error) {
    console.error("Error fetching canteen list: ", error);
    return [];
  }
};
