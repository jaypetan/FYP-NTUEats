// External libraries
import { SignedIn, SignedOut } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { View } from "react-native";

// App Context
import { useAppContext } from "../components/AppContext";

// Internal Components
import SignInScreen from "../(auth)/sign-in";
import MainPage from "./main-page";
import ProfilePage from "./profile-page";
import RecipePage from "./recipe-page";
import StallPage from "./stall-page";

// Navigation Component
import { useRef } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import ReanimatedDrawerLayout, {
  DrawerLayoutMethods,
  DrawerPosition,
  DrawerType,
} from "react-native-gesture-handler/ReanimatedDrawerLayout";
import NavPage from "./nav-page";

import Animated, { FadeOutRight, SlideInDown } from "react-native-reanimated";
import NavButton from "../components/Nav/NavButton";

export default function Page() {
  const { currentPage } = useAppContext();
  const [content, setContent] = useState(<MainPage />);
  const [page, setPage] = useState(1); // used to trigger re-render for animation

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
        setPage(2);
        break;
      case "profile-page":
        setContent(<ProfilePage />);
        setPage(2);
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
