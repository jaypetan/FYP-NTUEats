import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import EatWHATLogo from "@/assets/images/logos/EatWHAT-logo.png";
import { Image, Text, View } from "react-native";
import { useAppContext } from "../AppContext";
import SearchBar from "../EatWHAT/SearchBar";
import StallCard from "../EatWHAT/StallCard";
import HomeNav from "../Home/HomeNav";

import { useEffect, useState } from "react";

// Firebase Services
import { fetchStallData } from "@/utils/stallServices";

interface EatWhatProps {
  backgroundColor: string;
  backgroundColorHex: string;
  widthClass: string;
}

export default function EatWhat({
  backgroundColor,
  backgroundColorHex,
  widthClass,
}: EatWhatProps) {
  const { currentPage, setCurrentPage } = useAppContext();

  // Fetch stall data from Firebase Firestore
  const [stallData, setStallData] = useState<any[]>([]);

  useEffect(() => {
    if (currentPage !== "eat-what") return;
    console.log("Fetching stall data...");
    fetchStallData().then((data) => {
      setStallData(data);
    });
  }, [currentPage]);

  // TODO: Add search bar functionality
  return (
    <View className="h-full w-full flex-col">
      <HomeNav
        backgroundColor={backgroundColor}
        backgroundColorHex={backgroundColorHex}
        text="EatWHAT"
        setCurrentPage={setCurrentPage}
        desiredPage="eat-what"
        widthClass={widthClass}
      />
      {currentPage !== "eat-what" ? (
        <View
          className={`bg-${backgroundColor} min-h-[80vh] rounded-tl-3xl w-full`}
        />
      ) : (
        <View className={`bg-${backgroundColor} pt-8 rounded-tl-3xl`}>
          <OptimizedScrollView
            className={`bg-${backgroundColor} min-h-[80vh] px-8`}
          >
            <View className="flex-row gap-2 mt-4 mb-2 justify-center">
              <Image
                source={EatWHATLogo}
                className="w-40 h-40"
                resizeMode="contain"
              />
            </View>
            <Text className="text-4xl font-koulen pt-4 text-blue">
              What are we eating today?
            </Text>
            <SearchBar />
            {stallData.map((stall, index) => (
              <StallCard
                key={index}
                imageSource={stall.stall_pic}
                title={stall.name}
                location={stall.location}
                description={stall.description}
                priceSymbol={stall.price_symbol}
                stallId={stall.id}
              />
            ))}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
