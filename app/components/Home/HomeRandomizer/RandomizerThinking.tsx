import { useEffect, useState } from "react";
import { ActivityIndicator, Image, View } from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeInLeft,
    FadeOutDown,
    FlipOutEasyY,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

// External Libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface RandomizerThinkingProps {
  selectedOption: "eat" | "cook" | "both" | null;
  setImageState: React.Dispatch<
    React.SetStateAction<"initial" | "thinking" | "result">
  >;
  Randomizer2: any;
}

const RandomimerThinking = ({
  selectedOption,
  setImageState,
  Randomizer2,
}: RandomizerThinkingProps) => {
  // Animation Configurations for spinning card
  const SPIN_DURATION = 1800;
  const cardRotation = useSharedValue(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 1000 }, { rotateY: `${cardRotation.value}deg` }],
  }));

  useEffect(() => {
    cardRotation.value = 0;
    setIsImageLoading(true);
    cardRotation.value = withTiming(1080, {
      duration: SPIN_DURATION,
      easing: Easing.linear,
    });

    const timer = setTimeout(() => {
      setImageState("result");
    }, SPIN_DURATION);

    return () => clearTimeout(timer);
  }, [cardRotation, setImageState]);

  const CardIcon = [
    { icon: "silverware-fork-knife", value: "eat" },
    { icon: "chef-hat", value: "cook" },
    { icon: "infinity", value: "both" },
  ];
  return (
    <View className="flex-row items-end mt-2">
      <Animated.View
        entering={FadeInLeft}
        exiting={FlipOutEasyY.duration(300).damping(2)}
      >
        <Animated.View
          style={cardAnimatedStyle}
          className="relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden p-3"
        >
          <View className="w-full h-full rounded-2xl border-2 border-blue left-0 right-0 flex items-center justify-center">
            {selectedOption && (
              <MaterialCommunityIcons
                name={
                  (CardIcon.find((item) => item.value === selectedOption)
                    ?.icon || "help") as any
                }
                size={36}
                color="#264653"
                className="rounded-full p-2 border-2 border-blue"
              />
            )}
          </View>
        </Animated.View>
      </Animated.View>
      <Animated.View
        entering={FadeIn.delay(200)}
        exiting={FadeOutDown.duration(200)}
        className="relative justify-center items-center"
      >
        {!isImageLoading && (
          <ActivityIndicator
            size="large"
            color="#264653"
            className="absolute z-10 top-0"
          />
        )}
        <Image
          source={Randomizer2}
          fadeDuration={0}
          onLoadStart={() => setIsImageLoading(true)}
          onLoadEnd={() => setIsImageLoading(false)}
          className="w-40 h-40 mt-6"
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

export default RandomimerThinking;
