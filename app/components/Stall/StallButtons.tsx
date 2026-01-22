// React and React Native core
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

interface StallButtonsProps {
  setMenuModalVisible: (visible: boolean) => void;
  setPictureModalVisible: (visible: boolean) => void;
  setAddReview: (visible: boolean) => void;
  addReview: boolean;
}

const StallButtons: React.FC<StallButtonsProps> = ({
  setMenuModalVisible,
  setPictureModalVisible,
  setAddReview,
  addReview,
}) => {
  return (
    <View className="flex-col justify-between w-full gap-4">
      <View className="flex-row justify-between">
        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={() => setMenuModalVisible(true)}
            className="flex-row items-center bg-red/80 px-8 py-2 rounded-lg"
          >
            <Text className="text-2xl font-koulen pt-3 text-black">Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPictureModalVisible(true)}
            className="flex-row items-center bg-red/80 px-4 rounded-lg"
          >
            <FontAwesome name="image" size={24} color="#323232" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => setAddReview(!addReview)}
          className="flex-row items-center bg-green/50 px-8 py-2 rounded-lg"
        >
          <Text className="text-2xl font-koulen pt-3 text-black">
            {addReview ? "Cancel" : "Add Review"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StallButtons;
