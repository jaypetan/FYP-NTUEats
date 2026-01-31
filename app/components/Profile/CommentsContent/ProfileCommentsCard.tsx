// React and React Native
import { Text, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileCommentsCardProps {
  comment: {
    comment_pic: string | "";
    content: string;
    id: string;
    title: string;
    likes: number;
    recipe_id: string;
    formatted_date: string;
    user_id: string;
  };
}

const ProfileCommentsCard: React.FC<ProfileCommentsCardProps> = ({
  comment,
}) => {
  return (
    <View className="bg-cream mb-4 py-4 px-6 rounded-2xl">
      {comment.comment_pic && (
        <ImageLoader
          image={comment.comment_pic}
          className="w-full h-48 rounded-2xl mb-4"
        />
      )}
      <View className="flex-col">
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-semibold text-blue">
            {comment.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg text-blue font-semibold">
              {comment.likes}
            </Text>
            <FontAwesome name="heart" size={16} color="red" />
          </View>
        </View>
        <Text className="text-blue text-lg mb-4">"{comment.content}"</Text>
        <View className="flex-row justify-between items-end">
          <Text className="text-gray-600">{comment.formatted_date}</Text>
          <TouchableScale
            className="border-2 border-blue px-4 py-1 rounded-xl"
            onPress={() => {}}
          >
            <Text className="text-blue font-semibold">Edit Recipe</Text>
          </TouchableScale>
        </View>
      </View>
    </View>
  );
};

export default ProfileCommentsCard;
