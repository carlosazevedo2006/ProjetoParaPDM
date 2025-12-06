// src/hooks/useEnemyMovement.ts
import { useState } from "react";
import { Animated } from "react-native";
import { Posicao } from "../types/types";
import { GRID_SIZE, CELULA, igual } from "../utils/constants";

export default function useEnemyMovement({
  modoSelecionado,
  cobra,
  enemyAnimSegments,
  terminarJogo,
}: any) {

  // ⚠ Inimigo começa SEMPRE vazio (só ativado no Game.tsx quando for modo difícil)
  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([]);

  function moverCobraInimiga() {
    // ⚠ O inimigo só funciona no modo difícil
    if (modoSelecionado !== "DIFICIL") return;

    // ⚠ Se não existe inimigo, não faz nada
    if (!cobraInimiga.length) return;

    setCobraInimiga((prev) => {
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];
      const alvo = cobra[0];
      if (!alvo) return prev;

      const dx = Math.sign(alvo.x - head.x);
      const dy = Math.sign(alvo.y - head.y);

      const novaHead = { x: head.x + dx, y: head.y + dy };

      // colisão com jogador
      if (igual(novaHead, alvo)) {
        terminarJogo();
        return prev;
      }

      // evitar sair dos limites
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        return prev;
      }

      // ⚠ Garantir segmentos DA ANIMAÇÃO somente no modo difícil
      if (enemyAnimSegments.current.length === 0) {
        enemyAnimSegments.current = [
          new Animated.ValueXY({
            x: head.x * CELULA,
            y: head.y * CELULA,
          }),
        ];
      }

      // animação suave
      Animated.timing(enemyAnimSegments.current[0], {
        toValue: { x: novaHead.x * CELULA, y: novaHead.y * CELULA },
        duration: 160,
        useNativeDriver: false,
      }).start();

      return [novaHead];
    });
  }

  return {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  };
}
