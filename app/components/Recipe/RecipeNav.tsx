// React and React Native core
import { Text, TouchableWithoutFeedback, View } from "react-native";

// External libraries
import { FontAwesome } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

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
    <View className="flex-row items-end absolute bottom-0 w-full overflow-hidden justify-center">
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
            <Animated.View
              style={[
                page === p.name
                  ? {
                      backgroundColor: "#FFE6A7",
                      paddingHorizontal: 20,
                      paddingTop: 24,
                      paddingBottom: 8,
                      borderTopLeftRadius: 16,
                      borderTopRightRadius: 16,
                    }
                  : {
                      backgroundColor: "rgba(255, 230, 167, 0.8)",
                      paddingHorizontal: 24,
                      paddingTop: 16,
                      paddingBottom: 8,
                    },
                index === 0
                  ? { borderTopLeftRadius: 16 }
                  : index === 2
                    ? { borderTopRightRadius: 16 }
                    : {},
                {
                  zIndex: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  transitionDuration: "200ms",
                },
              ]}
            >
              <FontAwesome
                name={p.icon as any}
                size={page === p.name ? 24 : 20}
                color="#264653"
                className="mr-2 pb-2"
              />
              <Text
                className={`${
                  page === p.name ? "text-2xl" : "text-xl"
                } font-koulen text-blue capitalize pt-1`}
              >
                {p.name}
              </Text>
            </Animated.View>
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
