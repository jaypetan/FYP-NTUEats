import TouchableScale from "@/app/components/TouchableScale";
import React from "react";
import { Text, View } from "react-native";
import { useAppContext } from "../../AppContext";
import { ImageLoader } from "../../ImageLoader";

interface FoodCardProps {
  imageSource: any;
  stallImage: string;
  stallName: string;
  canteenName: string;
  storeId: string;
}

const FoodCard: React.FC<FoodCardProps> = ({
  imageSource,
  stallImage,
  stallName,
  canteenName,
  storeId,
}) => {
  const { setCurrentPage, setSelectedId } = useAppContext();
  const handlePress = () => {
    setSelectedId(storeId);
    setCurrentPage("stall-page");
  };

  return (
    <View className="mr-4 relative w-44 h-64 rounded-2xl overflow-hidden bg-green/50">
      <TouchableScale onPress={() => handlePress()} className="w-full h-full">
        {imageSource ? (
          <ImageLoader
            image={imageSource}
            className="w-full h-full rounded-2xl absolute p-2"
            loaderClassName="w-full h-full rounded-2xl"
          />
        ) : (
          <ImageLoader
            image={stallImage}
            className="w-full h-full rounded-2xl absolute p-2"
            loaderClassName="w-full h-full rounded-2xl"
          />
        )}
        <View className="absolute h-full w-full  py-6 px-4 flex-col justify-end">
          <Text className="text-2xl font-ranchers tracking-wider text-white bg-red/80 px-2">
            {stallName}
          </Text>
          <Text className="text-xl font-ranchers text-white bg-black/50">
            @ {canteenName}
          </Text>
        </View>
      </TouchableScale>
    </View>
  );
};

export default FoodCard;
