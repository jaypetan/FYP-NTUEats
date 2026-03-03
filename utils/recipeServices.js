// Firebase imports
import { fetchAllRecipesWithSelectedRestriction } from "@/utils/dietaryServices";
import { db, uploadImageAsync } from "@/utils/firebase";
import { fetchTotalLikesByItemId } from "@/utils/likeServices";
import { compareDatas, formatDate } from "@/utils/sharedFunctions";
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

// Utility functions for randomization with seed
const getDeterministicHash = (value) => {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash >>> 0;
};

// Function to add a new recipe
export const addNewRecipe = async (recipeData) => {
  try {
    // Upload recipe image and get URL if recipe_pic exists
    if (recipeData.recipe_pic) {
      // Upload recipe image and get URL
      const sanitize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const timestamp = Date.now();
      const path = `cookWHAT/recipe-${sanitize(
        recipeData.title,
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
    const docRef = await addDoc(recipesCollection, recipeData);
    return docRef.id;
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
          doc.id,
        );
        const chefData = await fetchUserByDocId(data.user_id);
        return {
          id: doc.id,
          likes,
          chef_name: chefData.username,
          ...data,
        };
      }),
    );
    return recipes;
  } catch (error) {
    console.error("Error fetching recipes: ", error);
    return [];
  }
};

// Get recipes with restrictions applied
export const getRecipesWithRestrictions = async (restrictions, otherData) => {
  try {
    let recipes = [];
    if (otherData && Array.isArray(otherData)) {
      recipes = otherData;
    } else {
      recipes = await getRecipes();
    }
    if (!restrictions) {
      return recipes;
    }
    let filteredRecipes = recipes;
    // Filter recipes based on restrictions (halal, vegetarian)
    if (restrictions.halal) {
      const halalRecipeIds =
        await fetchAllRecipesWithSelectedRestriction("halal");
      filteredRecipes = compareDatas(
        filteredRecipes,
        halalRecipeIds,
        "id",
        "id",
      );
    }
    if (restrictions.vegetarian) {
      const vegRecipeIds =
        await fetchAllRecipesWithSelectedRestriction("vegetarian");
      filteredRecipes = compareDatas(filteredRecipes, vegRecipeIds, "id", "id");
    }
    return filteredRecipes;
  } catch (error) {
    console.error("Error fetching recipes with restrictions: ", error);
    return [];
  }
};

// Get recipes arranged by most likes or most recent
export const getRecipesArranged = async (
  arrangementType,
  limitNum,
  restrictions,
  otherData,
  randomSeed,
) => {
  try {
    let resolvedOtherData = otherData;
    let resolvedRandomSeed = randomSeed;

    if (typeof otherData === "string" && randomSeed === undefined) {
      resolvedRandomSeed = otherData;
      resolvedOtherData = undefined;
    }

    // Get recipes with restrictions applied if restrictions exist, otherwise get all recipes
    const recipes = resolvedOtherData
      ? await getRecipesWithRestrictions(restrictions, resolvedOtherData)
      : await getRecipesWithRestrictions(restrictions);

    // Sort by arrangementType
    if (arrangementType === "most_likes") {
      recipes.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      recipes.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      if (typeof resolvedRandomSeed === "string" && resolvedRandomSeed) {
        recipes.sort((a, b) => {
          const hashA = getDeterministicHash(`${resolvedRandomSeed}:${a.id}`);
          const hashB = getDeterministicHash(`${resolvedRandomSeed}:${b.id}`);
          return hashA - hashB;
        });
      } else {
        recipes.sort(() => Math.random() - 0.5);
      }
    }

    // Get length before slicing for limit
    const length = recipes.length;
    // Apply limit if specified
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

// Get recipes arranged by a specific user
export const getRecipesByUserIdArranged = async (
  userId,
  arrangementType,
  limitNum,
) => {
  try {
    const allRecipes = await getRecipes();
    const userRecipes = allRecipes.filter(
      (recipe) => recipe.user_id === userId,
    );
    // Sort by arrangementType
    if (arrangementType === "most_likes") {
      userRecipes.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      userRecipes.sort((a, b) => b.timestamp - a.timestamp);
    }
    // Get total before limiting
    const total = userRecipes.length;
    const limitedRecipes =
      typeof limitNum === "number" && limitNum > 0
        ? userRecipes.slice(0, limitNum)
        : userRecipes;

    // Get formatted date for each recipe
    limitedRecipes.forEach((recipe) => {
      recipe.formatted_date = formatDate(recipe.timestamp);
    });
    return { content: limitedRecipes, total };
  } catch (error) {
    console.error("Error arranging user recipes: ", error);
    return { content: [], total: 0 };
  }
};

// Get a recipe by ID
export const getRecipeById = async (recipeId) => {
  try {
    const recipeDoc = doc(db, "recipes", recipeId);
    const snapshot = await getDoc(recipeDoc);
    const data = snapshot.data();
    const chefData = await fetchUserByDocId(data.user_id);
    if (snapshot.exists()) {
      return {
        id: snapshot.id,
        ...snapshot.data(),
        chef_name: chefData ? chefData.username : "Unknown Chef",
      };
    } else {
      console.log("No such recipe!");
      return {
        id: "",
        title: "",
        description: "",
        cooking_time: "",
        ingredients: [],
        instructions: [],
        recipe_pic: "",
        user_id: "",
        chef_name: "Unknown Chef",
        timestamp: null,
      };
    }
  } catch (error) {
    console.error("Error fetching recipe: ", error);
    return {
      id: "",
      title: "",
      description: "",
      cooking_time: "",
      ingredients: [],
      instructions: [],
      recipe_pic: "",
      user_id: "",
      chef_name: "Unknown Chef",
      timestamp: null,
    };
  }
};

// Edit a recipe by ID
export const editRecipeById = async (recipeId, updatedData) => {
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

// Function to search recipes by title
export const searchRecipesByTitle = async (searchTerm) => {
  try {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const recipes = await getRecipes();
    const filteredRecipes = recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(lowerSearchTerm),
    );
    return { data: filteredRecipes };
  } catch (error) {
    console.error("Error searching recipes: ", error);
    return { data: [] };
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
        comment.id,
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
        comment.id,
      );
    }

    return comments;
  } catch (error) {
    console.error("Error fetching user recipe comments: ", error);
    return [];
  }
};

// Arrange recipe comments by user ID
export const arrangeRecipeCommentsByUserId = async (
  userId,
  arrangementType,
  limitNum,
) => {
  try {
    const comments = await getRecipeCommentsByUserId(userId);

    // Sort by arrangementType
    if (arrangementType === "most_likes") {
      comments.sort((a, b) => b.likes - a.likes);
    } else if (arrangementType === "most_recent") {
      comments.sort((a, b) => b.timestamp - a.timestamp);
    }

    const total = comments.length;
    const limitedComments =
      typeof limitNum === "number" && limitNum > 0
        ? comments.slice(0, limitNum)
        : comments;

    return { content: limitedComments, total };
  } catch (error) {
    console.error("Error arranging user recipe comments: ", error);
    return { content: [], total: 0 };
  }
};

// Add a comment to a recipe
export const addRecipeComment = async (commentData) => {
  try {
    // Upload comment image and get URL if comment_pic exists
    if (commentData.comment_pic) {
      // Upload comment image and get URL
      const recipeName = await getRecipeById(commentData.recipe_id).then(
        (recipe) => (recipe ? recipe.title : "unknown-recipe"),
      );
      const commentNumber = await getRecipeCommentsByRecipeId(
        commentData.recipe_id,
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
    const timestamp = serverTimestamp();
    updatedData.timestamp = timestamp;
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

// Get recipe comment by ID
export const getRecipeCommentById = async (commentId) => {
  try {
    const commentDoc = doc(db, "recipe_comments", commentId);
    const snapshot = await getDoc(commentDoc);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    } else {
      console.log("No such recipe comment!");
      return {
        id: "",
        content: "",
        recipe_id: "",
        user_id: "",
        timestamp: null,
        comment_pic: "",
      };
    }
  } catch (error) {
    console.error("Error fetching recipe comment: ", error);
    return null;
  }
};
