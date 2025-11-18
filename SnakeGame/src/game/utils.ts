import { Position, Direction } from './types';
import { OPPOSITE_DIRECTIONS, DIRECTION_MOVES } from './constants';

export class GameUtils {
  static getOppositeDirection(dir: Direction): Direction {
    return OPPOSITE_DIRECTIONS[dir];
  }

  static getNextPosition(pos: Position, dir: Direction): Position {
    const move = DIRECTION_MOVES[dir];
    return {
      x: pos.x + move.x,
      y: pos.y + move.y
    };
  }

  static positionsEqual(pos1: Position, pos2: Position): boolean {
    return pos1.x === pos2.x && pos1.y === pos2.y;
  }

  static positionToString(pos: Position): string {
    return `${pos.x},${pos.y}`;
  }
}