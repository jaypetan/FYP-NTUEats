import { ScrollView, Text } from "react-native";

const RecipesContent = () => {
  return (
    <ScrollView className="pt-8 mt-4 bg-darkcream/80 w-full h-full rounded-3xl">
      <Text className="text-center text-4xl font-koulen text-blue mb-4 pt-4">
        Recipes
      </Text>
    </ScrollView>
  );
};

export default RecipesContent;
