// React and React Native core
import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";

interface DietryButtonProps {
  icon?: React.ReactNode;
  label?: string;
  selected?: boolean;
}
const DietryButton: React.FC<DietryButtonProps> = ({
  icon,
  label,
  selected,
}) => {
  const [selectedState, setSelectedState] = useState(selected);
  return (
    <TouchableOpacity
      className={`p-3 rounded-2xl border-2 border-blue flex flex-row gap-2 ${
        selectedState ? "bg-cream " : "bg-darkcream/50"
      }`}
      onPress={() => setSelectedState(!selectedState)}
    >
      {icon && icon}
      <Text className="text-xl text-blue">{label}</Text>
    </TouchableOpacity>
  );
};

export default DietryButton;
