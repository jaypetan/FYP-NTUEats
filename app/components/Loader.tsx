// React and React Native core
import { Image, Text, View } from "react-native";

interface LoaderProps {
  small?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ small }) => {
  return (
    <View
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [
          { translateX: -40 },
          { translateY: -50 },
          { scale: small ? 0.7 : 1 },
        ],
        zIndex: 10,
      }}
    >
      {/* <ActivityIndicator size="large" color="#007AFF" />
      <Text className="text-blue mt-2">Loading...</Text> */}
      <Text className="text-blue text-2xl font-koulen ml-3">Loading...</Text>
      <Image
        source={require("@/assets/images/logos/cat-loading.gif")}
        style={{ width: 80, height: 80 }}
      />
    </View>
  );
};

export default Loader;
