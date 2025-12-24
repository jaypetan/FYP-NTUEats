import { addNewStall } from "@/utils/stallServices";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Image, Text, TextInput, View } from "react-native";

const StallAdd = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Please enter a stall name.");
      return;
    }
    addNewStall({ name, description, image });
  };

  return (
    <View>
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        Add New Stall
      </Text>
      <View>
        <Text>Stall Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter stall name"
        />
        <Text>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
        />
        <Button title="Pick an Image" onPress={pickImage} />
        {image && <Image className="w-64 h-64" source={{ uri: image }} />}
        <Button title="Add Stall" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default StallAdd;
