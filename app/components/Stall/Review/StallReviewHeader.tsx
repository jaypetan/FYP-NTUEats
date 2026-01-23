// React and React Native core
import { Text, View } from "react-native";

// External libraries
import { MaterialIcons } from "@expo/vector-icons";

// Utilities

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface StallReviewHeaderProps {
  arrangement: string;
  setArrangement: (arrangement: string) => void;
  arrangeReviews: () => void;
}

const StallReviewHeader: React.FC<StallReviewHeaderProps> = ({
  arrangement,
  setArrangement,
  arrangeReviews,
}) => {
  const handleChange = () => {
    const newArrangement =
      arrangement === "most_liked" ? "most_recent" : "most_liked";
    setArrangement(newArrangement);
  };
  return (
    <View className="flex-row items-center justify-between mb-2">
      <Text className="text-blue font-bold text-3xl text-center">
        Top Reviews:
      </Text>
      <TouchableScale
        onPress={() => handleChange()}
        className="justify-center py-2 items-center rounded-full border-2 border-blue w-44"
      >
        {arrangement === "most_liked" ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons
              name="swap-vert"
              size={24}
              color="#000"
              style={{ transform: [{ scaleX: -1 }] }}
            />
            <Text className="text-blue text-center text-xl">Most Liked</Text>
          </View>
        ) : (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="swap-vert" size={24} color="#000" />
            <Text className="text-blue text-center text-xl">Most Recent</Text>
          </View>
        )}
      </TouchableScale>
    </View>
  );
};

export default StallReviewHeader;
