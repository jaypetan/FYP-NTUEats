// React Native core
import { Text, View } from "react-native";

// External libraries
import { MaterialIcons } from "@expo/vector-icons";

const NavButton = () => {
  return (
    <View className="ml-2 flex-row items-center self-start" collapsable={false}>
      <MaterialIcons name="keyboard-arrow-left" size={32} color="#323232" />
      <Text className="font-ranchers font-bold text-blue text-3xl">Nav</Text>
    </View>
  );
};

export default NavButton;
