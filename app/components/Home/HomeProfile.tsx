// React and React Native core
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// App Context
import { useAppContext } from "@/app/components/AppContext";

const HomeProfile = () => {
  const { user } = useUser();
  const appContext = useAppContext();

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
        <ScrollView className="rounded-xl p-2 border-b-2 border-blue max-h-24">
          <Text
            className="bg-red/80 font-inter text-center text-blue text-base border-2 border-blue rounded-xl px-2 w-full mb-2"
            numberOfLines={1}
          >
            2 new likes on your review!
          </Text>
          <Text
            className="bg-red/80 font-inter text-center text-blue text-base border-2 border-blue rounded-xl px-2 w-full mb-2"
            numberOfLines={1}
          >
            1 new likes on Carbona recipe!
          </Text>
          <Text
            className="bg-red/80 font-inter text-center text-blue text-base border-2 border-blue rounded-xl px-2 w-full mb-2"
            numberOfLines={1}
          >
            1 new comment on Japanese Curry Rice recipe!
          </Text>
          <Text
            className="bg-red/80 font-inter text-center text-blue text-base border-2 border-blue rounded-xl px-2 w-full mb-2"
            numberOfLines={1}
          >
            2 new likes on your review!
          </Text>
        </ScrollView>
        <TouchableOpacity
          className="self-end mt-4 flex-row gap-2 items-center border-2 border-blue rounded-xl px-4"
          onPress={() => appContext.setCurrentPage("profile-page")}
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
