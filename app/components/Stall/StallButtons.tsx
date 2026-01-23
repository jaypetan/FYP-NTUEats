// React and React Native core
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";

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
  const [saved, setSaved] = useState(false);
  const handleSave = () => {
    setSaved(!saved);
  };

  return (
    <View className="flex-col justify-between w-full gap-4">
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => setAddReview(!addReview)}
          className={`${
            addReview ? "bg-red/50" : "bg-green/50"
          } items-center justify-center border-blue border-2 px-6 py-2 rounded-lg mr-4`}
        >
          <Text className="text-2xl font-koulen pt-3 text-black">
            {addReview ? "Cancel" : "Add Review"}
          </Text>
        </TouchableOpacity>
        <View className="flex-row gap-2 justify-end">
          <TouchableOpacity
            onPress={() => setMenuModalVisible(true)}
            className="items-center justify-center border-2 border-blue p-4 rounded-full"
          >
            <MaterialIcons name="article" size={24} color="#323232" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setPictureModalVisible(true)}
            className="items-center justify-center border-2 border-blue p-4 rounded-full"
          >
            <FontAwesome name="image" size={24} color="#323232" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              handleSave();
            }}
            className="items-center justify-center border-blue border-2 p-4 rounded-full"
          >
            {saved ? (
              <MaterialIcons name="bookmark" size={24} color="#323232" />
            ) : (
              <MaterialIcons name="bookmark-border" size={24} color="#323232" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StallButtons;
