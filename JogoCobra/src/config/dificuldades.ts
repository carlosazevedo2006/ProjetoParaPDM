// src/config/dificuldades.ts
// Definições base para as dificuldades Fácil / Médio / Difícil
// Cada dificuldade define a velocidade inicial (ms por passo), se aumenta a velocidade,
// se activa a cobra inimiga e parâmetros relacionados.

export type DificuldadeDef = {
  key: "FACIL" | "MEDIO" | "DIFICIL";
  label: string;
  velocidadeBaseMs: number;   // ms por passo (menor = mais rápido)
  aumentaVelocidade: boolean; // se true, a velocidade diminui gradualmente com pontos
  incrementoPor3ComidasMs?: number; // redução de ms por cada 3 comidas (ex: 15)
  cobraInimiga: boolean;      // activa cobra inimiga
  inimigaSpeedFactor?: number; // factor de velocidade da inimiga (ex: 1.1 => 10% mais rápida)
};

export const DIFICULDADES: Record<string, DificuldadeDef> = {
  FACIL: {
    key: "FACIL",
    label: "Fácil",
    velocidadeBaseMs: 420,
    aumentaVelocidade: false,
    incrementoPor3ComidasMs: 0,
    cobraInimiga: false,
    inimigaSpeedFactor: 1.0,
  },
  MEDIO: {
    key: "MEDIO",
    label: "Médio",
    velocidadeBaseMs: 300,
    aumentaVelocidade: true,
    incrementoPor3ComidasMs: 20, // a cada 3 comidas reduz 20ms
    cobraInimiga: false,
    inimigaSpeedFactor: 1.0,
  },
  DIFICIL: {
    key: "DIFICIL",
    label: "Difícil",
    velocidadeBaseMs: 200,
    aumentaVelocidade: true,
    incrementoPor3ComidasMs: 30,
    cobraInimiga: true,
    inimigaSpeedFactor: 1.15, // inimiga 15% mais rápida que o jogador
  },
};
