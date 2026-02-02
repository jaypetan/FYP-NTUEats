// React and React Native
import { Text, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

// App Context
import { useAppContext } from "@/app/components/AppContext";

interface ProfileReviewCommentsCardProps {
  comment: {
    recipe_pic: string | "";
    title: string;
    id: string;
    stall_name: string;
    likes: number;
    recipe_id: string;
    formatted_date: string;
    user_id: string;
  };
  toggleModalVisibility: (type: string) => void;
}

const ProfileReviewCommentsCard: React.FC<ProfileReviewCommentsCardProps> = ({
  comment,
  toggleModalVisibility,
}) => {
  const { setSelectedId } = useAppContext();
  const handleEditPress = () => {
    toggleModalVisibility("review");
    setSelectedId(comment.id);
  };
  return (
    <View className="bg-cream mb-4 py-4 px-6 rounded-2xl border-2 border-blue">
      <View className="flex-col">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold text-blue max-w-72">
            {comment.stall_name}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg text-blue font-semibold">
              {comment.likes}
            </Text>
            <FontAwesome name="heart" size={16} color="red" />
          </View>
        </View>
        <Text className="text-blue text-lg mb-4 max-w-72">
          "{comment.title}"
        </Text>
        <View className="flex-row justify-between items-end">
          <Text className="text-gray-600">{comment.formatted_date}</Text>
          <TouchableScale
            className="border-2 border-blue px-4 py-2 rounded-xl"
            onPress={() => {
              handleEditPress();
            }}
          >
            <Text className="text-blue font-semibold">Edit</Text>
          </TouchableScale>
        </View>
      </View>
    </View>
  );
};

export default ProfileReviewCommentsCard;
