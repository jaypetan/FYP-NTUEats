// React and React Native core imports
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

// External libraries
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import Animated, { FadeOutRight, SlideInDown } from "react-native-reanimated";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Internal Components
import AdminPage from "@/app/(admin)/admin-page";
import SignInScreen from "@/app/(auth)/sign-in";
import MainPage from "@/app/(home)/main-page";
import NavPage from "@/app/(home)/nav-page";
import ProfilePage from "@/app/(home)/profile-page";
import RecipePage from "@/app/(home)/recipe-page";
import ReportPage from "@/app/(home)/report-page";
import StallPage from "@/app/(home)/stall-page";
import UploadRecipePage from "@/app/(home)/upload-recipe-page";
import NavButton from "@/app/components/Nav/NavButton";

export default function Page() {
  const { currentPage } = useAppContext();
  const [content, setContent] = useState(<MainPage />);
  const [page, setPage] = useState(1); // used to trigger re-render for animation

  // Drawer reference and gesture
  const drawerRef = useRef<DrawerLayoutMethods>(null);
  const tapGesture = Gesture.Tap()
    .runOnJS(true)
    .onStart(() => drawerRef.current?.openDrawer());
  const closeDrawer = () => drawerRef.current?.closeDrawer();

  // Update page shown based on currentPage
  useEffect(() => {
    switch (currentPage) {
      case "home-page":
        setContent(<MainPage />);
        setPage(1);
        break;
      case "stall-page":
        setContent(<StallPage />);
        setPage(2);
        break;
      case "recipe-page":
        setContent(<RecipePage />);
        setPage(3);
        break;
      case "profile-page":
        setContent(<ProfilePage />);
        setPage(4);
        break;
      case "admin-page":
        setContent(<AdminPage />);
        setPage(5);
        break;
      case "upload-recipe-page":
        setContent(<UploadRecipePage />);
        setPage(6);
        break;
      case "report-page":
        setContent(<ReportPage />);
        setPage(7);
        break;
      default:
        // home-page, eat-what, and cook-what will set to default
        setContent(<MainPage />);
        setPage(1);
    }
  }, [currentPage]);

  return (
    <View>
      {/* if signed in */}
      <SignedIn>
        {/* if admin, show admin page */}

        <View className="bg-red h-screen realtive pt-4">
          <ReanimatedDrawerLayout
            ref={drawerRef}
            renderNavigationView={() => <NavPage closeDrawer={closeDrawer} />}
            drawerPosition={DrawerPosition.LEFT}
            drawerType={DrawerType.SLIDE}
            overlayColor="rgba(0, 0, 0, 0)"
            drawerWidth={300}
          >
            <GestureDetector gesture={tapGesture}>
              <NavButton />
            </GestureDetector>
            <Animated.View
              key={page}
              entering={SlideInDown.duration(800)}
              exiting={FadeOutRight.duration(800)}
            >
              {content}
            </Animated.View>
          </ReanimatedDrawerLayout>
        </View>
      </SignedIn>

      {/* if signed out */}
      <SignedOut>
        <SignInScreen />
      </SignedOut>
    </View>
  );
}
