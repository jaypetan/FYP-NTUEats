// React and React Native core
import { useState } from "react";
import { Text, View } from "react-native";

// External libraries
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

// Assets
import CommentsLogo from "@/assets/images/logos/Comments-logo.png";
import FavouriteLogo from "@/assets/images/logos/Favourites-logo.png";
import ProfileLogo from "@/assets/images/logos/Profile-logo.png";
import RecipesLogo from "@/assets/images/logos/Recipes-logo.png";

// Components
import ClosePage from "@/app/components/ClosePage";
import CommentsContent from "@/app/components/Profile/CommentsContent";
import EditCommentModal from "@/app/components/Profile/CommentsContent/EditRecipeCommentModal";
import EditReviewModal from "@/app/components/Profile/CommentsContent/EditReviewModal";
import ProfileContent from "@/app/components/Profile/ProfileContent";
import ProfileNav from "@/app/components/Profile/ProfileNav";
import RecipesContent from "@/app/components/Profile/RecipesContent";
import EditRecipeModal from "@/app/components/Profile/RecipesContent/EditRecipeModal";
import FavouriteContent from "../components/Profile/FavouriteContent";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editModalVisible, setEditModalVisible] = useState("");

  const toggleModalVisibility = (type: string) => {
    if (editModalVisible) {
      setEditModalVisible("");
    } else {
      setEditModalVisible(type);
    }
  };

  const tabs = [
    {
      key: "profile",
      logo: ProfileLogo,
      content: <ProfileContent setActiveTab={setActiveTab} />,
    },
    {
      key: "favourites",
      logo: FavouriteLogo,
      content: <FavouriteContent />,
    },
    {
      key: "recipes",
      logo: RecipesLogo,
      content: (
        <RecipesContent
          activeTab={activeTab}
          toggleModalVisibility={toggleModalVisibility}
          editModalVisible={editModalVisible}
        />
      ),
    },
    {
      key: "comments",
      logo: CommentsLogo,
      content: (
        <CommentsContent
          activeTab={activeTab}
          toggleModalVisibility={toggleModalVisibility}
          editModalVisible={editModalVisible}
        />
      ),
    },
  ];

  return (
    <View className="items-center">
      <EditCommentModal
        editModalVisible={editModalVisible}
        toggleModalVisibility={toggleModalVisibility}
      />
      <EditReviewModal
        editModalVisible={editModalVisible}
        toggleModalVisibility={toggleModalVisibility}
      />
      <EditRecipeModal
        editModalVisible={editModalVisible}
        toggleModalVisibility={toggleModalVisibility}
      />
      <ClosePage right={"right-6"} />
      <Text className="font-koulen text-3xl text-blue pt-2">{activeTab}</Text>
      {/* Navigation within profile */}
      <ProfileNav
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Profile content */}
      <Animated.View
        key={activeTab}
        entering={SlideInDown.duration(600)}
        exiting={SlideOutDown.duration(600)}
        className="w-full items-center mt-2"
      >
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </Animated.View>
    </View>
  );
}
