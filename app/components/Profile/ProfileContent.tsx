// React Native core
import { ScrollView, Text, View } from "react-native";

// External libraries
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

// Components
import DietryButton from "@/app/components/Profile/ProfileContent/DietryButton";
import UserInfo from "@/app/components/Profile/ProfileContent/UserInfo";
import TouchableScale from "@/app/components/TouchableScale";

const ProfileContent = () => {
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
    {
      label: "No Beef",
      icon: <MaterialCommunityIcons name="cow" size={24} color="green" />,
    },
    {
      label: "No Milk",
      icon: <MaterialCommunityIcons name="cup" size={24} color="green" />,
    },
  ];

  return (
    <ScrollView className="p-8 mt-4 bg-darkcream/80 w-full h-full rounded-3xl">
      <Text className="text-center text-4xl font-koulen text-blue mb-4 pt-4">
        Profile
      </Text>
      {/* User information */}
      <UserInfo />

      {/* Favourites button */}
      <TouchableScale
        className="bg-green/80 p-6 rounded-2xl flex flex-row justify-between items-center mt-4"
        onPress={() => {}}
      >
        <View className="flex flex-row items-center gap-4">
          <FontAwesome
            name="heart"
            size={22}
            color="red"
            className="opacity-70"
          />
          <Text className="text-2xl pt-4 font-koulen text-blue">
            Favourites
          </Text>
        </View>
        <MaterialIcons name="arrow-forward" size={24} color="black" />
      </TouchableScale>

      {/* Dietry Preferences Section */}
      <View className="bg-green/80 p-6 rounded-2xl mt-4 flex flex-col gap-2">
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
