// React and React Native
import { Text, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Components
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

// App Context
import { useAppContext } from "@/app/components/AppContext";

interface ProfileRecipeCardProps {
  recipe: {
    id: string;
    likes: number;
    cook_time: number;
    description: string;
    ingredients: string[];
    instructions: string[];
    recipe_pic: string;
    title: string;
    formatted_date: string;
  };
  toggleModalVisibility: (type: string) => void;
}

const ProfileRecipeCard: React.FC<ProfileRecipeCardProps> = ({
  recipe,
  toggleModalVisibility,
}) => {
  const { setSelectedId } = useAppContext();
  const handleEditPress = () => {
    toggleModalVisibility("recipe");
    setSelectedId(recipe.id);
  };
  return (
    <View className="bg-cream mb-4 py-4 px-6 rounded-2xl border-2 border-blue">
      <View className="flex-col">
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-semibold text-blue max-w-72">
            {recipe.title}
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-lg text-blue font-semibold">
              {recipe.likes}
            </Text>
            <FontAwesome name="heart" size={16} color="red" />
          </View>
        </View>
        <Text className="text-blue text-lg mb-4 max-w-72 leading-5 mt-2">
          "{recipe.description}"
        </Text>
        {recipe.recipe_pic && (
          <View className="h-48 w-48 mb-4 border-2 border-blue rounded-xl overflow-hidden">
            <ImageLoader
              image={recipe.recipe_pic}
              className="w-full h-48 mb-4 rounded-xl"
              loaderClassName="h-48"
            />
          </View>
        )}
        <View className="flex-row justify-between items-end">
          <Text className="text-blue text-lg">{recipe.formatted_date}</Text>
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

export default ProfileRecipeCard;
