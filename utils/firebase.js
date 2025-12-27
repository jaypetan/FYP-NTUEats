// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app"; // Analytics service
import { getFirestore } from "firebase/firestore"; // Firestore service
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"; // Cloud Storage service
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGYy5tb03Nv41xnz_9wh8pjqkccs1D0BA",
  authDomain: "fyp-backend-14bf3.firebaseapp.com",
  projectId: "fyp-backend-14bf3",
  storageBucket: "fyp-backend-14bf3.firebasestorage.app",
  messagingSenderId: "452074784691",
  appId: "1:452074784691:web:19523255572c57942d2dc6",
  measurementId: "G-DCVXFF4WY5",
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
