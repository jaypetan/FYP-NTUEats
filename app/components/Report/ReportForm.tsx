import { useEffect, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";

// Utilities
import { handleReportSubmit } from "@/utils/reportServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import TouchableScale from "@/app/components/TouchableScale";

// App Context
import { useAppContext } from "@/app/components/AppContext";
import { useUser } from "@clerk/clerk-expo";

const ReportForm = () => {
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const { returnToPreviousPage } = useAppContext();
  const [reportText, setReportText] = useState("");
  const placeholderText =
    "E.g., 'The Western stall in Hall 2 is closed' or 'Bob made an offensive comment in the Laksa recipe.'";

  useEffect(() => {
    const fetchUserId = async () => {
      if (user) {
        let fetchedUser = await fetchUserByClerkId(user.id);
        setUserId(fetchedUser ? fetchedUser.id : "");
      }
    };
    fetchUserId();
  }, [user]);

  const handleSubmit = () => {
    // Validate that the report text is not empty
    if (reportText.trim() === "") {
      Alert.alert("Empty Report", "Please enter a report before submitting.");
      return;
    }

    // Show confirmation alert before submitting the report
    Alert.alert(
      "Submit Report",
      "Are you sure you want to submit this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: () => {
            // Call the report submission function, then return to the previous page
            handleReportSubmit(userId, reportText);
            setReportText("");
            returnToPreviousPage();
          },
        },
      ],
    );
  };
  return (
    <View className="flex-col mt-4">
      {/* Form fields for reporting */}
      <TextInput
        placeholder={placeholderText}
        placeholderTextColor="#888"
        className="border-2 border-blue rounded-lg p-4 text-blue h-32 w-full"
        multiline
        numberOfLines={3}
        value={reportText}
        onChangeText={setReportText}
      />

      {/* Submit button */}
      <View className="mt-4">
        <TouchableScale onPress={handleSubmit}>
          <Text className="text-center text-2xl font-koulen text-blue bg-green/50 border-2 border-blue rounded-lg pt-3 px-6 self-end">
            Submit
          </Text>
        </TouchableScale>
      </View>
    </View>
  );
};

export default ReportForm;
