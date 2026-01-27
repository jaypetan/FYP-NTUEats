// Firebase imports
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { fetchUserByClerkId, fetchUserByDocId } from "@/utils/userServices";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

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

// Get recipes with total likes
export const getRecipes = async () => {
  try {
    const recipesCollection = collection(db, "recipes");
    const snapshot = await getDocs(recipesCollection);
    const recipes = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const likes = await fetchTotalLikesByItemId(
          "recipes_likes",
          "recipe_id",
          doc.id
        );
        const chefData = await fetchUserByDocId(data.user_id);
        return {
          id: doc.id,
          likes,
          chef_name: chefData.username,
          ...data,
        };
      })
    );
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes: ", error);
    return [];
  }
};

// Get recipes arranged by most likes or most recent
export const getRecipesArranged = async (arrangementType, limitNum) => {
  try {
    const recipes = await getRecipes();

    if (arrangementType === "most_likes") {
      recipes.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      recipes.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      console.log("Invalid arrangement type. Returning unsorted recipes.");
    }

    const length = recipes.length; // Store length before slicing
    const limitedRecipes =
      typeof limitNum === "number" && limitNum > 0
        ? recipes.slice(0, limitNum)
        : recipes;

    return { content: limitedRecipes, length };
  } catch (error) {
    console.error("Error arranging recipes: ", error);
    return { content: [], length: 0 };
  }
};

// Get a recipe by ID
export const getRecipeById = async (recipeId) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);
    const snapshot = await getDoc(recipeDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.log("No such recipe!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching recipe: ", error);
    return null;
  }
};

// Update a recipe by ID
export const updateRecipeById = async (recipeId, updatedData) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);
    await updateDoc(recipeDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating recipe: ", error);
    return false;
  }
};

// Delete a recipe by ID
export const deleteRecipeById = async (recipeId) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);
    await deleteDoc(recipeDoc);
    return true;
  } catch (error) {
    console.error("Error deleting recipe: ", error);
    return false;
  }
};

export const searchRecipesByTitleArranged = async (
  keyword,
  arrangementType,
  limitNum
) => {
  try {
    const lowerKeyword = keyword.toLowerCase();
    const recipes = await getRecipes();

    // Filter by title
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(lowerKeyword)
    );

    // Sort by arrangementType
    if (arrangementType === "most_likes") {
      filteredRecipes.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      filteredRecipes.sort((a, b) => b.timestamp - a.timestamp);
    }

    const total = filteredRecipes.length;
    const limitedRecipes =
      typeof limitNum === "number" && limitNum > 0
        ? filteredRecipes.slice(0, limitNum)
        : filteredRecipes;

    return { content: limitedRecipes, total };
  } catch (error) {
    console.error("Error searching and arranging recipes: ", error);
    return { content: [], total: 0 };
  }
};

// FOR COMMENTS ON RECIPES
// Fetch comments for a specific recipe
export const getRecipeCommentsByRecipeId = async (recipeId) => {
  try {
    const commentsRef = collection(db, "recipe_comments");
    const q = query(commentsRef, where("recipe_id", "==", recipeId));

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get likes for each comment
    for (let comment of comments) {
      comment.likes = await fetchTotalLikesByItemId(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id
      );
    }

    return comments;
  } catch (error) {
    console.error("Error fetching recipe comments: ", error);
    return [];
  }
};

// Arrange recipe comments by most likes
export const getRecipeCommentsArranged = async (recipeId) => {
  try {
    const comments = await getRecipeCommentsByRecipeId(recipeId);
    comments.sort((a, b) => b.likes - a.likes);
    return comments;
  } catch (error) {
    console.error("Error arranging recipe comments by likes: ", error);
    return [];
  }
};

// Fetch comments made by a specific user
export const getRecipeCommentsByUserId = async (userId) => {
  try {
    const commentsRef = collection(db, "recipe_comments");
    const q = query(commentsRef, where("user_id", "==", userId));

    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get likes for each comment
    for (let comment of comments) {
      comment.likes = await fetchTotalLikesByItemId(
        "recipe_comments_likes",
        "recipe_comment_id",
        comment.id
      );
    }

    return comments;
  } catch (error) {
    console.error("Error fetching user recipe comments: ", error);
    return [];
  }
};

// Add a comment to a recipe
export const addRecipeComment = async (commentData) => {
  try {
    // Upload comment image and get URL if comment_pic exists
    if (commentData.comment_pic) {
      // Upload comment image and get URL
      const recipeName = await getRecipeById(commentData.recipe_id).then(
        (recipe) => (recipe ? recipe.title : "unknown-recipe")
      );
      const commentNumber = await getRecipeCommentsByRecipeId(
        commentData.recipe_id
      ).then((comments) => comments.length + 1);

      const path = `cookWHAT/comment-${recipeName}-${commentNumber}.jpeg`;
      const imageUrl = await uploadImageAsync(commentData.comment_pic, path);
      commentData.comment_pic = imageUrl;
    } else {
      console.log("No comment picture provided.");
    }
    // Convert clerk_id to user_id
    const userData = await fetchUserByClerkId(commentData.user_id);
    if (!userData) throw new Error("User not found for the given clerk_id");
    commentData.user_id = userData.id;

    // Add timestamp
    commentData.timestamp = serverTimestamp();

    console.log("Adding new recipe comment with data: ", commentData);
    const commentsCollection = collection(db, "recipe_comments");
    await addDoc(commentsCollection, commentData);
    return true;
  } catch (error) {
    console.error("Error adding recipe comment: ", error);
    return false;
  }
};

// Edit a recipe comment by ID
export const editRecipeCommentById = async (commentId, updatedData) => {
  try {
    const commentDoc = doc(db, "recipe_comments", commentId);
    await updateDoc(commentDoc, updatedData);
    return true;
  } catch (error) {
    console.error("Error updating recipe comment: ", error);
    return false;
  }
};

// Delete a recipe comment by ID
export const deleteRecipeCommentById = async (commentId) => {
  try {
    const commentDoc = doc(db, "recipe_comments", commentId);
    await deleteDoc(commentDoc);
    return true;
  } catch (error) {
    console.error("Error deleting recipe comment: ", error);
    return false;
  }
};
