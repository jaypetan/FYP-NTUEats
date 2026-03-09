// React and React Native core
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// Assets
import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";

// Utilities
import { fetchDietaryByRecipeId } from "@/utils/dietaryServices";
import {
  getRecipesArranged,
  searchRecipesByTitle,
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
  const { currentPage, setCurrentPage, restrictions } = useAppContext();
  const [arrangement, setArrangement] = useState<string>("");
  const [recipesData, setRecipesData] = useState<any[]>([]);
  const [recipesShown, setRecipesShown] = useState(4);
  const [recipesDataLength, setRecipesDataLength] = useState(0);

  const [filterDropdown, setFilterDropdown] = useState<boolean>(false); // State for filter dropdown visibility
  const [restrictionsFilter, setRestrictionsFilter] = useState({
    vegetarian: false,
    halal: false,
  }); // State for dietary restrictions filter

  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [searchData, setSearchData] = useState<any[]>([]); // State for search results
  const randomSeedRef = useRef<string>(`${Date.now()}-${Math.random()}`);
  const hasEnteredCookWhatRef = useRef<boolean>(false);

  const handleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  // Fetch restrictions on page load
  useEffect(() => {
    if (currentPage === "cook-what") {
      setRestrictionsFilter((prev) => ({
        ...prev,
        vegetarian: restrictions.vegetarian,
        halal: restrictions.halal,
      }));
    }
  }, [currentPage, restrictions]);

  // Fetch all recipes on component mount
  const fetchRecipesFunction = useCallback(
    async (arrangement: string, recipesToShow: number) => {
      const randomSeed = arrangement ? "" : randomSeedRef.current;
      const { content, length } =
        searchData.length > 0 && searchTerm.trim() !== ""
          ? await getRecipesArranged(
              arrangement,
              recipesToShow,
              restrictionsFilter,
              searchData, // Pass search results for further filtering and arrangement
              randomSeed,
            )
          : await getRecipesArranged(
              arrangement,
              recipesToShow,
              restrictionsFilter,
              undefined,
              randomSeed,
            );
      const updatedRecipes = await Promise.all(
        content.map(async (recipe: any) => {
          const dietaryInfo = await fetchDietaryByRecipeId(recipe.id);
          return {
            ...recipe,
            halal: dietaryInfo?.halal || false,
            vegetarian: dietaryInfo?.vegetarian || false,
          };
        }),
      );
      setRecipesData(updatedRecipes);
      setRecipesDataLength(length);
    },
    [restrictionsFilter, searchData, searchTerm],
  );

  useEffect(() => {
    if (currentPage === "cook-what" && !hasEnteredCookWhatRef.current) {
      randomSeedRef.current = `${Date.now()}-${Math.random()}`;
      hasEnteredCookWhatRef.current = true;
    }

    if (currentPage !== "cook-what") {
      hasEnteredCookWhatRef.current = false;
    }
  }, [currentPage]);

  // If currentPage changes to "cook-what", reset recipesShown
  useEffect(() => {
    if (currentPage !== "cook-what") return;
    const recipesToShow = 4; // Reset recipes shown when leaving the page
    setRecipesShown(recipesToShow);
  }, [currentPage, arrangement, restrictionsFilter, searchData]);

  // Fetch recipes whenever arrangement or recipesShown changes
  useEffect(() => {
    if (currentPage !== "cook-what") return;
    fetchRecipesFunction(arrangement, recipesShown);
  }, [currentPage, arrangement, restrictionsFilter, recipesShown, searchData]);

  // Fetch more recipes
  const loadMoreRecipes = () => {
    let newLimit = recipesShown + 4;
    if (newLimit >= recipesDataLength) {
      newLimit = recipesDataLength; // Don't exceed total recipes
    }
    setRecipesShown(newLimit);
  };

  // Search bar functionality
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    searchRecipesByTitle(query).then((result) => {
      setSearchData(result?.data ?? []);
    });
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
              {recipesData.length === 0 && (
                <View className="items-center mt-8">
                  <Text className="text-blue text-xl">No recipes found.</Text>
                  <Text className="text-blue text-lg">
                    Try adjusting your search or filters.
                  </Text>
                </View>
              )}
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
