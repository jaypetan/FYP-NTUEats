import { fetchReviewImagesByStallId } from "@/utils/reviewServices";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useAppContext } from "../AppContext";
import Loader from "../Loader";

interface PictureModalProps {
  setPictureModalVisible: (visible: boolean) => void;
  pictureModalVisible: boolean;
}

const PictureModal: React.FC<PictureModalProps> = ({
  setPictureModalVisible,
  pictureModalVisible,
}) => {
  const { selectedId } = useAppContext();
  const [pictureData, setPictureData] = useState<any[]>([]);
  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (pictureModalVisible) {
      fetchReviewImagesByStallId(selectedId).then(setPictureData);
      console.log("Menu data fetched for stall ID:", selectedId);
      console.log(pictureData);
    }
  }, [pictureModalVisible, selectedId]);

  // Extract image URLs from menu data
  const images = pictureData.map((uri) => ({ uri }));

  useEffect(() => {
    setLoadedImages(0);
  }, [pictureModalVisible]);

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={pictureModalVisible}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        setPictureModalVisible(!pictureModalVisible);
      }}
    >
      <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
        <Pressable onPress={() => setPictureModalVisible(!pictureModalVisible)}>
          <Text className="border-b-2 border-blue text-2xl font-koulen pt-3 text-black text-center bg-red">
            Close Gallery
          </Text>
        </Pressable>

        {images.length > 0 ? (
          <FlatList
            data={images}
            className={`mx-4 py-4`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, idx) => idx.toString()}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => {
                  setSelectedImageIndex(index);
                  setEnlargedImageVisible(true);
                }}
                className="mr-4"
              >
                {!loadedImages && <Loader />}
                <Image
                  source={item}
                  resizeMode="contain"
                  className="w-48 h-48"
                  onLoadEnd={handleImageLoad}
                />
              </Pressable>
            )}
          />
        ) : (
          <View className="h-32 justify-center items-center">
            <Text className="text-xl">No Menu Available</Text>
          </View>
        )}
      </View>
      <ImageViewing
        images={images}
        imageIndex={selectedImageIndex}
        visible={enlargedImageVisible}
        onRequestClose={() => setEnlargedImageVisible(false)}
      />
    </Modal>
  );
};

export default PictureModal;
