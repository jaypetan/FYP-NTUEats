// React and React Native core
import { Image, Text, View } from "react-native";

// External libraries
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

// Components
import TouchableScale from "@/app/components/TouchableScale";

type ImagePickerFieldProps = {
  imageUri: string;
  onImagePicked: (uri: string) => void;
  label?: string;
  optional?: boolean;
  textbold?: boolean;
};

export default function ImagePickerField({
  imageUri,
  onImagePicked,
  label = "Upload Image",
  optional = false,
  textbold = true,
}: ImagePickerFieldProps) {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      onImagePicked(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-col items-start">
      <View className="flex-row items-center mt-2 mb-2">
        <Text className={`${textbold ? "font-bold" : ""} text-xl text-blue`}>
          {label}
        </Text>
        {optional && (
          <Text className="text-xl text-gray-500 ml-2">(optional)</Text>
        )}
      </View>
      <TouchableScale
        onPress={pickImage}
        className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mb-2"
      >
        {imageUri ? (
          <Image
            className="w-64 h-64 border-2 border-blue"
            source={{ uri: imageUri }}
          />
        ) : (
          <View className="items-center">
            <Feather name="upload" size={48} color="#888" />
            <Text className="mt-2 text-gray-500">Pick A Review Image</Text>
          </View>
        )}
      </TouchableScale>
    </View>
  );
}
