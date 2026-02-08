import { Text, TextInput, View } from "react-native";

interface PriceRangeInputProps {
  value: string;
  onChangeText: (text: string) => void;
}

const PriceRangeInput: React.FC<PriceRangeInputProps> = ({
  value,
  onChangeText,
}) => (
  <>
    <Text className="text-xl pt-2">Price Range:</Text>
    <View className="flex-row items-center gap-4">
      <TextInput
        className="px-4 py-2 border-2 border-blue mb-2 w-32"
        keyboardType="numeric"
        maxLength={1}
        value={value}
        onChangeText={(text) => {
          if (/^[1-5]?$/.test(text)) {
            onChangeText(text);
          }
        }}
        placeholder="1-5"
        placeholderTextColor="#888"
      />
      {value ? (
        <Text className="text-xl pb-4">{"$".repeat(Number(value))}</Text>
      ) : null}
    </View>
  </>
);

export default PriceRangeInput;
