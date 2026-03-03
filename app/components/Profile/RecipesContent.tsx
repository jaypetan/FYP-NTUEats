// React Native core
import { useCallback, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";

// Utils
import { getRecipesByUserIdArranged } from "@/utils/recipeServices";

// Components
import { useAppContext } from "@/app/components/AppContext";
import ListWithSeeMore from "@/app/components/ListWithLoadMore";
import ProfileRecipeCard from "@/app/components/Profile/RecipesContent/ProfileRecipeCard";
import TouchableScale from "@/app/components/TouchableScale";

interface RecipesContentProps {
  userId: string;
  toggleModalVisibility: (type: string) => void;
  editModalVisible: string;
}
const RecipesContent: React.FC<RecipesContentProps> = ({
  userId,
  toggleModalVisibility,
  editModalVisible,
}) => {
  const { setCurrentPage } = useAppContext();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [maxLength, setMaxLength] = useState(0);

  // Fetch and set recipe
  const fetchAndSetRecipes = useCallback(
    async (arrangement: string, length: number) => {
      // Implementation for fetching recipes goes here
      if (userId) {
        const fetchedRecipes = await getRecipesByUserIdArranged(
          userId,
          arrangement,
          length,
        );
        if (fetchedRecipes) {
          setRecipes(fetchedRecipes.content);
          setMaxLength(fetchedRecipes.total);
        }
      }
    },
    [userId],
  );

  // Fetch recipes when userId changes
  useEffect(() => {
    fetchAndSetRecipes("most_recent", 4);
  }, [editModalVisible, fetchAndSetRecipes]);

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
      <View className="flex-row justify-between w-full items-start">
        <Text className="text-4xl self-start font-koulen text-blue mb-4 pt-4">
          Your Recipes
        </Text>
        <TouchableScale
          onPress={() => setCurrentPage("upload-recipe-page")}
          className="rounded-2xl p-2 border-2 border-blue bg-cream/80 mb-4"
        >
          <MaterialCommunityIcons name="plus" size={24} color="#264653" />
        </TouchableScale>
      </View>
      <Animatable.View animation="fadeInUpBig" className="w-full">
        <ScrollView className="flex-col w-full max-h-[450px]">
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
      </Animatable.View>
    </View>
  );
};

export default RecipesContent;
