// React and React Native core
import { Text, View } from "react-native";

// External libraries
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

interface FoodCardProps {
  imageSource: any;
  foodName: string;
  halal?: boolean;
  vegetarian?: boolean;
  recipeId: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  imageSource,
  foodName,
  halal,
  vegetarian,
  recipeId,
}) => {
  const { setCurrentPage, setSelectedId } = useAppContext();
  const handlePress = () => {
    setSelectedId(recipeId);
    setCurrentPage("recipe-page");
  };

  return (
    <View className="mr-4 relative w-44 h-64 rounded-2xl bg-green/50 border-2 border-blue overflow-hidden">
      <TouchableScale onPress={() => handlePress()}>
        <ImageLoader
          image={imageSource}
          className="w-full h-full rounded-2xl absolute p-2"
          loaderClassName="w-full h-full rounded-2xl"
        />
        <View className="absolute p-4 h-full w-full flex-col justify-between">
          <View className="flex-row justify-end gap-1">
            {vegetarian && (
              <FontAwesome
                name="leaf"
                size={16}
                color="white"
                className="p-2 rounded-full bg-green/80"
              />
            )}
            {halal && (
              <MaterialCommunityIcons
                name="food-halal"
                size={16}
                color="white"
                className="p-2 rounded-full bg-green/80"
              />
            )}
          </View>
          <Text className="text-2xl font-ranchers tracking-wider text-white bg-red/80 px-2">
            {foodName}
          </Text>
        </View>
      </TouchableScale>
    </View>
  );
};

export default FoodCard;
