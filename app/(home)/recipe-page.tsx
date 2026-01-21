import { fetchTotalLikesByItemId } from "@/utils/LikeServices";
import {
  getRecipeById,
  getRecipeCommentsByRecipeId,
} from "@/utils/recipeServices";
import { useEffect, useRef, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useAppContext } from "../components/AppContext";
import RecipeAbout from "../components/Recipe/RecipeAbout";
import RecipeComments from "../components/Recipe/RecipeComments";
import RecipeHeader from "../components/Recipe/RecipeHeader";
import RecipeSteps from "../components/Recipe/RecipeSteps";

export default function RecipePage() {
  const [page, setPage] = useState("about");
  const scrollViewRef = useRef<ScrollView>(null);
  const [recipeData, setRecipeData] = useState<any>({
    title: "",
    recipe_pic: "",
    description: "",
    ingredients: [],
    instructions: [],
  });
  const [commentsData, setCommentsData] = useState<any[]>([]);
  const { selectedId } = useAppContext();

  // Fetch Data based on selectedId
  const fetchRecipeData = async () => {
    if (selectedId) {
      const data = await getRecipeById(selectedId);
      setRecipeData(data);
    }
  };

  // Fetch Comments Data based on selectedId
  const fetchCommentsData = async () => {
    if (selectedId) {
      const data = await getRecipeCommentsByRecipeId(selectedId);
      setCommentsData(data);
    }
  };

  useEffect(() => {
    fetchRecipeData();
    fetchCommentsData();
  }, [selectedId]);

  // Fetch comments likes
  const fetchCommentsLikes = async () => {
    const updatedComments = await Promise.all(
      commentsData.map(async (comment) => {
        const likesCount = await fetchTotalLikesByItemId(
          "recipe_comments_likes",
          "recipe_comment_id",
          comment.id
        );
        return { ...comment, likes: likesCount };
      })
    );
    setCommentsData(updatedComments);
  };
  useEffect(() => {
    fetchCommentsLikes();
  }, [commentsData.length]);

  useEffect(() => {
    // Reset scroll position to the top when the page changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [page]);

  return (
    <View className="mt-4 flex-col">
      <RecipeHeader
        recipeImage={recipeData.recipe_pic}
        recipeName={recipeData.title}
        page={page}
        setPage={setPage}
      />
      <ScrollView
        ref={scrollViewRef}
        className={`px-8 py-4 w-full h-[50vh] bg-darkcream ${
          page === "about"
            ? "rounded-tr-2xl"
            : page === "steps"
            ? "rounded-t-2xl"
            : "rounded-tl-2xl"
        }`}
      >
        {page === "about" ? (
          <RecipeAbout
            desc={recipeData.description}
            ingredients={recipeData.ingredients}
          />
        ) : page === "steps" ? (
          <RecipeSteps steps={recipeData.instructions} />
        ) : page === "comments" ? (
          <RecipeComments
            comments={commentsData}
            fetchCommentsData={fetchCommentsData}
          />
        ) : null}
        <Text className="py-8" />
      </ScrollView>
    </View>
  );
}
