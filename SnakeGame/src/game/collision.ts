import { Position, Snake } from './types';
import { GameUtils } from './utils';

export class CollisionDetector {
  static checkWallCollision(pos: Position, gridSize: number): boolean {
    return pos.x < 0 || pos.x >= gridSize || pos.y < 0 || pos.y >= gridSize;
  }

  static checkSelfCollision(head: Position, body: Position[]): boolean {
    return body.some(segment => GameUtils.positionsEqual(segment, head));
  }

  static checkSnakeCollision(snake1: Snake, snake2: Snake): boolean {
    const head1 = snake1.body[0];
    return snake2.body.some(segment => GameUtils.positionsEqual(segment, head1));
  }
}