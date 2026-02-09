// React and React Native core
import { Text, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import ClosePage from "@/app/components/ClosePage";
import FoodPreference from "@/app/components/FoodPreference";
import ImageLoader from "@/app/components/ImageLoader";

interface StallHeaderProps {
  stallImage: any;
  stallName: string;
  stallLocation: string;
  halal?: boolean;
  vegetarian?: boolean;
}
const StallHeader: React.FC<StallHeaderProps> = ({
  stallImage,
  stallName,
  stallLocation,
  halal,
  vegetarian,
}) => {
  return (
    <View>
      <ClosePage right={"right-6"} />
      <View className="w-full h-64 bg-cream flex justify-center items-center px-8 pt-8 rounded-t-full">
        <ImageLoader
          image={stallImage}
          className="h-full w-full rounded-t-full"
          loaderClassName="overflow-hidden absolute w-full h-full rounded-t-full"
        />
        <FoodPreference
          halal={halal}
          vegetarian={vegetarian}
          className="bottom-4 right-12"
        />
      </View>
      <View className="flex-row justify-between items-center bg-black py-4 px-8">
        <Text className="font-inter font-semibold uppercase text-white text-2xl">
          {stallName}
        </Text>
        <View className="flex-row gap-3 items-center">
          <FontAwesome name="map-marker" size={20} color="red" />
          <Text className="font-inter text-white text-2xl">
            {stallLocation}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StallHeader;
