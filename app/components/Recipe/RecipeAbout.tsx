// React and React Native core
import React from "react";
import { Text, View } from "react-native";

// External libraries
import FontAwesome from "react-native-vector-icons/FontAwesome5";

interface RecipeAboutProps {
  chefName: string;
  cookingTime: string;
  desc: string;
  ingredients: string[];
}

const RecipeAbout: React.FC<RecipeAboutProps> = ({
  chefName,
  cookingTime,
  desc,
  ingredients,
}) => {
  const Title = ({ title, icon }: { title?: string; icon?: string }) => (
    <View className="flex-row items-center gap-2">
      {icon && <FontAwesome name={icon} size={24} color="#323232" />}
      {title && (
        <Text className="text-3xl pt-2 font-koulen text-blue mt-4">
          {title}
        </Text>
      )}
    </View>
  );
  return (
    <View className="flex-col gap-2">
      {/* Description & Cooking Time */}
      <View>
        <View className="flex-row justify-between">
          <Title title="Description" icon="file-alt" />
          {/* Cooking Time */}
          <View className="flex-row items-center gap-2">
            <Title icon="clock" />
            <Text className="text-xl text-blue">{cookingTime}</Text>
          </View>
        </View>
        <Text className="text-xl text-blue">{desc}</Text>
      </View>
      {/* Ingredients */}
      <View>
        <Title title="Ingredients" icon="utensils" />
        {ingredients.map((ingredient, index) => (
          <Text key={index} className="text-xl text-blue">
            - {ingredient}
          </Text>
        ))}
      </View>
      {/* Chef Name */}
      <View className="flex-row items-center self-end">
        <Title title={`By: ${chefName}`} />
      </View>
    </View>
  );
};

export default RecipeAbout;
