// React and React Native
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface FavouriteHeaderProps {
  pageInfo: string;
  handlePageInfoChange: () => void;
}

const FavouriteHeader: React.FC<FavouriteHeaderProps> = ({
  pageInfo,
  handlePageInfoChange,
}) => {
  return (
    <View className="flex-col items-start mb-8 w-full">
      <View className="flex-row items-center gap-2">
        <Text className="text-center text-4xl font-koulen text-blue pt-4">
          Favourite
        </Text>
        <Animatable.Text
          animation="bounceIn"
          duration={400}
          key={pageInfo + "sub"}
          className="text-center text-4xl font-koulen text-blue pt-4"
        >
          {pageInfo === "stalls" ? "stalls" : "recipes"}
        </Animatable.Text>
      </View>
      <View className="">
        <TouchableScale
          className="rounded-2xl border-2 border-blue px-4 py-1 flex-row items-center gap-2 bg-green/50"
          onPress={() => {
            handlePageInfoChange();
          }}
        >
          <FontAwesome name="exchange" size={16} color="#264653" />
          <Text className="text-center text-lg text-blue font-semibold">
            {pageInfo === "stalls" ? "recipes" : "stalls"}
          </Text>
        </TouchableScale>
      </View>
    </View>
  );
};

export default FavouriteHeader;
