// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { fetchLikedItemsByUserId } from "@/utils/likeServices";
import { getRecipeById } from "@/utils/recipeServices";
import { getStallDataById } from "@/utils/stallServices";

import FavouriteCard from "@/app/components/Profile/FavouriteContent/FavouriteCard";

interface FavouriteContentProps {
  userId: string;
}
const FavouriteContent: React.FC<FavouriteContentProps> = ({ userId }) => {
  const [pageInfo, setPageInfo] = useState("stalls"); // "recipes" or "stalls"

  const [favouriteItems, setfavouriteItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (pageInfo === "recipes") {
      fetchFavouriteRecipes();
    } else if (pageInfo === "stalls") {
      fetchFavouriteStalls();
    }
  }, [userId]);

  // Fetch favourite stalls
  const fetchFavouriteStalls = async () => {
    if (userId) {
      const fetchedFavourites = await fetchLikedItemsByUserId(
        "stalls_saved",
        "stall_id",
        userId
      );
      console.log("Fetched favourite stalls:", fetchedFavourites);
      const fetchedFavouritesWithData = await Promise.all(
        fetchedFavourites.map(async (favourite) => {
          const stallData = await getStallDataById(favourite);
          return {
            stallData,
          };
        })
      );
      console.log(
        "Fetched favourite stalls with data:",
        fetchedFavouritesWithData
      );
      setfavouriteItems(fetchedFavouritesWithData);
    }
  };

  // Fetch favourite recipes
  const fetchFavouriteRecipes = async () => {
    if (userId) {
      const fetchedFavourites = await fetchLikedItemsByUserId(
        "recipes_likes",
        "recipe_id",
        userId
      );
      console.log("Fetched favourite recipes:", fetchedFavourites);
      const fetchedFavouritesWithData = await Promise.all(
        fetchedFavourites.map(async (favourite) => {
          const recipeData = await getRecipeById(favourite);
          return {
            recipeData,
          };
        })
      );
      console.log(
        "Fetched favourite recipes with data:",
        fetchedFavouritesWithData
      );
      setfavouriteItems(fetchedFavouritesWithData);
    }
  };

  return (
    <View className="rounded-3xl w-full h-full items-center bg-darkcream/80 px-8 pt-8 mt-4">
      <Text className="text-center text-lg text-blue mt-8">
        Favourite content goes here.
      </Text>
      <ScrollView className="flex-col w-full max-h-[500px]">
        {favouriteItems.length === 0 ? (
          <Text className="text-center text-lg text-blue mt-8">
            No favourite items yet.
          </Text>
        ) : (
          favouriteItems.map((item, index) => (
            <View key={index}>
              {pageInfo === "stalls" ? (
                <FavouriteCard stallData={item.stallData} />
              ) : pageInfo === "recipes" ? (
                <FavouriteCard recipeData={item.recipeData} />
              ) : null}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default FavouriteContent;
