// Board utility functions for Batalha Naval
import { Board, Cell, Position, Ship, BOARD_SIZE, CellStatus } from '../types';

/**
 * Creates an empty board with all cells set to 'empty'
 */
export function createEmptyBoard(): Board {
  const cells: Cell[][] = [];
  
  for (let row = 0; row < BOARD_SIZE; row++) {
    cells[row] = [];
    for (let col = 0; col < BOARD_SIZE; col++) {
      cells[row][col] = {
        position: { row, col },
        status: 'empty',
      };
    }
  }
  
  return { cells, ships: [] };
}

/**
 * Checks if a position is valid (within board bounds)
 */
export function isValidPosition(position: Position): boolean {
  return (
    position.row >= 0 &&
    position.row < BOARD_SIZE &&
    position.col >= 0 &&
    position.col < BOARD_SIZE
  );
}

/**
 * Checks if a ship can be placed at the given positions
 */
export function canPlaceShip(
  board: Board,
  positions: Position[]
): boolean {
  // Check all positions are valid
  if (!positions.every(isValidPosition)) {
    return false;
  }
  
  // Check all positions are empty
  for (const pos of positions) {
    const cell = board.cells[pos.row][pos.col];
    if (cell.status !== 'empty') {
      return false;
    }
  }
  
  // Check adjacent cells don't have ships (diagonal and orthogonal)
  for (const pos of positions) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        const adjPos = { row: pos.row + dr, col: pos.col + dc };
        if (isValidPosition(adjPos)) {
          const adjCell = board.cells[adjPos.row][adjPos.col];
          // Only check if adjacent position is not part of current ship
          if (adjCell.status === 'ship' && 
              !positions.some(p => p.row === adjPos.row && p.col === adjPos.col)) {
            return false;
          }
        }
      }
    }
  }
  
  return true;
}

/**
 * Places a ship on the board
 */
export function placeShip(board: Board, ship: Ship): Board {
  const newCells = board.cells.map(row => 
    row.map(cell => ({ ...cell }))
  );
  
  for (const pos of ship.positions) {
    newCells[pos.row][pos.col] = {
      position: pos,
      status: 'ship',
      shipId: ship.id,
    };
  }
  
  return {
    cells: newCells,
    ships: [...board.ships, ship],
  };
}

/**
 * Processes a fire action at a position
 * Returns updated board and whether it was a hit
 */
export function processFireOnBoard(
  board: Board,
  position: Position
): { board: Board; hit: boolean; sunk: boolean; shipId?: string } {
  const cell = board.cells[position.row][position.col];
  
  // Can't fire at same position twice
  if (cell.status === 'hit' || cell.status === 'miss') {
    return { board, hit: false, sunk: false };
  }
  
  const hit = cell.status === 'ship';
  const newCells = board.cells.map(row => 
    row.map(c => ({ ...c }))
  );
  
  newCells[position.row][position.col] = {
    ...cell,
    status: hit ? 'hit' : 'miss',
  };
  
  let sunk = false;
  let shipId = cell.shipId;
  let updatedShips = board.ships;
  
  if (hit && shipId) {
    // Update ship hits
    updatedShips = board.ships.map(ship => {
      if (ship.id === shipId) {
        const newHits = ship.hits + 1;
        const isSunk = newHits >= ship.size;
        return { ...ship, hits: newHits, sunk: isSunk };
      }
      return ship;
    });
    
    const hitShip = updatedShips.find(s => s.id === shipId);
    sunk = hitShip?.sunk || false;
  }
  
  return {
    board: { cells: newCells, ships: updatedShips },
    hit,
    sunk,
    shipId,
  };
}

/**
 * Checks if all ships on a board are sunk
 */
export function areAllShipsSunk(board: Board): boolean {
  return board.ships.length > 0 && board.ships.every(ship => ship.sunk);
}

/**
 * Generates positions for a ship given start position, size, and orientation
 */
export function generateShipPositions(
  start: Position,
  size: number,
  horizontal: boolean
): Position[] {
  const positions: Position[] = [];
  
  for (let i = 0; i < size; i++) {
    positions.push({
      row: horizontal ? start.row : start.row + i,
      col: horizontal ? start.col + i : start.col,
    });
  }
  
  return positions;
}

/**
 * Creates a copy of the board with only hit/miss information (for opponent view)
 */
export function getOpponentBoardView(board: Board): Board {
  const cells: Cell[][] = board.cells.map(row =>
    row.map(cell => ({
      position: cell.position,
      status: cell.status === 'ship' ? 'empty' : cell.status,
      shipId: cell.status === 'hit' ? cell.shipId : undefined,
    }))
  );
  
  return { cells, ships: [] };
}
