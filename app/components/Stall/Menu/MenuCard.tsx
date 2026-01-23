// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

// Utilities
import {
  fetchTotalLikesByItemId,
  hasUserLikedItem,
  likeItem,
  unlikeItem,
} from "@/utils/likeServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import ImageLoader from "@/app/components/ImageLoader";

interface MenuCardProps {
  item: {
    id: string;
    image: string;
  };
}

const MenuCard: React.FC<MenuCardProps> = ({ item }) => {
  const { user } = useUser();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [like, setLike] = useState(false);
  const [menuLikesCount, setMenuLikesCount] = useState(0);

  // Get current user ID
  const getCurrentUserId = async () => {
    if (user) {
      const userData = await fetchUserByClerkId(user.id);
      setCurrentUserId(userData ? userData.id : null);
      return userData ? userData.id : null;
    }
    return null;
  };

  // Fetch total likes for the menu
  const fetchLikes = async () => {
    const likes = await fetchTotalLikesByItemId(
      "menus_likes",
      "menu_id",
      item.id
    );
    setMenuLikesCount(likes);
  };

  // Check if the user has liked the menu
  const checkUserLikeStatus = async () => {
    const userHasLiked = await hasUserLikedItem(
      "menus_likes",
      "menu_id",
      item.id,
      currentUserId
    );
    setLike(userHasLiked);
  };

  // Fetch like status and total likes on component mount
  useEffect(() => {
    getCurrentUserId();
    fetchLikes();
  }, []);
  useEffect(() => {
    checkUserLikeStatus();
  }, [currentUserId]);

  // Handle like button press
  const likeMenuHandler = async () => {
    if (like === false) {
      await likeItem("menus_likes", "menu_id", item.id, currentUserId);
    } else {
      await unlikeItem("menus_likes", "menu_id", item.id, currentUserId);
    }
    setLike(!like);
    await fetchLikes(); // Fetch updated likes after action
  };

  return (
    <View>
      <View className="w-64 h-64">
        <ImageLoader
          image={item.image}
          className="w-64 h-64"
          loaderClassName="w-full h-full absolute"
        />
      </View>
      <View className="flex-row items-center justify-end p-2 bg-green/80">
        <Text className="text-blue text-xl mr-2 font-koulen pt-2 ">
          {menuLikesCount > 0 ? menuLikesCount : ""}
        </Text>
        <TouchableOpacity onPress={() => likeMenuHandler()}>
          {like ? (
            <FontAwesome name="heart" size={20} color="red" />
          ) : (
            <FontAwesome name="heart-o" size={20} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MenuCard;
