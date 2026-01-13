import { addNewMenuItem } from "@/utils/menuServices";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppContext } from "../AppContext";
import TouchableScale from "../TouchableScale";

interface MenuUploadModalProps {
  setMenuModalVisible: (visible: boolean) => void;
  setMenuUploadModalVisible: (visible: boolean) => void;
  menuUploadModalVisible: boolean;
}

const MenuUploadModal: React.FC<MenuUploadModalProps> = ({
  setMenuModalVisible,
  setMenuUploadModalVisible,
  menuUploadModalVisible,
}) => {
  const { selectedId } = useAppContext();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (isProcessing) return; // Prevent multiple submissions
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
    setIsProcessing(true);
    await addNewMenuItem({
      stall_id: selectedId,
      image: image,
    });

    console.log(
      "Menu Image Submitted for Stall ID:",
      selectedId,
      "Image URI:",
      image
    );
    alert("Menu image submitted successfully!");

    // Reset form
    setIsProcessing(false);
    setImage(null);
    closeMenuUploadModal();
  };

  const closeMenuUploadModal = () => {
    setMenuUploadModalVisible(false);
    setMenuModalVisible(true);
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={menuUploadModalVisible}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        setMenuUploadModalVisible(!menuUploadModalVisible);
      }}
    >
      <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
        <Pressable onPress={() => closeMenuUploadModal()}>
          <Text className="border-b-2 border-blue text-2xl font-koulen pt-3 text-black text-center bg-red">
            Close Menu Upload
          </Text>
        </Pressable>
        <View className="flex-col gap-2 p-4">
          <TouchableOpacity
            onPress={pickImage}
            className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mt-4 self-center"
          >
            {image ? (
              <Image
                className="w-64 h-64 border-2 border-blue"
                source={{ uri: image }}
              />
            ) : (
              <Text> Click to Upload Menu</Text>
            )}
          </TouchableOpacity>
          <View className="flex-row w-full justify-end">
            <TouchableScale
              onPress={handleSubmit}
              className="bg-green rounded-md py-2 px-4 items-center mt-4"
            >
              <Text className="text-blue font-semibold text-base">
                Submit Menu
              </Text>
            </TouchableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MenuUploadModal;
