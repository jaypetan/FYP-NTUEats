import { FontAwesome } from "@expo/vector-icons";
import { Image, ImageSource } from "expo-image";
import React, { useEffect } from "react";
import {
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface SimpleViewerProps {
  visible: boolean;
  source: ImageSource | string | number;
  onClose: () => void;
}

export default function SimpleViewer({
  visible,
  source,
  onClose,
}: SimpleViewerProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Transformation Values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const opacity = useSharedValue(0); // Fade-in manually instead of Moti

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      opacity.value = 0;
    }
  }, [visible]);

  const config = { damping: 15, stiffness: 100 };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1, config);
        translateX.value = withSpring(0, config);
        translateY.value = withSpring(0, config);
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translateX.value = offsetX.value + e.translationX;
        translateY.value = offsetY.value + e.translationY;
      }
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      if (scale.value > 1) {
        scale.value = withSpring(1, config);
        translateX.value = withSpring(0, config);
        translateY.value = withSpring(0, config);
        offsetX.value = 0;
        offsetY.value = 0;
      } else {
        scale.value = withSpring(3, config);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const composed = Gesture.Race(
    doubleTap,
    Gesture.Simultaneous(pinchGesture, panGesture),
  );

  const handleClose = () => {
    scale.value = 1;
    translateX.value = 0;
    translateY.value = 0;
    offsetX.value = 0;
    offsetY.value = 0;
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      onRequestClose={handleClose}
      animationType="none"
    >
      <GestureHandlerRootView className="flex-1">
        <Animated.View style={backdropStyle} className="flex-1 bg-[#000]">
          {/* Header with Close Button */}
          <View className="absolute right-5 z-[100] top-20">
            <TouchableOpacity
              onPress={handleClose}
              className="border-2 border-white w-12 aspect-square justify-center items-center rounded-full"
              activeOpacity={0.7}
            >
              <FontAwesome name="times" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <GestureDetector gesture={composed}>
            <Animated.View className="flex-1 justify-center items-center">
              <Animated.View
                style={animatedStyle}
                className="w-full h-full justify-center items-center"
              >
                <Image
                  source={source}
                  contentFit="contain"
                  style={{ width: screenWidth, height: screenHeight }}
                  priority="high"
                />
              </Animated.View>
            </Animated.View>
          </GestureDetector>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
}
