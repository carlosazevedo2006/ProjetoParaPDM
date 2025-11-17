import { GameConfig } from '../types/gameTypes';

// Configurações padrão do jogo - valores que podem ser ajustados facilmente
export const DEFAULT_CONFIG: GameConfig = {
  boardSize: 10,           // Tabuleiro 10x10
  initialSpeed: 200,       // 200ms entre movimentos = velocidade média
  speedIncrement: 10,      // Reduz 10ms por ponto ganho
  snakeColor: '#4CAF50',   // Verde
  foodColor: '#F44336'     // Vermelho
};

// Posição inicial da cobra - começa no centro do tabuleiro
export const INITIAL_SNAKE: Position[] = [[5, 5]];

// Direção inicial - a cobra começa se movendo para a direita
export const INITIAL_DIRECTION: Direction = 'RIGHT';