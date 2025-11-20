// src/utils/constants.ts
// Constantes e funções utilitárias do jogo

import { Posicao } from "../types";

// Dimensões do tabuleiro
export const GRID_SIZE = 10; // 10x10 quadrículas

// Tamanho visual de cada célula (podes ajustar conforme o ecrã)
export const CELULA = 36;

// Tempo entre movimentos (ms) — velocidade base constante.
// Se quiseres activar o aumento de velocidade, ver Game.tsx (opção ENABLE_SPEEDUP)
export const MOVE_INTERVAL_MS = 300;

// Direções (vetores) — sem diagonais
export const DIRECOES = {
  CIMA: { x: 0, y: -1 },
  BAIXO: { x: 0, y: 1 },
  ESQUERDA: { x: -1, y: 0 },
  DIREITA: { x: 1, y: 0 },
} as const;

// Gera posição aleatória dentro do tabuleiro
export function gerarComida(exclude: Posicao[] = []): Posicao {
  const taken = new Set(exclude.map((p) => `${p.x},${p.y}`));
  let tries = 0;
  while (tries < 1000) {
    const pos = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
    if (!taken.has(`${pos.x},${pos.y}`)) return pos;
    tries++;
  }
  // fallback raro
  return { x: 0, y: 0 };
}

// comparação de posições
export function igual(a: Posicao, b: Posicao) {
  return a.x === b.x && a.y === b.y;
}
