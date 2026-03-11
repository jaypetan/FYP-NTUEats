import { db } from "@/utils/firebase";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const handleReportSubmit = async (userFeedback) => {
  try {
    // Add the document to the 'reports' collection
    const docRef = await addDoc(collection(db, "reports"), {
      text: userFeedback, // Firebase extension looks for this 'text' field
      status: "pending",
      adminCheck: false,
      timestamp: serverTimestamp(),
    });

    console.log("Report submitted! ID:", docRef.id);
    alert("Thank you! Our AI is categorizing your report now.");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

export const fetchAllReports = async () => {
  try {
    const reportsRef = collection(db, "reports");
    const querySnapshot = await getDocs(reportsRef);
    const reports = [];
    querySnapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    return reports;
  } catch (error) {
    console.error("Error fetching reports: ", error);
    return [];
  }
};
