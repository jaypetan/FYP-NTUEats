// React and React Native core
import { useState } from "react";
import { Keyboard, Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { ScrollView } from "react-native-gesture-handler";

// Utilities
import { updateRecipeDietary } from "@/utils/dietaryServices";
import { addNewRecipe } from "@/utils/recipeServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import CheckboxInput from "@/app/(admin)/components/CheckboxInput";
import ClosePage from "@/app/components/ClosePage";
import DynamicInputList from "@/app/components/DynamicInputList";
import ImagePickerField from "@/app/components/ImagePickerField";
import InputField from "@/app/components/InputField";
import TouchableScale from "@/app/components/TouchableScale";

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
  const [dietaryInfo, setDietaryInfo] = useState({
    isHalal: false,
    isVegetarian: false,
  });
  const [loading, setLoading] = useState(false);

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

    // Submit the new recipe
    try {
      setLoading(true);
      const newId = await addNewRecipe(newRecipe);
      await updateRecipeDietary(newId, {
        halal: dietaryInfo.isHalal ? 1 : 0,
        vegetarian: dietaryInfo.isVegetarian ? 1 : 0,
      });
      alert("Recipe submitted successfully!");

      // Reset form
      setLoading(false);
      setRecipe({
        title: "",
        description: "",
        cooking_time: "",
        recipe_pic: "",
      });
      setIngredients([""]);
      setInstructions([""]);
      setCurrentPage("home-page");
    } catch {
      alert("Failed to submit recipe. Please try again.");
    }
  };

  return (
    <View className="h-full w-full bg-cream pt-4 pb-8 px-8 rounded-3xl mt-4">
      <View>
        <ClosePage right="-right-4" />
      </View>
      <Text className="text-4xl font-koulen text-blue pt-4 text-center mt-8">
        Upload Recipe
      </Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onScrollBeginDrag={Keyboard.dismiss}
      >
        <View className="flex-col gap-2 mt-4">
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

            {/*Dietary Preferences */}
            <View>
              <Text className="text-blue text-xl text-left font-bold">
                Dietary Preferences:
              </Text>
              <CheckboxInput
                label="Halal"
                bool={dietaryInfo.isHalal}
                setBool={() => {
                  setDietaryInfo({
                    ...dietaryInfo,
                    isHalal: !dietaryInfo.isHalal,
                  });
                }}
              />
              <CheckboxInput
                label="Vegetarian"
                bool={dietaryInfo.isVegetarian}
                setBool={() => {
                  setDietaryInfo({
                    ...dietaryInfo,
                    isVegetarian: !dietaryInfo.isVegetarian,
                  });
                }}
              />
            </View>

            {/* Image Upload */}
            <ImagePickerField
              label="Recipe Image:"
              imageUri={recipe.recipe_pic}
              onImagePicked={(uri) => setRecipe({ ...recipe, recipe_pic: uri })}
            />
          </View>
          {/* Submit Button */}
          <TouchableScale
            onPress={handleSubmit}
            className="bg-green rounded-md py-2 px-4 items-center mt-4  border-2 border-blue mb-8"
            disabled={loading}
          >
            <Text className="text-blue font-semibold text-base">
              {loading ? "Submitting..." : "Submit Recipe"}
            </Text>
          </TouchableScale>
          <Text className="py-12" />
        </View>
      </ScrollView>
    </View>
  );
}
