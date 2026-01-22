// React and React Native core
import { Text, TextInput, TextInputProps, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  h24?: boolean; // prop to set height to 24 for multiline inputs
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  h24,
  ...rest
}) => {
  return (
    <View>
      <Text className="mb-2 text-blue text-xl text-left font-bold">
        {label}
      </Text>
      <TextInput
        className={`text-blue text-lg font-semibold border-2 border-blue leading-5 p-3 rounded-xl 
        ${h24 ? "h-24" : ""}`}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="gray"
        {...rest} // Spread additional props
      />
    </View>
  );
};

export default InputField;
