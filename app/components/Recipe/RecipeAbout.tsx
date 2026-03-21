// React and React Native core
import React, { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";

// External libraries
import FontAwesome from "react-native-vector-icons/FontAwesome5";

// Utilities
import { hasUserLikedItem, likeItem, unlikeItem } from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";

// Componenets
import TouchableScale from "../TouchableScale";

interface RecipeAboutProps {
  recipeId: string;
  chefName: string;
  cookingTime: string;
  desc: string;
  ingredients: string[];
}

const RecipeAbout: React.FC<RecipeAboutProps> = ({
  recipeId,
  chefName,
  cookingTime,
  desc,
  ingredients,
}) => {
  const [liked, setLiked] = useState(false);
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

  // Check if the user has liked the recipe
  const checkUserLikeStatus = useCallback(async () => {
    if (!recipeId || !currentUserId) return;
    const userHasLiked = await hasUserLikedItem(
      "recipes_likes",
      "recipe_id",
      recipeId,
      currentUserId,
    );
    setLiked(userHasLiked);
  }, [recipeId, currentUserId]);

  // Check user like status when currentUserId changes
  useEffect(() => {
    getCurrentUserId();
  }, [getCurrentUserId, recipeId]);

  useEffect(() => {
    checkUserLikeStatus();
  }, [checkUserLikeStatus]);

  const handleSave = () => {
    if (liked) {
      unlikeItem("recipes_likes", "recipe_id", recipeId, currentUserId);
    } else {
      likeItem("recipes_likes", "recipe_id", recipeId, currentUserId);
    }
    setLiked(!liked);
  };

  const Title = ({ title, icon }: { title?: string; icon?: string }) => (
    <View className="flex-row items-center gap-2">
      {icon && <FontAwesome name={icon} size={24} color="#323232" />}
      {title && (
        <Text className="text-3xl pt-2 font-koulen text-blue mt-4">
          {title}
        </Text>
      )}
    </View>
  );
  return (
    <View className="flex-col gap-2">
      {/* Description & Cooking Time */}
      <View>
        <View className="flex-row justify-between itens-start">
          <Title title="Description" icon="file-alt" />
          {/* Save Button */}
          <TouchableScale
            onPress={() => {
              handleSave();
            }}
            className={`items-center justify-center border-blue border-2 p-3 rounded-full self-center ${
              liked ? "bg-green/50" : ""
            }`}
          >
            {liked ? (
              <FontAwesome name="heart" size={20} color="#323232" solid />
            ) : (
              <FontAwesome name="heart" size={20} color="#323232" />
            )}
          </TouchableScale>
        </View>
        <Text className="text-xl text-blue">{desc}</Text>
      </View>
      {/* Cooking Time */}
      <View>
        <Title icon="clock" title="cooking time" />
        <Text className="text-xl text-blue">{cookingTime}</Text>
      </View>
      {/* Ingredients */}
      <View>
        <Title title="Ingredients" icon="utensils" />
        {ingredients.map((ingredient, index) => (
          <Text key={index} className="text-xl text-blue">
            - {ingredient}
          </Text>
        ))}
      </View>
      {/* Chef Name */}
      <View className="flex-row items-center self-end">
        <Title title={`By: ${chefName}`} />
      </View>
    </View>
  );
};

export default RecipeAbout;
