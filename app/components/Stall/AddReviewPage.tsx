import { addNewReview } from "@/utils/reviewServices";
import { useUser } from "@clerk/clerk-expo";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAppContext } from "../AppContext";
import TouchableScale from "../TouchableScale";

interface AddReviewPageProps {
  setAddReview: (visible: boolean) => void;
}
const AddReviewPage: React.FC<AddReviewPageProps> = ({ setAddReview }) => {
  const { selectedId } = useAppContext();
  const { user } = useUser();

  const [details, setDetails] = useState({
    title: "",
    content: "",
    review_pic: "",
    stall_id: "",
    user_id: "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDetails({ ...details, review_pic: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (!details.title.trim() || !details.content.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    // Get stall_id
    details.stall_id = selectedId || "";
    // Get user_id
    details.user_id = user ? user.id : "";

    console.log("Review Submitted:", details);
    await addNewReview(details);
    alert("Review submitted successfully!");

    // Reset form
    setDetails({
      title: "",
      content: "",
      review_pic: "",
      stall_id: "",
      user_id: "",
    });
    setAddReview(false);
  };

  return (
    <View className="flex-col gap-2 mt-8">
      <Text className="text-blue font-inter font-bold text-3xl w-full text-center">
        Add Review
      </Text>
      <Text className="text-xl text-blue font-bold">Title:</Text>
      <TextInput
        className="w-full border-2 border-blue rounded-md p-2 mb-4 pb-4"
        onChangeText={(text) => setDetails({ ...details, title: text })}
        value={details.title}
        placeholder="Write your title here... (max 30 characters)"
        placeholderTextColor={"#888"}
        maxLength={30}
      />
      <Text className="text-xl text-blue font-bold">Content:</Text>
      <TextInput
        className="w-full h-24 border-2 border-blue rounded-md p-2 mb-4 pb-4"
        onChangeText={(text) => setDetails({ ...details, content: text })}
        value={details.content}
        placeholder="Write your review here... (max 120 characters)"
        placeholderTextColor={"#888"}
        multiline
        numberOfLines={4}
        maxLength={120}
      />

      {/* Image Upload */}
      <View className="flex-row items-center mb-2 gap-2">
        <Text className="text-xl text-blue font-bold">Upload Image:</Text>
        <Text className="text-xl text-gray-500">(optional)</Text>
      </View>
      <TouchableOpacity
        onPress={pickImage}
        className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mb-2"
      >
        {details.review_pic ? (
          <Image
            className="w-64 h-64 border-2 border-blue"
            source={{ uri: details.review_pic }}
          />
        ) : (
          <Text> Pick A Review Image</Text>
        )}
      </TouchableOpacity>
      <TouchableScale
        onPress={handleSubmit}
        className="bg-green rounded-md py-2 px-4 items-center mt-4  border-2 border-blue mb-8"
      >
        <Text className="text-blue font-semibold text-base">Submit Review</Text>
      </TouchableScale>
    </View>
  );
};

export default AddReviewPage;
