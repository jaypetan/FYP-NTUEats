// React Native core
import { Text, View } from "react-native";

// Components
import TouchableScale from "@/app/components/TouchableScale";

interface ListItemProps {
  setAdminCurrentPage: React.Dispatch<React.SetStateAction<string>>;
  itemPage: string;
  itemText: string;
}

interface AdminDefaultProps {
  setAdminCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const ListItem: React.FC<ListItemProps> = ({
  setAdminCurrentPage,
  itemPage,
  itemText,
}) => {
  return (
    <TouchableScale
      onPress={() => setAdminCurrentPage(itemPage)}
      className="rounded-full py-2 px-4 border-blue border-2 "
    >
      <Text className="text-2xl">{itemText}</Text>
    </TouchableScale>
  );
};

const AdminDefault: React.FC<AdminDefaultProps> = ({ setAdminCurrentPage }) => {
  return (
    <View className="flex flex-col items-center gap-6">
      <ListItem
        itemPage="stall-add"
        itemText="Add New Stalls"
        setAdminCurrentPage={setAdminCurrentPage}
      />
      <ListItem
        itemPage="stall-list"
        itemText="View Stall List"
        setAdminCurrentPage={setAdminCurrentPage}
      />
    </View>
  );
};

export default AdminDefault;
