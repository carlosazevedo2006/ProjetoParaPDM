export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface Pos {
  x: number;
  y: number;
}

export interface GameState {
  snake: Pos[];
  food: Pos;
  direction: Direction;
  isGameOver: boolean;
  score: number;
  size: number;
}
