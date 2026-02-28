// React and React Native core
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

// Utilities
import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import SimpleViewer from "@/app/components/SimpleViewer";

interface StallReviewCardProps {
  reviewID: string;
  reviewName: string;
  reviewDate: string;
  reviewImage?: any;
  reviewTitle: string;
  reviewDescription: string;
}
const StallReviewCard = ({
  reviewID,
  reviewName,
  reviewDate,
  reviewImage,
  reviewTitle,
  reviewDescription,
}: StallReviewCardProps) => {
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [like, setLike] = useState(false);
  const [reviewLikesCount, setReviewLikesCount] = useState(0);
  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);

  // Check if the user has liked the review
  const checkUserLikeStatus = useCallback(async () => {
    const userHasLiked = await hasUserLikedItem(
      "reviews_likes",
      "review_id",
      reviewID,
      currentUserId,
    );
    setLike(userHasLiked);
  }, [reviewID, currentUserId]);

  // Fetch total likes for the review
  const fetchLikes = useCallback(async () => {
    const likes = await fetchTotalLikesByItemId(
      "reviews_likes",
      "review_id",
      reviewID,
    );
    setReviewLikesCount(likes);
  }, [reviewID]);

  // Get current user ID
  const getCurrentUserId = useCallback(async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : null);
      return userData ? userData.id : null;
    }
    return null;
  }, [user]);

  // Fetch like status and total likes on component mount
  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  useEffect(() => {
    getCurrentUserId();
  }, [getCurrentUserId, reviewID]);

  useEffect(() => {
    checkUserLikeStatus();
  }, [checkUserLikeStatus]);

  // Handle like button press
  const likeReviewHandler = async () => {
    if (like === false) {
      await likeItem("reviews_likes", "review_id", reviewID, currentUserId);
    } else {
      await unlikeItem("reviews_likes", "review_id", reviewID, currentUserId);
    }
    setLike(!like);
    await fetchLikes(); // Fetch updated likes after action
  };

  return (
    <View className="bg-green/50 rounded-xl p-4 flex-col gap-4 border-2 border-blue w-full">
      <View className="flex-col w-full justify-between gap-4">
        <View>
          <View className="flex-row justify-between">
            <View className="flex-row gap-2 items-baseline">
              <FontAwesome name="user" size={16} color="#323232" />
              <Text className="font-inter text-lg font-semibold text-blue">
                {reviewName}
              </Text>
            </View>
            <Text className="font-inter text-lg text-blue">{reviewDate}</Text>
          </View>
          <Text
            className="text-blue font-inter font-bold text-lg mt-2"
            numberOfLines={1}
          >
            {reviewTitle}
          </Text>
          <Text
            className="text-blue font-inter text-sm"
            numberOfLines={reviewImage ? 4 : 3}
          >
            {reviewDescription}
          </Text>
        </View>
        <View
          className={`${
            reviewImage ? "justify-between" : "justify-end"
          } flex-row items-end`}
        >
          {reviewImage && (
            <View className="w-48 h-48 rounded-2xl overflow-hidden border-2 border-blue">
              <TouchableOpacity onPress={() => setEnlargedImageVisible(true)}>
                <ImageLoader
                  image={reviewImage}
                  className="w-48 h-48"
                  loaderClassName="w-full h-full absolute"
                />
              </TouchableOpacity>
              <SimpleViewer
                visible={enlargedImageVisible}
                source={reviewImage}
                onClose={() => setEnlargedImageVisible(false)}
              />
            </View>
          )}
          <View className="flex-row gap-2 items-center justify-end">
            <Text className="font-inter text-lg font-semibold text-blue">
              {reviewLikesCount}
            </Text>
            <TouchableOpacity onPress={() => likeReviewHandler()}>
              {like ? (
                <FontAwesome name="heart" size={20} color="red" />
              ) : (
                <FontAwesome name="heart-o" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default StallReviewCard;
