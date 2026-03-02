import { useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";

// External libraries
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Assets
import Randomizer1 from "@/assets/images/logos/Randomizer-1.png";
import Randomizer2 from "@/assets/images/logos/Randomizer-2.png";
import Randomizer3 from "@/assets/images/logos/Randomizer-3.png";

const HomeRandomizer = () => {
  const [imageState, setImageState] = useState<
    "initial" | "thinking" | "result"
  >("initial");
  return (
    <View className="mt-12">
      <Text className="text-4xl font-ranchers text-blue">
        Still Cannot decide?
      </Text>
      {imageState === "initial" ? (
        <View className="flex-row items-end mt-2">
          <View className="flex-col gap-2 mt-2 h-64">
            <View className="border-2 border-blue rounded-full self-start flex-row gap-2 justify-center items-center px-4">
              <MaterialCommunityIcons
                name="silverware-fork-knife"
                size={28}
                color="#264653"
              />
              <Text className="text-blue text-2xl pt-3 font-koulen">Eat</Text>
            </View>
            <View className="border-2 border-blue rounded-full self-start flex-row gap-2 justify-center items-center px-4">
              <MaterialCommunityIcons
                name="chef-hat"
                size={28}
                color="#264653"
              />
              <Text className="text-blue text-2xl pt-3 font-koulen">Cook</Text>
            </View>
            <View className="border-2 border-blue rounded-full self-start flex-row gap-2 justify-center items-center px-4">
              <Text className="text-blue text-2xl pt-3 font-koulen">
                Both also can
              </Text>
            </View>
          </View>
          <Image
            source={Randomizer1}
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>
      ) : imageState === "thinking" ? (
        <View className="flex-row items-end mt-2">
          <View className="mr-8 relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden p-3">
            <View className="w-full h-full rounded-2xl border-2 border-blue left-0 right-0 flex items-center justify-center">
              <Text className="text-blue font-koulen text-center text-2xl">
                card will spin
              </Text>
            </View>
          </View>
          <View className="relative justify-center items-center">
            <ActivityIndicator
              size="large"
              color="#264653"
              className="absolute z-10 top-0"
            />
            <Image
              source={Randomizer2}
              className="w-40 h-40 mt-6"
              resizeMode="contain"
            />
          </View>
        </View>
      ) : (
        <View className="flex-row items-end mt-2">
          <View className="mr-8 relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden p-3">
            <Text className="text-blue font-koulen text-center text-2xl">
              Food Card
            </Text>
          </View>
          <Image
            source={Randomizer3}
            className="w-48 h-48"
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

export default HomeRandomizer;
