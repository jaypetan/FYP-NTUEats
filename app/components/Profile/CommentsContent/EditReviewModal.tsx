// React and React Native imports
import { BlurView } from "expo-blur";
import { useCallback, useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";

// External libraries
import { AntDesign, Feather } from "@expo/vector-icons";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Component Props
import ImagePickerField from "@/app/components/ImagePickerField";
import InputField from "@/app/components/InputField";
import TouchableScale from "@/app/components/TouchableScale";

// Utilities
import {
  deleteReviewById,
  editReviewById,
  getReviewDataById,
} from "@/utils/reviewServices";

interface EditReviewModalProps {
  editModalVisible: string;
  toggleModalVisibility: (type: string) => void;
}
const EditReviewModal: React.FC<EditReviewModalProps> = ({
  editModalVisible,
  toggleModalVisibility,
}) => {
  const { selectedId } = useAppContext();
  const [reviewDetails, setReviewDetails] = useState({
    title: "",
    content: "",
    review_pic: "",
  });
  const [isProcessing, setIsProcessing] = useState("");

  // Fetch review details
  const fetchReviewDetails = useCallback(async () => {
    if (selectedId) {
      const reviewData = await getReviewDataById(selectedId);
      if (reviewData) {
        setReviewDetails({
          title: reviewData.title || "",
          content: reviewData.content || "",
          review_pic: reviewData.review_pic || "",
        });
      }
    }
  }, [selectedId]);

  useEffect(() => {
    if (editModalVisible === "review") {
      fetchReviewDetails();
      setIsProcessing("");
    }
  }, [editModalVisible, fetchReviewDetails]);

  // Handle submit and delete functions can be added here
  const handleSubmitChanges = () => {
    setIsProcessing("edit");
    // Implementation for submitting changes
    editReviewById(selectedId || "", reviewDetails)
      .then(() => {
        Alert.alert("Review updated successfully!");
        toggleModalVisibility("review");
      })
      .catch(() => {
        Alert.alert("Error updating review. Please try again.");
      })
      .finally(() => {
        setIsProcessing("");
      });
  };

  // Handle delete function
  const handleDeleteReview = () => {
    setIsProcessing("delete");
    // Implementation for deleting review
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this review?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deleteReviewById(selectedId || "")
              .then(() => {
                Alert.alert("Review deleted successfully!");
                toggleModalVisibility("review");
              })
              .catch(() => {
                Alert.alert("Error deleting review. Please try again.");
              })
              .finally(() => {
                setIsProcessing("");
              });
          },
        },
      ],
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible === "review"}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        toggleModalVisibility("review");
      }}
    >
      <BlurView intensity={20} className="w-full h-full ">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue pb-8">
          <Pressable onPress={() => toggleModalVisibility("review")}>
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <Text className="text-blue font-koulen text-3xl pt-4 mt-4 text-center">
            Edit Review
          </Text>
          <ScrollView>
            <View className="px-6 mt-6">
              <InputField
                label="Title"
                placeholder="Update your review title..."
                value={reviewDetails.title}
                onChangeText={(text) =>
                  setReviewDetails({ ...reviewDetails, title: text })
                }
                maxLength={50}
              />
              <InputField
                label="Content"
                placeholder="Update your comment..."
                value={reviewDetails.content}
                onChangeText={(text) =>
                  setReviewDetails({ ...reviewDetails, content: text })
                }
                multiline
                maxLength={120}
                numberOfLines={4}
              />
              <ImagePickerField
                label="Picture"
                imageUri={reviewDetails.review_pic}
                onImagePicked={(uri: string) =>
                  setReviewDetails({ ...reviewDetails, review_pic: uri })
                }
                optional
              />
            </View>
          </ScrollView>
          <View className="flex-row w-full justify-between px-6 pt-4">
            <TouchableScale
              className="border-2 border-blue bg-red px-4 py-2 rounded-xl items-center flex-row gap-2"
              onPress={() => {
                handleDeleteReview();
              }}
              disabled={isProcessing !== ""}
            >
              <Feather name="trash-2" size={20} color="#264653" />
              <Text className="text-blue font-semibold text-base text-center">
                {isProcessing === "delete" ? "Deleting..." : "Delete"}
              </Text>
            </TouchableScale>
            <TouchableScale
              className="border-2 border-blue bg-green px-4 py-2 rounded-xl items-center"
              onPress={() => {
                handleSubmitChanges();
              }}
              disabled={isProcessing !== ""}
            >
              <Text className="text-blue font-semibold text-base text-center">
                {isProcessing === "edit" ? "Submitting..." : "Submit Changes"}
              </Text>
            </TouchableScale>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default EditReviewModal;
