// React and React Native core imports
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Project components
import { ImageLoader } from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

// Project utilities
import { fetchStallData } from "@/utils/stallServices";

interface StallListProps {
  setAdminCurrentPage: (page: string) => void;
  setPropId: (id: string) => void;
}

const StallList: React.FC<StallListProps> = ({
  setAdminCurrentPage,
  setPropId,
}) => {
  const [stalls, setStalls] = useState<any[]>([]);
  useEffect(() => {
    fetchStallData().then((data) => setStalls(data));
  }, []);

  const editStall = (stallId: string) => {
    setAdminCurrentPage("stall-edit");
    setPropId(stallId);
  };

  const handleDelete = (stallId: string) => {
    Alert.alert(
      "Delete Stall",
      "Are you sure you want to delete this stall?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Perform deletion logic here, for demonstration no action taken
            alert("Stall deleted successfully");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-col items-center">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        Stall List
      </Text>
      <View className="h-5/6">
        <ScrollView>
          {stalls.map((stall) => (
            <View
              key={stall.id}
              className="w-72 bg-white rounded-lg p-4 my-2 flex-col border-2 border-blue"
            >
              <View className="w-64 h-64 mb-2">
                <ImageLoader
                  image={stall.stall_pic}
                  className="w-64 h-64 rounded-md"
                  loaderClassName="absolute w-64 h-64 rounded-md"
                />
              </View>
              <Text className="text-lg font-semibold text-blue">
                {stall.name}
              </Text>
              <Text className="text-blue">
                Description: {stall.description}
              </Text>
              <Text className="text-blue">Price: {stall.price_symbol}</Text>
              <Text className="text-blue">Location: {stall.location}</Text>
              <View className="flex-row justify-between gap-2">
                <TouchableScale onPress={() => editStall(stall.id)}>
                  <View className="flex-row items-center gap-2 mt-2 rounded-2xl border-2 border-blue bg-green/80 px-4 py-2">
                    <Text>Edit</Text>
                    <FontAwesome name="edit" size={20} color="black" />
                  </View>
                </TouchableScale>
                <TouchableScale onPress={() => handleDelete(stall.id)}>
                  <View className="flex-row items-center gap-2 mt-2 rounded-2xl border-2 border-blue bg-red px-4 py-2">
                    <Text>Delete</Text>
                    <FontAwesome name="trash" size={20} color="black" />
                  </View>
                </TouchableScale>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default StallList;
