// React Native core
import { Text, View } from "react-native";

// External libraries
import { MaterialIcons } from "@expo/vector-icons";

import { useAppContext } from "@/app/components/AppContext";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

interface FavouriteCardProps {
  stallData?: {
    id: string;
    stall_pic: string;
    name: string;
    location: string;
  };
  recipeData?: {
    id: string;
    recipe_pic: string;
    title: string;
    description: string;
  };
}

const FavouriteCard: React.FC<FavouriteCardProps> = ({
  stallData,
  recipeData,
}) => {
  const { setSelectedId, setCurrentPage } = useAppContext();
  const handlePress = () => {
    if (stallData) {
      setSelectedId(stallData.id);
      setCurrentPage("StallDetails");
    } else if (recipeData) {
      setSelectedId(recipeData.id);
      setCurrentPage("RecipeDetails");
    }
  };
  return (
    <TouchableScale
      onPress={handlePress}
      className="mb-4 p-4 bg-cream rounded-xl flex-row gap-4 items-center border-2 border-blue"
    >
      <View className="h-32 w-32 border-2 border-blue rounded-xl overflow-hidden">
        <ImageLoader
          image={
            stallData
              ? stallData.stall_pic
              : recipeData
              ? recipeData.recipe_pic
              : ""
          }
          className="w-full h-32 rounded-xl mb-4"
          loaderClassName="h-32 scale-75"
        />
      </View>
      <View className="flex-col justify-center max-w-40">
        <Text className="text-blue font-koulen text-2xl mt-2">
          {stallData ? stallData.name : recipeData ? recipeData.title : ""}
        </Text>
        {stallData && (
          <Text className="text-blue capitalize text-lg leading-5">
            {stallData ? stallData.location : ""}
          </Text>
        )}
      </View>
      <MaterialIcons
        className="ml-auto"
        name="arrow-forward"
        size={24}
        color="#264653"
      />
    </TouchableScale>
  );
};

export default FavouriteCard;
