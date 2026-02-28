import { FontAwesome } from "@expo/vector-icons";
import { Image, ImageSource } from "expo-image";
import { AnimatePresence, MotiView } from "moti";
import React from "react";
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
} from "react-native-reanimated";

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
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

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
    <AnimatePresence>
      {visible && (
        <Modal visible={visible} transparent onRequestClose={handleClose}>
          <GestureHandlerRootView className="flex-1">
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-[#000]"
            >
              {/* Modern Header using useSafeAreaInsets */}
              <View className="absolute right-5 z-[100] top-20">
                <TouchableOpacity
                  onPress={handleClose}
                  className="w-12 h-12 justify-center items-center rounded-full border-white border-2"
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
            </MotiView>
          </GestureHandlerRootView>
        </Modal>
      )}
    </AnimatePresence>
  );
}
