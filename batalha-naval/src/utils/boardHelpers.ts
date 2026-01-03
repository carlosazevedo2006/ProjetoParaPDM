import { Board, BOARD_SIZE, Cell } from '../models/Board';

export function createEmptyBoard(): Board {
  const cells: Cell[][] = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    const row: Cell[] = [];
    for (let c = 0; c < BOARD_SIZE; c++) {
      row.push({ row: r, col: c, hit: false });
    }
    cells.push(row);
  }
  return { cells, ships: [] };
}

export function isInsideBoard(row: number, col: number): boolean {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}