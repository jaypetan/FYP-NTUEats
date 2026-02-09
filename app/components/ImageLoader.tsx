// React and React Native core
import { useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";

// Components
import Loader from "@/app/components/Loader";

interface ImageLoaderProps {
  image: string;
  loaderClassName?: string;
  className?: string;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  image,
  loaderClassName = "",
  className = "",
}) => {
  const [loading, setLoading] = useState(true);
  const handleImageLoad = () => {
    setLoading(false);
  };

  // Skeleton Placeholder Component
  const LoadingPlaceholder = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 700,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, [opacity]);

    return <Animated.View className={`${className} bg-green/50`} />;
  };

  return (
    <View className="w-full h-full">
      {loading && (
        <View className={loaderClassName}>
          <Loader />
          <LoadingPlaceholder />
        </View>
      )}
      {image && (
        <Image
          source={{ uri: image }}
          resizeMode="cover"
          className={className}
          onLoadEnd={handleImageLoad}
        />
      )}
    </View>
  );
};

export default ImageLoader;
