import TouchableScale from "@/app/components/TouchableScale";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface StallReviewHeaderProps {
  arrangement: string;
  setArrangement: (arrangement: string) => void;
}

const StallReviewHeader: React.FC<StallReviewHeaderProps> = ({
  arrangement,
  setArrangement,
}) => {
  return (
    <View className="flex-col items-center gap-1 mb-2">
      <View className="relative w-full">
        <Text className="text-blue font-bold text-3xl w-full text-center">
          Top Reviews
        </Text>
        <TouchableScale
          onPress={() => {
            setArrangement(
              arrangement === "most_liked" ? "most_recent" : "most_liked"
            );
          }}
          className="absolute right-4 justify-center p-2 rounded-full border-2 border-blue"
        >
          {arrangement === "most_liked" ? (
            <MaterialIcons
              name="swap-vert"
              size={24}
              color="#000"
              style={{ transform: [{ scaleX: -1 }] }}
            />
          ) : (
            <MaterialIcons name="swap-vert" size={24} color="#000" />
          )}
        </TouchableScale>
      </View>
      <Text className="text-blue text-center text-lg">
        {arrangement === "most_liked" ? "Most Liked" : "Most Recent"}
      </Text>
    </View>
  );
};

export default StallReviewHeader;
