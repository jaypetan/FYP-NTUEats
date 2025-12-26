import { Text, TextInput, TextInputProps } from "react-native";

type LabeledInputProps = {
  label: string;
} & TextInputProps;

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  ...props
}) => (
  <>
    <Text className="text-xl pt-2">{label}</Text>
    <TextInput
      className="px-4 py-2 border-2 border-blue mb-2"
      placeholderTextColor="#888"
      {...props}
    />
  </>
);
