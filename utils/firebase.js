// Import the functions you need from the SDKs you need
import Constants from "expo-constants";
import { getApp, getApps, initializeApp } from "firebase/app"; // Analytics service
import { getFirestore } from "firebase/firestore"; // Firestore service
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Cloud Storage service
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Read config from environment or Expo Constants (safe fallback to current values)
const getEnv = (key) => {
  if (typeof process !== "undefined" && process.env && process.env[key])
    return process.env[key];
  if (Constants?.expoConfig?.extra && Constants.expoConfig.extra[key])
    return Constants.expoConfig.extra[key];
  if (Constants?.manifest?.extra && Constants.manifest.extra[key])
    return Constants.manifest.extra[key];
  return undefined;
};

const firebaseConfig = {
  apiKey: getEnv("FIREBASE_API_KEY"),
  authDomain: getEnv("FIREBASE_AUTH_DOMAIN"),
  projectId: getEnv("FIREBASE_PROJECT_ID"),
  storageBucket: getEnv("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnv("FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnv("FIREBASE_APP_ID"),
  measurementId: getEnv("FIREBASE_MEASUREMENT_ID"),
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Get a reference to the Firestore service
export const db = getFirestore(app);

// Get a reference to the Cloud Storage service
export const storage = getStorage(app);

// Function to upload an image to Firebase Storage
export const uploadImageAsync = async (uri, path) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, blob);
    const downloadUrl = await getDownloadURL(storageRef);
    return downloadUrl;
  } catch (error) {
    console.error("Image upload failed:", error);
    return null;
  }
};
