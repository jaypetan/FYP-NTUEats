// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchUserByClerkId } from "@/utils/userServices";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

// Function to add a new recipe
export const addNewRecipe = async (recipeData) => {
  try {
    // Upload recipe image and get URL if recipe_pic exists
    if (recipeData.recipe_pic) {
      // Upload recipe image and get URL
      const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const timestamp = Date.now();
      const path = `cookWHAT/recipe-${sanitize(
        recipeData.title
      )}-${timestamp}.jpeg`;
      const imageUrl = await uploadImageAsync(recipeData.recipe_pic, path);
      recipeData.recipe_pic = imageUrl;
    } else {
      console.log("No recipe picture provided.");
    }

    // Convert clerk_id to user_id
    const userData = await fetchUserByClerkId(recipeData.user_id);
    if (!userData) throw new Error("User not found for the given clerk_id");
    recipeData.user_id = userData.id;

    // Add timestamp
    recipeData.timestamp = serverTimestamp();

    console.log("Adding new recipe with data: ", recipeData);
    const recipesCollection = collection(db, "recipes");
    await addDoc(recipesCollection, recipeData);
    return true;
  } catch (error) {
    console.error("Error adding new recipe: ", error);
    return false;
  }
};
