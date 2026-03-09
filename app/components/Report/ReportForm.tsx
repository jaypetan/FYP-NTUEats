import { TextInput, View } from "react-native";

const ReportForm = () => {
  return (
    <View className="flex-1 mt-4">
      {/* Form fields for reporting */}
      <TextInput
        placeholder="E.g. {name of stall} in hall XX canteen no longer exist"
        placeholderTextColor="#888"
        className="border-2 border-blue rounded-lg p-4 text-blue"
        multiline
      />
    </View>
  );
};

export default ReportForm;
