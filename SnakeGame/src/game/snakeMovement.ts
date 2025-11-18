import { Snake, Direction } from './types';
import { GameUtils } from './utils';

export class SnakeMovement {
  static move(snake: Snake, grow: boolean): Snake {
    const head = snake.body[0];
    const newHead = GameUtils.getNextPosition(head, snake.direction);
    const newBody = [newHead, ...snake.body];
    
    if (!grow) {
      newBody.pop();
    }

    return { ...snake, body: newBody };
  }

  static changeDirection(snake: Snake, newDirection: Direction): Snake {
    if (newDirection === GameUtils.getOppositeDirection(snake.direction)) {
      return snake;
    }
    return { ...snake, direction: newDirection };
  }
}