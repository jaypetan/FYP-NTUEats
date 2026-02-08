// React and React Native core imports
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Project components
import PriceRangeInput from "@/app/(admin)//components/PriceRangeInput";
import CheckboxInput from "@/app/(admin)/components/CheckboxInput";
import LabeledInput from "@/app/(admin)/components/LabeledInput";
import ImagePickerField from "@/app/components/ImagePickerField";
import TouchableScale from "@/app/components/TouchableScale";

// Project utilities
import { updateStallDietary } from "@/utils/dietaryServices";
import { addNewStall } from "@/utils/stallServices";

interface StallAddProps {
  setAdminCurrentPage: (page: string) => void;
}

const StallAdd: React.FC<StallAddProps> = ({ setAdminCurrentPage }) => {
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
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    // convert price_symbol number to string of $
    const price_symbol_sign = "$".repeat(Number(details.price_symbol));

    // Prepare updated details
    const updatedDetails = {
      ...details,
      price_symbol: price_symbol_sign,
    };

    const newStallId = await addNewStall(updatedDetails);
    console.log("New Stall ID:", newStallId);
    await updateStallDietary(newStallId, {
      halal: dietaryInfo.isHalal,
      vegetarian: dietaryInfo.isVegetarian,
    });
    Alert.alert("Stall Added Successfully");

    // Reset form
    setLoading(false);
    setDetails({
      name: "",
      description: "",
      location: "",
      price_symbol: "",
      stall_pic: "",
    });
    setDietaryInfo({
      isHalal: false,
      isVegetarian: false,
    });
    setAdminCurrentPage("default");
  };

  return (
    <View className="flex-col items-center h-[600px]">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        New Stall
      </Text>
      <ScrollView className="px-8 w-full">
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
        <ImagePickerField
          imageUri={details.stall_pic}
          onImagePicked={(uri: string) =>
            setDetails({ ...details, stall_pic: uri })
          }
          label="Stall Image"
          optional={false}
          textbold={false}
        />

        {/* Submit Button */}
        <TouchableScale onPress={handleSubmit} disabled={loading}>
          <Text className="py-2 mt-4 bg-green/80 rounded-full border-2 border-blue  text-center text-blue text-lg font-bold">
            {loading ? "Adding..." : "Add Stall"}
          </Text>
        </TouchableScale>
      </ScrollView>
    </View>
  );
};

export default StallAdd;
