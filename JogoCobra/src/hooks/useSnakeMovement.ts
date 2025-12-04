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

type Modo = "FACIL" | "MEDIO" | "DIFICIL" | null;

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
  modoSelecionado: Modo;
  onGameOver?: () => void;
}) {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() =>
    gerarComida([{ x: startX, y: startY }])
  );
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);
  const [velocidade, setVelocidade] = useState<number>(MOVE_INTERVAL_MS);
  const [corCobra, setCorCobra] = useState<string>("#43a047");

  const comidaRef = useRef<Posicao>(comida);
  comidaRef.current = comida;

  // Garantir animSegments inicial (um Animated.ValueXY para a cabeça)
  if (!animSegments.current || animSegments.current.length === 0) {
    animSegments.current = [
      new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
    ];
  }

  // Reset total do estado da cobra (usado antes de iniciar)
  function resetCobra() {
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;

    const init = { x: startX, y: startY };
    setCobra([init]);

    const novaComida = gerarComida([init]);
    setComida(novaComida);
    comidaRef.current = novaComida;

    setPontos(0);
    setVelocidade(MOVE_INTERVAL_MS);

    // animSegments reseteado com apenas a cabeça
    animSegments.current = [
      new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
    ];
  }

  // Função que realiza um passo lógico e anima os segmentos suavemente
  function step() {
    setCobra((prev) => {
      // segurança
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];
      const dir = latestDirRef.current || direcao;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        onGameOver?.();
        return prev;
      }

      // colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        onGameOver?.();
        return prev;
      }

      // nova lista lógica: cabeça + prev
      const novaCobra = [novaHead, ...prev];

      // verificamos se comeu
      const ate = igual(novaHead, comidaRef.current);
      if (ate) {
        // atualiza pontos usando functional update
        setPontos((old) => {
          const novo = old + 1;
          setMelhor((m) => {
            if (novo > m) {
              AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(novo)).catch(() => {});
              return novo;
            }
            return m;
          });
          return novo;
        });

        // modo MEDIO -> aumentar velocidade (diminuir intervalo)
        if (modoSelecionado === "MEDIO") {
          setVelocidade((v) => Math.max(70, v - 25)); // limite inferior
        }

        // gerar nova comida sem colidir com a nova cobra
        const nextFood = gerarComida(novaCobra);
        setComida(nextFood);
        comidaRef.current = nextFood;

        // animação do alimento
        try {
          eatAnim.setValue(1);
          Animated.sequence([
            Animated.timing(eatAnim, { toValue: 1.35, duration: 80, useNativeDriver: true }),
            Animated.timing(eatAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
          ]).start();
        } catch {}
      } else {
        // não comeu -> remover cauda lógica
        novaCobra.pop();
      }

      // ============================
      // GARANTIR QUE animSegments.length == novaCobra.length
      // ============================
      // Se precisarmos de adicionar anims (crescimento), adicionamos na posição da cauda lógica anterior
      while (animSegments.current.length < novaCobra.length) {
        // a cauda anterior é prev[prev.length -1] se existir, senão usamos head (fallback)
        const tailRef = prev.length > 0 ? prev[prev.length - 1] : prev[0];
        const safe = tailRef || { x: startX, y: startY };
        animSegments.current.push(new Animated.ValueXY({ x: safe.x * CELULA, y: safe.y * CELULA }));
      }

      // Se houver mais anims do que segmentos, truncamos (sempre manter sincronizado)
      if (animSegments.current.length > novaCobra.length) {
        animSegments.current.splice(novaCobra.length);
      }

      // ============================
      // ULTRA-SMOOTH: animar todos os segmentos com Animated.parallel
      // cada anim vai para a posição do segmento lógico correspondente
      // duração adaptativa: uma fração da velocidade (slightly less than tick) para suavidade
      // ============================
      const dur = Math.max(60, Math.floor(velocidade * 0.85)); // garante suavidade sem ultrapassar o tick

      const animations: Animated.CompositeAnimation[] = [];

      for (let i = 0; i < novaCobra.length; i++) {
        const seg = novaCobra[i];
        const anim = animSegments.current[i];
        if (!anim) continue;

        animations.push(
          Animated.timing(anim, {
            toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
            duration: dur,
            useNativeDriver: false,
          })
        );
      }

      // start paralelo (sem await)
      if (animations.length > 0) {
        Animated.parallel(animations).start();
      }

      return novaCobra;
    });
  }

  // pedido de mudança de direção, com prevenção de inversão direta
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (!atual) {
      latestDirRef.current = nova;
      setDirecao(nova);
      return;
    }
    if (nova.x === -atual.x && nova.y === -atual.y) return;
    latestDirRef.current = nova;
    setDirecao(nova);
  }

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
