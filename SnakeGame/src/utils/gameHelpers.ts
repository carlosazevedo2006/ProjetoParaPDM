import { Position, Direction } from '../types/gameTypes';

/**
 * Gera uma posição aleatória que não colida com a cobra
 * @param boardSize Tamanho do tabuleiro
 * @param exclude Array de posições a evitar (corpo da cobra)
 * @returns Posição aleatória válida
 */
export const generateRandomPosition = (
  boardSize: number, 
  exclude: Position[] = []
): Position => {
  // Gera coordenadas x e y aleatórias dentro do tabuleiro
  const position: Position = [
    Math.floor(Math.random() * boardSize),  // x: 0 a boardSize-1
    Math.floor(Math.random() * boardSize)   // y: 0 a boardSize-1
  ];
  
  // Verifica se a posição gerada está na lista de exclusões
  const isExcluded = exclude.some(segment => 
    segment[0] === position[0] && segment[1] === position[1]
  );
  
  // Se estiver em uma posição proibida, gera outra recursivamente
  return isExcluded ? generateRandomPosition(boardSize, exclude) : position;
};

/**
 * Calcula a próxima posição da cabeça baseada na direção atual
 * @param head Posição atual da cabeça
 * @param direction Direção do movimento
 * @returns Nova posição da cabeça
 */
export const getNextHeadPosition = (
  head: Position, 
  direction: Direction
): Position => {
  const [x, y] = head;  // Desestrutura a posição em x e y
  
  switch (direction) {
    case 'UP': 
      return [x, y - 1];    // Move para cima (diminui y)
    case 'DOWN': 
      return [x, y + 1];    // Move para baixo (aumenta y)
    case 'LEFT': 
      return [x - 1, y];    // Move para esquerda (diminui x)
    case 'RIGHT': 
      return [x + 1, y];    // Move para direita (aumenta x)
    default: 
      return head;          // Fallback - mantém posição atual
  }
};

/**
 * Verifica se há colisão com paredes ou próprio corpo
 * @param position Posição a verificar
 * @param boardSize Tamanho do tabuleiro
 * @param snake Array da cobra
 * @returns true se houve colisão
 */
export const checkCollision = (
  position: Position, 
  boardSize: number, 
  snake: Position[]
): boolean => {
  const [x, y] = position;
  
  // Colisão com parede: verifica se saiu dos limites do tabuleiro
  const wallCollision = x < 0 || x >= boardSize || y < 0 || y >= boardSize;
  
  // Colisão com próprio corpo: verifica se a posição já existe na cobra
  const selfCollision = snake.some(segment => 
    segment[0] === x && segment[1] === y
  );
  
  return wallCollision || selfCollision;
};

/**
 * Verifica se a cabeça da cobra colidiu com a comida
 * @param head Posição da cabeça
 * @param food Posição da comida
 * @returns true se comeu a comida
 */
export const checkFoodCollision = (head: Position, food: Position): boolean => {
  return head[0] === food[0] && head[1] === food[1];
};

/**
 * Retorna a direção oposta (para prevenir movimento de 180 graus)
 * @param direction Direção atual
 * @returns Direção oposta
 */
export const getOppositeDirection = (direction: Direction): Direction => {
  // Mapeamento de direções opostas
  const opposites: Record<Direction, Direction> = {
    'UP': 'DOWN',
    'DOWN': 'UP', 
    'LEFT': 'RIGHT',
    'RIGHT': 'LEFT'
  };
  return opposites[direction];
};