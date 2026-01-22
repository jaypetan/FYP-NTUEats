// React and React Native core
import { Text, TouchableWithoutFeedback, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";

// Assets
import Subtract from "@/assets/design/Subtract.svg";

interface RecipeNavProps {
  page: string;
  setPage: (page: string) => void;
}

const pages = [
  { name: "about", icon: "info-circle" },
  { name: "steps", icon: "list-ol" },
  { name: "comments", icon: "comments" },
];

const RecipeNav: React.FC<RecipeNavProps> = ({ page, setPage }) => {
  return (
    <View className="flex-row items-end absolute bottom-0 w-full justify-center">
      {pages.map((p, index) => (
        <TouchableWithoutFeedback key={p.name} onPress={() => setPage(p.name)}>
          <View
            className={`${page === p.name ? "z-10" : "z-0"} flex-row items-end`}
          >
            {page === p.name && (
              <View className="absolute left-0 -translate-x-full">
                <Subtract color="#FFE6A7" />
              </View>
            )}
            <View
              className={`${
                page === p.name
                  ? "bg-darkcream px-8 pt-6 pb-2 rounded-t-2xl"
                  : "bg-cream/80 px-6 pt-4 pb-2"
              } ${
                index === 0
                  ? "rounded-tl-2xl"
                  : index === 2
                  ? "rounded-tr-2xl"
                  : ""
              } z-10 flex-row items-center justify-center`}
            >
              <FontAwesome
                name={p.icon as any}
                size={page === p.name ? 24 : 20}
                color="gray"
                className="mr-2 pb-2"
              />
              <Text
                className={`${
                  page === p.name ? "text-2xl" : "text-xl"
                } font-koulen text-blue capitalize pt-1`}
              >
                {p.name}
              </Text>
            </View>
            {page === p.name && (
              <View className="absolute rotate-90 right-0 translate-x-full">
                <Subtract color="#FFE6A7" />
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
};

export default RecipeNav;
