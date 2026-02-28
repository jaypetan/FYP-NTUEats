// React and React Native core
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

// Utilities
import { hasUserLikedItem, likeItem, unlikeItem } from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";

// External libraries
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

// Components
import TouchableScale from "../TouchableScale";

interface StallButtonsProps {
  setMenuModalVisible: (visible: boolean) => void;
  setPictureModalVisible: (visible: boolean) => void;
  setAddReview: (visible: boolean) => void;
  addReview: boolean;
  stallId: string;
}

const StallButtons: React.FC<StallButtonsProps> = ({
  setMenuModalVisible,
  setPictureModalVisible,
  setAddReview,
  addReview,
  stallId,
}) => {
  const [saved, setSaved] = useState(false);
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user ID
  const getCurrentUserId = useCallback(async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : null);
      return userData ? userData.id : null;
    }
    return null;
  }, [user]);

  // Check if the user has liked the menu
  const checkUserLikeStatus = useCallback(async () => {
    const userHasLiked = await hasUserLikedItem(
      "stalls_saved",
      "stall_id",
      stallId,
      currentUserId,
    );
    setSaved(userHasLiked);
  }, [stallId, currentUserId]);

  // Check user like status when currentUserId changes
  useEffect(() => {
    getCurrentUserId();
  }, [getCurrentUserId, stallId]);

  useEffect(() => {
    checkUserLikeStatus();
  }, [checkUserLikeStatus]);

  const handleSave = () => {
    if (saved) {
      unlikeItem("stalls_saved", "stall_id", stallId, currentUserId);
    } else {
      likeItem("stalls_saved", "stall_id", stallId, currentUserId);
    }
    setSaved(!saved);
  };

  return (
    <View className="flex-col justify-between w-full gap-4 ">
      <View className="flex-row justify-between items-center">
        {/* Add Review Button */}
        <TouchableScale
          onPress={() => setAddReview(!addReview)}
          className={`${
            addReview ? "bg-red/50" : "bg-green/50"
          } items-center justify-center border-blue border-2 px-6 py-2 rounded-lg mr-4`}
        >
          <Text className="text-2xl font-koulen pt-3 text-blue">
            {addReview ? "Cancel" : "Add Review"}
          </Text>
        </TouchableScale>

        {/* Menu Button */}
        <View className="flex-row gap-2 justify-end">
          <TouchableScale
            onPress={() => setMenuModalVisible(true)}
            className="items-center justify-center border-2 border-blue p-4 rounded-full"
          >
            <MaterialIcons name="article" size={24} color="#323232" />
          </TouchableScale>

          {/* Gallery Button */}
          <TouchableScale
            onPress={() => setPictureModalVisible(true)}
            className="items-center justify-center border-2 border-blue p-4 rounded-full"
          >
            <FontAwesome name="image" size={24} color="#323232" />
          </TouchableScale>

          {/* Save Button */}
          <TouchableScale
            onPress={() => {
              handleSave();
            }}
            className={`items-center justify-center border-blue border-2 p-4 rounded-full ${
              saved ? "bg-green/50" : ""
            }`}
          >
            {saved ? (
              <MaterialIcons name="bookmark" size={24} color="#323232" />
            ) : (
              <MaterialIcons name="bookmark-border" size={24} color="#323232" />
            )}
          </TouchableScale>
        </View>
      </View>
    </View>
  );
};

export default StallButtons;
