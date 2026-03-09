import { Image, Text, View } from "react-native";

// Assets
import ReportLogo from "@/assets/images/logos/Report-logo.png";

const ReportHeader = () => {
  return (
    <View>
      <Text className="font-koulen text-4xl text-blue pt-4 text-center">
        Report Page
      </Text>
      <Image
        source={ReportLogo}
        className="w-full h-48 mb-4"
        resizeMode="contain"
      />
      <Text className="font-inter text-xl text-blue text-center">
        You can report any issues, bug or information that requires updating
        here.
      </Text>
    </View>
  );
};

export default ReportHeader;
