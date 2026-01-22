// React and React Native core
import React from "react";
import { ScrollView } from "react-native";

const OptimizedScrollView = React.memo(({ backgroundColor, children }: any) => {
  return (
    <ScrollView className={`bg-${backgroundColor} min-h-[80vh] px-8`}>
      {children}
    </ScrollView>
  );
});

export default OptimizedScrollView;
