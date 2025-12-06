// src/components/GameBoard.tsx
import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { GRID_SIZE, CELULA } from "../utils/constants";

export default function GameBoard({
  cobra,
  cobraInimiga,
  comida,
  animSegments,
  enemyAnimSegments,
  eatAnim,
  corCobra,
  modoSelecionado,
  panHandlers,
  colors,          // ← RECEBEMOS O TEMA AQUI
}: any) {

  const size = GRID_SIZE * CELULA;
  const safeEatAnim = eatAnim ?? new Animated.Value(1);

  return (
    <View
      style={[styles.wrapper, { width: size, height: size }]}
      {...panHandlers}
    >
      <View
        style={[
          styles.board,
          { backgroundColor: colors.card },   // ← TEMA APLICADO
        ]}
      >

        {/* --- COMIDA --- */}
        <Animated.View
          style={[
            styles.food,
            {
              left: comida.x * CELULA,
              top: comida.y * CELULA,
              transform: [{ scale: safeEatAnim }],
            },
          ]}
        />

        {/* --- COBRA --- */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments?.[i];

          // animado
          if (anim && typeof anim.x !== "undefined") {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: corCobra },
                  {
                    transform: [
                      { translateX: anim.x },
                      { translateY: anim.y },
                    ],
                  },
                ]}
              />
            );
          }

          // estático (fallback)
          return (
            <View
              key={`s-static-${i}`}
              style={[
                styles.snake,
                {
                  backgroundColor: corCobra,
                  left: seg.x * CELULA,
                  top: seg.y * CELULA,
                },
              ]}
            />
          );
        })}

        {/* --- COBRA INIMIGA (difícil) --- */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga?.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];

            if (anim && typeof anim.x !== "undefined") {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[
                    styles.enemy,
                    {
                      transform: [
                        { translateX: anim.x },
                        { translateY: anim.y },
                      ],
                    },
                  ]}
                />
              );
            }

            return (
              <View
                key={`e-static-${i}`}
                style={[
                  styles.enemy,
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
    width: "100%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    borderRadius: 8,      // visual minimalista
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
    backgroundColor: "#ff3b3b",
    borderRadius: 4,
  },

  food: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ff9500",
    borderRadius: 6,
    zIndex: 10,
    borderWidth: 1.5,
    borderColor: "#b45c00",
  },
});
