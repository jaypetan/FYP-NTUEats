// React and React Native core
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";

// Components
import Animated, {
  FadeInLeft,
  FadeInRight,
  FadeOutLeft,
  FadeOutRight,
} from "react-native-reanimated";

// Utilities
import { fetchDietaryByStallId } from "@/utils/dietaryServices";
import { getStallDataById } from "@/utils/stallServices";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import MenuModal from "@/app/components/Stall/Menu/MenuModal";
import MenuUploadModal from "@/app/components/Stall/Menu/MenuUploadModal";
import PictureModal from "@/app/components/Stall/PictureModal";
import AddReviewPage from "@/app/components/Stall/Review/AddReviewPage";
import StallReviews from "@/app/components/Stall/Review/StallReviews";
import StallButtons from "@/app/components/Stall/StallButtons";
import StallHeader from "@/app/components/Stall/StallHeader";

export default function StallPage() {
  const { selectedId } = useAppContext();
  const [stallData, setStallData] = useState({
    name: "",
    description: "",
    location: "",
    price_symbol: "",
    stall_pic: "",
    dietry: {
      halal: false,
      vegetarian: false,
    },
  });

  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [pictureModalVisible, setPictureModalVisible] = useState(false);
  const [menuUploadModalVisible, setMenuUploadModalVisible] = useState(false);
  const [addReview, setAddReview] = useState(false);

  // Fetch stall data from selectedId
  useEffect(() => {
    getStallDataById(selectedId).then((data) => {
      if (data) {
        setStallData({
          ...stallData,
          name: data.name || "",
          description: data.description || "",
          location: data.location || "",
          price_symbol: data.price_symbol || "",
          stall_pic: data.stall_pic || "",
        });
      }
    });
    fetchDietaryByStallId(selectedId).then((dietaryInfo) => {
      if (dietaryInfo) {
        setStallData((prevData) => ({
          ...prevData,
          dietry: {
            halal: dietaryInfo.halal || false,
            vegetarian: dietaryInfo.vegetarian || false,
          },
        }));
      }
    });
  }, [selectedId]);

  return (
    <View>
      <MenuModal
        setMenuModalVisible={setMenuModalVisible}
        menuModalVisible={menuModalVisible}
        setMenuUploadModalVisible={setMenuUploadModalVisible}
      />
      <PictureModal
        setPictureModalVisible={setPictureModalVisible}
        pictureModalVisible={pictureModalVisible}
      />
      <MenuUploadModal
        setMenuModalVisible={setMenuModalVisible}
        setMenuUploadModalVisible={setMenuUploadModalVisible}
        menuUploadModalVisible={menuUploadModalVisible}
      />
      <StallHeader
        stallImage={stallData.stall_pic}
        stallName={stallData.name}
        stallLocation={stallData.location.toUpperCase()}
        halal={stallData.dietry.halal}
        vegetarian={stallData.dietry.vegetarian}
      />
      <View className="h-[55vh] w-full bg-cream pt-4 pb-8 px-8">
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={Keyboard.dismiss}
        >
          <StallButtons
            setMenuModalVisible={setMenuModalVisible}
            setPictureModalVisible={setPictureModalVisible}
            addReview={addReview}
            setAddReview={setAddReview}
            stallId={selectedId || ""}
          />
          {addReview ? (
            <Animated.View
              key="addReview"
              entering={FadeInRight.delay(150)}
              exiting={FadeOutRight}
            >
              <AddReviewPage setAddReview={setAddReview} />
            </Animated.View>
          ) : (
            <Animated.View
              key="stallReviews"
              entering={FadeInLeft.delay(150)}
              exiting={FadeOutLeft}
            >
              <StallReviews selectedId={selectedId} />
            </Animated.View>
          )}
          <View className="mt-8" />
        </ScrollView>
      </View>
    </View>
  );
}
