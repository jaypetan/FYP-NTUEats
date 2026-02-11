// React and React Native core
import { useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// Assets
import EatWHATLogo from "@/assets/images/logos/EatWHAT-logo.png";

// Utilities
import { fetchDietaryByStallId } from "@/utils/dietaryServices";
import { getStallsArranged, searchStallsByName } from "@/utils/stallServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import StallCard from "@/app/components/EatWHAT/StallCard";
import StallFilter from "@/app/components/EatWHAT/StallFilter";
import HomeNav from "@/app/components/Home/HomeNav";
import LoadMore from "@/app/components/LoadMore";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import SearchBar from "@/app/components/SearchBar";
import Animated, {
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  FadeOutUp,
  LinearTransition,
} from "react-native-reanimated";

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
  const [arrangement, setArrangement] = useState<string>("most_saved");
  const [stallsShown, setStallsShown] = useState<number>(4);
  const [stallDataLength, setStallDataLength] = useState<number>(0);

  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
  const [restrictionsFilter, setRestrictionsFilter] = useState({
    canteen: "",
    vegetarian: false,
    halal: false,
  });

  const handleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  // Function to fetch stalls based on arrangement and limit
  const fetchStallFunction = async (
    arrangement: string,
    limitNumber: number
  ) => {
    const { data, length } = await getStallsArranged(
      arrangement,
      limitNumber,
      restrictionsFilter
    );
    // Fetch dietary info for each stall
    const updatedStalls = await Promise.all(
      data.map(async (stall) => {
        const dietaryInfo = await fetchDietaryByStallId(stall.id);
        return {
          ...stall,
          vegetarian: dietaryInfo?.vegetarian ?? false,
          halal: dietaryInfo?.halal ?? false,
        };
      })
    );
    setStallData(updatedStalls);
    setStallDataLength(length);
  };

  useEffect(() => {
    if (currentPage !== "eat-what") return;
    const stallsToShow = 4; // Reset stalls shown when leaving the page
    setStallsShown(stallsToShow);
    fetchStallFunction(arrangement, stallsToShow);
  }, [currentPage, arrangement, restrictionsFilter]);

  // Fetch more stalls
  const loadMoreStalls = () => {
    let newLimit = stallsShown + 2;
    if (newLimit > stallDataLength) {
      newLimit = stallDataLength;
    }
    setStallsShown(newLimit);
    fetchStallFunction(arrangement, newLimit);
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

  // Filter Functionality

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

            {/* Search Bar & Filter */}
            <SearchBar
              handleSearch={handleSearch}
              searchTerm={searchTerm}
              handleScroll={handleScroll}
              handleFilterDropdown={handleFilterDropdown}
            />
            {filterDropdown && (
              <Animated.View
                className="w-full"
                entering={FadeInUp}
                exiting={FadeOutUp}
              >
                <StallFilter
                  arrangement={arrangement}
                  setArrangement={setArrangement}
                  restrictionsFilter={restrictionsFilter}
                  setRestrictionsFilter={setRestrictionsFilter}
                />
              </Animated.View>
            )}

            {/* Stalls */}
            <View className="min-h-[50vh] flex-col gap-8 mt-8">
              {stallData.map((stall, index) => (
                <Animated.View
                  entering={FadeInRight.delay(100 + index * 100)}
                  exiting={FadeOutLeft}
                  layout={LinearTransition}
                  key={stall.id}
                >
                  <StallCard
                    key={index}
                    imageSource={stall.stall_pic}
                    title={stall.name}
                    location={stall.location}
                    description={stall.description}
                    priceSymbol={stall.price_symbol}
                    stallId={stall.id}
                    vegetarian={stall.vegetarian}
                    halal={stall.halal}
                  />
                </Animated.View>
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
