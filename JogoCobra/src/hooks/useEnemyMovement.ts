// src/hooks/useEnemyMovement.ts
import { useState, useRef } from "react";
import { Animated } from "react-native";
import { CELULA } from "../utils/constants";
import { Posicao } from "../types/types";
import { GRID_SIZE, igual } from "../utils/constants";
const ENEMY_SPEED = 180; // velocidade suave da cobra inimiga

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  terminarJogo,
}: any) {

  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  // ← AQUI é onde tens de inserir a melhoria 1.2
  const enemyAnimSegments = useRef([
    new Animated.ValueXY({
      x: (GRID_SIZE - 2) * CELULA,
      y: (GRID_SIZE - 2) * CELULA,
    }),
  ]);
  

  function moverCobraInimiga() {
    if (modoSelecionado !== "DIFICIL") return;

    setCobraInimiga((prev) => {
      const head = prev[0];
      const alvo = cobra[0];

      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);

      const novaHead = { x: head.x + dx, y: head.y + dy };

      // jogador bate no corpo da cobra inimiga
      if (cobra.some((seg) => igual(seg, head))) {
      terminarJogo();
      return prev;
      }

      if (
       novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
       return [{ x: GRID_SIZE - 2, y: GRID_SIZE - 2 }]; // respawn
      }

      const novaCobra = [novaHead, ...prev];
      novaCobra.pop(); // mantém o tamanho (a cobra move-se)
      
      // -----------------------------
      // 1.3 — ANIMAÇÃO SUAVE DO INIMIGO
      // -----------------------------
      const anim = enemyAnimSegments.current[0];
      Animated.timing(anim, {
        toValue: { x: novaHead.x * CELULA, y: novaHead.y * CELULA },
        duration: ENEMY_SPEED,
        useNativeDriver: false,
      }).start();
      
      return novaCobra;
    });
  }

  return {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  };
}
  