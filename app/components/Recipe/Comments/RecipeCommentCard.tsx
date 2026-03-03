// React and React Native core
import { useCallback, useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

// Utilities
import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/likeServices";
import { fetchUserByClerkId, fetchUserByDocId } from "@/utils/userServices";

// Components
import ImageLoader from "@/app/components/ImageLoader";

// App Context
import { useAppContext } from "../../AppContext";

interface RecipeCommentCardProps {
  comment: {
    id: string;
    user_id: string;
    content: string;
    likes: number;
    comment_pic: string | null;
  };
}

const RecipeCommentCard: React.FC<RecipeCommentCardProps> = ({ comment }) => {
  const { user } = useUser();
  const { selectedSecondaryId, setSelectedSecondaryId } = useAppContext();

  const [currentUserId, setCurrentUserId] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const [like, setLike] = useState(false);
  const [commentsLikesCount, setCommentsLikesCount] = useState(0);

  // Get current user ID
  const getCurrentUserId = useCallback(async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : "");
      return userData ? userData.id : "";
    }
    return null;
  }, [user]);

  // Fetch username based on user_id
  useEffect(() => {
    const getUser = async () => {
      const userData = await fetchUserByDocId(comment.user_id);
      if (userData) {
        setCommentUser(userData.username);
      } else {
        setCommentUser("Unknown User");
      }
    };
    getUser();
  }, [comment.user_id]);

  // Check if the user has liked the comment
  const checkUserLikeStatus = useCallback(async () => {
    const userHasLiked = await hasUserLikedItem(
      "recipe_comments_likes",
      "recipe_comment_id",
      comment.id,
      currentUserId,
    );
    setLike(userHasLiked);
  }, [comment.id, currentUserId]);

  // Get total likes for the comment
  const fetchLikes = useCallback(async () => {
    const likes = await fetchTotalLikesByItemId(
      "recipe_comments_likes",
      "recipe_comment_id",
      comment.id,
    );
    setCommentsLikesCount(likes);
  }, [comment.id]);

  // Fetch like status and total likes on component mount
  useEffect(() => {
    getCurrentUserId();
  }, [getCurrentUserId, comment.id]);

  useEffect(() => {
    fetchLikes();
  }, [fetchLikes]);

  useEffect(() => {
    checkUserLikeStatus();
  }, [checkUserLikeStatus]);

  // Update likes count when like state changes
  const likeCommentHandler = async () => {
    if (like === false) {
      await likeItem(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id,
        currentUserId,
      );
    } else {
      await unlikeItem(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id,
        currentUserId,
      );
    }
    setLike(!like);
    await fetchLikes(); // Fetch updated likes after action
  };

  // Flicker animation when selectedSecondaryId matches comment.id
  const flickerOpacity = useSharedValue(1); // For flicker animation when comment is selected
  useEffect(() => {
    if (selectedSecondaryId === comment.id) {
      flickerOpacity.value = withDelay(
        1000, // delay before start (ms)
        withRepeat(
          withTiming(0.35, {
            duration: 120,
            easing: Easing.linear,
          }),
          10, // number of repetitions
          true,
        ),
      );
      setTimeout(() => {
        setSelectedSecondaryId(null); // Reset after animation
      }, 2200); // Total duration of the flicker animation
    } else {
      flickerOpacity.value = withTiming(1, {
        duration: 120,
        easing: Easing.linear,
      });
    }
  }, [selectedSecondaryId, comment.id, flickerOpacity]);

  const flickerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: flickerOpacity.value,
  }));

  return (
    <Animated.View
      style={flickerAnimatedStyle}
      className="mb-4 border-b border-blue pb-2"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-2xl pt-2 text-blue font-koulen">
          {commentUser}:
        </Text>
        <View>
          <View className="flex-row gap-2 items-center justify-end">
            <Text className="font-inter text-lg font-semibold text-blue">
              {commentsLikesCount ? commentsLikesCount : ""}
            </Text>
            <TouchableOpacity onPress={() => likeCommentHandler()}>
              {like ? (
                <FontAwesome name="heart" size={20} color="red" />
              ) : (
                <FontAwesome name="heart-o" size={20} color="black" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Text className="text-xl text-blue">{comment.content}</Text>
      <View className="flex-row py-4">
        {comment.comment_pic && (
          <View className="w-64 h-64 border-2 border-blue rounded-lg overflow-hidden">
            <ImageLoader
              image={comment.comment_pic}
              className="w-64 h-64"
              loaderClassName="w-64 h-64"
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default RecipeCommentCard;
