import { fetchMenuItemsByStallId } from "@/utils/menuServices";
import { useEffect, useState } from "react";
import { FlatList, Image, Modal, Pressable, Text, View } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { useAppContext } from "../AppContext";

interface MenuModalProps {
  setMenuModalVisible: (visible: boolean) => void;
  menuModalVisible: boolean;
}

const MenuModal: React.FC<MenuModalProps> = ({
  setMenuModalVisible,
  menuModalVisible,
}) => {
  const { selectedId } = useAppContext();
  const [menuData, setMenuData] = useState<any[]>([]);
  const [enlargedImageVisible, setEnlargedImageVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (menuModalVisible) {
      fetchMenuItemsByStallId(selectedId).then(setMenuData);
      console.log("Menu data fetched for stall ID:", selectedId);
      console.log(menuData);
    }
  }, [menuModalVisible, selectedId]);

  // Extract image URLs from menu data
  const images = menuData
    .map((item) => item.image)
    .filter((url) => url !== undefined && url !== null)
    .map((uri) => ({ uri }));

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

        {images.length > 0 && (
          <FlatList
            data={images}
            className="mx-4"
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
              >
                <Image
                  source={item}
                  resizeMode="contain"
                  className="w-64 h-64"
                />
              </Pressable>
            )}
          />
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

export default MenuModal;
