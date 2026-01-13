import { useState } from "react";
import { Image, View } from "react-native";
import Loader from "./Loader";

interface ImageLoaderProps {
  image: string;
  loaderClassName?: string;
  className?: string;
}

export const ImageLoader: React.FC<ImageLoaderProps> = ({
  image,
  loaderClassName = "",
  className = "",
}) => {
  const [loading, setLoading] = useState(true);
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <View className="w-full h-full">
      {loading && (
        <View className={loaderClassName}>
          <Loader />
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
