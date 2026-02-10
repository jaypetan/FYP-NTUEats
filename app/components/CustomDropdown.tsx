// A dropdown component for selecting custom options.
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

// External libraries
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

type CustomOption = {
  value: string;
  label: string;
};

type CustomDropdownProps = {
  label: string;
  variable: string;
  setVar: (value: string) => void;
  customOptions: CustomOption[];
  placeholder?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  variable,
  setVar,
  customOptions,
  placeholder,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownLabel = customOptions.find(
    (option) => option.value === variable
  )?.label;

  return (
    <View>
      <Text className="font-koulen text-blue text-2xl pt-2">{label}</Text>
      <Pressable
        className="border-2 border-blue px-4 py-2 flex-row justify-between"
        onPress={() => setDropdownOpen(!dropdownOpen)}
      >
        <Text
          className={`text-blue text-lg font-bold ${
            !dropdownLabel ? "opacity-50" : ""
          }`}
        >
          {dropdownLabel || placeholder}
        </Text>
        <MaterialIcons
          style={{
            transform: [{ rotate: dropdownOpen ? "180deg" : "0deg" }],
          }}
          name="arrow-drop-down"
          size={24}
          color="#264653"
        />
      </Pressable>
      {dropdownOpen && (
        <View className="flex-col border-x-2 border-b-2 border-blue bg-darkcream">
          {customOptions.map((option, index) => (
            <View
              key={option.value}
              className={`${
                variable === option.value
                  ? "hidden"
                  : placeholder &&
                    variable !== "" &&
                    index === customOptions.length - 1
                  ? "border-b-2"
                  : !placeholder &&
                    index === customOptions.length - 2 &&
                    variable === customOptions[customOptions.length - 1].value
                  ? ""
                  : index === customOptions.length - 1
                  ? ""
                  : "border-b-2"
              } border-blue`}
            >
              <TouchableScale
                className="w-full py-2 px-4"
                onPress={() => {
                  setVar(option.value);
                  setDropdownOpen(false);
                }}
              >
                <Text className="text-blue text-lg font-semibold">
                  {option.label}
                </Text>
              </TouchableScale>
            </View>
          ))}
          {placeholder && variable && (
            <View>
              <TouchableScale
                className="w-full py-2 px-4"
                onPress={() => {
                  setVar("");
                  setDropdownOpen(false);
                }}
              >
                <Text className="text-red text-lg font-semibold">
                  Clear Filter
                </Text>
              </TouchableScale>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default CustomDropdown;
