// React component
import { View } from "react-native";

// External libraries
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

interface FoodPreferenceProps {
  vegetarian?: boolean;
  halal?: boolean;
  className?: string;
}

const FoodPreference: React.FC<FoodPreferenceProps> = ({
  vegetarian,
  halal,
  className = "",
}) => {
  return (
    <View className={`absolute z-10 ${className} flex-row gap-2`}>
      {vegetarian && (
        <FontAwesome
          name="leaf"
          size={20}
          color="white"
          className="p-2 rounded-full bg-green/80"
        />
      )}
      {halal && (
        <MaterialCommunityIcons
          name="food-halal"
          size={20}
          color="white"
          className="p-2 rounded-full bg-green/80"
        />
      )}
    </View>
  );
};

export default FoodPreference;
