// React and React Native
import { Text, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileCommentsHeaderProps {
  pageInfo: string;
  setPageInfo: (info: string) => void;
}

const ProfileCommentsHeader: React.FC<ProfileCommentsHeaderProps> = ({
  pageInfo,
  setPageInfo,
}) => {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <View className="flex-row items-center gap-1">
        <Text className="text-center text-4xl font-koulen text-blue pt-4">
          {pageInfo === "comments" ? "Comments" : "Reviews"}
        </Text>
        <Text className="text-center text-xl text-blue">
          on {pageInfo === "comments" ? "recipes" : "stalls"}
        </Text>
      </View>
      <View className="">
        <TouchableScale
          className="rounded-2xl border-2 border-blue px-4 py-1 flex-row items-center gap-2 mb-4 bg-green/50"
          onPress={() => {
            setPageInfo(pageInfo === "comments" ? "reviews" : "comments");
          }}
        >
          <FontAwesome name="exchange" size={16} color="#264653" />
          <Text className="text-center text-lg text-blue font-semibold">
            {pageInfo === "comments" ? "Reviews" : "Comments"}
          </Text>
        </TouchableScale>
      </View>
    </View>
  );
};

export default ProfileCommentsHeader;
