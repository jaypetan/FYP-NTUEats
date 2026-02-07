// React and React Native core
import { Text, View } from "react-native";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

interface StallCardProps {
  imageSource: any;
  title: string;
  location: string;
  description: string;
  priceSymbol: string;
  stallId: string;
}

const StallCard: React.FC<StallCardProps> = ({
  imageSource,
  title,
  location,
  description,
  priceSymbol,
  stallId,
}) => {
  const { setCurrentPage, setSelectedId } = useAppContext();

  return (
    <View className="mt-8 border-2 border-blue rounded-2xl">
      <TouchableScale
        onPress={() => {
          setCurrentPage("stall-page");
          setSelectedId(stallId);
        }}
      >
        <View className="w-full h-48">
          <ImageLoader
            image={imageSource}
            className="w-full h-full rounded-2xl absolute"
            loaderClassName="w-full h-full rounded-2xl"
          />
        </View>

        <View className="absolute bottom-0 w-full px-4 pt-2 bg-green/70 rounded-b-2xl flex-col justify-end">
          <View className="flex-row justify-between">
            <Text className="text-3xl font-koulen text-blue leading-10 -mb-[1rem]">
              {title}
            </Text>
            <Text className="text-xl font-koulen font-bold text-blue">
              {location}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base font-inter font-semibold text-blue">
              {description}
            </Text>
            <Text className="text-2xl font-koulen text-blue">
              {priceSymbol}
            </Text>
          </View>
        </View>
      </TouchableScale>
    </View>
  );
};

export default StallCard;
