// Configurações do jogo
export const GRID_SIZE = 10;
export const CELL_MARGIN = 1;

// Direções de movimento
export const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
} as const;

// Cores do jogo
export const COLORS = {
  background: '#0a0a0a',
  grid: '#1a1a1a',
  gridLine: '#2a2a2a',
  snake: '#4CAF50',
  snakeHead: '#2E7D32',
  enemy: '#7B1FA2',
  enemyHead: '#6A1B9A',
  food: '#F44336',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  button: '#4CAF50',
  buttonText: '#FFFFFF',
};

// Gerar comida em posição aleatória
export const generateFood = (snake: Position[], enemy: Position[] = []): Position => {
  const occupied = new Set([
    ...snake.map(pos => `${pos.x},${pos.y}`),
    ...enemy.map(pos => `${pos.x},${pos.y}`)
  ]);
  
  const available: Position[] = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      if (!occupied.has(`${x},${y}`)) {
        available.push({ x, y });
      }
    }
  }
  
  return available.length > 0 
    ? available[Math.floor(Math.random() * available.length)]
    : { x: 0, y: 0 };
};

// Comparar posições
export const positionsEqual = (a: Position, b: Position): boolean => 
  a.x === b.x && a.y === b.y;