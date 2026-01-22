// React and React Native core
import { Text, View } from "react-native";

interface RecipeStepsProps {
  steps: string[];
}

const RecipeSteps: React.FC<RecipeStepsProps> = ({ steps }) => {
  return (
    <>
      <Text className="text-3xl pt-2 font-koulen text-blue mt-4">
        Instructions ({steps.length} Steps):
      </Text>
      {steps.map((steps, index) => (
        <View key={index} className="flex-row items-start mb-2">
          <Text className="text-xl text-blue mr-2">Step {index + 1}:</Text>
          <Text className="text-xl text-blue flex-1">{steps}</Text>
        </View>
      ))}
    </>
  );
};

export default RecipeSteps;
