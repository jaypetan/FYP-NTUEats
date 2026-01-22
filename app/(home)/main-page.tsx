// React and React Native core
import { useEffect, useState } from "react";
import { View } from "react-native";

// External libraries
import Animated, {
  ReduceMotion,
  SequencedTransition,
} from "react-native-reanimated";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import CookWhat from "@/app/components/Main/CookWHAT";
import EatWhat from "@/app/components/Main/EatWHAT";
import HomePage from "@/app/components/Main/HomePage";

export default function MainPage() {
  const { currentPage } = useAppContext();

  // State to manage the order of components
  const [componentOrder, setComponentOrder] = useState([
    { id: "cook-what", component: CookWhat },
    { id: "eat-what", component: EatWhat },
    { id: "home-page", component: HomePage },
  ]);

  // Ensure the currentPage is always the last item
  useEffect(() => {
    setComponentOrder((prevOrder) => {
      // Filter out the currentPage component
      const otherComponents = prevOrder.filter(
        (item) => item.id !== currentPage
      );
      // Find the currentPage component
      const currentPageComponent = prevOrder.find(
        (item) => item.id === currentPage
      );
      // Return the reordered array with currentPage as the last item if it exists
      return currentPageComponent
        ? [...otherComponents, currentPageComponent]
        : prevOrder;
    });
  }, [currentPage]);

  return (
    <View>
      {componentOrder.map(({ id, component: Component }, index) => (
        <Animated.View
          key={id}
          className="h-14"
          layout={SequencedTransition.duration(1000)
            .delay(200)
            .reverse()
            .reduceMotion(ReduceMotion.Never)}
        >
          <Component
            backgroundColor={index % 2 === 0 ? "darkcream" : "cream"}
            backgroundColorHex={index % 2 === 0 ? "#FFE6A7" : "#FFEFC7"}
            widthClass={
              index === 0
                ? "w-[14rem]"
                : index === 1
                ? "w-[12rem]"
                : "w-[10rem]"
            }
          />
        </Animated.View>
      ))}
    </View>
  );
}
