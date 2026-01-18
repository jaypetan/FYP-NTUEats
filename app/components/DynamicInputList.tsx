import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

type DynamicInputListProps = {
  items: string[];
  onChange: (items: string[]) => void;
  label: string;
  placeholderPrefix: string;
};

export default function DynamicInputList({
  items,
  onChange,
  label,
  placeholderPrefix,
}: DynamicInputListProps) {
  const handleItemChange = (text: string, idx: number) => {
    const updated = [...items];
    updated[idx] = text;
    onChange(updated);
  };

  const addItem = () => {
    onChange([...items, ""]);
  };

  const removeItem = (idx: number) => {
    if (items.length > 1) {
      const updated = items.filter((_, index) => index !== idx);
      onChange(updated);
    }
  };

  return (
    <View>
      <Text className="text-xl text-blue font-bold mt-4 mb-2">{label}:</Text>
      <View className="flex-col gap-2">
        {items.map((item, idx) => (
          <View key={idx} className="flex-row w-full gap-2 items-center">
            <TextInput
              className="flex-1 text-blue text-lg font-semibold border-2 border-blue leading-5 p-3 rounded-xl"
              value={item}
              onChangeText={(text) => handleItemChange(text, idx)}
              placeholder={`${placeholderPrefix} ${idx + 1}`}
              placeholderTextColor={"gray"}
            />
            <TouchableOpacity onPress={() => removeItem(idx)}>
              <Feather
                name="minus-circle"
                size={24}
                color={items.length === 1 ? "gray" : "red"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </View>
      <TouchableOpacity
        onPress={addItem}
        className="flex-row items-center mt-2"
      >
        <Feather name="plus-circle" size={24} color="#007AFF" />
        <Text className="ml-2 text-blue font-bold">
          Add {placeholderPrefix}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
