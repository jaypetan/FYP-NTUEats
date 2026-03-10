import { Keyboard, TouchableWithoutFeedback, View } from "react-native";

// Components
import ReportForm from "@/app/components/Report/ReportForm";
import ReportHeader from "@/app/components/Report/ReportHeader";
import ClosePage from "../components/ClosePage";

export default function ReportPage() {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="h-full w-full bg-cream rounded-t-[4rem] px-8 pt-8 mt-8">
        <ClosePage right="right-2" />
        <ReportHeader />
        <ReportForm />
      </View>
    </TouchableWithoutFeedback>
  );
}
