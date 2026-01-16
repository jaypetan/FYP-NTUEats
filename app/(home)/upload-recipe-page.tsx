import { useUser } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import TouchableScale from "../components/TouchableScale";

export default function UploadRecipePage() {
  const { user } = useUser();
  const [recipe, setRecipe] = useState({
    user_id: "",
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    cookingTime: "",
    image: "",
  });

  // Set user_id when user is available
  useEffect(() => {
    setRecipe({ ...recipe, user_id: user ? user.id : "" });
  }, [user]);

  // Function to pick image from library
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setRecipe({ ...recipe, image: result.assets[0].uri });
    }
  };

  // Function to handle recipe submission
  const handleSubmit = async () => {
    // Validate inputs
    if (!recipe.title.trim() || !recipe.description.trim()) {
      alert("Please fill in all required fields.");
      return;
    }

    console.log("Recipe Submitted:", recipe);
    // Here you would typically send the recipe data to your backend server
    alert("Recipe submitted successfully!");

    // Reset form
    setRecipe({
      user_id: user ? user.id : "",
      title: "",
      description: "",
      ingredients: [],
      instructions: [],
      cookingTime: "",
      image: "",
    });
  };

  return (
    <View className="h-full w-full bg-cream pt-4 pb-8 px-8 rounded-3xl mt-4">
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View className="flex-col gap-2 mt-8">
          <Text className="text-4xl font-koulen text-blue pt-4 text-center">
            Upload Recipe
          </Text>
          <Text className="text-xl text-blue font-bold">Title:</Text>
          <TextInput
            className="w-full border-2 border-blue rounded-md p-2 mb-4 pb-4"
            onChangeText={(text) => setRecipe({ ...recipe, title: text })}
            value={recipe.title}
            placeholder="Write your title here... (max 30 characters)"
            placeholderTextColor={"#888"}
            maxLength={30}
          />
          <Text className="text-xl text-blue font-bold">Description:</Text>
          <TextInput
            className="w-full h-24 border-2 border-blue rounded-md p-2 mb-4 pb-4"
            onChangeText={(text) => setRecipe({ ...recipe, description: text })}
            value={recipe.description}
            placeholder="Write your review here... (max 120 characters)"
            placeholderTextColor={"#888"}
            multiline
            numberOfLines={4}
            maxLength={120}
          />
          {/* Image Upload */}
          <View className="flex-row items-center mb-2 gap-2">
            <Text className="text-xl text-blue font-bold">Upload Image:</Text>
            <Text className="text-xl text-gray-500">(optional)</Text>
          </View>
          <TouchableOpacity
            onPress={pickImage}
            className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mb-2"
          >
            {recipe.image ? (
              <Image
                className="w-64 h-64 border-2 border-blue"
                source={{ uri: recipe.image }}
              />
            ) : (
              <View className="items-center flex-col gap-2">
                <Feather
                  name="upload"
                  size={32}
                  color="black"
                  className="rounded-2xl border-2 p-2 border-blue"
                />
                <Text> Pick A Recipe Image</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableScale
            onPress={handleSubmit}
            className="bg-green rounded-md py-2 px-4 items-center mt-4  border-2 border-blue mb-8"
          >
            <Text className="text-blue font-semibold text-base">
              Submit Review
            </Text>
          </TouchableScale>
        </View>
      </ScrollView>
    </View>
  );
}
