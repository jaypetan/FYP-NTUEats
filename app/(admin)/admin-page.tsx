import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, { FadeInLeft, FadeOutRight } from "react-native-reanimated";
import TouchableScale from "../components/TouchableScale";

// Internal Components
import AdminDefault from "./admin-default";
import StallAdd from "./stall/stall-add";
import StallEdit from "./stall/stall-edit";
import StallList from "./stall/stall-list";

export default function AdminPage() {
  const [adminCurrentPage, setAdminCurrentPage] = useState("default");
  const [propId, setPropId] = useState(""); // to pass ids to edit page
  const [content, setContent] = useState(
    <AdminDefault setAdminCurrentPage={setAdminCurrentPage} />
  );
  const [page, setPage] = useState(1); // used to trigger re-render for animation

  // Update page shown based on currentPage
  useEffect(() => {
    switch (adminCurrentPage) {
      case "stall-add":
        setContent(<StallAdd setAdminCurrentPage={setAdminCurrentPage} />);
        setPage(1);
        break;
      case "stall-list":
        // Pass setPropId to allow setting propId when navigating to edit page
        setContent(
          <StallList
            setAdminCurrentPage={setAdminCurrentPage}
            setPropId={setPropId}
          />
        );
        setPage(1);
        break;
      case "stall-edit":
        // Use propId to identify which stall to edit
        setContent(
          <StallEdit
            setAdminCurrentPage={setAdminCurrentPage}
            propId={propId}
          />
        );
        setPage(2);
        break;
      default:
        setContent(<AdminDefault setAdminCurrentPage={setAdminCurrentPage} />);
        setPage(0);
    }
  }, [adminCurrentPage]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="h-full w-full items-center bg-cream mt-4 rounded-3xl relative">
        <Text className="font-koulen text-3xl pt-4 px-4 mt-8 mb-4 text-blue border-b-2 border-blue">
          Admin Page
        </Text>
        {adminCurrentPage !== "default" && (
          <TouchableScale
            onPress={() => setAdminCurrentPage("default")}
            className="absolute top-6 left-8"
          >
            <FontAwesome
              name="reply"
              size={24}
              color="black"
              className="rounded-full p-2 border-blue border-2"
            />
          </TouchableScale>
        )}
        <Animated.View key={page} entering={FadeInLeft} exiting={FadeOutRight}>
          {content}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}
