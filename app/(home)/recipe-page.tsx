// React and React Native core
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

// Utilities
import { fetchDietaryByRecipeId } from "@/utils/dietaryServices";
import {
  getRecipeById,
  getRecipeCommentsArranged,
} from "@/utils/recipeServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import RecipeComments from "@/app/components/Recipe/Comments/RecipeComments";
import RecipeAbout from "@/app/components/Recipe/RecipeAbout";
import RecipeHeader from "@/app/components/Recipe/RecipeHeader";
import RecipeSteps from "@/app/components/Recipe/RecipeSteps";

export default function RecipePage() {
  const [page, setPage] = useState("about");
  const scrollViewRef = useRef<ScrollView>(null);
  const [recipeData, setRecipeData] = useState<any>({
    title: "",
    recipe_pic: "",
    description: "",
    ingredients: [],
    instructions: [],
  });
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const { selectedId } = useAppContext();

  // Fetch Data based on selectedId
  const fetchRecipeData = async () => {
    if (selectedId) {
      const recipe = await getRecipeById(selectedId);
      const dietaryInfo = await fetchDietaryByRecipeId(recipe.id);
      setRecipeData({
        ...recipe,
        halal: dietaryInfo?.halal || false,
        vegetarian: dietaryInfo?.vegetarian || false,
      });
    }
  };

  // Fetch Comments Data based on selectedId
  const fetchCommentsData = async () => {
    if (selectedId) {
      const data = await getRecipeCommentsArranged(selectedId);
      setCommentsData(data);
    }
  };

  useEffect(() => {
    fetchRecipeData();
    fetchCommentsData();
  }, [selectedId]);

  useEffect(() => {
    // Reset scroll position to the top when the page changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [page]);

  return (
    <View className="mt-4 flex-col">
      <RecipeHeader
        recipeImage={recipeData.recipe_pic}
        recipeName={recipeData.title}
        page={page}
        setPage={setPage}
        halal={recipeData.halal}
        vegetarian={recipeData.vegetarian}
      />
      <ScrollView
        ref={scrollViewRef}
        className={`px-8 py-4 w-full h-[50vh] bg-darkcream ${
          page === "about"
            ? "rounded-tr-2xl"
            : page === "steps"
            ? "rounded-t-2xl"
            : "rounded-tl-2xl"
        }`}
      >
        <Animated.View
          entering={FadeInUp.delay(200)}
          exiting={FadeOutDown}
          key={page}
        >
          {page === "about" ? (
            <RecipeAbout
              desc={recipeData.description}
              ingredients={recipeData.ingredients}
            />
          ) : page === "steps" ? (
            <RecipeSteps steps={recipeData.instructions} />
          ) : page === "comments" ? (
            <RecipeComments
              comments={commentsData}
              fetchCommentsData={fetchCommentsData}
            />
          ) : null}
        </Animated.View>
        <Text className="py-8" />
      </ScrollView>
    </View>
  );
}
