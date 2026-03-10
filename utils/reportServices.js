import { db } from "@/utils/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const handleReportSubmit = async (userFeedback) => {
  try {
    // Add the document to the 'reports' collection
    const docRef = await addDoc(collection(db, "reports"), {
      text: userFeedback, // Firebase extension looks for this 'text' field
      status: "pending",
      adminResponse: "",
      timestamp: serverTimestamp(),
    });

    console.log("Report submitted! ID:", docRef.id);
    alert("Thank you! Our AI is categorizing your report now.");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};
