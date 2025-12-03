// src/components/GameBoard.tsx
import React from "react";
import { View, Animated, StyleSheet } from "react-native";
import SnakeSegment from "./SnakeSegment";
import EnemySnakeSegment from "./EnemySnakeSegment";
import Food from "./Food";
import { GRID_SIZE, CELULA } from "../utils/constants";
import { Posicao } from "../types/types";

interface GameBoardProps {
  cobra: Posicao[];
  cobraInimiga?: Posicao[];
  comida: Posicao;
  animSegments: Animated.ValueXY[];
  eatAnim: Animated.Value;
  corCobra: string;
  modoSelecionado?: string | null;
  panHandlers?: any;
}

export default function GameBoard({
  cobra,
  cobraInimiga = [],
  comida,
  animSegments = [],
  eatAnim,
  corCobra,
  modoSelecionado = null,
  panHandlers = {},
}: GameBoardProps) {
  return (
    <View style={styles.board} {...(panHandlers || {})}>
      {/* Grid */}
      {Array.from({ length: GRID_SIZE }).map((_, row) =>
        Array.from({ length: GRID_SIZE }).map((_, col) => (
          <View
            key={`grid-${row}-${col}`}
            style={{
              position: "absolute",
              width: CELULA,
              height: CELULA,
              left: col * CELULA,
              top: row * CELULA,
              borderWidth: 0.5,
              borderColor: "#ddd",
              borderStyle: "dashed",
            }}
          />
        ))
      )}

      {/* Cobra do jogador — usa animSegments para suavidade */}
      {cobra.map((seg, idx) => {
        const anim = animSegments && animSegments[idx];
        // usar Animated.View com transform via getTranslateTransform quando anim existe
        if (anim && typeof anim.getTranslateTransform === "function") {
          return (
            <Animated.View
              key={`seg-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { backgroundColor: corCobra },
                { transform: anim.getTranslateTransform() },
              ]}
            />
          );
        } else {
          // fallback estático
          return (
            <Animated.View
              key={`seg-static-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { backgroundColor: corCobra },
                { left: seg.x * CELULA + 2, top: seg.y * CELULA + 2 },
              ]}
            />
          );
        }
      })}

      {/* Cobra inimiga (modo difícil) */}
      {modoSelecionado === "DIFICIL" &&
        (cobraInimiga || []).map((seg, idx) => (
          <EnemySnakeSegment key={`enemy-${idx}`} segment={seg} />
        ))}

      {/* Comida */}
      <Animated.View
        style={{
          position: "absolute",
          left: comida.x * CELULA + 2,
          top: comida.y * CELULA + 2,
          width: CELULA - 4,
          height: CELULA - 4,
          borderRadius: 6,
          backgroundColor: "#e53935",
          transform: [{ scale: eatAnim || 1 }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    width: GRID_SIZE * CELULA,
    height: GRID_SIZE * CELULA,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#555",
    position: "relative",
    overflow: "hidden",
  },
  segment: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    borderRadius: 6,
  },
});
    