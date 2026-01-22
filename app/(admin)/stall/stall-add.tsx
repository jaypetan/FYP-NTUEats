// React and React Native core imports
import { useState } from "react";
import { Alert, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

// Project components
import PriceRangeInput from "@/app/(admin)//components/PriceRangeInput";
import LabeledInput from "@/app/(admin)/components/LabeledInput";
import ImagePickerField from "@/app/components/ImagePickerField";
import TouchableScale from "@/app/components/TouchableScale";

// Project utilities
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

    addNewStall(updatedDetails);
    Alert.alert("Stall Added Successfully");

    // Reset form
    setDetails({
      name: "",
      description: "",
      location: "",
      price_symbol: "",
      stall_pic: "",
    });
    setAdminCurrentPage("default");
  };

  return (
    <View className="flex-col items-center">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        New Stall
      </Text>
      <View className="w-full h-5/6">
        <ScrollView>
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
            onChangeText={(text) =>
              setDetails({ ...details, description: text })
            }
            placeholder="types of food served"
            multiline
          />
          <PriceRangeInput
            value={details.price_symbol}
            onChangeText={(text) =>
              setDetails({ ...details, price_symbol: text })
            }
          />

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
          <TouchableScale onPress={handleSubmit}>
            <Text className="py-2 mt-4 bg-green/80 rounded-full border-2 border-blue  text-center text-blue text-lg font-bold">
              Add Stall
            </Text>
          </TouchableScale>
        </ScrollView>
      </View>
    </View>
  );
};

export default StallAdd;
