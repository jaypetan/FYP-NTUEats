import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/LikeServices";
import { fetchUserByClerkId } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { ImageLoader } from "../ImageLoader";

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
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);

  // Check if the user has liked the review
  const checkUserLikeStatus = async () => {
    const userHasLiked = await hasUserLikedItem(
      "reviews_likes",
      "review_id",
      reviewID,
      currentUserId
    );
    setLike(userHasLiked);
  };

  // Fetch total likes for the review
  const fetchLikes = async () => {
    const likes = await fetchTotalLikesByItemId(
      "reviews_likes",
      "review_id",
      reviewID
    );
    setReviewLikesCount(likes);
  };

  // Get current user ID
  const getCurrentUserId = async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : null);
      return userData ? userData.id : null;
    }
    return null;
  };

  // Fetch like status and total likes on component mount
  useEffect(() => {
    getCurrentUserId();
    fetchLikes();
  }, []);
  useEffect(() => {
    checkUserLikeStatus();
  }, [currentUserId]);

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
    <View
      className={`bg-green/50 rounded-xl p-4 flex-col gap-4
      }`}
    >
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
            <View className="w-48 h-48">
              <TouchableOpacity onPress={() => setIsImageViewVisible(true)}>
                <ImageLoader
                  image={reviewImage}
                  className="w-48 rounded-2xl h-48"
                  loaderClassName="w-full h-full absolute"
                />
              </TouchableOpacity>
              <ImageViewing
                images={[{ uri: reviewImage }]}
                imageIndex={0}
                visible={isImageViewVisible}
                onRequestClose={() => setIsImageViewVisible(false)}
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
