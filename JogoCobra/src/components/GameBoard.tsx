import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { GRID_SIZE, CELULA } from "../utils/constants";
import { useTheme } from "../context/ThemeContext";

export default function GameBoard({
  cobra,
  cobraInimiga,
  comida,
  animSegments,
  enemyAnimSegments,
  eatAnim,
  modoSelecionado,
  panHandlers,
}: any) {
  const { colors, snakeColor } = useTheme();

  const size = GRID_SIZE * CELULA;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]} {...panHandlers}>
      <View style={[styles.board, { backgroundColor: colors.board }]}>

        {/* Comida */}
        <Animated.View
          style={[
            styles.food,
            {
              backgroundColor: colors.food,
              transform: [
                { translateX: comida.x * CELULA },
                { translateY: comida.y * CELULA },
                { scale: eatAnim },
              ],
            },
          ]}
        />

        {/* Cobra */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments[i];
          if (anim) {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: snakeColor },
                  { transform: [{ translateX: anim.x }, { translateY: anim.y }] },
                ]}
              />
            );
          }
          return (
            <View
              key={`s-static-${i}`}
              style={[
                styles.snake,
                { backgroundColor: snakeColor },
                { left: seg.x * CELULA, top: seg.y * CELULA },
              ]}
            />
          );
        })}

        {/* Cobra inimiga */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];
            if (anim) {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[
                    styles.enemy,
                    { backgroundColor: colors.enemy },
                    { transform: [{ translateX: anim.x }, { translateY: anim.y }] },
                  ]}
                />
              );
            }
            return (
              <View
                key={`e-static-${i}`}
                style={[
                  styles.enemy,
                  { backgroundColor: colors.enemy },
                  { left: seg.x * CELULA, top: seg.y * CELULA },
                ]}
              />
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  board: {
    position: "relative",
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 12,
  },

  snake: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 4,
  },

  enemy: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 4,
  },

  food: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 6,
  },
});
