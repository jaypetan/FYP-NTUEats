import { addNewRecipe } from "@/utils/recipeServices";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useAppContext } from "../components/AppContext";
import DynamicInputList from "../components/DynamicInputList";
import ImagePickerField from "../components/ImagePickerField";
import InputField from "../components/InputField";
import TouchableScale from "../components/TouchableScale";

export default function UploadRecipePage() {
  const { setCurrentPage } = useAppContext();
  const { user } = useUser();
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    cooking_time: "",
    recipe_pic: "",
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  // Function to handle recipe submission
  const handleSubmit = async () => {
    // Validate inputs
    if (
      !recipe.title.trim() ||
      !recipe.description.trim() ||
      !recipe.cooking_time.trim() ||
      !recipe.recipe_pic.trim() ||
      ingredients.length === 0 ||
      instructions.length === 0
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Remove empty ingredients and instructions and prepare final recipe object
    const newRecipe = {
      ...recipe,
      user_id: user ? user.id : "",
      ingredients: ingredients.filter((ing) => ing.trim() !== ""),
      instructions: instructions.filter((inst) => inst.trim() !== ""),
    };
    console.log("Submitting recipe:", newRecipe);

    // Submit recipe to backend (Firebase Firestore)
    await addNewRecipe(newRecipe);
    alert("Recipe submitted successfully!");

    // Reset form
    setRecipe({
      title: "",
      description: "",
      cooking_time: "",
      recipe_pic: "",
    });
    setIngredients([""]);
    setInstructions([""]);
    setCurrentPage("home-page");
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
          <View className="flex-col gap-6">
            <InputField
              label="Title:"
              value={recipe.title}
              onChangeText={(text) => setRecipe({ ...recipe, title: text })}
              placeholder="Write your title here... (max 30 characters)"
              maxLength={30}
            />
            <InputField
              label="Description:"
              value={recipe.description}
              onChangeText={(text) =>
                setRecipe({ ...recipe, description: text })
              }
              placeholder="Write your review here... (max 120 characters)"
              multiline
              numberOfLines={4}
              maxLength={120}
            />
            <InputField
              label="Cooking Time:"
              value={recipe.cooking_time}
              onChangeText={(text) =>
                setRecipe({ ...recipe, cooking_time: text })
              }
              placeholder="e.g. 30 mins"
            />
          </View>

          {/* Dynamic Ingredient List */}
          <DynamicInputList
            items={ingredients}
            onChange={setIngredients}
            label="Ingredients"
            placeholderPrefix="Ingredient"
          />
          <DynamicInputList
            items={instructions}
            onChange={setInstructions}
            label="Instructions"
            placeholderPrefix="Step"
          />

          {/* Image Upload */}
          <ImagePickerField
            label="Recipe Image:"
            imageUri={recipe.recipe_pic}
            onImagePicked={(uri) => setRecipe({ ...recipe, recipe_pic: uri })}
          />

          {/* Submit Button */}
          <TouchableScale
            onPress={handleSubmit}
            className="bg-green rounded-md py-2 px-4 items-center mt-4  border-2 border-blue mb-8"
          >
            <Text className="text-blue font-semibold text-base">
              Submit Review
            </Text>
          </TouchableScale>
          <Text className="py-12" />
        </View>
      </ScrollView>
    </View>
  );
}
