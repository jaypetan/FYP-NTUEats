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
        className="w-full h-48 "
        resizeMode="contain"
      />
      <Text className="font-inter text-lg text-blue text-center leading-6">
        Help us keep NTUeats accurate. Report closed stalls, recipe errors, or
        inappropriate content here.
      </Text>
    </View>
  );
};

export default ReportHeader;
