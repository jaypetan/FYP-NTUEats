// React Native core
import { TextInput, View } from "react-native";

// External libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface SearchBarProps {
  handleSearch: (query: string) => void;
  searchTerm: string;
  handleScroll?: () => void;
  handleFilterDropdown: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  handleSearch,
  searchTerm,
  handleScroll,
  handleFilterDropdown,
}) => {
  return (
    <View className="flex-col gap-2">
      <View className="flex-row justify-between items-center w-full">
        <TextInput
          className="text-blue text-lg font-semibold border-2 border-blue leading-5 p-3 rounded-full w-80"
          value={searchTerm}
          onChangeText={handleSearch}
          onFocus={handleScroll}
          placeholder="search"
          placeholderTextColor="gray"
        />
        <TouchableScale onPress={handleFilterDropdown}>
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="gray"
            className="rounded-full p-2 bg-cream border-2 border-blue"
          />
        </TouchableScale>
      </View>
    </View>
  );
};

export default SearchBar;
