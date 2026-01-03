import { Board, Ship } from '../models/Board';
import { BOARD_SIZE, SHIPS_CONFIG } from '../utils/constants';
import { isInsideBoard, canPlaceShip as canPlaceShipHelper, placeShip as placeShipHelper, placeFleetRandomly as placeFleetRandomlyHelper } from '../utils/boardHelpers';

// Re-export the helpers for backward compatibility
export function canPlaceShip(
  board: Board,
  startRow: number,
  startCol: number,
  size: number,
  orientation: 'horizontal' | 'vertical'
): boolean {
  return canPlaceShipHelper(board, startRow, startCol, size, orientation);
}

export function placeShip(
  board: Board,
  name: string,
  size: number,
  row: number,
  col: number,
  orientation: 'horizontal' | 'vertical'
): Ship | null {
  return placeShipHelper(board, name, size, row, col, orientation);
}

export function placeFleetRandomly(board: Board): boolean {
  return placeFleetRandomlyHelper(board, SHIPS_CONFIG);
}
