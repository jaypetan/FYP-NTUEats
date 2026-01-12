import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface StallReviewCardProps {
  reviewName: string;
  reviewDate: string;
  reviewImage?: any;
  reviewTitle: string;
  reviewDescription: string;
  reviewLikes: number;
}
const StallReviewCard = ({
  reviewName,
  reviewDate,
  reviewImage,
  reviewTitle,
  reviewDescription,
  reviewLikes,
}: StallReviewCardProps) => {
  const [like, setLike] = useState(false);
  return (
    <View
      className={`bg-green/50 rounded-xl p-4 flex-row gap-4
      }`}
    >
      {reviewImage && (
        <Image
          source={{ uri: reviewImage }}
          resizeMode="cover"
          className="w-28 rounded-2xl h-48"
        />
      )}
      <View
        className={`flex-col ${
          reviewImage ? "w-60" : " w-full"
        } justify-between gap-4`}
      >
        <View>
          <View className="flex-row justify-between">
            <View className="flex-row gap-2 items-baseline">
              <FontAwesome name="user" size={16} color="#323232" />
              <Text className="font-inter text-lg font-semibold text-blue">
                {reviewName}
              </Text>
            </View>
            <Text className="font-inter text-lg text-blue">{reviewDate}</Text>
          </View>
          <Text
            className="text-blue font-inter font-bold text-lg mt-2"
            numberOfLines={1}
          >
            {reviewTitle}
          </Text>
          <Text
            className="text-blue font-inter text-sm"
            numberOfLines={reviewImage ? 4 : 3}
          >
            {reviewDescription}
          </Text>
        </View>
        <View className="flex-row gap-2 items-center justify-end">
          <Text className="font-inter text-lg font-semibold text-blue">
            {reviewLikes}
          </Text>
          <TouchableOpacity onPress={() => setLike(!like)}>
            {like ? (
              <FontAwesome name="heart" size={20} color="red" />
            ) : (
              <FontAwesome name="heart-o" size={20} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default StallReviewCard;
