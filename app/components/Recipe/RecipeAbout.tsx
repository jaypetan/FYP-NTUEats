// React and React Native core
import React from "react";
import { Text, View } from "react-native";

// External libraries
import FontAwesome from "react-native-vector-icons/FontAwesome5";

interface RecipeAboutProps {
  desc: string;
  ingredients: string[];
}

const RecipeAbout: React.FC<RecipeAboutProps> = ({ desc, ingredients }) => {
  return (
    <>
      <View className="flex-row items-center gap-2">
        <FontAwesome name="file-alt" size={24} color="#323232" />
        <Text className="text-3xl pt-2 font-koulen text-blue mt-4">
          Description:
        </Text>
      </View>
      <Text className="text-xl text-blue">{desc}</Text>
      <View className="flex-row items-center mt-4 gap-2">
        <FontAwesome name="utensils" size={24} color="#323232" />
        <Text className="text-3xl pt-2 font-koulen text-blue mt-4">
          Ingredients:
        </Text>
      </View>
      {ingredients.map((ingredient, index) => (
        <Text key={index} className="text-xl text-blue">
          - {ingredient}
        </Text>
      ))}
    </>
  );
};

export default RecipeAbout;
