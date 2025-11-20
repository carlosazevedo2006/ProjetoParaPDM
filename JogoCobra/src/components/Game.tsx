// src/components/Game.tsx
// Lógica principal do jogo SNAKE.
// Regras implementadas conforme pedido:
// - Tabuleiro 10x10
// - Movimento contínuo (4 direções, sem diagonais)
// - Swipe + botões
// - Prevenção de inversão direta
// - Comida aleatória; crescer e +1 ponto ao comer
// - Game Over ao colidir nas paredes ou no próprio corpo
// - Guarda melhor pontuação com AsyncStorage
// - Pequeno efeito visual (animação) ao comer
// - Usa imagem apple.png se colocares em /assets (opcional)

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  Animated,
  Easing,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Posicao } from "../types";
import { GRID_SIZE, CELULA, DIRECOES, gerarComida, igual, MOVE_INTERVAL_MS } from "../utils/constants";
import Controls from "./Controls";

const STORAGE_KEY = "@JogoCobra_melhorPontuacao";

// Configurações adicionais
const ENABLE_SPEEDUP = false; // se true, aumenta a velocidade gradualmente (opcional)
const SPEEDUP_FACTOR = 0.95; // multiplicador do intervalo (menor = mais rápido)
const MIN_INTERVAL_MS = 80;

