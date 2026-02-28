// React and React Native core
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

// External libraries
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Utilities
import { fetchReviewImagesByStallId } from "@/utils/reviewServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import SimpleViewer from "@/app/components/SimpleViewer";

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

  useEffect(() => {
    if (pictureModalVisible) {
      fetchReviewImagesByStallId(selectedId).then(setPictureData);
    }
  }, [pictureModalVisible, selectedId]);

  // Extract image URLs from menu data
  const images = pictureData.map((uri) => ({ uri }));

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
      <BlurView intensity={20} className="w-full h-full ">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue pb-8">
          <Pressable
            onPress={() => setPictureModalVisible(!pictureModalVisible)}
          >
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <Text className="text-3xl font-koulen pt-8 text-black text-center">
            Photos
          </Text>

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
                  className="mr-4 border-2 border-blue rounded-lg overflow-hidden"
                >
                  <View className="w-64 h-64">
                    <ImageLoader
                      image={item.uri}
                      className="w-64 h-64"
                      loaderClassName="w-full h-full"
                    />
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View className="h-32 justify-center items-center">
              <Text className="text-xl">No Pictures Available</Text>
            </View>
          )}
        </View>
        <SimpleViewer
          visible={enlargedImageVisible}
          source={images[selectedImageIndex]?.uri || null}
          onClose={() => setEnlargedImageVisible(false)}
        />
      </BlurView>
    </Modal>
  );
};

export default PictureModal;
