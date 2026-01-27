// React and React Native core
import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";

// External libraries
import { AntDesign } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

// Utilities
import { addNewMenuItem } from "@/utils/menuServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import ImagePickerField from "@/app/components/ImagePickerField";
import TouchableScale from "@/app/components/TouchableScale";

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
    if (!image) {
      alert("Please select an image to upload.");
      return;
    }
    setIsProcessing(true);
    try {
      await addNewMenuItem({
        image: image,
        stall_id: selectedId || "",
      });
      alert("Menu item uploaded successfully!");
    } catch (error) {
      alert("Error uploading menu item. Please try again.");
    } finally {
      // Reset form
      setImage("");
      setIsProcessing(false);
      closeMenuUploadModal();
    }
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
                disabled={isProcessing}
                className="bg-green rounded-md py-2 px-4 items-center mt-4"
              >
                <Text className="text-blue font-semibold text-base">
                  {isProcessing ? "Uploading..." : "Submit"}
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
