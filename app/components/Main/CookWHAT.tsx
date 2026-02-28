// React and React Native core
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// Assets
import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";

// Utilities
import { fetchDietaryByRecipeId } from "@/utils/dietaryServices";
import {
  getRecipesArranged,
  searchRecipesByTitleArranged,
} from "@/utils/recipeServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import RecipeCard from "@/app/components/CookWHAT/RecipeCard";
import RecipeFilter from "@/app/components/CookWHAT/RecipeFilter";
import HomeNav from "@/app/components/Home/HomeNav";
import LoadMore from "@/app/components/LoadMore";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import SearchBar from "@/app/components/SearchBar";
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

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
  const [arrangement, setArrangement] = useState<string>("");
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [recipesShown, setRecipesShown] = useState(4);
  const [recipesDataLength, setRecipesDataLength] = useState(0);

  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);

  const handleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  // Fetch all recipes on component mount
  const fetchRecipesFunction = useCallback(
    async (recipesToShow: number) => {
      const recipes = await getRecipesArranged(arrangement, recipesToShow);
      const recipesWithDietary = await Promise.all(
        recipes.content.map(async (recipe: any) => {
          const dietaryInfo = await fetchDietaryByRecipeId(recipe.id);
          return {
            ...recipe,
            halal: dietaryInfo?.halal || false,
            vegetarian: dietaryInfo?.vegetarian || false,
          };
        }),
      );
      setRecipesData(recipesWithDietary);
      setRecipesDataLength(recipes.length);
    },
    [arrangement],
  );

  // If currentPage changes to "cook-what", reset recipesShown
  useEffect(() => {
    if (currentPage !== "cook-what") return;
    const recipesToShow = 4; // Reset stalls shown when leaving the page
    setRecipesShown(recipesToShow);
  }, [currentPage]);

  // Fetch recipes whenever arrangement or recipesShown changes
  useEffect(() => {
    if (currentPage !== "cook-what") return;
    fetchRecipesFunction(recipesShown);
  }, [currentPage, recipesShown, fetchRecipesFunction]);

  // Fetch more recipes
  const loadMoreRecipes = () => {
    let recipesToShow = recipesShown + 4;
    if (recipesToShow >= recipesDataLength) {
      recipesToShow = recipesDataLength; // Don't exceed total recipes
    }
    setRecipesShown(recipesToShow);
  };

  // Search bar functionality
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    if (query.trim() === "") {
      fetchRecipesFunction(recipesShown);
    } else {
      searchRecipesByTitleArranged(query, arrangement, recipesShown).then(
        (results) => {
          setRecipesData(results.content);
        },
      );
    }
  };

  // ScrollView reference for scrolling to top on search
  const scrollViewRef = useRef<ScrollView>(null);
  const handleScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 200, animated: true });
    }
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
            ref={scrollViewRef}
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

            {/* Search Bar & Filter */}
            <SearchBar
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
              handleFilterDropdown={() => handleFilterDropdown()}
            />
            {filterDropdown && (
              <Animated.View
                className="w-full"
                entering={FadeInUp}
                exiting={FadeOutUp}
              >
                <RecipeFilter
                  arrangement={arrangement}
                  setArrangement={setArrangement}
                />
              </Animated.View>
            )}

            {/* Recipes */}
            <View className="min-h-[50vh] flex-col gap-4 mt-6">
              {recipesData.map((recipe, index) => (
                <Animated.View
                  entering={FadeInRight.delay(100 + index * 100)}
                  exiting={FadeOutLeft}
                  layout={LinearTransition}
                  key={recipe.id}
                >
                  <RecipeCard
                    key={index}
                    recipeId={recipe.id}
                    foodImage={recipe.recipe_pic}
                    foodName={recipe.title}
                    chefName={recipe.chef_name}
                    duration={recipe.cooking_time}
                    halal={recipe.halal}
                    vegetarian={recipe.vegetarian}
                  />
                </Animated.View>
              ))}
            </View>
            {recipesDataLength > recipesShown && (
              <LoadMore onClick={loadMoreRecipes} />
            )}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
