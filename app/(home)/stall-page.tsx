import { ScrollView, Text, View } from "react-native";
import StallButtons from "../components/Stall/StallButtons";
import StallHeader from "../components/Stall/StallHeader";
import StallReviews from "../components/Stall/StallReviews";

import { getStallDataById } from "@/utils/stallServices";
import { useEffect, useState } from "react";
import { useAppContext } from "../components/AppContext";

import MenuModal from "../components/Stall/MenuModal";

export default function StallPage() {
  const { selectedId } = useAppContext();
  const [stallData, setStallData] = useState({
    name: "",
    description: "",
    location: "",
    price_symbol: "",
    stall_pic: "",
  });

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [pictureModalVisible, setPictureModalVisible] = useState(false);

  // Fetch stall data from selectedId
  useEffect(() => {
    getStallDataById(selectedId).then((data) => {
      if (data) {
        setStallData({
          name: data.name || "",
          description: data.description || "",
          location: data.location || "",
          price_symbol: data.price_symbol || "",
          stall_pic: data.stall_pic || "",
        });
        console.log("Stall data fetched for ID:", selectedId);
      }
    });
  }, [selectedId]);

  return (
    <View>
      <MenuModal
        setMenuModalVisible={setMenuModalVisible}
        menuModalVisible={menuModalVisible}
      />
      <StallHeader
        stallImage={stallData.stall_pic}
        stallName={stallData.name}
        stallLocation={stallData.location.toUpperCase()}
      />
      <View className="h-[55vh] w-full bg-cream pt-4 px-8">
        <ScrollView showsVerticalScrollIndicator={false}>
          <StallButtons setMenuModalVisible={setMenuModalVisible} />
          <StallReviews />
          <Text className="py-8" />
        </ScrollView>
      </View>
    </View>
  );
}
