import { ActivityIndicator, Text, View } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -25 }, { translateY: -25 }],
        zIndex: 10,
      }}
    >
      <ActivityIndicator size="large" color="#007AFF" />
      <Text className="text-blue mt-2">Loading...</Text>
    </View>
  );
};

export default Loader;
