import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";
import { fetchTotalLikesByItemId } from "@/utils/LikeServices";
import { getAllRecipes } from "@/utils/recipeServices";
import { fetchUserByDocId } from "@/utils/userServices";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { useAppContext } from "../AppContext";
import RecipeCard from "../CookWHAT/RecipeCard";
import SearchBar from "../CookWHAT/SearchBar";
import HomeNav from "../Home/HomeNav";
import OptimizedScrollView from "../OptimizedScrollView";

interface CookWhatProps {
  backgroundColor: string;
  backgroundColorHex: string;
  widthClass: string;
}

export default function CookWhat({
  backgroundColor,
  backgroundColorHex,
  widthClass,
}: CookWhatProps) {
  const { currentPage, setCurrentPage } = useAppContext();
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [rawRecipes, setRawRecipes] = useState<any[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const recipes = await getAllRecipes();
      setRawRecipes(recipes); // Set raw recipes first
    };
    fetchRecipes();
  }, []);

  useEffect(() => {
    if (rawRecipes.length === 0) return;

    const fetchAdditionalData = async () => {
      const updatedRecipes = await Promise.all(
        rawRecipes.map(async (recipe) => {
          const chefData = await fetchUserByDocId(recipe.user_id);
          const likesCount = await fetchTotalLikesByItemId(
            "recipes_likes",
            "recipe_id",
            recipe.id
          );
          return {
            ...recipe,
            chefName: chefData ? chefData.username : "Unknown Chef",
            likes: likesCount,
          };
        })
      );
      updatedRecipes.sort((a, b) => b.likes - a.likes);
      setRecipesData(updatedRecipes);
    };

    fetchAdditionalData();
  }, [rawRecipes]);

  return (
    <View className="h-full w-full flex-col">
      <HomeNav
        backgroundColor={backgroundColor}
        backgroundColorHex={backgroundColorHex}
        text="CookWHAT"
        setCurrentPage={setCurrentPage}
        desiredPage="cook-what"
        widthClass={widthClass}
      />
      {currentPage !== "cook-what" ? (
        <View
          className={`bg-${backgroundColor} min-h-[80vh] rounded-tl-3xl w-full`}
        />
      ) : (
        <View className={`bg-${backgroundColor} pt-8 rounded-tl-3xl`}>
          <OptimizedScrollView
            className={`bg-${backgroundColor} min-h-[80vh] px-8`}
          >
            <View className="flex-row gap-2 mt-4 mb-2 justify-center">
              <Image
                source={CookWHATLogo}
                className="w-40 h-40"
                resizeMode="contain"
              />
            </View>
            <Text className="text-4xl font-koulen pt-4 text-blue">
              What are we cooking today?
            </Text>
            <SearchBar />
            {recipesData.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipeId={recipe.id}
                foodImage={recipe.recipe_pic}
                foodName={recipe.title}
                chefName={recipe.chefName}
                duration={recipe.cooking_time}
                halal={recipe.halal}
                vegetarian={recipe.vegetarian}
                spicy={recipe.spicy}
              />
            ))}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
