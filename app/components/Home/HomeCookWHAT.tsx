import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { getRecipesArranged } from "@/utils/recipeServices";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Animated, { FadeOut } from "react-native-reanimated";
import { useAppContext } from "../AppContext";
import FoodCard from "./HomeCookWHAT/FoodCard";
import VerticalWordButton from "./SharedComponents/VerticalWordButton";

const HomeEatWHAT = () => {
  const { setCurrentPage } = useAppContext();
  const [swiped, setSwiped] = useState(false); // To remove instructions after swipe

  // Fetch and display food cards
  const [recipeData, setRecipeData] = useState<any[]>([]);
  const fetchRecipeData = async () => {
    const data = await getRecipesArranged("most_likes", 4);
    const likesPromises = data.content.map(async (recipe) => {
      const likes = await fetchTotalLikesByItemId(
        "recipes_likes",
        "recipe_id",
        recipe.id
      );
      return { ...recipe, likes };
    });
    const recipesWithLikes = await Promise.all(likesPromises);
    setRecipeData(recipesWithLikes);
  };

  useEffect(() => {
    fetchRecipeData();
  }, []);

  return (
    <View className="mt-8">
      <View className="flex-row items-end gap-2">
        <Image
          source={CookWHATLogo}
          className="w-40 h-40"
          resizeMode="contain"
        />
        <Text className="text-4xl font-ranchers text-blue">
          I Want To Cook!
        </Text>
      </View>
      <ScrollView
        className="w-full mt-4"
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        onScroll={() => setSwiped(true)}
      >
        {recipeData.map((card) => (
          <FoodCard
            key={card.id}
            imageSource={card.recipe_pic}
            foodName={card.title}
            halal={card.halal}
            vegetarian={card.vegetarian}
            spicy={card.spicy}
            recipeId={card.id}
          />
        ))}
        <VerticalWordButton
          text="More Options"
          setCurrentPage={setCurrentPage}
          desiredPage={"cook-what"}
        />
      </ScrollView>
      {!swiped && (
        <Animated.View
          className="absolute -bottom-8 right-0 flex-row items-center"
          exiting={FadeOut.duration(1000)}
        >
          <Text className="font-inter text-blue text-sm">
            Swipe for more options
          </Text>
          <MaterialCommunityIcons
            name="gesture-swipe-right"
            size={24}
            color={"gray"}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeEatWHAT;
