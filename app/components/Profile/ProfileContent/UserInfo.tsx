// React Native core
import { Text, View } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Components
import TouchableScale from "@/app/components/TouchableScale";

const UserInfo = () => {
  const { user } = useUser();
  return (
    <View className="bg-green/80 p-6 rounded-2xl flex flex-col">
      <Text className="text-2xl font-koulen text-blue">User Information</Text>
      <View className="justify-between items-center flex flex-row">
        <View>
          <Text className="text-2xl capitalize text-blue">
            {user?.username}
          </Text>
          <Text className="text-xl text-blue">
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>
        <TouchableScale
          className="p-4 rounded-xl items-center border-2 border-blue"
          onPress={() => {}}
        >
          <Text className="text-blue font-bold">Edit</Text>
        </TouchableScale>
      </View>
    </View>
  );
};

export default UserInfo;
