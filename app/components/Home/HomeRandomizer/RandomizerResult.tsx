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
import TouchableScale from "@/app/components/TouchableScale";

interface RandomizerResultProps {
  Randomizer3: any;
  setImageState: React.Dispatch<
    React.SetStateAction<"initial" | "thinking" | "result">
  >;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<"eat" | "cook" | "both" | null>
  >;
}

const RandomizerResult = ({
  Randomizer3,
  setImageState,
  setSelectedOption,
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
        className="mr-8 relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden p-3"
      >
        <Text className="text-blue font-koulen text-center text-2xl">
          Food Card
        </Text>
      </Animated.View>
      <Animated.View
        entering={SlideInRight.delay(200)}
        exiting={SlideOutRight.duration(300)}
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
