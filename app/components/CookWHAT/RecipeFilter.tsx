// React and React Native core
import { Text, View } from "react-native";

// Components
import CustomDropdown from "@/app/components/CustomDropdown";

interface RecipeFilterProps {
  arrangement: string;
  setArrangement: (arrangement: string) => void;
}

const RecipeFilter: React.FC<RecipeFilterProps> = ({
  arrangement,
  setArrangement,
}) => {
  const arrangementOptions = [
    { label: "Popularity", value: "most_likes" },
    { label: "Newly Added", value: "most_recent" },
  ];

  return (
    <View className="mt-4 p-4 pb-8 bg-cream rounded-2xl w-full border-2 border-blue">
      <Text className="text-2xl text-blue font-koulen">Filter</Text>
      <View className="flex-col gap-2">
        {/* Arrangement Dropdown */}
        <CustomDropdown
          label="Arrange By:"
          variable={arrangement}
          setVar={setArrangement}
          customOptions={arrangementOptions}
          placeholder="Random"
        />
      </View>
    </View>
  );
};

export default RecipeFilter;
