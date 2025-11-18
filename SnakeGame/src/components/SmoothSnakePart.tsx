import React from "react";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

interface Props {
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function SmoothSnakePart({ x, y, size, color }: Props) {
  const anim = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(x * size, { duration: 150 }) },
      { translateY: withTiming(y * size, { duration: 150 }) },
    ],
  }));

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          backgroundColor: color,
          position: "absolute",
          borderRadius: 6,
        },
        anim,
      ]}
    />
  );
}
