// React and React Native core
import { useState } from "react";
import { Text, View } from "react-native";

// External libraries
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";

// Assets
import CommentsLogo from "@/assets/images/logos/Comments-logo.png";
import ProfileLogo from "@/assets/images/logos/Profile-logo.png";
import RecipesLogo from "@/assets/images/logos/Recipes-logo.png";

// Components
import ClosePage from "@/app/components/ClosePage";
import CommentsContent from "@/app/components/Profile/CommentsContent";
import ProfileContent from "@/app/components/Profile/ProfileContent";
import ProfileNav from "@/app/components/Profile/ProfileNav";
import RecipesContent from "@/app/components/Profile/RecipesContent";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { key: "profile", logo: ProfileLogo, content: <ProfileContent /> },
    { key: "comments", logo: CommentsLogo, content: <CommentsContent /> },
    { key: "recipes", logo: RecipesLogo, content: <RecipesContent /> },
  ];

  const [page, setPage] = useState(1); // used to trigger re-render for animation

  return (
    <View className="items-center">
      <ClosePage right={"right-6"} />

      <Text className="font-koulen text-3xl text-blue pt-2">Settings</Text>
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
