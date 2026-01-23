// React and React Native core
import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

const OptimizedScrollView = forwardRef<
  ScrollView,
  ScrollViewProps & { backgroundColor?: string }
>(({ backgroundColor, children, ...props }, ref) => (
  <ScrollView
    ref={ref}
    className={`bg-${backgroundColor} min-h-[80vh] px-8`}
    {...props}
  >
    {children}
  </ScrollView>
));

export default React.memo(OptimizedScrollView);
