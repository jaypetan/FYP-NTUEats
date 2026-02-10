// React and React Native core
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// External libraries
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SafeScreen = ({ children }: { children: React.ReactNode }) => {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
        }}
      >
        {children}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SafeScreen;
