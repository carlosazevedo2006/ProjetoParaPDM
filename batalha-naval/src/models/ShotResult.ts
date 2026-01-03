export type ShotOutcome = 'water' | 'hit' | 'sunk';

export type ShotResult = {
  outcome: ShotOutcome;
  shipId?: string;
  position: { row: number; col: number };
};