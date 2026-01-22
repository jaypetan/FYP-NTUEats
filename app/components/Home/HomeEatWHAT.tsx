// React and React Native core
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// External libraries
import Animated, { FadeOut } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

// Assets
import EatWHATLogo from "@/assets/images/logos/EatWHAT-logo.png";

// Utilities
import { fetchTopReviewImageByStallId } from "@/utils/reviewServices";
import { fetchStallData } from "@/utils/stallServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import FoodCard from "@/app/components/Home/HomeEatWHAT/FoodCard";
import VerticalWordButton from "@/app/components/Home/SharedComponents/VerticalWordButton";

const HomeEatWHAT = () => {
  const { setCurrentPage } = useAppContext();
  const [swiped, setSwiped] = useState(false); // To remove instructions after swipe
  const [stallData, setStallData] = useState<any[]>([]);

  useEffect(() => {
    // Fetch only 4 stalls
    fetchStallData(4).then(async (data) => {
      // Fetch review images for each stall
      const stallsWithImages = await Promise.all(
        data.map(async (stall) => {
          const reviewImage = await fetchTopReviewImageByStallId(stall.id);
          return { ...stall, reviewImage };
        })
      );
      setStallData(stallsWithImages);
    });
  }, []);

  return (
    <View className="mt-8">
      <View className="flex-row items-end gap-4">
        <Text className="text-4xl font-ranchers text-blue">What To Eat?</Text>
        <Image
          source={EatWHATLogo}
          className="w-48 h-40"
          resizeMode="contain"
        />
      </View>
      <ScrollView
        className="w-full mt-4"
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        onScroll={() => setSwiped(true)}
      >
        {stallData.map((stall) => (
          <FoodCard
            key={stall.id}
            imageSource={stall.reviewImage}
            stallImage={stall.stall_pic}
            stallName={stall.name}
            canteenName={stall.location}
            storeId={stall.id}
          />
        ))}
        <VerticalWordButton
          text="More Options"
          setCurrentPage={setCurrentPage}
          desiredPage={"eat-what"}
        />
      </ScrollView>
      {!swiped && (
        <Animated.View
          className="absolute -bottom-8 right-0 flex-row items-center"
          exiting={FadeOut.duration(1000)}
        >
          <Text className="font-inter text-blue text-sm">
            Swipe for more options
          </Text>
          <MaterialCommunityIcons
            name="gesture-swipe-right"
            size={24}
            color={"gray"}
          />
        </Animated.View>
      )}
    </View>
  );
};

export default HomeEatWHAT;
