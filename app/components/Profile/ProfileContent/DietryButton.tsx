// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Utilities
import { editDietaryRestrictions } from "@/utils/userServices";

interface DietryButtonProps {
  icon?: React.ReactNode;
  label?: string;
  selected?: boolean;
  restriction?: string;
}
const DietryButton: React.FC<DietryButtonProps> = ({
  icon,
  label,
  selected,
  restriction,
}) => {
  const { user } = useUser();
  const [selectedState, setSelectedState] = useState(selected);
  const handlePress = () => {
    const newState = !selectedState;
    setSelectedState(newState);
    editDietaryRestrictions(user?.id!, restriction!, newState);
  };

  useEffect(() => {
    setSelectedState(selected);
  }, [selected]);

  return (
    <TouchableOpacity
      className={`p-3 rounded-2xl border-2 border-blue flex flex-row gap-2 ${
        selectedState ? "bg-green/50 " : "bg-darkcream/50"
      }`}
      onPress={handlePress}
    >
      {icon && icon}
      <Text className="text-xl text-blue">{label}</Text>
    </TouchableOpacity>
  );
};

export default DietryButton;
