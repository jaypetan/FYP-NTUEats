import { useAppContext } from "@/app/components/AppContext";
import { useUser } from "@clerk/clerk-expo";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const HomeProfile = () => {
  const { user } = useUser();
  const appContext = useAppContext();
 

  return (
    <View className="flex-row h-64 rounded-2xl p-4 bg-green/50">
      <View className="flex-col pb-2 p-4 h-full w-full justify-between">
        <Text
          className="font-koulen font-bold text-blue text-3xl leading-10"
          style={{ includeFontPadding: false }}
        >
          Hello, {user?.username}!
        </Text>
        <Text className="font-inter text-blue text-lg">Recent Updates:</Text>
        <ScrollView className="rounded-xl p-2  border-b-2 border-blue">
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
        <TouchableOpacity className="self-end mt-4 flex-row gap-2 items-center" onPress={() => appContext.setCurrentPage("profile-page")}>
          <Text className="font-inter text-blue text-lg ">Go To Profile</Text>
          <MaterialCommunityIcons name="arrow-right" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeProfile;
