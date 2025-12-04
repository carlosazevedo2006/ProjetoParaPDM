// src/components/GameBoard.tsx
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { CELULA } from "../utils/constants";

export default function GameBoard({
  gridSize,
  cobra,
  cobraAnim,
  comida,
  comidaAnim,
  panHandlers,
}: any) {
  const boardSize = gridSize * CELULA;

  return (
    <View
      style={[styles.wrapper, { width: boardSize, height: boardSize }]}
      {...panHandlers}
    >
      {/* FOOD */}
      <Animated.View
        style={[
          styles.food,
          {
            transform: [
              { translateX: comida.x * CELULA },
              { translateY: comida.y * CELULA },
              { scale: comidaAnim },
            ],
          },
        ]}
      />

      {/* SNAKE SEGMENTS */}
      {cobraAnim.map((anim: any, i: number) => (
        <Animated.View
          key={i}
          style={[
            styles.snake,
            {
              transform: [
                { translateX: anim.x },
                { translateY: anim.y },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },

  snake: {
    width: CELULA,
    height: CELULA,
    backgroundColor: "#43a047",
    position: "absolute",
  },

  food: {
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ffff00",
    position: "absolute",
  },
});
