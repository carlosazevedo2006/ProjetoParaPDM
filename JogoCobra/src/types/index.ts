export interface Position {
  x: number;
  y: number;
}

export interface GameState {
  snake: Position[];
  enemy: Position[];
  food: Position;
  direction: Position;
  enemyDirection: Position;
  gameOver: boolean;
  score: number;
  isPaused: boolean;
}

export interface GameConfig {
  baseSpeed: number;
  minSpeed: number;
  speedIncrease: number;
  enemyActive: boolean;
  enemySpeed: number;
}

export type GameStatus = 'playing' | 'paused' | 'game-over' | 'countdown';