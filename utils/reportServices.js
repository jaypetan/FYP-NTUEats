import { db } from "@/utils/firebase";
import { fetchUserByDocId } from "@/utils/userServices";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export const handleReportSubmit = async (userId, userFeedback) => {
  try {
    // Add the document to the 'reports' collection
    const docRef = await addDoc(collection(db, "reports"), {
      text: userFeedback, // Firebase extension looks for this 'text' field
      status: "pending",
      adminCheck: false,
      userId: userId,
      timestamp: serverTimestamp(),
    });

    alert(
      "Thank you for your report! We will look into it as soon as possible.",
    );
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

// Fetch reports based on filters (category, type, status)
export const fetchFilteredReports = async (
  category,
  type,
  adminCheck,
  term,
) => {
  try {
    const reportsRef = collection(db, "reports");
    const querySnapshot = await getDocs(reportsRef);
    let reports = [];

    // Process each report and apply filters
    querySnapshot.forEach((doc) => {
      const reportData = doc.data();
      const analysis = reportData.analysis;
      let cleanedAnalysis = {};

      if (typeof analysis === "string" && analysis !== null) {
        const cleaned = analysis
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "")
          .trim();

        try {
          cleanedAnalysis = JSON.parse(cleaned);
        } catch {
          cleanedAnalysis = {};
        }
      }

      if (
        (category === "All" || cleanedAnalysis.category === category) &&
        (type === "All" || cleanedAnalysis.type === type) &&
        (adminCheck === true || reportData.adminCheck === adminCheck)
      ) {
        reports.push({ id: doc.id, ...reportData });
      }
    });

    // Apply search term filter if provided
    if (term) {
      const normalizedTerm = term.trim().toLowerCase();
      const userIds = [...new Set(reports.map((report) => report.userId).filter(Boolean))];
      const users = await Promise.all(
        userIds.map(async (userId) => {
          const user = await fetchUserByDocId(userId);
          return [userId, user?.username?.toLowerCase() || ""];
        }),
      );
      const usernamesById = Object.fromEntries(users);

      reports = reports.filter((report) => {
        const reportText = typeof report.text === "string" ? report.text.toLowerCase() : "";
        const creatorName = usernamesById[report.userId] || "";

        return (
          reportText.includes(normalizedTerm) ||
          creatorName.includes(normalizedTerm)
        );
      });
    }

    return reports;
  } catch (error) {
    console.error("Error fetching filtered reports: ", error);
    return [];
  }
};
