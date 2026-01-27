// React and React Native core
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Utilities
import { addRecipeComment } from "@/utils/recipeServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImagePickerField from "@/app/components/ImagePickerField";
import InputField from "@/app/components/InputField";
import TouchableScale from "@/app/components/TouchableScale";

interface CommentUploadModalProps {
  setCommentUploadModalVisible: (visible: boolean) => void;
  commentUploadModalVisible: boolean;
  fetchCommentsData: () => Promise<void>;
}

const CommentUploadModal: React.FC<CommentUploadModalProps> = ({
  setCommentUploadModalVisible,
  commentUploadModalVisible,
  fetchCommentsData,
}) => {
  const { selectedId } = useAppContext();
  const { user } = useUser();
  const [commentContent, setCommentContent] = useState("");
  const [image, setImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    // Validate input
    if (commentContent.trim() === "") {
      alert("Please enter comment content.");
      return;
    }
    setIsProcessing(true);

    try {
      await addRecipeComment({
        content: commentContent,
        comment_pic: image,
        recipe_id: selectedId || "",
        user_id: user ? user.id : "",
      });
      alert("Comment submitted successfully!");
      // Refresh comments data
      await fetchCommentsData();
    } catch (error) {
      alert("Error submitting comment. Please try again.");
    } finally {
      // Reset form
      setCommentContent("");
      setImage("");
      setIsProcessing(false);
      closeCommentUploadModal();
    }
  };

  const closeCommentUploadModal = () => {
    setCommentUploadModalVisible(false);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={commentUploadModalVisible}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        setCommentUploadModalVisible(!commentUploadModalVisible);
      }}
    >
      <BlurView intensity={20} className="w-full h-full ">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
          <Pressable onPress={() => closeCommentUploadModal()}>
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <View className="flex-col gap-2 p-4">
            <Text className="text-3xl font-bold text-blue mb-4 text-center">
              Add Comment
            </Text>
            <InputField
              label="Content:"
              value={commentContent}
              onChangeText={(text) => setCommentContent(text)}
              placeholder="Write your comment here... (max 120 characters)"
              maxLength={120}
              multiline
              numberOfLines={4}
              h24
            />
            <ImagePickerField
              imageUri={image}
              onImagePicked={(uri) => setImage(uri)}
              label="Comment Image"
              optional={true}
            />
            <View className="flex-row w-full justify-end">
              <TouchableScale
                onPress={handleSubmit}
                className="bg-green rounded-md py-2 px-4 items-center mt-4"
                disabled={isProcessing}
              >
                <Text className="text-blue font-semibold text-base">
                  Submit
                </Text>
              </TouchableScale>
            </View>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CommentUploadModal;
