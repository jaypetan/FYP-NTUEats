import carbonaraImage from "@/assets/sample-data/cook/carbonara.jpeg";
import { getRecipeById } from "@/utils/recipeServices";
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
  const { selectedId } = useAppContext();

  // Fetch Data based on selectedId
  useEffect(() => {
    const fetchRecipeData = async () => {
      if (selectedId) {
        const data = await getRecipeById(selectedId);
        setRecipeData(data);
        console.log("Fetched Recipe Data:", data);
      }
    };
    fetchRecipeData();
  }, [selectedId]);

  useEffect(() => {
    console.log("Recipe Data:", recipeData);
  }, [recipeData]);

  useEffect(() => {
    // Reset scroll position to the top when the page changes
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [page]);

  const sampleData = {
    name: "Spaghetti Carbonara",
    desc: "Classic Italian pasta dish made with eggs, cheese, pancetta, and pepper.",
    ingredients: [
      "200g spaghetti",
      "100g pancetta, diced",
      "2 large eggs",
      "1 egg yolk (optional, for extra creaminess)",
      "50g pecorino cheese, finely grated",
      "50g parmesan cheese, finely grated",
      "1 clove garlic, peeled and smashed (optional)",
      "2 tbsp olive oil (optional, for frying pancetta)",
      "Freshly ground black pepper",
      "Salt",
      "Fresh parsley, chopped (optional, for garnish)",
      "Extra pecorino or parmesan, for serving",
    ],
    steps: [
      "Bring a large pot of salted water to a boil.",
      "Cook spaghetti until al dente, following package instructions.",
      "Dice pancetta into small cubes.",
      "Heat olive oil in a skillet and fry pancetta until crispy.",
      "Add a smashed garlic clove to the skillet for flavor, then remove it.",
      "Grate pecorino and parmesan cheeses finely.",
      "Beat eggs and optional egg yolk in a bowl.",
      "Mix grated cheeses into the eggs until smooth.",
      "Reserve 1 cup of pasta water before draining spaghetti.",
      "Drain pasta and add to the skillet with pancetta.",
      "Toss pasta in the pancetta fat to coat evenly.",
      "Remove skillet from heat to avoid scrambling the eggs.",
      "Pour egg and cheese mixture over the pasta.",
      "Toss quickly to create a creamy sauce.",
      "Add reserved pasta water if the sauce is too thick.",
      "Season with black pepper and adjust salt to taste.",
      "Serve hot with extra cheese, pepper, and parsley.",
    ],
    comments: [
      {
        user: "jaype",
        content: "This recipe is fantastic! Easy to follow and delicious.",
        content_pic: carbonaraImage,
        likes: 24,
      },
      {
        user: "ting",
        content:
          "Made this for dinner and my family couldn't get enough. Highly recommend!",
        content_pic: null,
        likes: 15,
      },
    ],
  };

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
          <RecipeComments comments={sampleData.comments} />
        ) : null}
        <Text className="py-8" />
      </ScrollView>
    </View>
  );
}
