// React and React Native core
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";

// External libraries
import { useUser } from "@clerk/clerk-expo";

// Utilities
import {
  editDietaryRestrictions,
  fetchUserByClerkId,
} from "@/utils/userServices";
import { useAppContext } from "../../AppContext";

interface DietryButtonProps {
  icon?: React.ReactNode;
  label?: string;
  restriction?: string;
}
const DietryButton: React.FC<DietryButtonProps> = ({
  icon,
  label,
  restriction, // "vegetarian" or "halal"
}) => {
  const { user } = useUser();
  const { restrictions, setRestrictions } = useAppContext();

  // Local state to manage button selection
  const [selectedState, setSelectedState] = useState(
    restrictions[restriction as keyof typeof restrictions],
  );

  const handlePress = async () => {
    const newState = !selectedState;
    const userId = await fetchUserByClerkId(user?.id!);
    editDietaryRestrictions(userId ? userId.id : "", restriction!, newState); // Update backend

    // Update local state
    setSelectedState(newState);

    // Update context state
    setRestrictions((prev) => {
      const newRestrictions = { ...prev };
      if (restriction === "vegetarian") {
        newRestrictions.vegetarian = newState;
      } else if (restriction === "halal") {
        newRestrictions.halal = newState;
      }
      return newRestrictions;
    });
  };

  useEffect(() => {
    setSelectedState(restrictions[restriction as keyof typeof restrictions]);
  }, [restrictions, restriction]);

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
