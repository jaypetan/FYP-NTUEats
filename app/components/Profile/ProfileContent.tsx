// React Native core
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

// External libraries
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Utilities
import { fetchDietaryRestrictions } from "@/utils/userServices";
import { useUser } from "@clerk/clerk-expo";

// Components
import DietryButton from "@/app/components/Profile/ProfileContent/DietryButton";
import UserInfo from "@/app/components/Profile/ProfileContent/UserInfo";
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileContentProps {
  setActiveTab: (tab: string) => void;
}
const ProfileContent: React.FC<ProfileContentProps> = ({ setActiveTab }) => {
  const { user } = useUser();

  const [dietaryRestrictions, setDietaryRestrictions] = useState<any[]>([]);
  const fetchDietaryRestrictionsData = async () => {
    try {
      const restrictions = await fetchDietaryRestrictions(user?.id!);
      setDietaryRestrictions(restrictions);
    } catch (error) {
      console.error("Error fetching dietary restrictions:", error);
    }
  };
  useEffect(() => {
    fetchDietaryRestrictionsData();
  }, []);

  const dietaryPreferences = [
    {
      label: "Halal",
      restriction: "halal",
      icon: (
        <MaterialCommunityIcons name="food-halal" size={24} color="green" />
      ),
    },
    {
      label: "Vegetarian",
      restriction: "vegetarian",
      icon: <MaterialCommunityIcons name="leaf" size={24} color="green" />,
    },
  ];

  const profileNavigation = [
    {
      label: "Favourites",
      description: "View your saved recipes/stalls",
      icon: <MaterialCommunityIcons name="heart" size={24} color="#264653" />,
      onPress: () => setActiveTab("favourites"),
    },
    {
      label: "Recipes",
      description: "Manage your personal recipes",
      icon: (
        <MaterialCommunityIcons name="book-open" size={24} color="#264653" />
      ),
      onPress: () => setActiveTab("recipes"),
    },
    {
      label: "Comments",
      description: "Manage your reviews/comments",
      icon: (
        <MaterialCommunityIcons
          name="comment-multiple"
          size={24}
          color="#264653"
        />
      ),
      onPress: () => setActiveTab("comments"),
    },
  ];

  return (
    <ScrollView className="p-8 mt-4 bg-darkcream/80 w-full h-[600px] rounded-3xl pt-12">
      {/* User information */}
      <UserInfo />

      {/* Dietry Preferences Section */}
      <View className="bg-cream border-2 border-blue p-6 rounded-2xl mt-4 flex flex-col gap-2">
        <Text className="text-2xl font-koulen text-blue">
          Dietary Preferences
        </Text>
        <View className="flex flex-row flex-wrap gap-4">
          {dietaryPreferences.map((preference) => (
            <DietryButton
              key={preference.label}
              label={preference.label}
              icon={preference.icon}
              restriction={preference.restriction}
              selected={dietaryRestrictions.some(
                (r) => r[preference.restriction] === true,
              )}
            />
          ))}
        </View>
      </View>

      {/* Navigation button */}
      {profileNavigation.map((item) => (
        <TouchableScale
          key={item.label}
          className="bg-cream border-2 border-blue p-6 rounded-2xl flex flex-row justify-between items-center mt-4"
          onPress={item.onPress}
        >
          <View className="flex flex-row items-start gap-2">
            {item.icon}
            <View className="flex flex-col">
              <Text className="text-2xl pt-1 font-koulen text-blue">
                {item.label}
              </Text>
              <Text className="text-lg text-gray-600 leading-4">
                {item.description}
              </Text>
            </View>
          </View>
          <MaterialIcons name="arrow-forward" size={24} color="black" />
        </TouchableScale>
      ))}
      <View className="mt-12" />
    </ScrollView>
  );
};

export default ProfileContent;
