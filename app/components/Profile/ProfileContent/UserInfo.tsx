// React Native core
import { Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Components
import TouchableScale from "@/app/components/TouchableScale";

const UserInfo = () => {
  const { user } = useUser();
  return (
    <View className="bg-cream border-2 border-blue p-6 rounded-2xl flex flex-col">
      <Text className="text-2xl font-koulen text-blue">User Information</Text>
      <View className="justify-between items-center flex flex-row">
        <View className="flex-col">
          <Text className="text-lg text-blue font-semibold">Username: </Text>
          <Text className="text-lg capitalize text-blue">{user?.username}</Text>
          <Text className="text-lg text-blue font-semibold mt-2">Email: </Text>
          <Text className="text-lg text-blue">
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>
        <TouchableScale
          className="self-end px-4 py-2 rounded-xl items-center bg-green/50 border-2 border-blue"
          onPress={() => {}}
        >
          <Text className="text-blue font-bold text-lg">Edit</Text>
        </TouchableScale>
      </View>
    </View>
  );
};

export default UserInfo;
