// React and React Native core
import { Text, View } from "react-native";

// Components
import CustomDropdown from "@/app/components/CustomDropdown";

interface FilterListProps {
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categoryOptions: { label: string; value: string }[];
  typeFilter: string;
  setTypeFilter: (value: string) => void;
  typeOptions: { label: string; value: string }[];
}

const FilterList: React.FC<FilterListProps> = ({
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  typeFilter,
  setTypeFilter,
  typeOptions,
}) => {
  return (
    <View className="p-4 pb-8 bg-cream rounded-2xl w-full border-2 border-blue">
      <Text className="text-2xl text-blue font-koulen">Filter</Text>
      <View className="flex-col gap-2">
        {/* Arrangement Dropdown */}
        <CustomDropdown
          label="Type:"
          variable={typeFilter}
          setVar={setTypeFilter}
          customOptions={typeOptions}
          placeholder="All"
        />

        {/* Canteen Dropdown */}
        <CustomDropdown
          label="Category:"
          variable={categoryFilter}
          setVar={setCategoryFilter}
          customOptions={categoryOptions}
          placeholder="All"
        />
      </View>
    </View>
  );
};

export default FilterList;
