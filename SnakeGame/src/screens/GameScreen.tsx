import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GameBoard from "../components/GameBoard";
import DirectionPad from "../components/DirectionPad";
import { GameState, Direction } from "../logic/gameTypes";
import { initGame, updateGame, nextDirection } from "../logic/gameEngine";

export default function GameScreen({ navigation }: any) {
  const BOARD = 10;
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    setState(initGame(BOARD, 0));
  }, []);

  useEffect(() => {
    if (!state || state.isGameOver) return;

    const id = setInterval(() => {
      setState((s) => {
        if (!s) return s;
        const newState = updateGame(s);

        if (newState.isGameOver) {
          navigation.replace("GameOver", {
            score: newState.score,
          });
        }

        return newState;
      });
    }, 200);

    return () => clearInterval(id);
  }, [state]);

  if (!state) return null;

  const handleDir = (dir: Direction) => {
    setState((s) => (s ? { ...s, direction: nextDirection(s.direction, dir) } : s));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#111", paddingTop: 50 }}>
      <Text style={{ color: "white", fontSize: 22, textAlign: "center" }}>
        Pontos: {state.score}
      </Text>

      <GameBoard state={state} />

      <DirectionPad onChange={handleDir} />
    </View>
  );
}
