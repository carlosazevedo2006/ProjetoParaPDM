import { Cell } from './Cell';
import { Ship } from './Ship';

export interface Board {
  grid: Cell[][];
  ships: Ship[];
}
