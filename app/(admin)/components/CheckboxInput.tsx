import { TextInputProps } from "react-native";
import { CheckBox } from "react-native-elements";

interface CheckboxInputProps extends TextInputProps {
  label: string;
  bool: boolean;
  setBool: (value: boolean) => void;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  label,
  bool,
  setBool,
  ...props
}) => (
  <>
    <CheckBox
      title={label}
      checked={bool}
      onPress={() => setBool(!bool)}
      checkedColor="#90BE6D" // Green when checked
      uncheckedColor="#264653"
      containerStyle={{
        backgroundColor: "transparent",
        borderWidth: 0,
        padding: 0,
      }}
      textStyle={{
        fontSize: 16,
        fontWeight: "bold",
        color: "#264653",
      }}
    />
  </>
);

export default CheckboxInput;
