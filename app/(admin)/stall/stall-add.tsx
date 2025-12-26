import TouchableScale from "@/app/components/TouchableScale";
import { addNewStall } from "@/utils/stallServices";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { LabeledInput } from "../components/LabelInput";
import { PriceRangeInput } from "../components/PriceRangeInput";

const StallAdd = () => {
  const [details, setDetails] = useState({
    name: "",
    description: "",
    canteen: "",
    priceSymbol: "",
    image: "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setDetails({ ...details, image: result.assets[0].uri });
    }
  };

  const handleSubmit = () => {
    if (
      !details.name.trim() ||
      !details.canteen.trim() ||
      !details.description.trim() ||
      !details.priceSymbol ||
      !details.image
    ) {
      Alert.alert("Missing Detail Information");
      return;
    }
    addNewStall(details);
  };

  return (
    <View className="flex-col items-center">
      <Text className="text-2xl font-koulen py-2 px-4 text-blue">
        New Stall
      </Text>
      <View className="w-64 flex-col gap-2">
        <ScrollView className="h-5/6 w-full">
          <LabeledInput
            label="Stall Name"
            maxLength={30}
            value={details.name}
            onChangeText={(text) => setDetails({ ...details, name: text })}
            placeholder="stall name"
          />
          <LabeledInput
            label="Canteen"
            maxLength={30}
            value={details.canteen}
            onChangeText={(text) => setDetails({ ...details, canteen: text })}
            placeholder="canteen name"
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
            value={details.priceSymbol}
            onChangeText={(text) =>
              setDetails({ ...details, priceSymbol: text })
            }
          />

          {/* Image Upload */}
          <Text className="text-xl pt-2">Stall Image</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="w-64 h-64 border-2 border-blue bg-white flex items-center justify-center mb-2"
          >
            {details.image ? (
              <Image
                className="w-64 h-64 border-2 border-blue"
                source={{ uri: details.image }}
              />
            ) : (
              <Text> Pick A Stall Image</Text>
            )}
          </TouchableOpacity>
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
