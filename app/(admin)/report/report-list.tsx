import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

// Utilities
import { fetchFilteredReports } from "@/utils/reportServices";

// Components
import FilterList from "@/app/(admin)/components/FilterList";
import SearchBar from "@/app/components/SearchBar";

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
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [adminCheckFilter, setAdminCheckFilter] = useState(false);

  const typeOptions = [
    { label: "Stall No Longer There", value: "stall no longer there" },
    { label: "Wrong Location", value: "wrong location" },
    { label: "Inappropriate Content", value: "contains inappropriate content" },
    { label: "No Loading", value: "no loading" },
    { label: "App Crash", value: "app crash" },
    { label: "Other", value: "other" },
  ];

  const categoryOptions = [
    { label: "Stall Issue", value: "stalls" },
    { label: "Recipe Issue", value: "recipe" },
    { label: "Review Issue", value: "stall review" },
    { label: "Comment Issue", value: "recipe comment" },
    { label: "Profile Issue", value: "profile" },
    { label: "System Issue", value: "technical bug" },
    { label: "Invalid Report", value: "invalid report" },
    { label: "Others", value: "others" },
  ];

  useEffect(() => {
    const loadReports = async () => {
      const data = await fetchFilteredReports(
        categoryFilter === "" ? "All" : categoryFilter,
        typeFilter === "" ? "All" : typeFilter,
        false,
      );
      console.log("Fetched Reports:", data);
      setReports(data);
    };
    loadReports();
  }, [categoryFilter, typeFilter, adminCheckFilter]);

  // Function to handle search
  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    const data = await fetchFilteredReports(
      categoryFilter === "" ? "All" : categoryFilter,
      typeFilter === "" ? "All" : typeFilter,
      false,
      term,
    );
    setReports(data);
  };

  // Function to toggle filter dropdown visibility
  const handleFilterDropdown = () => {
    setFilterDropdownVisible(!filterDropdownVisible);
  };

  return (
    <View className="w-full items-center">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        Report List
      </Text>
      <ScrollView className="w-full px-4 h-[65vh]">
        <View className="flex-col gap-4 justify-center">
          {/* Search Bar & Filter */}
          <SearchBar
            handleSearch={handleSearch}
            searchTerm={searchTerm}
            handleFilterDropdown={handleFilterDropdown}
          />
          {filterDropdownVisible && (
            <Animated.View
              className="w-full"
              entering={FadeInUp}
              exiting={FadeOutUp}
            >
              <FilterList
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                categoryOptions={categoryOptions}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                typeOptions={typeOptions}
              />
            </Animated.View>
          )}
          {/* Report List */}
          {reports.length === 0 ? (
            <Text className="text-blue text-lg mt-4">No reports found.</Text>
          ) : (
            reports.map((item, index) => (
              <Animated.View
                entering={FadeInRight.delay(100 + index * 100)}
                exiting={FadeOutLeft}
                layout={LinearTransition}
                key={item.id}
                className="bg-white p-4 rounded-2xl mb-2 w-full border-2 border-blue flex-col gap-2"
              >
                <Text className="font-bold">Report ID: {item.id}</Text>
                <Text className="text-xl py-4">
                  {parseAnalysis(item.analysis).summary || "-"}
                </Text>
                <Text>Report Text: </Text>
                <Text>{item.text || "-"}</Text>
                <Text>Created At: {formatTimestamp(item.timestamp)}</Text>
              </Animated.View>
            ))
          )}
          <View className="mt-4" />
        </View>
      </ScrollView>
    </View>
  );
};

export default ReportList;
