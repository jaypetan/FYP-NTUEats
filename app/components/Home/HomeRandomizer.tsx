import { useState } from "react";
import { Text, View } from "react-native";

// Assets
import Randomizer1 from "@/assets/images/logos/Randomizer-1.png";
import Randomizer2 from "@/assets/images/logos/Randomizer-2.png";
import Randomizer3 from "@/assets/images/logos/Randomizer-3.png";

// Components
import RandomizerInitial from "./HomeRandomizer/RandomizerInitial";
import RandomizerResult from "./HomeRandomizer/RandomizerResult";
import RandomimerThinking from "./HomeRandomizer/RandomizerThinking";

const HomeRandomizer = () => {
  const [imageState, setImageState] = useState<
    "initial" | "thinking" | "result"
  >("initial");
  const [selectedOption, setSelectedOption] = useState<
    "eat" | "cook" | "both" | null
  >(null);

  return (
    <View className="mt-12">
      <Text className="text-4xl font-ranchers text-blue">
        Still Cannot decide?
      </Text>
      <Text className="text-blue text-2xl font-koulen mt-2">
        I'll help you decide! Pick one:
      </Text>
      {imageState === "initial" ? (
        <RandomizerInitial
          setImageState={setImageState}
          setSelectedOption={setSelectedOption}
          Randomizer1={Randomizer1}
        />
      ) : imageState === "thinking" ? (
        <RandomimerThinking
          selectedOption={selectedOption}
          setImageState={setImageState}
          Randomizer2={Randomizer2}
        />
      ) : (
        <RandomizerResult
          Randomizer3={Randomizer3}
          setImageState={setImageState}
          setSelectedOption={setSelectedOption}
        />
      )}
    </View>
  );
};

export default HomeRandomizer;
