import { Snake, Position } from './types';
import { SnakeMovement } from './snakeMovement';
import { AIController } from './aiController';
import { CollisionDetector } from './collision';
import { GameUtils } from './utils';

export class GameEngine {
  static processPlayerMove(
    player: Snake,
    food: Position,
    gridSize: number
  ): { newPlayer: Snake; ateFood: boolean; collision: boolean } {
    const head = player.body[0];
    const newHead = GameUtils.getNextPosition(head, player.direction);

    if (
      CollisionDetector.checkWallCollision(newHead, gridSize) ||
      CollisionDetector.checkSelfCollision(newHead, player.body.slice(1))
    ) {
      return { newPlayer: player, ateFood: false, collision: true };
    }

    const ateFood = GameUtils.positionsEqual(newHead, food);
    const newPlayer = SnakeMovement.move(player, ateFood);

    return { newPlayer, ateFood, collision: false };
  }

  static processAIMove(ai: Snake, food: Position, gridSize: number): Snake {
    const newDirection = AIController.getNextDirection(ai, food, gridSize);
    const updatedAI = { ...ai, direction: newDirection };
    return SnakeMovement.move(updatedAI, false);
  }

  static checkGameOver(player: Snake, ai: Snake): boolean {
    return (
      CollisionDetector.checkSnakeCollision(player, ai) ||
      CollisionDetector.checkSnakeCollision(ai, player)
    );
  }
}