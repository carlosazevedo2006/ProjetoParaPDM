import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Position, Snake } from '../game/types';
import { GameUtils } from '../game/utils';

interface BoardProps {
  gridSize: number;
  boardColor: string;
  playerSnake: Snake;
  aiSnake: Snake;
  food: Position;
  foodEffect: Position | null;
}

export const Board: React.FC<BoardProps> = ({
  gridSize,
  boardColor,
  playerSnake,
  aiSnake,
  food,
  foodEffect
}) => {
  const screenWidth = Dimensions.get('window').width;
  const cellSize = Math.min((screenWidth - 40) / gridSize, 40);
  const boardSize = cellSize * gridSize;

  const playerPositions = new Set(playerSnake.body.map(GameUtils.positionToString));
  const aiPositions = new Set(aiSnake.body.map(GameUtils.positionToString));
  const playerHead = playerSnake.body[0];
  const aiHead = aiSnake.body[0];

  const cells = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const key = GameUtils.positionToString({ x, y });
      const isPlayerSnake = playerPositions.has(key);
      const isAiSnake = aiPositions.has(key);
      const isFood = GameUtils.positionsEqual(food, { x, y });
      const isFoodEffect = foodEffect && GameUtils.positionsEqual(foodEffect, { x, y });
      const isPlayerHead = GameUtils.positionsEqual(playerHead, { x, y });
      const isAiHead = GameUtils.positionsEqual(aiHead, { x, y });

      let backgroundColor = boardColor;
      if (isPlayerSnake) backgroundColor = playerSnake.color;
      if (isAiSnake) backgroundColor = aiSnake.color;
      if (isFood) backgroundColor = '#ef4444';

      cells.push(
        <View
          key={key}
          style={{
            width: cellSize,
            height: cellSize,
            backgroundColor,
            borderWidth: 0.5,
            borderColor: '#374151',
          }}
        >
          {isFoodEffect && (
            <View style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#fbbf24',
              opacity: 0.5,
              borderRadius: cellSize / 2
            }} />
          )}
          {isPlayerHead && (
            <View style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              backgroundColor: 'white',
              borderRadius: cellSize / 2,
              opacity: 0.7
            }} />
          )}
          {isAiHead && (
            <View style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              backgroundColor: '#fb923c',
              borderRadius: cellSize / 2,
              opacity: 0.7
            }} />
          )}
        </View>
      );
    }
  }

  return (
    <View style={{
      width: boardSize,
      height: boardSize,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignSelf: 'center',
      marginVertical: 20
    }}>
      {cells}
    </View>
  );
};