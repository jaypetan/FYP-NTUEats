import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Utilities
import { getRecipesArranged } from "@/utils/recipeServices";
import { fetchTopReviewImageByStallId } from "@/utils/reviewServices";
import { getStallsArranged } from "@/utils/stallServices";

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

  const { restrictions } = useAppContext();
  const [selectedPick, setSelectedPick] = useState<any[]>([]);
  const [pickLoaded, setPickLoaded] = useState(false);

  useEffect(() => {
    // For eat option, fetch 1 random stall and its review image
    const fetchEatOption = async () => {
      // Fetch only 4 stalls
      getStallsArranged("random", 1, restrictions).then(async (data) => {
        // Fetch review images for each stall
        const stallsWithImages = await Promise.all(
          data.data.map(async (stall) => {
            const reviewImage = await fetchTopReviewImageByStallId(stall.id);
            return { ...stall, reviewImage };
          }),
        );
        setSelectedPick(stallsWithImages[0]);
        setPickLoaded(true);
      });
    };

    // For cook option, fetch 1 random recipe
    const fetchCookOption = async () => {
      const data = await getRecipesArranged("random", 1, restrictions);
      setSelectedPick(data.content[0]);
      setPickLoaded(true);
    };

    if (imageState === "thinking") {
      setPickLoaded(false);
      if (selectedOption === "eat") {
        fetchEatOption();
      } else if (selectedOption === "cook") {
        fetchCookOption();
      } else {
        // Randomly pick between eat and cook
        const randomChoice = Math.random() < 0.5 ? "eat" : "cook";
        setSelectedOption(randomChoice);
      }
    }
  }, [imageState, selectedOption, restrictions]);

  return (
    <View className="mt-12">
      <Text className="text-4xl font-ranchers text-blue">
        Still Cannot decide?
      </Text>
      <Text className="text-blue text-2xl font-koulen mt-2">
        {imageState === "initial"
          ? "I'll help you decide! Pick one:"
          : imageState === "thinking"
            ? "Okay! Let me think..."
            : `Let's ${selectedOption}!`}
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
          pickLoaded={pickLoaded}
        />
      ) : (
        <RandomizerResult
          Randomizer3={Randomizer3}
          setImageState={setImageState}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          selectedPick={selectedPick}
        />
      )}
    </View>
  );
};

export default HomeRandomizer;
