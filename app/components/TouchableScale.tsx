// React and React Native core
import { useRef } from "react";
import { Animated, TouchableWithoutFeedback } from "react-native";

interface TouchableScaleProps {
  children: React.ReactNode;
  className?: string; // NativeWind className support
  onPress: () => void;
  scaleTo?: number; // Scale factor (default: 0.95)
  disabled?: boolean;
}

const TouchableScale: React.FC<TouchableScaleProps> = ({
  children,
  onPress,
  className,
  scaleTo = 0.9, // Default scale factor
  disabled = false,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: scaleTo, // Shrink to the specified scale
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1, // Return to original size
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
    >
      <Animated.View
        style={{ transform: [{ scale: scaleValue }] }}
        className={className} // NativeWind className
      >
        {children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default TouchableScale;
