// React Native core
import { ScrollView, Text, View } from "react-native";

// External libraries
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

// Components
import DietryButton from "@/app/components/Profile/ProfileContent/DietryButton";
import UserInfo from "@/app/components/Profile/ProfileContent/UserInfo";
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileContentProps {
  setActiveTab: (tab: string) => void;
}
const ProfileContent: React.FC<ProfileContentProps> = ({ setActiveTab }) => {
  const dietaryPreferences = [
    {
      label: "Halal",
      icon: (
        <MaterialCommunityIcons name="food-halal" size={24} color="green" />
      ),
    },
    {
      label: "Vegetarian",
      icon: <MaterialCommunityIcons name="leaf" size={24} color="green" />,
    },
    {
      label: "Vegan",
      icon: <MaterialCommunityIcons name="sprout" size={24} color="green" />,
    },
    {
      label: "No Seafood",
      icon: <MaterialCommunityIcons name="fish" size={24} color="green" />,
    },
  ];

  return (
    <ScrollView className="p-8 mt-4 bg-darkcream/80 w-full h-full rounded-3xl pt-12">
      {/* User information */}
      <UserInfo />

      {/* Favourites button */}
      <TouchableScale
        className="bg-cream border-2 border-blue p-6 rounded-2xl flex flex-row justify-between items-center mt-4"
        onPress={() => {
          setActiveTab("favourites");
        }}
      >
        <View className="flex flex-row items-start gap-2">
          <View className="relative">
            <MaterialCommunityIcons
              name="heart-outline"
              size={24}
              color="#264653"
              className="absolute z-10"
            />
            <MaterialCommunityIcons name="heart" size={24} color="red" />
          </View>

          <View className="flex flex-col">
            <Text className="text-2xl pt-1 font-koulen text-blue">
              Favourites
            </Text>
            <Text className="text-lg text-gray-600 leading-4">
              View your saved recipes/stalls
            </Text>
          </View>
        </View>
        <MaterialIcons name="arrow-forward" size={24} color="black" />
      </TouchableScale>

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
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ProfileContent;
