// React and React Native core
import { useCallback, useEffect, useRef, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

// Assets
import EatWHATLogo from "@/assets/images/logos/EatWHAT-logo.png";

// Utilities
import { fetchDietaryByStallId } from "@/utils/dietaryServices";
import { getStallsArranged, searchStallsByName } from "@/utils/stallServices";
import {
  fetchDietaryRestrictions,
  fetchUserByClerkId,
} from "@/utils/userServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";
import { useUser } from "@clerk/clerk-expo";

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
  const [arrangement, setArrangement] = useState<string>(""); // State for arrangement filter
  const [stallsShown, setStallsShown] = useState<number>(4); // Number of stalls currently shown
  const [stallDataLength, setStallDataLength] = useState<number>(0); // Total number of stalls available

  const [filterDropdown, setFilterDropdown] = useState<boolean>(false); // State for filter dropdown visibility
  const [restrictionsFilter, setRestrictionsFilter] = useState({
    canteen: "",
    vegetarian: false,
    halal: false,
  }); // State for dietary restrictions filter

  const [searchTerm, setSearchTerm] = useState<string>(""); // State for search term
  const [searchData, setSearchData] = useState<any[]>([]); // State for search results

  const handleFilterDropdown = () => {
    setFilterDropdown(!filterDropdown);
  };

  // Function to fetch user dietry restrictions
  const { user } = useUser();
  const fetchUserDietaryRestrictions = useCallback(async () => {
    if (!user) {
      console.error("User is not authenticated");
      return;
    }
    const userId = await fetchUserByClerkId(user?.id!);
    const restrictions = await fetchDietaryRestrictions(userId?.id!);
    if (restrictions.length > 0) {
      const userRestrictions = restrictions[0]; // Assuming one restriction document per user
      setRestrictionsFilter({
        canteen: "",
        vegetarian:
          "vegetarian" in userRestrictions
            ? userRestrictions.vegetarian
            : false,
        halal: "halal" in userRestrictions ? userRestrictions.halal : false,
      });
    } else {
      setRestrictionsFilter({
        canteen: "",
        vegetarian: false,
        halal: false,
      });
    }
  }, []);

  //Fetch restrictions on page load
  useEffect(() => {
    if (currentPage === "eat-what") {
      fetchUserDietaryRestrictions();
    }
  }, [currentPage]);

  // Function to fetch stalls based on arrangement and limit
  const fetchStallFunction = useCallback(
    async (arrangement: string, limitNumber: number) => {
      const { data, length } =
        searchData.length > 0 && searchTerm.trim() !== ""
          ? await getStallsArranged(
              arrangement,
              limitNumber,
              restrictionsFilter,
              searchData, // Pass search results for further filtering and arrangement
            )
          : await getStallsArranged(
              arrangement,
              limitNumber,
              restrictionsFilter,
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
        }),
      );
      setStallData(updatedStalls);
      setStallDataLength(length);
    },
    [arrangement, restrictionsFilter, searchData],
  );

  // Fetch stalls when arrangement or restrictions filter changes
  useEffect(() => {
    if (currentPage !== "eat-what") return;
    const stallsToShow = 4; // Reset stalls shown when leaving the page
    setStallsShown(stallsToShow);
    fetchStallFunction(arrangement, stallsToShow);
  }, [currentPage, arrangement, restrictionsFilter, searchData]);

  // Function to fetch more stalls
  const loadMoreStalls = () => {
    let newLimit = stallsShown + 2;
    if (newLimit > stallDataLength) {
      newLimit = stallDataLength; // Don't exceed total stalls available
    }
    setStallsShown(newLimit);
    fetchStallFunction(arrangement, newLimit);
  };

  // Search bar functionality
  const handleSearch = (query: string) => {
    setSearchTerm(query);
    // Implement search filtering logic here
    searchStallsByName(query).then((result) => {
      setSearchData(result?.data ?? []);
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
