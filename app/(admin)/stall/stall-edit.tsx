// React and React Native core imports
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// External libraries
import * as ImagePicker from "expo-image-picker";

// Project components
import PriceRangeInput from "@/app/(admin)//components/PriceRangeInput";
import CheckboxInput from "@/app/(admin)/components/CheckboxInput";
import LabeledInput from "@/app/(admin)/components/LabeledInput";
import ImageLoader from "@/app/components/ImageLoader";
import TouchableScale from "@/app/components/TouchableScale";

// Utilities
import {
  fetchDietaryByStallId,
  updateStallDietary,
} from "@/utils/dietaryServices";
import { getStallDataById, updateStallById } from "@/utils/stallServices";

interface StallEditProps {
  setAdminCurrentPage: (page: string) => void;
  propId?: string;
}
const StallEdit: React.FC<StallEditProps> = ({
  setAdminCurrentPage,
  propId,
}) => {
  const [details, setDetails] = useState({
    name: "",
    description: "",
    location: "",
    price_symbol: "",
    stall_pic: "",
  });
  const [dietaryInfo, setDietaryInfo] = useState({
    isHalal: false,
    isVegetarian: false,
  });

  // Fetch existing stall details from propId
  useEffect(() => {
    if (propId) {
      getStallDataById(propId).then((data) => {
        if (data) {
          setDetails({
            name: data.name,
            description: data.description,
            location: data.location,
            price_symbol: data.price_symbol
              ? (data.price_symbol.split("$").length - 1).toString()
              : "",
            stall_pic: data.stall_pic,
          });
        }
      });
      fetchDietaryByStallId(propId).then((dietaryData) => {
        if (dietaryData) {
          setDietaryInfo({
            isHalal: dietaryData.halal ? true : false,
            isVegetarian: dietaryData.vegetarian ? true : false,
          });
        }
      });
    }
  }, [propId]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDetails({ ...details, stall_pic: result.assets[0].uri });
    }
  };

  const handleSubmit = async () => {
    // Validate inputs
    if (
      !details.name.trim() ||
      !details.location.trim() ||
      !details.description.trim() ||
      !details.price_symbol ||
      !details.stall_pic
    ) {
      Alert.alert("Missing Detail Information");
      return;
    }

    // convert price_symbol number to string of $
    const price_symbol_sign = "$".repeat(Number(details.price_symbol));

    // Prepare updated details
    const updatedDetails = {
      ...details,
      price_symbol: price_symbol_sign,
    };

    // update stall
    updateStallById(propId!, updatedDetails);
    // update dietary info
    updateStallDietary(propId!, {
      halal: dietaryInfo.isHalal,
      vegetarian: dietaryInfo.isVegetarian,
    });
    Alert.alert("Stall Updated Successfully");

    // Navigate back to stall list
    setAdminCurrentPage("stall-list");
  };

  return (
    <View className="flex-col items-center h-[600px]">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        Edit Stall
      </Text>
      <ScrollView className="px-4 w-full">
        <LabeledInput
          label="Stall Name"
          maxLength={30}
          value={details.name}
          onChangeText={(text) => setDetails({ ...details, name: text })}
          placeholder="stall name"
        />
        <LabeledInput
          label="Location"
          maxLength={30}
          value={details.location}
          onChangeText={(text) => setDetails({ ...details, location: text })}
          placeholder="location name"
        />
        <LabeledInput
          label="Description"
          maxLength={100}
          value={details.description}
          onChangeText={(text) => setDetails({ ...details, description: text })}
          placeholder="types of food served"
          multiline
        />
        <PriceRangeInput
          value={details.price_symbol}
          onChangeText={(text) =>
            setDetails({ ...details, price_symbol: text })
          }
        />

        {/* Dietary Restrictions */}
        <View className="flex-col">
          <Text className="text-xl pt-2">Dietary Restrictions</Text>
          <CheckboxInput
            label="Halal"
            bool={dietaryInfo.isHalal}
            setBool={() => {
              setDietaryInfo({ ...dietaryInfo, isHalal: !dietaryInfo.isHalal });
            }}
          />
          <CheckboxInput
            label="Vegetarian"
            bool={dietaryInfo.isVegetarian}
            setBool={() => {
              setDietaryInfo({
                ...dietaryInfo,
                isVegetarian: !dietaryInfo.isVegetarian,
              });
            }}
          />
        </View>

        {/* Image Upload */}
        <Text className="text-xl pt-2">Stall Image</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mb-2 overflow-hidden"
        >
          <ImageLoader
            image={details.stall_pic}
            className="absolute w-64 h-64"
            loaderClassName="w-64 h-64"
          />
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableScale onPress={handleSubmit}>
          <Text className="py-2 mt-4 bg-green/80 rounded-full border-2 border-blue  text-center text-blue text-lg font-bold">
            Confirm Edit
          </Text>
        </TouchableScale>
      </ScrollView>
    </View>
  );
};
export default StallEdit;
