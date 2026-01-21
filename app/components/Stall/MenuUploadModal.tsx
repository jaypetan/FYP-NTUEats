import { addNewMenuItem } from "@/utils/menuServices";
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useAppContext } from "../AppContext";
import ImagePickerField from "../ImagePickerField";
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
  const [image, setImage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

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
    setImage("");
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
      <BlurView intensity={20} className="w-full h-full ">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue">
          <Pressable onPress={() => closeMenuUploadModal()}>
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <View className="flex-col gap-2 p-4">
            <ImagePickerField
              imageUri={image}
              onImagePicked={(uri: string) => setImage(uri)}
              label="Select Menu Image:"
            />
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
      </BlurView>
    </Modal>
  );
};

export default MenuUploadModal;
