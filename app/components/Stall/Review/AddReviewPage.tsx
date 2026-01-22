// React and React Native core
import { useState } from "react";
import { Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Utilities
import { addNewReview } from "@/utils/reviewServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImagePickerField from "@/app/components/ImagePickerField";
import InputField from "@/app/components/InputField";
import TouchableScale from "@/app/components/TouchableScale";

interface AddReviewPageProps {
  setAddReview: (visible: boolean) => void;
}

const AddReviewPage: React.FC<AddReviewPageProps> = ({ setAddReview }) => {
  const { selectedId } = useAppContext();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);

  const [details, setDetails] = useState({
    title: "",
    content: "",
    review_pic: "",
    stall_id: "",
    user_id: "",
  });

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

      {/* Input Fields */}
      <View className="flex-col gap-4">
        <InputField
          label="Title:"
          value={details.title}
          onChangeText={(text) => setDetails({ ...details, title: text })}
          placeholder="Write your title here... (max 30 characters)"
          maxLength={30}
        />
        <InputField
          label="Content:"
          value={details.content}
          onChangeText={(text) => setDetails({ ...details, content: text })}
          placeholder="Write your review here... (max 120 characters)"
          maxLength={120}
          multiline
          numberOfLines={4}
          h24
        />
      </View>

      {/* Image Upload */}
      <ImagePickerField
        imageUri={details.review_pic}
        onImagePicked={(uri) => setDetails({ ...details, review_pic: uri })}
        label="Review Image"
        optional={true}
      />

      {/* Submit Button */}
      <TouchableScale
        onPress={handleSubmit}
        className="bg-green rounded-md py-2 px-4 items-center mt-4 border-2 border-blue mb-8"
      >
        <Text className="text-blue font-semibold text-base">Submit Review</Text>
      </TouchableScale>
    </View>
  );
};

export default AddReviewPage;
