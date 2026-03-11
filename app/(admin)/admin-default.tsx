// React Native core
import { Text, View } from "react-native";

// External libraries
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface ListItemProps {
  setAdminCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  itemPage: string;
  itemText: string;
  icon?: React.ReactNode;
}

interface AdminDefaultProps {
  setAdminCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const ListItem: React.FC<ListItemProps> = ({
  setAdminCurrentPage,
  itemPage,
  itemText,
  icon,
}) => {
  return (
    <TouchableScale
      onPress={() => setAdminCurrentPage(itemPage)}
      className="rounded-xl py-2 px-4 border-blue border-2 w-full items-center bg-cream flex-row gap-4 "
    >
      <View className="rounded-full p-1 border-2 border-blue">{icon}</View>
      <Text className="text-xl font-semibold text-blue font-inter">
        {itemText}
      </Text>
    </TouchableScale>
  );
};

const AdminDefault: React.FC<AdminDefaultProps> = ({ setAdminCurrentPage }) => {
  return (
    <View className="flex flex-col mx-4">
      <Text className="text-2xl text-blue mb-2 mt-8">Actions:</Text>
      <View className="flex flex-col gap-4">
        <ListItem
          itemPage="stall-add"
          itemText="Add New Stalls"
          setAdminCurrentPage={setAdminCurrentPage}
          icon={
            <MaterialCommunityIcons name="plus" size={24} color="#264653" />
          }
        />
        <ListItem
          itemPage="stall-list"
          itemText="View Stall List"
          setAdminCurrentPage={setAdminCurrentPage}
          icon={
            <MaterialCommunityIcons
              name="format-list-bulleted"
              size={24}
              color="#264653"
            />
          }
        />
        <ListItem
          itemPage="report-list"
          itemText="View User Reports"
          setAdminCurrentPage={setAdminCurrentPage}
          icon={
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={24}
              color="#264653"
            />
          }
        />
      </View>
    </View>
  );
};

export default AdminDefault;
