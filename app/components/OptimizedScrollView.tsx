// React and React Native core
import React, { forwardRef } from "react";
import { ScrollView, ScrollViewProps } from "react-native";

// Optimized ScrollView Component, memoized to prevent unnecessary re-renders
const OptimizedScrollView = forwardRef<
  ScrollView,
  ScrollViewProps & { backgroundColor?: string }
>(({ backgroundColor, children, ...props }, ref) => (
  <ScrollView
    ref={ref}
    className="min-h-[80vh] px-8"
    style={{ backgroundColor: backgroundColor || "transparent" }}
    {...props}
  >
    {children}
  </ScrollView>
));

export default React.memo(OptimizedScrollView);
