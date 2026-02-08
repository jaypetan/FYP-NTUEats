// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

// Utilities
import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

interface RecipeCardProps {
  recipeId: string;
  foodImage: any;
  foodName: string;
  chefName: string;
  duration: string;
  halal?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  recipeId,
  foodImage,
  foodName,
  chefName,
  duration,
  halal,
  vegetarian,
  spicy,
}) => {
  const { setCurrentPage, setSelectedId } = useAppContext();
  const handlePress = () => {
    setSelectedId(recipeId);
    setCurrentPage("recipe-page");
  };

  const [like, setLike] = useState(false);
  const [recipeLikesCount, setRecipeLikesCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState("");
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

  // Check if the user has liked the comment
  const checkUserLikeStatus = async () => {
    const userHasLiked = await hasUserLikedItem(
      "recipes_likes",
      "recipe_id",
      recipeId,
      currentUserId
    );
    setLike(userHasLiked);
  };

  // Fetch current likes
  const fetchLikes = async () => {
    fetchTotalLikesByItemId("recipes_likes", "recipe_id", recipeId).then(
      (totalLikes) => {
        setRecipeLikesCount(totalLikes);
      }
    );
  };

  // Fetch like status and total likes on component mount
  useEffect(() => {
    getCurrentUserId();
    fetchLikes();
  }, []);
  useEffect(() => {
    checkUserLikeStatus();
  }, [currentUserId]);

  const likeRecipeHandler = async () => {
    if (like) {
      // Unlike the recipe
      await unlikeItem("recipes_likes", "recipe_id", recipeId, currentUserId);
      setLike(false);
      fetchLikes();
    } else {
      // Like the recipe
      await likeItem("recipes_likes", "recipe_id", recipeId, currentUserId);
      setLike(true);
      fetchLikes();
    }
  };

  return (
    <View className="mt-8 border-2 border-blue rounded-2xl">
      <TouchableScale
        onPress={() => handlePress()}
        className="w-full rounded-2xl bg-green/50 flex-row items-center p-4"
      >
        <View className="relative">
          <View className="w-32 h-32 rounded-2xl justify-center items-center overflow-hidden">
            <ImageLoader
              image={foodImage}
              className="w-32 h-32 rounded-2xl"
              loaderClassName="absolute w-full h-full bottom-0 translate-y-3"
            />
          </View>
          <View className="absolute bottom-2 right-2 flex-row gap-2">
            {vegetarian && (
              <FontAwesome
                name="leaf"
                size={16}
                color="white"
                className="p-2 rounded-full bg-green/80"
              />
            )}
            {halal && (
              <MaterialCommunityIcons
                name="food-halal"
                size={16}
                color="white"
                className="p-2 rounded-full bg-green/80"
              />
            )}
          </View>
        </View>

        <View className="flex-1 flex-col px-4 py-2 justify-between h-32">
          <View className="flex-row justify-between items-center">
            <View className="flex-col">
              <Text className="text-2xl font-koulen -mb-[0.5rem]">
                {foodName}
              </Text>
              <Text className="text-xl">By {chefName}</Text>
            </View>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-xl text-blue">{duration}</Text>
            <View className="flex-row gap-2 items-center justify-end">
              <Text className="font-inter text-lg font-semibold text-blue">
                {recipeLikesCount ? recipeLikesCount : ""}
              </Text>
              <TouchableOpacity onPress={() => likeRecipeHandler()}>
                {like ? (
                  <FontAwesome name="heart" size={20} color="red" />
                ) : (
                  <FontAwesome name="heart-o" size={20} color="black" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableScale>
    </View>
  );
};

export default RecipeCard;
