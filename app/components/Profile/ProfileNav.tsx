// React and React Native core
import { Image, View } from "react-native";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface ProfileNavProps {
  tabs: { key: string; logo: any }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileNav: React.FC<ProfileNavProps> = ({
  tabs,
  activeTab,
  setActiveTab,
}) => {
  return (
    <View className="flex-row gap-4 items-end justify-center">
      {tabs.map((tab) => (
        <TouchableScale
          key={tab.key}
          onPress={() => setActiveTab(tab.key)}
          className="border-blue border-2 aspect-square bg-cream/80 rounded-full"
        >
          <Image
            source={tab.logo}
            className={`${
              activeTab === tab.key ? "h-24 p-3" : "h-16 p-2"
            } aspect-square`}
            resizeMode="contain"
          />
        </TouchableScale>
      ))}
    </View>
  );
};

export default ProfileNav;
