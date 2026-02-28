// React and React Native core imports
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Project components
import ImageLoader from "@/app/components/ImageLoader";
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
    fetchStallData().then((response) => setStalls(response.data));
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
      { cancelable: true },
    );
  };

  return (
    <View className="flex-col items-center">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        Stall List
      </Text>
      <View className="h-5/6">
        <ScrollView>
          <View className="flex-row gap-4 flex-wrap justify-center">
            {stalls.map((stall) => (
              <View
                key={stall.id}
                className="w-44 bg-white rounded-lg p-4 my-2 flex-col border-2 justify-between border-blue"
              >
                <View className="flex-col gap-1">
                  <View className="w-36 h-24 mb-2 self-center rounded-md overflow-hidden">
                    <ImageLoader
                      image={stall.stall_pic}
                      className="w-36 h-24 rounded-md"
                      small
                    />
                  </View>
                  <Text className="font-semibold text-blue">{stall.name}</Text>
                  <Text className="text-blue text-sm leading-4 w-full text-start">
                    &quot;{stall.description}&quot;
                  </Text>
                  <Text className="text-blue text-sm leading-4 w-full text-start">
                    Price: {stall.price_symbol}
                  </Text>
                  <Text className="text-blue text-sm leading-4 w-full text-start">
                    Location: {stall.location}
                  </Text>
                </View>
                <View className="flex-row justify-between mt-4">
                  <TouchableScale onPress={() => editStall(stall.id)}>
                    <View className="rounded-2xl border-2 border-blue bg-green/80 px-4 py-2">
                      <FontAwesome name="edit" size={20} color="black" />
                    </View>
                  </TouchableScale>
                  <TouchableScale onPress={() => handleDelete(stall.id)}>
                    <View className="rounded-2xl border-2 border-blue bg-red px-4 py-2">
                      <FontAwesome name="trash" size={20} color="black" />
                    </View>
                  </TouchableScale>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default StallList;
