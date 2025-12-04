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
}: any) {
  // tamanho do tabuleiro com base no GRID_SIZE atual (mantido fixo neste design)
  const size = GRID_SIZE * CELULA;

  return (
    <View style={[styles.wrapper, { width: size, height: size }]} {...panHandlers}>
      <View style={styles.board}>

        {/* Comida (pop animação via eatAnim) */}
        <Animated.View
        style={[
           styles.food,
            {
           left: comida.x * CELULA,
           top: comida.y * CELULA,
             transform: [{ scale: eatAnim }],
           },
  ]}
/>


        {/* Cobra (segmentos animados) */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments[i];
          // se houver anim use transform animado, senão use posição direta
          if (anim) {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: corCobra },
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
                { backgroundColor: corCobra },
                { left: seg.x * CELULA, top: seg.y * CELULA },
              ]}
            />
          );
        })}

        {/* Cobra inimiga (modo difícil) */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];
            if (anim) {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[styles.enemy, { transform: [{ translateX: anim.x }, { translateY: anim.y }] }]}
                />
              );
            }
            return (
              <View key={`e-static-${i}`} style={[styles.enemy, { left: seg.x * CELULA, top: seg.y * CELULA }]} />
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
    backgroundColor: "#000",
    position: "relative",
    overflow: "hidden",
  },

  snake: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 2,
  },

  enemy: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    borderRadius: 2,
    backgroundColor: "#ff3b3b",
  },

  food: {
    position: "absolute",
    width: CELULA,
    height: CELULA,
    backgroundColor: "#ffd400",
    borderRadius: 2,
  },
});
