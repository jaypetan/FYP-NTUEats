// React and React Native core
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// Assets
import EatWHATLogo from "@/assets/images/logos/EatWHAT-logo.png";

// Utilities
import { fetchStallData, searchStallsByName } from "@/utils/stallServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import StallCard from "@/app/components/EatWHAT/StallCard";
import HomeNav from "@/app/components/Home/HomeNav";
import LoadMore from "@/app/components/LoadMore";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import SearchBar from "@/app/components/SearchBar";

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
  const [stallsShown, setStallsShown] = useState<number>(4);
  const [stallDataLength, setStallDataLength] = useState<number>(0);

  // Fetch stall data function
  const fetchStallFunction = (limitNumber: number) => {
    fetchStallData().then(({ data, length }) => {
      setStallData(data);
      setStallDataLength(length);
    });
  };
  useEffect(() => {
    if (currentPage !== "eat-what") return;
    setStallsShown(4); // Reset stalls shown when leaving the page
    fetchStallFunction(stallsShown);
  }, [currentPage]);

  // Fetch more stalls
  const loadMoreStalls = () => {
    const newLimit = stallsShown + 4;
    setStallsShown(newLimit);
    fetchStallFunction(newLimit);
  };

  // Search bar functionality
  const [searchTerm, setSearchTerm] = useState<string>("");
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Implement search filtering logic here
    searchStallsByName(query).then((data) => {
      setStallData(data);
    });
  };

  // ScrollView reference for scrolling to top on search
  const scrollViewRef = useRef<ScrollView>(null);
  const handleScroll = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 200, animated: true });
    }
  };

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
            ref={scrollViewRef}
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
            <SearchBar
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
            />
            <View className="min-h-[50vh] flex-col gap-4 mt-6">
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
            </View>
            {stallDataLength > stallsShown && (
              <LoadMore onClick={loadMoreStalls} />
            )}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
