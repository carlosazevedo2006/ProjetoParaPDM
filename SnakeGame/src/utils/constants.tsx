import { GameConfig } from '../types/gameTypes';

// Configurações padrão do jogo
export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 10,
  initialSpeed: 200,
  speedIncrement: 10,
  snakeColor: '#4CAF50',
  foodColor: '#F44336'
};

// Posição inicial da cobra (centro do tabuleiro)
export const INITIAL_SNAKE: [number, number][] = [[5, 5]];

// Direção inicial
export const INITIAL_DIRECTION = 'RIGHT';