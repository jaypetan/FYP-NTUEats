// React and React Native core
import { useEffect, useState } from "react";
import { Keyboard, ScrollView, View } from "react-native";

// Utilities
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
          name: data.name || "",
          description: data.description || "",
          location: data.location || "",
          price_symbol: data.price_symbol || "",
          stall_pic: data.stall_pic || "",
        });
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
            <AddReviewPage setAddReview={setAddReview} />
          ) : (
            <StallReviews selectedId={selectedId} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
