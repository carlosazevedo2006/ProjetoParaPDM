// src/components/SnakeSegment.tsx
import React from "react";
import { Animated, StyleSheet } from "react-native";
import { CELULA } from "../utils/constants";
import { Posicao } from "../types/types";

interface Props {
  segment: Posicao;
  animation?: Animated.ValueXY | any;
  color?: string;
}

export default function SnakeSegment({ segment, animation, color = "#43a047" }: Props) {
  // Se animation for um Animated.ValueXY, usamos animation.x / animation.y
  const transformStyle =
    animation && typeof animation.setValue !== "undefined"
      ? [{ translateX: animation.x }, { translateY: animation.y }]
      : [{ translateX: segment.x * CELULA }, { translateY: segment.y * CELULA }];

  return <Animated.View style={[styles.segment, { backgroundColor: color }, { transform: transformStyle }]} />;
}

const styles = StyleSheet.create({
  segment: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    borderRadius: 6,
  },
});
