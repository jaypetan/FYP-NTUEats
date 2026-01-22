import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/likeServices";
import { fetchUserByClerkId, fetchUserByDocId } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { ImageLoader } from "../ImageLoader";

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
  const [currentUserId, setCurrentUserId] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const [like, setLike] = useState(false);
  const [commentsLikesCount, setCommentsLikesCount] = useState(0);
  const { user } = useUser();

  // Get current user ID
  const getCurrentUserId = async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : "");
      return userData ? userData.id : "";
    }
    return null;
  };

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
  const checkUserLikeStatus = async () => {
    const userHasLiked = await hasUserLikedItem(
      "recipe_comments_likes",
      "recipe_comment_id",
      comment.id,
      currentUserId
    );
    setLike(userHasLiked);
  };

  // Get total likes for the comment
  const fetchLikes = async () => {
    const likes = await fetchTotalLikesByItemId(
      "recipe_comments_likes",
      "recipe_comment_id",
      comment.id
    );
    setCommentsLikesCount(likes);
  };

  // Fetch like status and total likes on component mount
  useEffect(() => {
    getCurrentUserId();
    fetchLikes();
  }, []);
  useEffect(() => {
    checkUserLikeStatus();
  }, [currentUserId]);
  useEffect(() => {
    fetchLikes();
    checkUserLikeStatus();
  }, [comment]);

  // Update likes count when like state changes
  const likeCommentHandler = async () => {
    if (like === false) {
      await likeItem(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id,
        currentUserId
      );
    } else {
      await unlikeItem(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id,
        currentUserId
      );
    }
    setLike(!like);
    await fetchLikes(); // Fetch updated likes after action
  };

  return (
    <View className="mb-4 border-b border-blue pb-2">
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
          <View className="w-64 h-64">
            <ImageLoader
              image={comment.comment_pic}
              className="w-64 h-64 rounded-lg"
              loaderClassName="w-64 h-64"
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default RecipeCommentCard;
