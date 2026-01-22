// React Native core
import { GestureHandlerRootView } from "react-native-gesture-handler";

// External libraries
import { Stack } from "expo-router/stack";

// App Context
import { AppProvider } from "@/app/components/AppContext";

export default function Layout() {
  return (
    <GestureHandlerRootView>
      {/* GestureHandlerRootView is to allow for swipe gestures */}
      <AppProvider>
        {/* AppProvider is to pass useContext to child components */}
        <Stack screenOptions={{ headerShown: false }} />
      </AppProvider>
    </GestureHandlerRootView>
  );
}
