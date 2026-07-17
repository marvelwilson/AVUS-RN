import { Dimensions } from "react-native";
import {
  Gesture,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from "react-native-gesture-handler";
import {
  clamp,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const ORB_SIZE = 72;
const MARGIN = 20;

export default function useFanGesture() {
  const translateX = useSharedValue(width - ORB_SIZE - 24);

  const translateY = useSharedValue(height * 0.83);

  const startX = useSharedValue(0);

  const startY = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      startX.value = translateX.value;
      startY.value = translateY.value;
    })
    .onUpdate(
      (
        event: GestureUpdateEvent<PanGestureHandlerEventPayload>
      ) => {
        translateX.value = clamp(
          startX.value + event.translationX,
          MARGIN,
          width - ORB_SIZE - MARGIN
        );

        translateY.value = clamp(
          startY.value + event.translationY,
          MARGIN + 50,
          height - ORB_SIZE - 60
        );
      }
    );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  return {
    gesture,
    animatedStyle,
    translateX,
    translateY,
  };
}