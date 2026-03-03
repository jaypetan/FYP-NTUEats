import { Image, Text, View } from "react-native";
import Animated, {
    FlipInYLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
} from "react-native-reanimated";

// External Libraries
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Components
import CookFoodCard from "@/app/components/Home/HomeCookWHAT/FoodCard";
import EatFoodCard from "@/app/components/Home/HomeEatWHAT/FoodCard";
import TouchableScale from "@/app/components/TouchableScale";

interface RandomizerResultProps {
  Randomizer3: any;
  setImageState: React.Dispatch<
    React.SetStateAction<"initial" | "thinking" | "result">
  >;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<"eat" | "cook" | "both" | null>
  >;
  selectedOption: "eat" | "cook" | "both" | null;
  selectedPick: any;
}

const RandomizerResult = ({
  Randomizer3,
  setImageState,
  setSelectedOption,
  selectedOption,
  selectedPick,
}: RandomizerResultProps) => {
  const handleReset = () => {
    setImageState("initial");
    setSelectedOption(null);
  };

  return (
    <View className="flex-row items-end mt-2">
      <Animated.View
        entering={FlipInYLeft.delay(100)}
        exiting={SlideOutLeft.duration(300)}
      >
        {selectedOption === "eat" ? (
          <EatFoodCard
            imageSource={selectedPick.reviewImage}
            stallImage={selectedPick.stall_pic}
            stallName={selectedPick.name}
            canteenName={selectedPick.location}
            storeId={selectedPick.id}
          />
        ) : selectedOption === "cook" ? (
          <CookFoodCard
            imageSource={selectedPick.recipe_pic}
            foodName={selectedPick.title}
            halal={selectedPick.halal}
            vegetarian={selectedPick.vegetarian}
            recipeId={selectedPick.id}
          />
        ) : (
          <View className="relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden p-3">
            <Text className="text-blue text-2xl font-koulen">
              Error in fetching result. Please try again.
            </Text>
          </View>
        )}
      </Animated.View>
      <Animated.View
        entering={SlideInRight.delay(200)}
        exiting={SlideOutRight.duration(300)}
        className="h-64 justify-between"
      >
        <TouchableScale onPress={() => handleReset()}>
          <View className="border-2 border-blue rounded-full self-end p-2 mr-8">
            <MaterialCommunityIcons name="refresh" size={32} color="#264653" />
          </View>
        </TouchableScale>
        <Image
          source={Randomizer3}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default RandomizerResult;
