// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Utils
import { getRecipesByUserIdArranged } from "@/utils/recipeServices";
import { fetchUserByClerkId } from "@/utils/userServices";

import ListWithSeeMore from "@/app/components/ListWithLoadMore";
import ProfileRecipeCard from "@/app/components/Profile/RecipesContent/ProfileRecipeCard";

interface RecipesContentProps {
  activeTab: string;
  toggleModalVisibility: (type: string) => void;
  editModalVisible: string;
}
const RecipesContent: React.FC<RecipesContentProps> = ({
  activeTab,
  toggleModalVisibility,
  editModalVisible,
}) => {
  const { user } = useUser();
  const [userId, setUserId] = useState("");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [maxLength, setMaxLength] = useState(0);

  // Fetch user ID based on Clerk ID
  useEffect(() => {
    const fetchAndSetUserId = async () => {
      if (user) {
        const fetchedUser = await fetchUserByClerkId(user.id);
        if (fetchedUser) {
          setUserId(fetchedUser.id);
        }
      }
    };
    fetchAndSetUserId();
  }, [user, activeTab]);

  // Fetch recipes when userId changes
  useEffect(() => {
    fetchAndSetRecipes("most_recent", 4);
  }, [userId, editModalVisible]);

  // Fetch and set recipe
  const fetchAndSetRecipes = async (arrangement: string, length: number) => {
    // Implementation for fetching recipes goes here
    if (userId) {
      const fetchedRecipes = await getRecipesByUserIdArranged(
        userId,
        arrangement,
        length
      );
      if (fetchedRecipes) {
        setRecipes(fetchedRecipes.content);
        setMaxLength(fetchedRecipes.total);
      }
    }
  };

  const reviewCard = recipes.map((recipe) => (
    <View key={recipe.id}>
      <ProfileRecipeCard
        toggleModalVisibility={toggleModalVisibility}
        recipe={recipe}
      />
    </View>
  ));

  return (
    <View className="rounded-3xl w-full h-full items-center bg-darkcream/80 px-8 pt-8 mt-4">
      <Text className="text-4xl self-start font-koulen text-blue mb-4 pt-4">
        Your Recipes
      </Text>
      <ScrollView className="flex-col w-full max-h-[500px]">
        {recipes.length === 0 ? (
          <Text className="text-center text-lg text-blue mt-8">
            No recipes yet.
          </Text>
        ) : (
          <ListWithSeeMore
            content={reviewCard}
            fetchFn={(arrangement, limitNumber) =>
              fetchAndSetRecipes(arrangement, limitNumber)
            }
            maxCount={maxLength}
            arrangement="most_recent"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default RecipesContent;
