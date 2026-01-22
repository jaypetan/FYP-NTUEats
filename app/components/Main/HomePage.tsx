// React Native core
import { Text, View } from "react-native";

// App Context
import { useAppContext } from "@/app/components/AppContext";

// Components
import HomeCookWHAT from "@/app/components/Home/HomeCookWHAT";
import HomeEatWHAT from "@/app/components/Home/HomeEatWHAT";
import HomeNav from "@/app/components/Home/HomeNav";
import HomeProfile from "@/app/components/Home/HomeProfile";
import OptimizedScrollView from "@/app/components/OptimizedScrollView";

interface HomePageProps {
  backgroundColor: string;
  backgroundColorHex: string;
  widthClass: string;
}

export default function HomePage({
  backgroundColor,
  backgroundColorHex,
  widthClass,
}: HomePageProps) {
  const { currentPage, setCurrentPage } = useAppContext();

  return (
    <View className="h-full w-full flex-col">
      <HomeNav
        backgroundColor={backgroundColor}
        backgroundColorHex={backgroundColorHex}
        text="Home"
        setCurrentPage={setCurrentPage}
        desiredPage="home-page"
        widthClass={widthClass}
      />
      {currentPage !== "home-page" ? (
        <View
          className={`bg-${backgroundColor} min-h-[80vh] rounded-tl-3xl w-full`}
        />
      ) : (
        <View className={`bg-${backgroundColor} pt-8 rounded-tl-3xl`}>
          <OptimizedScrollView
            className={`bg-${backgroundColor} min-h-[80vh] px-8`}
          >
            <HomeProfile />
            <HomeEatWHAT />
            <HomeCookWHAT />
            <Text className="py-24" />
          </OptimizedScrollView>
        </View>
      )}
    </View>
  );
}
