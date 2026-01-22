// React Native core
import { Text } from "react-native";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface VerticalWordButtonProps {
  text: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  desiredPage: string;
}
const VerticalWordButton: React.FC<VerticalWordButtonProps> = ({
  text,
  setCurrentPage,
  desiredPage,
}) => {
  return (
    <TouchableScale
      onPress={() => setCurrentPage(desiredPage)}
      className="bg-green/50 px-4 py-2 rounded-2xl flex-col justify-center"
    >
      {text.split("").map((char, index) => (
        <Text
          key={index}
          className="font-inter font-bold text-blue text-lg leading-[16px] text-center"
        >
          {char.toUpperCase()}
        </Text>
      ))}
    </TouchableScale>
  );
};

export default VerticalWordButton;
