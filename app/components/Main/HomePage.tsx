// React Native core
import { Text, View } from "react-native";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import HomeCookWHAT from "@/app/components/Home/HomeCookWHAT";
import HomeEatWHAT from "@/app/components/Home/HomeEatWHAT";
import HomeNav from "@/app/components/Home/HomeNav";
import HomeProfile from "@/app/components/Home/HomeProfile";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import {
  addUserLog,
  checkRecipeCommentLikeNotificationTimestamp,
  checkRecipeLikeNotificationTimestamp,
  checkReviewLikeNotificationTimestamp,
} from "@/utils/notification";
import { fetchUserByClerkId } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import HomeRandomizer from "../Home/HomeRandomizer";

interface HomePageProps {
  backgroundColor: string;
  backgroundColorHex: string;
  widthClass: string;
}

export default function HomePage({
  backgroundColor,
  backgroundColorHex,
  widthClass,
}: HomePageProps) {
  const { currentPage, setCurrentPage } = useAppContext();
  const { user } = useUser();
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    // Fetch notifications when the component mounts
    const fetchNotifications = async () => {
      if (!user?.id) {
        return;
      }
      // Get user ID from Clerk
      const resolvedUserId = await fetchUserByClerkId(user.id).then(
        (data) => data?.id,
      );
      if (!resolvedUserId) {
        return;
      }

      //Fetch recipe likes notifications since latest log timestamp
      const recipeNotifications = await checkRecipeLikeNotificationTimestamp(
        resolvedUserId,
      ).then((data) => data?.countsByItemArray);
      const recipeCommentsNotifications =
        await checkRecipeCommentLikeNotificationTimestamp(resolvedUserId).then(
          (data) => data?.countsByItemArray,
        );
      const reviewNotifications = await checkReviewLikeNotificationTimestamp(
        resolvedUserId,
      ).then((data) => data?.countsByItemArray);

      console.log(
        "Recipe Like Notifications since latest log:",
        recipeNotifications,
        "Recipe Comment Like Notifications since latest log:",
        recipeCommentsNotifications,
        "Review Like Notifications since latest log:",
        reviewNotifications,
      );

      addUserLog(resolvedUserId);
    };

    setNotifications(["Sample Notification 1", "Sample Notification 2"]); // Replace with actual fetched notifications

    fetchNotifications();
  }, [user]);

  return (
    <View className="h-full w-full flex-col">
      <HomeNav
        backgroundColor={backgroundColor}
        backgroundColorHex={backgroundColorHex}
        text="Home"
        setCurrentPage={setCurrentPage}
        desiredPage="home-page"
        widthClass={widthClass}
      />
      {currentPage !== "home-page" ? (
        <View
          className={`bg-${backgroundColor} min-h-[80vh] rounded-tl-3xl w-full`}
        />
      ) : (
        <View className={`bg-${backgroundColor} pt-8 rounded-tl-3xl`}>
          <OptimizedScrollView
            className={`bg-${backgroundColor} min-h-[80vh] px-8`}
          >
            <HomeProfile />
            <HomeEatWHAT />
            <HomeCookWHAT />
            <HomeRandomizer />
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
