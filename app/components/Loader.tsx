import { Image, Text, View } from "react-native";

const Loader = () => {
  return (
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -40 }, { translateY: -60 }],
        zIndex: 10,
      }}
    >
      {/* <ActivityIndicator size="large" color="#007AFF" />
      <Text className="text-blue mt-2">Loading...</Text> */}
      <Text className="text-blue text-2xl font-koulen ml-3">Loading...</Text>
      <Image
        source={require("@/assets/images/logos/cat-loading-nobg.gif")}
        style={{ width: 80, height: 80 }}
      />
    </View>
  );
};

export default Loader;
