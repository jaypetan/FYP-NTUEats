// React and React Native core
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// External libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeOut } from "react-native-reanimated";

// Assets
import CookWHATLogo from "@/assets/images/logos/CookWHAT-logo.png";

// Utilities
import { getRecipesArranged } from "@/utils/recipeServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import FoodCard from "@/app/components/Home/HomeCookWHAT/FoodCard";
import VerticalWordButton from "@/app/components/Home/SharedComponents/VerticalWordButton";

const HomeEatWHAT = () => {
  const { setCurrentPage } = useAppContext();
  const [swiped, setSwiped] = useState(false); // To remove instructions after swipe

  // Fetch and display food cards
  const [recipeData, setRecipeData] = useState<any[]>([]);
  const fetchRecipeData = async () => {
    const data = await getRecipesArranged("most_likes", 4);
    setRecipeData(data.content);
  };

  useEffect(() => {
    console.log(recipeData);
  }, [recipeData]);

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
