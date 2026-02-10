// React and React Native core
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

// External libraries
import { MaterialIcons } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface StallFilterProps {
  arrangement: string;
  setArrangement: (arrangement: string) => void;
}

const StallFilter: React.FC<StallFilterProps> = ({
  arrangement,
  setArrangement,
}) => {
  const [arrangementDropdown, setArrangementDropdown] = useState(false);
  const arrangementOptions = [
    { label: "Popularity", value: "most_saved" },
    { label: "Price (High to Low)", value: "price_high_to_low" },
    { label: "Price (Low to High)", value: "price_low_to_high" },
  ];

  return (
    <View className="mt-4 p-4 bg-cream rounded-2xl w-full border-2 border-blue">
      <Text className="text-2xl text-blue font-koulen">Filter</Text>

      {/* Arrangement Dropdown */}
      <Text className="font-koulen text-blue text-2xl pt-2">Arrange By: </Text>
      <Pressable
        className="border-2 border-blue px-4 py-2 flex-row justify-between"
        onPress={() => setArrangementDropdown(!arrangementDropdown)}
      >
        <Text className="text-blue text-lg font-bold">
          {
            arrangementOptions.find((option) => option.value === arrangement)
              ?.label
          }
        </Text>
        <MaterialIcons
          style={{
            transform: [{ rotate: arrangementDropdown ? "180deg" : "0deg" }],
          }}
          name="arrow-drop-down"
          size={24}
          color="#264653"
        />
      </Pressable>
      {arrangementDropdown && (
        <View className="flex-col border-x-2 border-b-2 border-blue bg-darkcream">
          {arrangementOptions.map((option, index) => (
            <View
              key={option.value}
              className={`${
                index === arrangementOptions.length - 1 ? "" : "border-b-2"
              } ${arrangement === option.value ? "hidden" : ""} border-blue`}
            >
              <TouchableScale
                className="w-full py-2 px-4"
                onPress={() => {
                  setArrangement(option.value);
                  setArrangementDropdown(false);
                }}
              >
                <Text className="text-blue text-lg font-semibold">
                  {option.label}
                </Text>
              </TouchableScale>
            </View>
          ))}
        </View>
      )}

      {/* Canteen Dropdown */}
    </View>
  );
};

export default StallFilter;
