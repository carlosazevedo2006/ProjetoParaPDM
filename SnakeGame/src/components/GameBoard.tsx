import React from "react";
import { View } from "react-native";
import { GameState } from "../logic/gameTypes";
import SmoothSnakePart from "./SmoothSnakePart";

export default function GameBoard({ state }: { state: GameState }) {
  const tile = 32; // tamanho de cada célula em pixels

  return (
    <View
      style={{
        width: tile * state.size,
        height: tile * state.size,
        backgroundColor: "#000",
        alignSelf: "center",
        marginTop: 30,
        position: "relative", // necessário para posições absolutas da cobra
        borderRadius: 8,
        overflow: "hidden",
      }}
    >
      {/* Cobra animada */}
      {state.snake.map((p, i) => (
        <SmoothSnakePart
          key={i}
          x={p.x}
          y={p.y}
          size={tile}
          color="#2ecc71"
        />
      ))}

      {/* Comida */}
      <View
        style={{
          width: tile,
          height: tile,
          backgroundColor: "#e74c3c",
          position: "absolute",
          left: state.food.x * tile,
          top: state.food.y * tile,
          borderRadius: 6,
        }}
      />
    </View>
  );
}
