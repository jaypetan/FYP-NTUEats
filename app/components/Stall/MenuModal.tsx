import { fetchMenuItemsByStallId } from "@/utils/menuServices";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useAppContext } from "../AppContext";
import Loader from "../Loader";

interface MenuModalProps {
  setMenuModalVisible: (visible: boolean) => void;
  menuModalVisible: boolean;
  setMenuUploadModalVisible: (visible: boolean) => void;
}

const MenuModal: React.FC<MenuModalProps> = ({
  setMenuModalVisible,
  menuModalVisible,
  setMenuUploadModalVisible,
}) => {
  const { selectedId } = useAppContext();
  const [menuData, setMenuData] = useState<any[]>([]);
  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState(0);

  useEffect(() => {
    if (menuModalVisible) {
      fetchMenuItemsByStallId(selectedId).then(setMenuData);
    }
  }, [menuModalVisible, selectedId]);

  // Extract image URLs from menu data
  const images = menuData
    .map((item) => item.image)
    .filter((url) => url !== undefined && url !== null)
    .map((uri) => ({ uri }));

  useEffect(() => {
    setLoadedImages(0);
  }, [menuModalVisible]);

  const handleImageLoad = () => {
    setLoadedImages((prev) => prev + 1);
  };

  const openMenuUploadModal = () => {
    setMenuModalVisible(false);
    setMenuUploadModalVisible(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={menuModalVisible}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        setMenuModalVisible(!menuModalVisible);
      }}
    >
      <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
        <Pressable onPress={() => setMenuModalVisible(!menuModalVisible)}>
          <Text className="border-b-2 border-blue text-2xl font-koulen pt-3 text-black text-center bg-red">
            Close Menu
          </Text>
        </Pressable>
        {images.length > 0 ? (
          <FlatList
            data={images}
            className={`mx-4 `}
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
                  className="w-64 h-64"
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
        <View className="flex-row w-full justify-end">
          <Pressable
            onPress={openMenuUploadModal}
            className="rounded-2xl flex justify-center bg-green px-4 pt-4 pb-2 mx-4 mb-4"
          >
            <Text className="font-koulen text-xl text-blue">Upload Menu</Text>
          </Pressable>
        </View>
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

export default MenuModal;
