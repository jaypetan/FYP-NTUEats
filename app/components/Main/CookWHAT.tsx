// React and React Native core
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";

// Assets
import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";

// Utilities
import { getRecipesArranged } from "@/utils/recipeServices";
import { fetchUserByDocId } from "@/utils/userServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import RecipeCard from "@/app/components/CookWHAT/RecipeCard";
import SearchBar from "@/app/components/CookWHAT/SearchBar";
import HomeNav from "@/app/components/Home/HomeNav";
import LoadMore from "@/app/components/LoadMore";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";

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
  const [recipesShown, setRecipesShown] = useState(4);

  // Fetch all recipes on component mount
  const fetchRecipesFunction = async (recipesToShow: number) => {
    const recipes = await getRecipesArranged("most_likes", recipesToShow);
    const recipesWithChef = await Promise.all(
      recipes.content.map(async (recipe: any) => {
        const chefData = await fetchUserByDocId(recipe.user_id);
        return {
          ...recipe,
          chef_name: chefData ? chefData.username : "Unknown Chef",
        };
      })
    );
    setRecipesData(recipesWithChef);
  };
  useEffect(() => {
    const recipesToShow = 4;
    setRecipesShown(recipesToShow); // Reset to initial number of recipes
    fetchRecipesFunction(recipesToShow);
  }, []);

  // Fetch more recipes
  const loadMoreRecipes = () => {
    const recipesToShow = recipesShown + 4;
    setRecipesShown(recipesToShow);
    fetchRecipesFunction(recipesToShow);
  };

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
                chefName={recipe.chef_name}
                duration={recipe.cooking_time}
                halal={recipe.halal}
                vegetarian={recipe.vegetarian}
                spicy={recipe.spicy}
              />
            ))}
            {recipesData.length >= recipesShown && (
              <LoadMore onClick={loadMoreRecipes} />
            )}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
