// React and React Native core
import { TouchableOpacity, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// App Context
import { useAppContext } from "@/app/components/AppContext";

interface ClosePageProps {
  right?: string;
}
const ClosePage: React.FC<ClosePageProps> = ({ right }) => {
  const { returnToPreviousPage } = useAppContext();
  return (
    <View className={`absolute top-0 ${right ? right : "right-0"} z-10`}>
      <TouchableOpacity
        className="flex-row items-center justify-center aspect-square border-4 border-white bg-red p-2 rounded-full "
        onPress={() => returnToPreviousPage()}
      >
        <FontAwesome name="times" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
export default ClosePage;
