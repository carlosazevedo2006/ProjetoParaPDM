import { Position, Snake } from './types';
import { GameUtils } from './utils';

export class FoodGenerator {
  static generate(gridSize: number, snakes: Snake[]): Position {
    const occupied = new Set(
      snakes.flatMap(s => s.body.map(p => GameUtils.positionToString(p)))
    );

    let food: Position;
    let attempts = 0;
    const maxAttempts = gridSize * gridSize;

    do {
      food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
      attempts++;
    } while (occupied.has(GameUtils.positionToString(food)) && attempts < maxAttempts);

    return food;
  }
}