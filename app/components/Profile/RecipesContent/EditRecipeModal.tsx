// React and React Native imports
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

// External libraries
import { AntDesign, Feather } from "@expo/vector-icons";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Component Props
import DynamicInputList from "@/app/components/DynamicInputList";
import ImagePickerField from "@/app/components/ImagePickerField";
import InputField from "@/app/components/InputField";
import TouchableScale from "@/app/components/TouchableScale";

// Utilities
import {
  deleteRecipeById,
  editRecipeById,
  getRecipeById,
} from "@/utils/recipeServices";

interface EditRecipeModalProps {
  editModalVisible: string;
  toggleModalVisibility: (type: string) => void;
}
const EditRecipeModal: React.FC<EditRecipeModalProps> = ({
  editModalVisible,
  toggleModalVisibility,
}) => {
  const { selectedId } = useAppContext();
  const [recipe, setRecipe] = useState({
    title: "",
    description: "",
    cooking_time: "",
    recipe_pic: "",
  });
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);

  const [isProcessing, setIsProcessing] = useState("");

  // Fetch recipe details
  const fetchRecipeDetails = async () => {
    if (!selectedId) return;

    try {
      const recipeData = await getRecipeById(selectedId);
      setRecipe({
        title: recipeData.title || "",
        description: recipeData.description || "",
        cooking_time: recipeData.cooking_time || "",
        recipe_pic: recipeData.recipe_pic || "",
      });
      setIngredients(recipeData.ingredients || []);
      setInstructions(recipeData.instructions || []);
    } catch (error) {
      Alert.alert("Error fetching recipe details. Please try again.");
    }
  };

  useEffect(() => {
    if (editModalVisible === "recipe") {
      fetchRecipeDetails();
      setIsProcessing("");
    }
  }, [editModalVisible]);

  // Handle submit and delete functions can be added here
  const handleSubmitChanges = () => {
    setIsProcessing("edit");

    // Call the edit service
    editRecipeById(selectedId || "", recipe)
      .then(() => {
        Alert.alert("Recipe updated successfully!");
        toggleModalVisibility("recipe");
      })
      .catch(() => {
        Alert.alert("Error updating recipe. Please try again.");
      })
      .finally(() => {
        setIsProcessing("");
      });
  };

  // Handle delete function can be added here
  const handleDeleteComment = () => {
    setIsProcessing("delete");
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            deleteRecipeById(selectedId || "")
              .then(() => {
                Alert.alert("Recipe deleted successfully!");
                toggleModalVisibility("recipe");
              })
              .catch(() => {
                Alert.alert("Error deleting recipe. Please try again.");
              })
              .finally(() => {
                setIsProcessing("");
              });
          },
        },
      ]
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible === "recipe"}
      className="w-full h-full bg-cream/20"
      onRequestClose={() => {
        toggleModalVisibility("recipe");
      }}
    >
      <BlurView intensity={20} className="w-full h-full">
        <View className="my-auto mx-4 bg-darkcream border-2 border-blue pb-8 h-2/3">
          <Pressable onPress={() => toggleModalVisibility("recipe")}>
            <View className="border-b-2 border-blue text-center bg-red items-end p-2">
              <AntDesign name="close" size={32} color="#264653" />
            </View>
          </Pressable>
          <Text className="text-blue font-koulen text-3xl pt-4 mt-4 text-center">
            Edit Comment
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
          >
            <View className="px-6 mt-6 flex-col gap-4 pb-4">
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

              {/* Image Upload */}
              <ImagePickerField
                label="Recipe Image:"
                imageUri={recipe.recipe_pic}
                onImagePicked={(uri) =>
                  setRecipe({ ...recipe, recipe_pic: uri })
                }
              />
            </View>
          </ScrollView>
          <View className="flex-row w-full justify-between px-6 pt-4">
            <TouchableScale
              className="border-2 border-blue bg-red px-4 py-2 rounded-xl items-center flex-row gap-2"
              onPress={() => {
                handleDeleteComment();
              }}
              disabled={isProcessing !== ""}
            >
              <Feather name="trash-2" size={20} color="#264653" />
              <Text className="text-blue font-semibold text-base text-center">
                {isProcessing === "delete" ? "Deleting..." : "Delete"}
              </Text>
            </TouchableScale>
            <TouchableScale
              className="border-2 border-blue bg-green px-4 py-2 rounded-xl items-center"
              onPress={() => {
                handleSubmitChanges();
              }}
              disabled={isProcessing !== ""}
            >
              <Text className="text-blue font-semibold text-base text-center">
                {isProcessing === "edit" ? "Submitting..." : "Submit Changes"}
              </Text>
            </TouchableScale>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default EditRecipeModal;
