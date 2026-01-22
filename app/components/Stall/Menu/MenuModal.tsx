// React and React Native core
import { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, Text, View } from "react-native";

// External libraries
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import ImageViewing from "react-native-image-viewing";

// Utilities
import { getMenusArranged } from "@/utils/menuServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import MenuCard from "@/app/components/Stall/Menu/MenuCard";

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
      fetchMenuData();
    }
  }, [menuModalVisible, selectedId]);

  const fetchMenuData = async () => {
    if (selectedId) {
      const menus = await getMenusArranged(selectedId);
      setMenuData(menus);
    }
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
          {menuData.length > 0 ? (
            <FlatList
              data={menuData}
              className={`mx-4 `}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item, index }) => (
                <View>
                  <Pressable
                    onPress={() => {
                      setSelectedImageIndex(index);
                      setEnlargedImageVisible(true);
                    }}
                    className="mr-4"
                  >
                    <MenuCard item={item} />
                  </Pressable>
                </View>
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
          images={menuData.map((menu) => ({ uri: menu.image }))}
          imageIndex={selectedImageIndex}
          visible={enlargedImageVisible}
          onRequestClose={() => setEnlargedImageVisible(false)}
        />
      </BlurView>
    </Modal>
  );
};

export default MenuModal;
