export type Cell = {
  row: number;
  col: number;
  shipId?: string;
  hit?: boolean;
};

export type Ship = {
  id: string;
  name: string;
  size: number;
  cells: { row: number; col: number }[];
  hits: number;
};

export type Board = {
  cells: Cell[][];
  ships: Ship[];
};

export const BOARD_SIZE = 10;