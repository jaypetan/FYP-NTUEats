// React and React Native
import { Text, View } from "react-native";

// External libraries
import {
  Feather,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

// App Context
import { useAppContext } from "@/app/components/AppContext";

interface ProfileReviewCommentsCardProps {
  comment: {
    review_pic: string | "";
    title: string;
    id: string;
    stall_name: string;
    likes: number;
    stall_id: string;
    formatted_date: string;
    user_id: string;
  };
  toggleModalVisibility: (type: string) => void;
}

const ProfileReviewCommentsCard: React.FC<ProfileReviewCommentsCardProps> = ({
  comment,
  toggleModalVisibility,
}) => {
  const { setSelectedId, setCurrentPage } = useAppContext();
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
        {comment.review_pic && (
          <View className="h-48 w-48 mb-4 border-2 border-blue rounded-xl overflow-hidden">
            <ImageLoader
              image={comment.review_pic}
              className="w-full h-48"
              loaderClassName="h-48"
            />
          </View>
        )}
        <View className="flex-row justify-between items-end">
          <Text className="text-gray-600">{comment.formatted_date}</Text>
          <View className="flex-row gap-2 items-center">
            <TouchableScale
              className="border-2 border-blue px-4 py-2 rounded-xl flex-row items-center gap-1"
              onPress={() => {
                handleEditPress();
              }}
            >
              <Text className="text-blue font-semibold">Edit</Text>
              <Feather name="edit" size={16} color="#264653" />
            </TouchableScale>
            <TouchableScale
              className="border-2 border-blue bg-green/50 px-4 py-2 rounded-xl flex-row items-center gap-1"
              onPress={() => {
                setSelectedId(comment.stall_id);
                setCurrentPage("stall-page");
              }}
            >
              <Text className="text-blue font-semibold">Stall</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={16}
                color="#264653"
              />
            </TouchableScale>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ProfileReviewCommentsCard;
