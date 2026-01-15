import { fetchMenuItemsByStallId } from "@/utils/menuServices";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useAppContext } from "../AppContext";
import { ImageLoader } from "../ImageLoader";

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

  const openMenuUploadModal = () => {
    setMenuModalVisible(false);
    setMenuUploadModalVisible(true);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={menuModalVisible}
      onRequestClose={() => {
        setMenuModalVisible(!menuModalVisible);
      }}
    >
      <BlurView intensity={20} className="w-full h-full ">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
          <Pressable onPress={() => setMenuModalVisible(!menuModalVisible)}>
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <Text className="text-3xl font-koulen pt-8 text-black text-center">
            Menus
          </Text>
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
                  <View className="w-64 h-64">
                    <ImageLoader
                      image={item.uri}
                      className="w-64 h-64"
                      loaderClassName="w-full h-full absolute"
                    />
                  </View>
                </Pressable>
              )}
            />
          ) : (
            <View className="h-32 justify-center items-center">
              <Text className="text-xl">No Menu Available</Text>
            </View>
          )}
          <View className="flex-row w-full justify-end pt-4">
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
      </BlurView>
    </Modal>
  );
};

export default MenuModal;
