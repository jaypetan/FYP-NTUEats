// React Native core
import { Text, TouchableWithoutFeedback, View } from "react-native";

// Assets
import Subtract from "@/assets/design/Subtract.svg";

interface HomeNavProps {
  backgroundColor: string;
  backgroundColorHex: string;
  text: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  desiredPage: string;
  widthClass: string;
}

const HomeNav: React.FC<HomeNavProps> = ({
  backgroundColor,
  backgroundColorHex,
  text,
  setCurrentPage,
  desiredPage,
  widthClass,
}) => {
  return (
    <View className="w-full flex flex-col">
      <View className="flex flex-row h-14 justify-end items-end w-full">
        <Subtract color={backgroundColorHex} />
        <TouchableWithoutFeedback onPress={() => setCurrentPage(desiredPage)}>
          <View
            className={`${widthClass} rounded-tl-3xl p-4 pr-8 bg-${backgroundColor}`}
          >
            <Text className="text-right font-koulen text-2xl text-blue">
              {text}
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default HomeNav;
