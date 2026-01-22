// React and React Native core
import { Text, View } from "react-native";

// Components
import ClosePage from "@/app/components/ClosePage";
import { ImageLoader } from "@/app/components/ImageLoader";
import RecipeNav from "@/app/components/Recipe/RecipeNav";

interface RecipeHeaderProps {
  recipeImage: any;
  recipeName: string;
  page: string;
  setPage: (page: string) => void;
}

const RecipeHeader: React.FC<RecipeHeaderProps> = ({
  recipeImage,
  recipeName,
  page,
  setPage,
}) => {
  return (
    <View>
      <ClosePage right={"right-6"} />
      <View className="mx-8 aspect-square bg-green rounded-t-[4rem] pt-12 px-8 relative">
        <ImageLoader
          image={recipeImage}
          className="w-full h-full rounded-t-[2rem]"
          loaderClassName="absolute w-full h-full"
        />
        <Text className="absolute font-koulen bg-red/90 px-4 text-3xl pt-6 top-12 left-8 w-full rounded-t-[2rem] text-center text-cream">
          {recipeName}
        </Text>
      </View>
      <RecipeNav page={page} setPage={setPage} />
    </View>
  );
};

export default RecipeHeader;
