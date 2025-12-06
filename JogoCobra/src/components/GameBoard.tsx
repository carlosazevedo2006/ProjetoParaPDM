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
  // tamanho do tabuleiro com base no GRID_SIZE atual
  const size = GRID_SIZE * CELULA;

  // fallback seguro caso eatAnim seja undefined
  const safeEatAnim = eatAnim ?? new Animated.Value(1);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]} {...panHandlers}>
      <View style={styles.board}>

        {/* --- COMIDA: use LEFT/TOP como fallback para garantir visibilidade --- */}
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

        {/* Cobra (segmentos animados) */}
        {cobra.map((seg: any, i: number) => {
          const anim = animSegments?.[i];

          if (anim && typeof anim.x !== "undefined") {
            return (
              <Animated.View
                key={`s-${i}`}
                style={[
                  styles.snake,
                  { backgroundColor: corCobra ?? "#43a047", zIndex: 5 },
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
                { backgroundColor: corCobra ?? "#43a047", zIndex: 5 },
                { left: seg.x * CELULA, top: seg.y * CELULA },
              ]}
            />
          );
        })}

        {/* Cobra inimiga (modo difícil) */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga?.map((seg: any, i: number) => {
            const anim = enemyAnimSegments?.[i];
            if (anim && typeof anim.x !== "undefined") {
              return (
                <Animated.View
                  key={`e-${i}`}
                  style={[
                    styles.enemy,
                    { transform: [{ translateX: anim.x }, { translateY: anim.y }], zIndex: 6 },
                  ]}
                />
              );
            }
            return (
              <View
                key={`e-static-${i}`}
                style={[styles.enemy, { left: seg.x * CELULA, top: seg.y * CELULA }]}
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
    backgroundColor: "#0b0b0b", // ligeiro contraste, mantém o tabuleiro escuro
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
    backgroundColor: "#ffd400", // cor de alto contraste
    borderRadius: 2,
    zIndex: 10,
    // tiny border to make it pop against dark bg
    borderWidth: 1,
    borderColor: "#b88600",
  },
});
