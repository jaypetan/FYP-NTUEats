import { Image, Text, View } from "react-native";
import Animated, { FadeIn, SlideOutDown } from "react-native-reanimated";

// External Libraries
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface RandomizerInitialProps {
  Randomizer1: any;
  setImageState: React.Dispatch<
    React.SetStateAction<"initial" | "thinking" | "result">
  >;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<"eat" | "cook" | "both" | null>
  >;
}

const RandomizerInitial = ({
  Randomizer1,
  setImageState,
  setSelectedOption,
}: RandomizerInitialProps) => {
  const ButtonOptionsChoices = [
    { icon: "silverware-fork-knife", text: "Eat", value: "eat" },
    { icon: "chef-hat", text: "Cook", value: "cook" },
    { icon: "", text: "Both also can", value: "both" },
  ];

  const ButtonOpions = (
    icon: string,
    text: string,
    value: string,
    key: number,
  ) => {
    return (
      <TouchableScale key={key} onPress={() => handlePress(value)}>
        <View className="border-2 border-blue bg-green/50 rounded-2xl self-start flex-row gap-2 justify-center items-center px-4">
          {icon && (
            <MaterialCommunityIcons name={icon} size={28} color="#264653" />
          )}
          <Text className="text-blue text-2xl pt-3 font-koulen">{text}</Text>
        </View>
      </TouchableScale>
    );
  };

  const handlePress = (value: string) => {
    setImageState("thinking");
    setSelectedOption(value as "eat" | "cook" | "both");
  };

  return (
    <View className="flex-row items-end mt-2">
      {/* LHS */}
      <Animated.View
        entering={FadeIn.delay(200)}
        exiting={SlideOutDown.duration(300)}
        className="flex-col gap-2 h-64"
      >
        {ButtonOptionsChoices.map((option, index) =>
          ButtonOpions(option.icon, option.text, option.value, index),
        )}
      </Animated.View>

      {/* RHS */}
      <Animated.View
        entering={FadeIn.delay(200)}
        exiting={SlideOutDown.duration(300)}
      >
        <Image
          source={Randomizer1}
          className="w-48 h-48"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default RandomizerInitial;
