// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

import { fetchLikedItemsByUserId } from "@/utils/likeServices";
import { getRecipeById } from "@/utils/recipeServices";
import { getStallDataById } from "@/utils/stallServices";

import ListWithSeeMore from "@/app/components/ListWithLoadMore";
import Loader from "@/app/components/Loader";
import FavouriteCard from "@/app/components/Profile/FavouriteContent/FavouriteCard";
import FavouriteHeader from "@/app/components/Profile/FavouriteContent/FavouriteHeader";
import * as Animatable from "react-native-animatable";

interface FavouriteContentProps {
  userId: string;
}
const FavouriteContent: React.FC<FavouriteContentProps> = ({ userId }) => {
  const [pageInfo, setPageInfo] = useState("stalls"); // "recipes" or "stalls"

  const [favouriteItems, setFavouriteItems] = useState<any[]>([]);
  const [maxLength, setMaxLength] = useState(0);

  useEffect(() => {
    if (pageInfo === "recipes") {
      fetchFavouriteRecipes(4);
    } else if (pageInfo === "stalls") {
      fetchFavouriteStalls(4);
    }
  }, [userId]);

  // Fetch favourite stalls
  const fetchFavouriteStalls = async (limitNumber: number) => {
    if (userId) {
      const fetchedFavourites = await fetchLikedItemsByUserId(
        "stalls_saved",
        "stall_id",
        userId,
        limitNumber
      );
      const fetchedFavouritesWithData = await Promise.all(
        fetchedFavourites.items.map(async (favourite) => {
          const stallData = await getStallDataById(favourite);
          return {
            stallData,
          };
        })
      );
      setMaxLength(fetchedFavourites.maxLength);
      setFavouriteItems(fetchedFavouritesWithData);
    }
  };

  // Fetch favourite recipes
  const fetchFavouriteRecipes = async (limitNumber: number) => {
    if (userId) {
      const fetchedFavourites = await fetchLikedItemsByUserId(
        "recipes_likes",
        "recipe_id",
        userId,
        limitNumber
      );
      const fetchedFavouritesWithData = await Promise.all(
        fetchedFavourites.items.map(async (favourite) => {
          const recipeData = await getRecipeById(favourite);
          return {
            recipeData,
          };
        })
      );
      setMaxLength(fetchedFavourites.maxLength);
      setFavouriteItems(fetchedFavouritesWithData);
    }
  };

  const handlePageInfoChange = () => {
    setFavouriteItems(["loading"]);
    const newPageInfo = pageInfo === "recipes" ? "stalls" : "recipes";
    setPageInfo(newPageInfo);
    // Fetch data based on new page info
    if (newPageInfo === "recipes") {
      fetchFavouriteRecipes(4);
    } else if (newPageInfo === "stalls") {
      fetchFavouriteStalls(4);
    }
  };

  const stallFavouriteCard = favouriteItems.map((item, index) => (
    <FavouriteCard key={index} stallData={item.stallData} />
  ));

  const recipeFavouriteCard = favouriteItems.map((item, index) => (
    <FavouriteCard key={index} recipeData={item.recipeData} />
  ));

  return (
    <View className="rounded-3xl w-full h-full items-center bg-darkcream/80 px-8 pt-8 mt-4">
      <FavouriteHeader
        pageInfo={pageInfo}
        handlePageInfoChange={handlePageInfoChange}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-col w-full max-h-[500px]"
      >
        {favouriteItems.length === 0 ? (
          <Text className="text-center text-lg text-blue mt-8">
            No favourite items yet.
          </Text>
        ) : favouriteItems[0] === "loading" ? (
          <View className="h-full mt-24 scale-150">
            <Loader />
          </View>
        ) : (
          <Animatable.View animation="fadeInUpBig" key={pageInfo}>
            <ListWithSeeMore
              content={
                pageInfo === "stalls" ? stallFavouriteCard : recipeFavouriteCard
              }
              fetchFn={(arrangement, limitNumber) =>
                pageInfo === "stalls"
                  ? fetchFavouriteStalls(limitNumber)
                  : fetchFavouriteRecipes(limitNumber)
              }
              maxCount={maxLength}
              arrangement="most_recent"
            />
          </Animatable.View>
        )}
        <View className="mt-16" />
      </ScrollView>
    </View>
  );
};

export default FavouriteContent;
