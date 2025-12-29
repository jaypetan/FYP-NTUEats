import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import { useRef } from "react";
import { Text, View } from "react-native";
import { useAppContext } from "../AppContext";
import SearchBar from "../EatWHAT/SearchBar";
import StallCard from "../EatWHAT/StallCard";
import HomeNav from "../Home/HomeNav";

import { useEffect, useState } from "react";

// Firebase Services
import { fetchStallData } from "@/utils/stallServices";
import Loader from "../Loader";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentPage !== "eat-what") return;
    setLoading(true);
    imagesLoaded.current = 0;
    console.log("Fetching stall data...");
    fetchStallData().then((data) => {
      setStallData(data);
      if (data.length === 0) setLoading(false);
    });
  }, [currentPage]);

  // Handle image load for all stall cards
  const imagesLoaded = useRef(0);

  const handleImageLoad = () => {
    imagesLoaded.current += 1;
    if (imagesLoaded.current >= stallData.length) {
      console.log("All images loaded");
      setLoading(false);
    }
  };

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
          {loading && <Loader />}
          <View className={`${loading ? "opacity-0" : ""}`}>
            <OptimizedScrollView
              className={`bg-${backgroundColor} min-h-[80vh] px-8`}
            >
              <Text className="text-4xl font-koulen pt-8 text-blue">
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
                  onImageLoad={handleImageLoad}
                />
              ))}
              <Text className="py-24" />
            </OptimizedScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
