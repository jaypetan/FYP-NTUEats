import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

// Utilities
import { fetchAllReports } from "@/utils/reportServices";

const parseAnalysis = (analysis: any) => {
  if (!analysis) return {};
  if (typeof analysis === "object") return analysis;
  if (typeof analysis !== "string") return {};

  // Clean the AI response to extract the JSON part
  const cleaned = analysis
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    return {};
  }
};

const formatTimestamp = (timestamp: any) => {
  if (!timestamp) return "-";
  if (typeof timestamp?.toDate === "function") {
    return timestamp.toDate().toLocaleString();
  }
  if (typeof timestamp?.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toLocaleString();
  }
  return "-";
};

const ReportList = () => {
  const [reports, setReports] = useState<any[]>([]);
  useEffect(() => {
    const loadReports = async () => {
      const data = await fetchAllReports();
      console.log("Fetched Reports:", data);
      setReports(data);
    };
    loadReports();
  }, []);

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-2xl font-bold mb-4">Report List</Text>
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const analysis = parseAnalysis(item.analysis);

          return (
            <View className="bg-white p-4 rounded-2xl mb-2 w-full border-2 border-blue">
              <Text className="font-bold">Report ID: {item.id}</Text>
              <Text>Report Text: {item.text || "-"}</Text>
              <Text>Category: {analysis.category || "-"}</Text>
              <Text>Type: {analysis.type || "-"}</Text>
              <Text>Summary: {analysis.summary || "-"}</Text>
              <Text>Created At: {formatTimestamp(item.timestamp)}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default ReportList;
