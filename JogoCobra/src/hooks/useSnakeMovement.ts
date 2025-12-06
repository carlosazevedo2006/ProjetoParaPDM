// src/hooks/useSnakeMovement.ts
import { useState, useRef, useEffect } from "react";
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
  // posição inicial (centro)
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  // estados lógicos
  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);

  // velocidade do tick em ms (diminui para aumentar velocidade)
  const [velocidade, setVelocidade] = useState<number>(MOVE_INTERVAL_MS);

  const comidaRef = useRef<Posicao>(comida);
  comidaRef.current = comida;

  // Inicializar animSegments se ainda não existir (um Animated.ValueXY por segmento)
  if (!animSegments.current || animSegments.current.length === 0) {
    animSegments.current = [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })];
  }

  // Reset completo (use antes de começar a contagem)
  function resetCobra() {
    // garantir latestDirRef válido no reset
    latestDirRef.current = DIRECOES.DIREITA;
    setDirecao(DIRECOES.DIREITA);

    const init = { x: startX, y: startY };
    setCobra([init]);

    const nova = gerarComida([init]);
    setComida(nova);
    comidaRef.current = nova;

    setPontos(0);
    setVelocidade(MOVE_INTERVAL_MS);

    // Reset animSegments para apenas a cabeça na posição inicial
    animSegments.current = [new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })];
  }

  // Função passo (tick) — atualiza lógica e dispara animações
  function step() {
    setCobra((prev) => {
      if (!prev || prev.length === 0) return prev;

      const head = prev[0];

      // pega direção com fallback
      const dir = latestDirRef.current ?? direcao;

      // ---- ADIÇÃO DEFENSIVA: garantir dir válido antes de usar ----
      if (typeof dir?.x !== "number" || typeof dir?.y !== "number") {
        // se dir inválida, mantém estado e evita movimento que provoca gameOver imediato
        return prev;
      }
      // -----------------------------------------------------------

      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes
      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        onGameOver?.();
        return prev;
      }

      // colisão com próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        onGameOver?.();
        return prev;
      }

      // nova snake lógica
      const novaCobra = [novaHead, ...prev];

      // verificar se comeu comida
      const ate = igual(novaHead, comidaRef.current);
      if (ate) {
        // pontos (functional update evita stale closure)
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

        // Acelera nos modos MEDIO e DIFICIL
        if (modoSelecionado === "MEDIO" || modoSelecionado === "DIFICIL") {
          setVelocidade((v) => Math.max(60, v - (modoSelecionado === "MEDIO" ? 25 : 15)));
        }

        // gerar nova comida sem colidir com a nova cobra
        const nextFood = gerarComida(novaCobra);
        setComida(nextFood);
        comidaRef.current = nextFood;

        // animação "pop" do alimento
        try {
          eatAnim.setValue(1);
          Animated.sequence([
            Animated.timing(eatAnim, { toValue: 1.35, duration: 80, useNativeDriver: true }),
            Animated.timing(eatAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
          ]).start();
        } catch {}
      } else {
        // se não comeu, remover cauda lógica
        novaCobra.pop();
      }

      // ======= garantir animSegments correspondentes =======
      // quando cresce precisa adicionar um Animated.ValueXY na posição da cauda anterior
      while (animSegments.current.length < novaCobra.length) {
        // tailRef: onde posicionar o novo segmento (cauda anterior)
        // usamos prev (estado anterior) para obter posição segura da cauda
        const tailRef = prev.length >= 1 ? prev[prev.length - 1] : prev[0];
        const safe = tailRef || { x: startX, y: startY };
        animSegments.current.push(new Animated.ValueXY({ x: safe.x * CELULA, y: safe.y * CELULA }));
      }
      // se houver anims a mais, cortar
      if (animSegments.current.length > novaCobra.length) {
        animSegments.current.splice(novaCobra.length);
      }

      // ======= animar todos os segmentos de forma suave =======
      // duração adaptativa: ligeiramente menor que o tick para evitar acúmulo
      const dur = Math.max(60, Math.floor(velocidade * 0.8));
      const anims: Animated.CompositeAnimation[] = [];

      for (let i = 0; i < novaCobra.length; i++) {
        const seg = novaCobra[i];
        const anim = animSegments.current[i];
        if (!anim) continue;
        anims.push(
          Animated.timing(anim, {
            toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
            duration: dur,
            useNativeDriver: false,
          })
        );
      }

      if (anims.length > 0) {
        // não aguardamos (start assíncrono)
        Animated.parallel(anims).start();
      }

      return novaCobra;
    });
  }

  // pedido de mudança de direção (evita inversão direta)
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

  // hook effect para guardar melhor pontuação ao montar (leitura inicial)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_MELHOR);
        if (raw) setMelhor(Number(raw));
      } catch {}
    })();
    // adicionar limpeza opcional se o animSegments for usado por outros hooks (não necessário mas seguro)
    return () => {};
  }, []);

  return {
    cobra,
    direcao,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra: "#43a047",

    setCobra,
    setComida,
    setPontos,
    setVelocidade,
    setMelhor,

    requestDirecao,
    step,
    resetCobra,
  };
}
