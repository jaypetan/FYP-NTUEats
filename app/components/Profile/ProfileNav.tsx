import React from "react";
import { Image, View } from "react-native";
import TouchableScale from "../TouchableScale";

interface ProfileNavProps {
  tabs: { key: string; logo: any }[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileNav: React.FC<ProfileNavProps> = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <View className="flex-row gap-4 items-end justify-center">
            {tabs.map((tab) => (
              <TouchableScale key={tab.key} onPress={() => setActiveTab(tab.key)}>
                <Image
                  source={tab.logo}
                  className={`${
                    activeTab === tab.key ? "h-24 p-3" : "h-16 p-2"
                  } border-blue border-2 aspect-square bg-cream/80 rounded-full`}
                  resizeMode="contain"
                />
              </TouchableScale>
            ))}
          </View>
    );
};

export default ProfileNav;