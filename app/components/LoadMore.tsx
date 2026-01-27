// React and React Native core
import { Text } from "react-native";

// External libraries
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

const LoadMore = ({ onClick }: { onClick: () => void }) => {
  return (
    <TouchableScale
      onPress={onClick}
      className="justify-center items-center mt-8 w-64 self-center border-2 border-blue rounded-full p-2 flex-row"
    >
      <Text className="text-blue font-koulen pt-3 text-2xl mr-2">
        Load More
      </Text>
      <MaterialCommunityIcons name="plus-thick" size={18} color="#264653" />
      <MaterialCommunityIcons name="plus-thick" size={18} color="#264653" />
    </TouchableScale>
  );
};

export default LoadMore;
