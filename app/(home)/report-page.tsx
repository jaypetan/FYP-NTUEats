import { View } from "react-native";

// Components
import ReportForm from "@/app/components/Report/ReportForm";
import ReportHeader from "@/app/components/Report/ReportHeader";

export default function ReportPage() {
  return (
    <View className="h-full w-full bg-cream rounded-t-[4rem] px-8 pt-4 mt-8">
      <ReportHeader />
      <ReportForm />
    </View>
  );
}
