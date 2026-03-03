// React and React Native core
import {
  AppState,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// App Context
import { useAppContext } from "@/app/components/AppContext";
import { useEffect, useRef, useState } from "react";

// Utilities
import {
  addUserLog,
  checkRecipeCommentLikeNotificationTimestamp,
  checkRecipeLikeNotificationTimestamp,
  checkReviewLikeNotificationTimestamp,
} from "@/utils/notification";
import { fetchRecipeIdByCommentId } from "@/utils/recipeServices";
import { getStallIdByReviewId } from "@/utils/reviewServices";
import { fetchUserByClerkId } from "@/utils/userServices";

// Components
import TouchableScale from "../TouchableScale";

const HomeProfile = () => {
  const { user } = useUser();
  const { setCurrentPage, setSelectedId, setSelectedSecondaryId } =
    useAppContext();
  const appStateRef = useRef(AppState.currentState); // To track the current app state
  const resolvedUserIdRef = useRef<string | null>(null); // To store the resolved user ID after fetching from Clerk
  const [notifications, setNotifications] = useState<
    Array<{
      type: string;
      itemId: string;
      likes_count: number;
    }>
  >([]);

  // Fetch notifications when the component mounts
  useEffect(() => {
    // Variable to hold combined notifications
    let combinedNotifications: Array<{
      type: string;
      itemId: string;
      likes_count: number;
    }> = [];

    // Fetch notifications when the component mounts
    const fetchNotifications = async () => {
      if (!user?.id) {
        return;
      }
      // Get user ID from Clerk
      const resolvedUser = await fetchUserByClerkId(user.id);
      const resolvedUserId = resolvedUser?.id;
      if (!resolvedUserId) {
        return;
      }
      resolvedUserIdRef.current = resolvedUserId;

      //Fetch recipe likes notifications since latest log timestamp
      const [recipeRes, recipeCommentRes, reviewRes] = await Promise.all([
        checkRecipeLikeNotificationTimestamp(resolvedUserId),
        checkRecipeCommentLikeNotificationTimestamp(resolvedUserId),
        checkReviewLikeNotificationTimestamp(resolvedUserId),
      ]);

      // Combine all notifications into a single array with a unified format
      combinedNotifications = [
        ...(recipeRes?.countsByItemArray || []).map((notif: any) => ({
          type: "Recipe",
          itemId: notif.recipe_id,
          likes_count: notif.likes_count,
        })),
        ...(recipeCommentRes?.countsByItemArray || []).map((notif: any) => ({
          type: "Comment",
          itemId: notif.recipe_comment_id,
          likes_count: notif.likes_count,
        })),
        ...(reviewRes?.countsByItemArray || []).map((notif: any) => ({
          type: "Review",
          itemId: notif.review_id ?? "",
          likes_count: notif.likes_count,
        })),
      ];

      // Arrange notification by most likes
      combinedNotifications.sort((a, b) => b.likes_count - a.likes_count);
      setNotifications(combinedNotifications); // Replace with actual fetched notifications
    };

    fetchNotifications();
  }, [user]);

  // Set up AppState listener to log ONLY when user leaves the app
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      const prevAppState = appStateRef.current;
      const leavingApp =
        prevAppState === "active" &&
        (nextAppState === "inactive" || nextAppState === "background");

      if (leavingApp && resolvedUserIdRef.current) {
        addUserLog(resolvedUserIdRef.current);
      }

      appStateRef.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // Handler for when a notification is pressed
  const handleNotificationPress = (type: string, itemId: string) => {
    // Navigate to the relevant page based on notification type
    if (type === "Recipe") {
      // navigate to the recipe page
      setSelectedId(itemId);
      setCurrentPage("recipe-page");
    } else if (type === "Comment") {
      const fetchAndSetCommentRecipeId = async () => {
        // Get recipe ID associated with the comment ID, then navigate to comment page
        const recipeId = await fetchRecipeIdByCommentId(itemId);
        setSelectedId(recipeId);
        setSelectedSecondaryId(itemId);
        setCurrentPage("recipe-page");
      };
      fetchAndSetCommentRecipeId();
    } else if (type === "Review") {
      const fetchAndSetReviewStallId = async () => {
        // Get stall ID associated with the review ID, then navigate to stall page
        const stallId = await getStallIdByReviewId(itemId);
        setSelectedId(stallId);
        setSelectedSecondaryId(itemId);
        setCurrentPage("stall-page");
      };
      fetchAndSetReviewStallId();
    }
  };

  // Helper function to render each notification with consistent styling
  const notificationInformation = (
    likes_count: number,
    type: string,
    itemId: string,
  ) => {
    return (
      <TouchableScale
        className="mb-2"
        onPress={() => handleNotificationPress(type, itemId)}
      >
        <Text
          className="bg-red/80 font-inter text-center text-blue text-lg border-2 border-blue rounded-xl px-2 py-1 w-full"
          numberOfLines={1}
        >
          {likes_count} new like{likes_count > 1 ? "s" : ""} on a {type}!
        </Text>
      </TouchableScale>
    );
  };

  return (
    <View className="flex-col flex-1 rounded-2xl p-4 bg-green/50 border-2 border-blue mt-8">
      <View className="flex-col pb-2 p-4 h-full w-full justify-between">
        <Text
          className="font-koulen font-bold text-blue text-3xl leading-10"
          style={{ includeFontPadding: false }}
        >
          Hello, {user?.username}!
        </Text>
        <Text className="font-inter text-blue text-lg">Recent Updates:</Text>
        {notifications.length === 0 && (
          <Text
            className="font-inter text-center text-blue text-lg border-2 border-blue rounded-xl px-2 py-1 mt-4"
            numberOfLines={1}
          >
            No new notifications.
          </Text>
        )}
        {notifications.length > 0 && (
          <View className="rounded-xl border-2 border-blue p-2 mt-2">
            <ScrollView
              className="p-2 h-32"
              showsVerticalScrollIndicator={true}
              persistentScrollbar={true}
              indicatorStyle="black"
              scrollIndicatorInsets={{ right: 1 }}
            >
              {notifications.map((notification, index) => (
                <View key={index}>
                  {notificationInformation(
                    notification.likes_count,
                    notification.type,
                    notification.itemId,
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        <TouchableOpacity
          className="self-end mt-4 flex-row gap-2 items-center border-2 border-blue rounded-xl px-4"
          onPress={() => setCurrentPage("profile-page")}
        >
          <Feather name="user" size={24} color="#264653" />
          <Text className="font-koulen pt-2 text-blue text-xl ">Profile</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color="#264653"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeProfile;
