export type Position = { x: number; y: number };
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type GameState = 'menu' | 'playing' | 'paused' | 'gameover';

export interface GameConfig {
  gridSize: number;
  snakeColor: string;
  boardColor: string;
  initialSpeed: number;
  speedIncrease: boolean;
}

export interface Snake {
  body: Position[];
  direction: Direction;
  color: string;
  isPlayer: boolean;
}