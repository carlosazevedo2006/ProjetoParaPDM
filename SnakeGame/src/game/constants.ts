import { GameConfig } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 10,
  snakeColor: '#10b981',
  boardColor: '#1f2937',
  initialSpeed: 200,
  speedIncrease: true
};

export const OPPOSITE_DIRECTIONS = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT'
} as const;

export const DIRECTION_MOVES = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
} as const;