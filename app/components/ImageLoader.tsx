// React and React Native core
import { useState } from "react";
import { Image, View } from "react-native";

// External libraries
import { Skeleton } from "moti/skeleton";

// Components
import Loader from "@/app/components/Loader";

interface ImageLoaderProps {
  image: string;
  loaderClassName?: string;
  className?: string;
  radius?: number;
  small?: boolean;
}

const ImageLoader: React.FC<ImageLoaderProps> = ({
  image,
  loaderClassName = "",
  className = "",
  radius = 0,
  small,
}) => {
  const [loading, setLoading] = useState(true);
  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <View className="w-full h-full">
      {loading && (
        <View className={loaderClassName}>
          <Loader small={small} />
          <Skeleton
            colors={["#90BE6D", "#FFEFC7", "#90BE6D"]}
            width="100%"
            height="100%"
            colorMode="light"
            radius={radius}
          />
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
