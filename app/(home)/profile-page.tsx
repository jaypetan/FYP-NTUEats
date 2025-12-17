import CommentsLogo from "@/assets/images/logos/Comments-logo.png";
import ProfileLogo from "@/assets/images/logos/Profile-logo.png";
import RecipesLogo from "@/assets/images/logos/Recipes-logo.png";
import { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import TouchableScale from "../components/TouchableScale";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { key: "profile", logo: ProfileLogo },
    { key: "comments", logo: CommentsLogo },
    { key: "recipes", logo: RecipesLogo },
  ];

  return (
    <View className="items-center">
      <Text className="font-koulen text-3xl text-blue pt-2">Settings</Text>
      {/* Navigation within profile */}
      <View className="flex-row gap-4 items-end justify-center">
        {tabs.map((tab) => (
          <TouchableScale key={tab.key} onPress={() => setActiveTab(tab.key)}>
            <Image
              source={tab.logo}
              className={`${
                activeTab === tab.key ? "h-24 p-3" : "h-16 p-2"
              } border-blue border-2 aspect-square bg-cream/80 rounded-full`}
              resizeMode="contain"
            />
          </TouchableScale>
        ))}
      </View>
      {/* Profile content */}
      <ScrollView className="pt-8 mt-8 bg-darkcream/80 w-full h-full rounded-3xl">
        <Text>ProfilePage</Text>
      </ScrollView>
    </View>
  );
}
