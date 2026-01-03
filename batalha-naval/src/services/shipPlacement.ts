import { Board, Ship } from '../models/Board';
import { ShipOrientation, ShipPosition } from '../models/Ship';
import { BOARD_SIZE, SHIPS_CONFIG } from '../utils/constants';
import { isInsideBoard } from '../utils/boardHelpers';
import { randomInt, randomFromArray } from '../utils/random';

// Verifica se um navio pode ser colocado
export function canPlaceShip(
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: ShipOrientation
): boolean {
  const positions: ShipPosition[] = [];

  for (let i = 0; i < size; i++) {
    const row = orientation === 'horizontal' ? startRow : startRow + i;
    const col = orientation === 'horizontal' ? startCol + i : startCol;

    if (!isInsideBoard(row, col)) return false;
    positions.push({ row, col });
  }

  // Regra: não sobrepor nem encostar (lado/diagonal)
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

// Coloca um navio
export function placeShip(
  board: Board,
  name: string,
  size: number,
  row: number,
  col: number,
  orientation: ShipOrientation
): Ship | null {
  if (!canPlaceShip(board, row, col, size, orientation)) return null;

  const shipId = `${name}-${Date.now()}`;
  const positions: ShipPosition[] = [];

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
  };

  board.ships.push(ship);
  return ship;
}

// Colocação aleatória da frota
export function placeFleetRandomly(board: Board): boolean {
  board.ships = [];

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      board.cells[r][c].shipId = undefined;
      board.cells[r][c].hit = false;
    }
  }

  for (const ship of SHIPS_CONFIG) {
    let placed = false;
    let tries = 0;

    while (!placed && tries < 100) {
      tries++;
      const orientation = randomFromArray<ShipOrientation>(['horizontal', 'vertical']);
      const row = randomInt(0, BOARD_SIZE - 1);
      const col = randomInt(0, BOARD_SIZE - 1);

      if (placeShip(board, ship.name, ship.size, row, col, orientation)) {
        placed = true;
      }
    }

    if (!placed) return false;
  }

  return true;
}
