// React and React Native
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileCommentsHeaderProps {
  pageInfo: string;
  handlePageInfoChange: () => void;
}

const ProfileCommentsHeader: React.FC<ProfileCommentsHeaderProps> = ({
  pageInfo,
  handlePageInfoChange,
}) => {
  return (
    <View className="flex-col items-start mb-8 w-full">
      <View className="flex-row items-center gap-1">
        <Animatable.Text
          animation="bounceInLeft"
          duration={400}
          key={pageInfo}
          className="text-center text-4xl font-koulen text-blue pt-4"
        >
          {pageInfo === "comments" ? "Comments" : "Reviews"}
        </Animatable.Text>
        <Animatable.Text
          animation="bounceInLeft"
          duration={400}
          key={pageInfo + "sub"}
          className="text-center text-xl text-blue"
        >
          on {pageInfo === "comments" ? "recipes" : "stalls"}
        </Animatable.Text>
      </View>
      <View className="">
        <TouchableScale
          className="rounded-2xl border-2 border-blue px-4 py-1 flex-row items-center gap-2 bg-green/50"
          onPress={() => {
            handlePageInfoChange();
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
