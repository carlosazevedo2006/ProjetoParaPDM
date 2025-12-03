// src/hooks/useSnakeMovement.ts
import { useState, useRef } from "react";
import { Animated } from "react-native";
import {
  DIRECOES,
  gerarComida,
  GRID_SIZE,
  CELULA,
  igual,
} from "../utils/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Posicao } from "../types/types";

const MOVE_INTERVAL_MS = 300;
const STORAGE_KEY_MELHOR = "@JogoCobra_MelhorPontuacao";

export default function useSnakeMovement({
  latestDirRef,
  eatAnim,
  animSegments,
  modoSelecionado,
  onGameOver,
}: {
  latestDirRef: React.MutableRefObject<Posicao>;
  eatAnim: Animated.Value;
  animSegments: React.MutableRefObject<Animated.ValueXY[]>;
  modoSelecionado: "FACIL" | "MEDIO" | "DIFICIL" | null;
  onGameOver?: () => void;
}) {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);
  const [velocidade, setVelocidade] = useState<number>(MOVE_INTERVAL_MS);
  const [corCobra, setCorCobra] = useState<string>("#43a047");

  const comidaRef = useRef<Posicao>(comida);
  comidaRef.current = comida;

  // Garantir animSegments inicial
  if (!animSegments.current || animSegments.current.length === 0) {
    animSegments.current = [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })];
  }

  function resetCobra() {
    // Reset direção
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;

    // Reset posição inicial
    const init = { x: startX, y: startY };
    setCobra([init]);
    
    // Reset comida
    const novaComida = gerarComida([init]);
    setComida(novaComida);
    comidaRef.current = novaComida;

    // Reset pontos e velocidade
    setPontos(0);
    setVelocidade(MOVE_INTERVAL_MS);

    // Reset animSegments: apenas a cabeça
    animSegments.current = [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })];
  }

  function step() {
    setCobra((prev) => {
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];
      const dir = latestDirRef.current || direcao;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes
      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        onGameOver?.();
        return prev;
      }

      // colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        onGameOver?.();
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // comer comida?
      if (igual(novaHead, comidaRef.current)) {
        const novoPontos = pontos + 1;
        setPontos(novoPontos);

        if (novoPontos > melhor) {
          setMelhor(novoPontos);
          AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(novoPontos)).catch(() => {});
        }

        // -------------------------------
        //      MODO MÉDIO – acelerar
        // -------------------------------
         if (modoSelecionado === "MEDIO") {
            setVelocidade((velAtual) => {
             const novaVel = velAtual - 25; // aumenta a velocidade (tempo menor)
             return Math.max(90, novaVel);  // nunca abaixo de 90 ms
           });
          }

        
        // gerar nova comida sem colidir com a cobra
        const nextFood = gerarComida(novaCobra);
        setComida(nextFood);
        comidaRef.current = nextFood;

        // animação de comer
        try {
          eatAnim.setValue(1);
          Animated.sequence([
            Animated.timing(eatAnim, { toValue: 1.35, duration: 90, useNativeDriver: true }),
            Animated.timing(eatAnim, { toValue: 1, duration: 140, useNativeDriver: true }),
          ]).start();
        } catch (err) {
          // ignore se eatAnim inválido
        }
      } else {
        // não comeu -> remove cauda
        novaCobra.pop();
      }

      // garantir Animated.ValueXY para cada segmento
      while (animSegments.current.length < novaCobra.length) {
        // inicializar a posição do novo segmento na posição do último segmento anterior (para evitar salto)
        const last = novaCobra[animSegments.current.length] || novaCobra[novaCobra.length - 1];
        animSegments.current.push(new Animated.ValueXY({ x: last.x * CELULA, y: last.y * CELULA }));
      }
      // se houver mais animSegments do que segmentos, cortar
      if (animSegments.current.length > novaCobra.length) {
        animSegments.current.splice(novaCobra.length);
      }

      // animar cada segmento para a nova posição
      novaCobra.forEach((seg, idx) => {
        const anim = animSegments.current[idx];
        if (anim && typeof anim.setValue !== "undefined") {
          Animated.timing(anim, {
            toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
            duration: velocidade,
            useNativeDriver: false,
          }).start();
        }
      });

      return novaCobra;
    });
  }

  // Solicitar mudança de direção
 function requestDirecao(nova: Posicao, instantaneo = false) {
  const atual = latestDirRef.current;

  if (nova.x === -atual.x && nova.y === -atual.y) return;

  latestDirRef.current = nova;
  setDirecao(nova);

  // ⬇️⬇️ Movimento imediato da cabeça (melhora o swipe)
  if (instantaneo && animSegments.current[0]) {
    const head = cobra[0];
    const novaHead = { x: head.x + nova.x, y: head.y + nova.y };

    animSegments.current[0].setValue({
      x: novaHead.x * CELULA,
      y: novaHead.y * CELULA,
    });
  }
}

  // Retornar estado e funções
  return {
    cobra,
    direcao,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra,
    setCobra,
    setComida,
    setPontos,
    setVelocidade,
    setMelhor,
    setCorCobra,
    requestDirecao,
    step,
    resetCobra,
  };
}
