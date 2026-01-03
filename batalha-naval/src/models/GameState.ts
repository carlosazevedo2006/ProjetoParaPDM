import { Player } from './Player';

export type GamePhase = 'lobby' | 'setup' | 'playing' | 'finished';

export interface GameState {
  players: Player[];
  currentTurnPlayerId: string;
  phase: GamePhase;
  winnerId?: string;
  selfId?: string;
  roomId?: string;
}
