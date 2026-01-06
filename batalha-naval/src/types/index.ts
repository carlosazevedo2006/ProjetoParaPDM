// Type definitions for Batalha Naval

export type CellStatus = 'empty' | 'ship' | 'hit' | 'miss';

export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export interface Ship {
  id: string;
  type: ShipType;
  size: number;
  positions: Position[];
  hits: number;
  sunk: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Cell {
  position: Position;
  status: CellStatus;
  shipId?: string;
}

export interface Board {
  cells: Cell[][];
  ships: Ship[];
}

export interface Player {
  id: string;
  name: string;
  board: Board;
  opponentBoard: Board; // What this player sees of opponent's board
  ready: boolean;
}

export interface GameState {
  roomId: string;
  players: [Player | null, Player | null];
  currentTurn: 0 | 1;
  phase: 'setup' | 'playing' | 'finished';
  winner?: 0 | 1;
  mode: 'local' | 'multiplayer';
}

export type NetworkMessage =
  | { type: 'JOIN_OR_CREATE'; roomId: string; playerName: string }
  | { type: 'PLAYER_READY'; ships: Ship[] }
  | { type: 'FIRE'; position: Position }
  | { type: 'RESET' }
  | { type: 'SERVER_STATE'; gameState: GameState }
  | { type: 'ERROR'; message: string }
  | { type: 'CONNECTION_ERROR'; message: string }
  | { type: 'DISCONNECT'; message: string };

export const SHIP_SIZES: Record<ShipType, number> = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};

export const SHIP_NAMES: Record<ShipType, string> = {
  carrier: 'Porta-aviões',
  battleship: 'Encouraçado',
  cruiser: 'Cruzador',
  submarine: 'Submarino',
  destroyer: 'Destroyer',
};

export const BOARD_SIZE = 10;
