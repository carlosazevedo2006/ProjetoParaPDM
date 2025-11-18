import { GameState, Direction } from "./gameTypes";

function randomPos(size: number) {
  return {
    x: Math.floor(Math.random() * size),
    y: Math.floor(Math.random() * size),
  };
}

export function initGame(size: number, best: number): GameState {
  return {
    snake: [{ x: 5, y: 5 }],
    food: randomPos(size),
    direction: "RIGHT",
    isGameOver: false,
    score: 0,
    size,
  };
}

export function nextDirection(curr: Direction, asked: Direction): Direction {
  if (curr === "UP" && asked === "DOWN") return curr;
  if (curr === "DOWN" && asked === "UP") return curr;
  if (curr === "LEFT" && asked === "RIGHT") return curr;
  if (curr === "RIGHT" && asked === "LEFT") return curr;
  return asked;
}

export function updateGame(s: GameState): GameState {
  const head = s.snake[0];
  let newHead = { ...head };

  if (s.direction === "UP") newHead.y--;
  if (s.direction === "DOWN") newHead.y++;
  if (s.direction === "LEFT") newHead.x--;
  if (s.direction === "RIGHT") newHead.x++;

  if (
    newHead.x < 0 ||
    newHead.x >= s.size ||
    newHead.y < 0 ||
    newHead.y >= s.size
  ) {
    return { ...s, isGameOver: true };
  }

  if (s.snake.some((p) => p.x === newHead.x && p.y === newHead.y)) {
    return { ...s, isGameOver: true };
  }

  const newSnake = [newHead, ...s.snake];

  let newFood = s.food;

  if (newHead.x === s.food.x && newHead.y === s.food.y) {
    newFood = randomPos(s.size);
  } else {
    newSnake.pop();
  }

  return {
    ...s,
    snake: newSnake,
    food: newFood,
    score: s.score + (newFood !== s.food ? 1 : 0),
  };
}