export default function Game() {
  // A cobra é um array de Posicao: cabeça no índice 0
  const [cobra, setCobra] = useState<Posicao[]>([{ x: 5, y: 5 }]);
  // direção actual como vector (x,y) aplicado no passo
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  // posicao da comida
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: 5, y: 5 }]));
  // pontuações
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);
  // game over
  const [gameOver, setGameOver] = useState<boolean>(false);

  // controlo do intervalo de movimento
  const intervalRef = useRef<number | null>(null);
  const intervalMsRef = useRef<number>(MOVE_INTERVAL_MS);

  // direcção pendente para evitar múltiplas mudanças dentro de um tick
  const pendingDirRef = useRef<Posicao | null>(null);
  const latestDirRef = useRef<Posicao>(direcao);

  // animação de comer (escala) - reexecutada quando se come
  const eatAnim = useRef(new Animated.Value(1)).current;

  // carregar melhor pontuação
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setMelhor(Number(raw));
      } catch {
        // ignore
      }
    })();
    startLoop();
    return () => stopLoop();
  }, []);

  // actualiza a referência à direcção
  useEffect(() => {
    latestDirRef.current = direcao;
  }, [direcao]);

  // inicia o timer do jogo
  function startLoop() {
    stopLoop();
    intervalRef.current = setInterval(step, intervalMsRef.current) as unknown as number;
  }
  function stopLoop() {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  // aplica direcção recebida de Controls ou swipe
  function requestDirecao(nova: Posicao) {
    // prevenir inversão directa: nova não pode ser -direcao_actual
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) {
      return;
    }
    // guarda como pendente para aplicar no próximo tick
    pendingDirRef.current = nova;
  }

  // passo do jogo (movimenta a cobra)
  function step() {
    // aplica direcção pendente no início do tick
    if (pendingDirRef.current) {
      setDirecao((_) => {
        const d = pendingDirRef.current!;
        latestDirRef.current = d;
        pendingDirRef.current = null;
        return d;
      });
    }

    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes -> Game Over
      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        acabarJogo();
        return prev;
      }

      // colisão com o próprio corpo -> Game Over
      if (prev.some((seg) => igual(seg, novaHead))) {
        acabarJogo();
        return prev;
      }

      // cria nova cobra com a nova cabeça na frente
      let novaCobra = [novaHead, ...prev];

      // se comeu comida
      if (igual(novaHead, comida)) {
        // pontuar e gerar nova comida (evitar posições ocupadas)
        setPontos((p) => {
          const np = p + 1;
          // guardar melhor se necessário
          if (np > melhor) {
            setMelhor(np);
            AsyncStorage.setItem(STORAGE_KEY, String(np)).catch(() => {});
          }
          return np;
        });

        // animação de comer (efeito visual)
        Animated.sequence([
          Animated.timing(eatAnim, { toValue: 1.4, duration: 90, easing: Easing.out(Easing.quad), useNativeDriver: true }),
          Animated.timing(eatAnim, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        ]).start();

        // gerar nova comida evitando posições ocupadas
        const next = gerarComida(novaCobra);
        setComida(next);

        // opcional: aumentar velocidade a cada comida
        if (ENABLE_SPEEDUP) {
          intervalMsRef.current = Math.max(MIN_INTERVAL_MS, Math.round(intervalMsRef.current * SPEEDUP_FACTOR));
          startLoop(); // reinicia o loop com a nova velocidade
        }

        // crescer: não remover cauda
      } else {
        // mover: remover a cauda (a cobra mantém comprimento)
        novaCobra = novaCobra.slice(0, novaCobra.length - 1);
      }

      return novaCobra;
    });
  }

  function acabarJogo() {
    stopLoop();
    setGameOver(true);
  }

  function reiniciar() {
    // resetar estados
    intervalMsRef.current = MOVE_INTERVAL_MS;
    setCobra([{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }]);
    setDirecao(DIRECOES.DIREITA);
    latestDirRef.current = DIRECOES.DIREITA;
    pendingDirRef.current = null;
    setComida(gerarComida([{ x: Math.floor(GRID_SIZE / 2), y: Math.floor(GRID_SIZE / 2) }]));
    setPontos(0);
    setGameOver(false);
    startLoop();
  }

  // Swipe: criar PanResponder para controlar a direcção por gestos
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, gs) => {
        const { dx, dy } = gs;
        // threshold mínimo para evitar triggers pequenos
        const thresh = 12;
        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > thresh) requestDirecao(DIRECOES.DIREITA);
          else if (dx < -thresh) requestDirecao(DIRECOES.ESQUERDA);
        } else {
          if (dy > thresh) requestDirecao(DIRECOES.BAIXO);
          else if (dy < -thresh) requestDirecao(DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // cálculo visual do tamanho do tabuleiro em px (ajusta ao ecrã)
  const winW = Math.min(Dimensions.get("window").width, 520);
  const boardSize = Math.floor(CELULA * GRID_SIZE);
  const offsetX = Math.floor((winW - boardSize) / 2);

  // tenta carregar imagem da maçã se existir; se não existir, usa quadrado vermelho
  let appleImg: any = null;
  try {
    appleImg = require("../../assets/apple.png");
  } catch {
    appleImg = null;
  }

  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.title}>JogoCobra — SNAKE (PT)</Text>

      <View style={styles.scoreRow}>
        <Text style={styles.score}>Pontos: {pontos}</Text>
        <Text style={styles.score}>Melhor: {melhor}</Text>
      </View>

      <View style={[styles.boardWrapper, { width: boardSize, height: boardSize, left: offsetX }]}>
        {/* grid background (opcional linhas) */}
        <View style={[styles.board, { width: boardSize, height: boardSize }]}>
          {/* desenhar cada segmento da cobra */}
          {cobra.map((seg, idx) => {
            const isHead = idx === 0;
            const left = seg.x * CELULA;
            const top = seg.y * CELULA;
            const segStyle = [
              styles.segment,
              {
                width: CELULA - 2,
                height: CELULA - 2,
                left,
                top,
                borderRadius: 6,
                backgroundColor: isHead ? "#1b5e20" : "#43a047",
              },
            ];
            return <View key={`seg-${idx}-${seg.x}-${seg.y}`} style={segStyle} />;
          })}

          {/* comida: imagem se existir, senão quadrado vermelho */}
          {appleImg ? (
            <Animated.Image
              source={appleImg}
              style={{
                position: "absolute",
                left: comida.x * CELULA,
                top: comida.y * CELULA,
                width: CELULA - 4,
                height: CELULA - 4,
                transform: [{ scale: eatAnim }],
              }}
              resizeMode="contain"
            />
          ) : (
            <Animated.View
              style={{
                position: "absolute",
                left: comida.x * CELULA + 2,
                top: comida.y * CELULA + 2,
                width: CELULA - 6,
                height: CELULA - 6,
                borderRadius: 4,
                backgroundColor: "#d32f2f",
                transform: [{ scale: eatAnim }],
              }}
            />
          )}
        </View>
      </View>

      <Controls onChangeDirecao={requestDirecao} />

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={reiniciar}>
          <Text style={styles.actionText}>{gameOver ? "Reiniciar" : "Reiniciar"}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: ENABLE_SPEEDUP ? "#1976d2" : "#9e9e9e" }]}
          onPress={() => {
            // alterna o aumento de velocidade (apenas visual / funcional para quem editar o código)
            // como implementação simples, reverte o ENABLE_SPEEDUP flag manualmente no ficheiro se
            // quiseres que esteja activado permanentemente.
          }}
        >
          <Text style={styles.actionText}>Opções</Text>
        </TouchableOpacity>
      </View>

      {gameOver && <Text style={styles.gameOver}>GAME OVER</Text>}
      <Text style={styles.hint}>Sem diagonais — desliza (swipe) ou usa as setas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 12,
    width: "100%",
  },
  title: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 8,
  },
  scoreRow: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  score: {
    color: "#fff",
    fontSize: 16,
  },
  boardWrapper: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
  },
  board: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  segment: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "#f57c00",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
  },
  gameOver: {
    color: "#ff5252",
    fontSize: 18,
    marginTop: 8,
  },
  hint: {
    color: "#ddd",
    marginTop: 8,
    fontSize: 12,
  },
});
