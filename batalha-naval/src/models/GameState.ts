import { Player } from './Player';

export type GamePhase = 'start' | 'playMenu' | 'settings' | 'connect' | 'lobby' | 'setup' | 'playing' | 'finished';

export interface Preferences {
  vibrationEnabled: boolean;
}

export interface GameState {
  players: Player[];
  currentTurnPlayerId: string;
  phase: GamePhase;
  winnerId?: string;
  selfId?: string;
  roomId?: string;
  preferences: Preferences;
  serverUrl?: string;
}
