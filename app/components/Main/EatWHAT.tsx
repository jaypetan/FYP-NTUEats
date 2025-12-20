import OptimizedScrollView from "@/app/components/OptimizedScrollView";
import Stall3 from "@/assets/sample-data/eat/stall-can11-malayfood.jpeg";
import Stall1 from "@/assets/sample-data/eat/stall-can11-sichuanmeishi.jpeg";
import Stall2 from "@/assets/sample-data/eat/stall-can9-jiulixiang.jpeg";
import Stall4 from "@/assets/sample-data/eat/stall-can9-localspecialties.jpeg";
import { Text, View } from "react-native";
import { useAppContext } from "../AppContext";
import SearchBar from "../EatWHAT/SearchBar";
import StallCard from "../EatWHAT/StallCard";
import HomeNav from "../Home/HomeNav";

import { useEffect, useState } from "react";

// Firebase imports
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";

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
  const fetchStallData = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "stalls"));
      const stallsData = querySnapshot.docs.map((doc) => doc.data());
      setStallData(stallsData);
    } catch (error) {
      console.error("Error fetching stall data: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStallData();
  }, []);

  // TODO: Add search bar functionality

  // TODO: Replace with actual data
  const stalls = [
    {
      imageSource: Stall1,
      title: "Si Chuan Mei Shi",
      location: "CAN 11",
      description: "sour fish soup, double cooked pork ...",
      priceSymbol: "$$",
    },
    {
      imageSource: Stall2,
      title: "Jiu Li Xiang",
      location: "CAN 9",
      description: "braised pork rice, oyster omelette ...",
      priceSymbol: "$$",
    },
    {
      imageSource: Stall3,
      title: "Malay Food",
      location: "CAN 11",
      description: "nasi lemak, mee goreng ...",
      priceSymbol: "$",
    },
    {
      imageSource: Stall4,
      title: "Local Specialties",
      location: "CAN 9",
      description: "cai fan, fried rice ...",
      priceSymbol: "$",
    },
  ];

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
                priceSymbol={stall.priceSymbol}
              />
            ))}
            {stalls.map((stall, index) => (
              <StallCard
                key={index}
                imageSource={stall.imageSource}
                title={stall.title}
                location={stall.location}
                description={stall.description}
                priceSymbol={stall.priceSymbol}
              />
            ))}
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
