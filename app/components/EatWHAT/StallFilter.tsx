// React and React Native core
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

// Components
import CustomDropdown from "@/app/components/CustomDropdown";

// Utilities
import { fetchCanteenList } from "@/utils/stallServices";

interface StallFilterProps {
  arrangement: string;
  setArrangement: (arrangement: string) => void;
  restrictionsFilter: {
    canteen: string;
    vegetarian: boolean;
    halal: boolean;
  };
  setRestrictionsFilter: (restrictionsFilter: {
    canteen: string;
    vegetarian: boolean;
    halal: boolean;
  }) => void;
}

const StallFilter: React.FC<StallFilterProps> = ({
  arrangement,
  setArrangement,
  restrictionsFilter,
  setRestrictionsFilter,
}) => {
  const arrangementOptions = [
    { label: "Popularity", value: "most_saved" },
    { label: "Price (High to Low)", value: "price_high_to_low" },
    { label: "Price (Low to High)", value: "price_low_to_high" },
  ];

  const [canteen, setCanteen] = useState<{ label: string; value: string }[]>(
    []
  );

  const fetchCanteens = async () => {
    await fetchCanteenList().then((data) => {
      // set data to label and value pairs
      const canteenOptions = data.map((canteenName) => ({
        label: canteenName
          .replaceAll("_", " ")
          .toLowerCase()
          .replace(/^./, (c: string) => c.toUpperCase()),
        value: canteenName,
      }));
      setCanteen(canteenOptions);
    });
  };

  useEffect(() => {
    fetchCanteens();
  }, []);

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
        />

        {/* Canteen Dropdown */}
        <CustomDropdown
          label="Canteen:"
          variable={restrictionsFilter.canteen}
          setVar={(value: string) => {
            setRestrictionsFilter({
              ...restrictionsFilter,
              canteen: value,
            });
          }}
          customOptions={canteen}
          placeholder="Filter by canteen"
        />
      </View>
    </View>
  );
};

export default StallFilter;
