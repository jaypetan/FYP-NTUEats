// React and React Native core
import { ActivityIndicator, View } from "react-native";

// External libraries
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";

// Styles
import "./global.css";

// Components
import SafeScreen from "@/app/components/SafeScreen";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Inter-Italic": require("../assets/fonts/Inter/Inter-Italic-VariableFont_opsz,wght.ttf"),
    Inter: require("../assets/fonts/Inter/Inter-VariableFont_opsz,wght.ttf"),
    "Koulen-Regular": require("../assets/fonts/Koulen/Koulen-Regular.ttf"),
    "Ranchers-Regular": require("../assets/fonts/Ranchers/Ranchers-Regular.ttf"),
  });

  // Show a loading indicator while fonts are loading
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ClerkProvider is required for login/authentication
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeScreen>
        <Slot />
      </SafeScreen>
    </ClerkProvider>
  );
}
