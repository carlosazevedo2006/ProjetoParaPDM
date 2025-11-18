import { Snake, Position, Direction } from './types';
import { GameUtils } from './utils';
import { CollisionDetector } from './collision';

export class AIController {
  static getNextDirection(snake: Snake, food: Position, gridSize: number): Direction {
    const head = snake.body[0];
    const possibleDirs: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const opposite = GameUtils.getOppositeDirection(snake.direction);
    
    const validDirs = possibleDirs.filter(dir => dir !== opposite);
    
    const directionScores = validDirs.map(dir => {
      const nextPos = GameUtils.getNextPosition(head, dir);
      
      if (CollisionDetector.checkWallCollision(nextPos, gridSize)) {
        return { dir, score: -1000 };
      }
      if (CollisionDetector.checkSelfCollision(nextPos, snake.body.slice(1))) {
        return { dir, score: -1000 };
      }
      
      const dist = Math.abs(nextPos.x - food.x) + Math.abs(nextPos.y - food.y);
      const freeSpaceBonus = this.calculateFreeSpace(nextPos, snake, gridSize);
      
      return { dir, score: -dist + freeSpaceBonus };
    });

    directionScores.sort((a, b) => b.score - a.score);
    
    return directionScores[0].score > -1000 
      ? directionScores[0].dir 
      : snake.direction;
  }

  private static calculateFreeSpace(pos: Position, snake: Snake, gridSize: number): number {
    const directions: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    let freeCount = 0;

    for (const dir of directions) {
      const checkPos = GameUtils.getNextPosition(pos, dir);
      if (!CollisionDetector.checkWallCollision(checkPos, gridSize) &&
          !CollisionDetector.checkSelfCollision(checkPos, snake.body)) {
        freeCount++;
      }
    }

    return freeCount * 2;
  }
}