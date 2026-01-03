import { Board, BOARD_SIZE, Cell, Ship } from '../models/Board';

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

export function canPlaceShip(
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: 'horizontal' | 'vertical'
): boolean {
  const positions: { row: number; col: number }[] = [];

  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;

    if (!isInsideBoard(row, col)) return false;
    positions.push({ row, col });
  }

  // No-contact rule: check all 8 neighbors + cell itself
  for (const p of positions) {
    for (let r = p.row - 1; r <= p.row + 1; r++) {
      for (let c = p.col - 1; c <= p.col + 1; c++) {
        if (!isInsideBoard(r, c)) continue;
        if (board.cells[r][c].shipId) return false;
      }
    }
  }

  return true;
}

export function placeShip(
  board: Board,
  name: string,
  size: number,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): Ship | null {
  if (!canPlaceShip(board, row, col, size, orientation)) return null;

  const positions: { row: number; col: number }[] = [];
  const shipId = `${name}-${Date.now()}-${Math.random()}`;

  for (let i = 0; i < size; i++) {
    const r = orientation === 'horizontal' ? row : row + i;
    const c = orientation === 'horizontal' ? col + i : col;
    board.cells[r][c].shipId = shipId;
    positions.push({ row: r, col: c });
  }

  const ship: Ship = {
    id: shipId,
    name,
    size,
    cells: positions,
    hits: 0,
    orientation,
  };

  board.ships.push(ship);
  return ship;
}

export function placeFleetRandomly(board: Board, shipsConfig: { name: string; size: number }[]): boolean {
  // Clear existing ships
  board.ships = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      board.cells[r][c].shipId = undefined;
      board.cells[r][c].hit = false;
    }
  }

  for (const shipConfig of shipsConfig) {
    let placed = false;
    let tries = 0;

    while (!placed && tries < 100) {
      tries++;
      const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      if (placeShip(board, shipConfig.name, shipConfig.size, row, col, orientation)) {
        placed = true;
      }
    }

    if (!placed) return false;
  }

  return true;
}