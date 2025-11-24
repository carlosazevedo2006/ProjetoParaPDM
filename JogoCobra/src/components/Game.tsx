// src/components/Game.tsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Easing,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { GRID_SIZE, CELULA, DIRECOES, gerarComida, igual } from "../utils/constants";
import { Posicao } from "../types/types";

/**
 * VERSÃO COM OS 3 MODOS:
 *  - Fácil  (jogo normal)
 *  - Médio  (aumenta velocidade a cada fruta)
 *  - Difícil (cobra inimiga que persegue o jogador)
 *
 * Apenas UMA tela de menu, com seleção de modo acima do botão Jogar.
 */

const MOVE_INTERVAL_MS = 300;
const STORAGE_KEY_MELHOR = "@JogoCobra_MelhorPontuacao";
const STORAGE_KEY_COR = "@JogoCobra_CorCobra";

type Modo = "FACIL" | "MEDIO" | "DIFICIL";

export default function Game() {
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  // Estados principais
  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);

  const [jogando, setJogando] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [contador, setContador] = useState<number | null>(null);

  const [corCobra, setCorCobra] = useState<string>("#43a047");

  // ---------------- NOVOS ESTADOS DOS MODOS ----------------
  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);
  const [velocidade, setVelocidade] = useState<number>(MOVE_INTERVAL_MS);

  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  const latestDirRef = useRef<Posicao>(direcao);
  const comidaRef = useRef<Posicao>(comida);
  const eatAnim = useRef(new Animated.Value(1)).current;

  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const animSegments = useRef<Animated.ValueXY[]>([
    new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
  ]);

  // Carregar alta pontuação e cor da cobra guardada
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_MELHOR);
        if (raw) setMelhor(Number(raw));

        const savedCor = await AsyncStorage.getItem(STORAGE_KEY_COR);
        if (savedCor) setCorCobra(savedCor);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    latestDirRef.current = direcao;
  }, [direcao]);

  useEffect(() => {
    comidaRef.current = comida;
  }, [comida]);

  // ---------------- LOOP com requestAnimationFrame ----------------
  const loop = (timestamp?: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp || 0;

    const delta = (timestamp || 0) - lastTimeRef.current;

    if (delta >= velocidade && jogando) {
      step();
      lastTimeRef.current = timestamp || 0;
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [jogando, velocidade]);

  // ---------------- PASSO DO JOGO ----------------
  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Colisões
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        terminarJogo();
        return prev;
      }

      if (prev.some((seg) => igual(seg, novaHead))) {
        terminarJogo();
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // -------- Comer comida --------
      if (igual(novaHead, comidaRef.current)) {
        setPontos((p) => {
          const np = p + 1;
          if (np > melhor) {
            setMelhor(np);
            AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(np));
          }
          return np;
        });

        // Animação comida
        Animated.sequence([
          Animated.timing(eatAnim, {
            toValue: 1.4,
            duration: 90,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(eatAnim, {
            toValue: 1,
            duration: 180,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]).start();

        const nova = gerarComida(novaCobra);
        setComida(nova);
        comidaRef.current = nova;

        // -------- Aceleração (MÉDIO) --------
        if (modoSelecionado === "MEDIO") {
          setVelocidade((v) => Math.max(80, v - 20));
        }
      } else {
        novaCobra.pop();
      }

      // Animação dos segmentos
      while (animSegments.current.length < novaCobra.length) {
        const idx = animSegments.current.length;
        animSegments.current.push(
          new Animated.ValueXY({
            x: novaCobra[idx].x * CELULA,
            y: novaCobra[idx].y * CELULA,
          })
        );
      }

      novaCobra.forEach((seg, idx) => {
        Animated.timing(animSegments.current[idx], {
          toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
          duration: velocidade,
          easing: Easing.linear,
          useNativeDriver: false,
        }).start();
      });

      // -------- Cobra inimiga (DIFÍCIL) --------
      if (modoSelecionado === "DIFICIL") {
        const [hx, hy] = [novaCobra[0].x, novaCobra[0].y];
        const [ix, iy] = [cobraInimiga[0].x, cobraInimiga[0].y];

        let movX = ix < hx ? 1 : ix > hx ? -1 : 0;
        let movY = iy < hy ? 1 : iy > hy ? -1 : 0;

        const novaInimiga = [{ x: ix + movX, y: iy + movY }];

        // Colisão com jogador
        if (igual(novaInimiga[0], novaCobra[0]) || novaCobra.some((seg) => igual(seg, novaInimiga[0]))) {
          terminarJogo();
          return novaCobra;
        }

        setCobraInimiga(novaInimiga);
      }

      return novaCobra;
    });
  }

  // ---------------- Direção ----------------
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) return;
    latestDirRef.current = nova;
    setDirecao(nova);
    step();
  }

  // ---------------- SWIPE ----------------
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_, g) => {
        const { dx, dy } = g;
        const t = 12;
        if (Math.abs(dx) > Math.abs(dy)) {
          dx > t ? requestDirecao(DIRECOES.DIREITA) : dx < -t && requestDirecao(DIRECOES.ESQUERDA);
        } else {
          dy > t ? requestDirecao(DIRECOES.BAIXO) : dy < -t && requestDirecao(DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // ---------------- FIM PARTE 1 ----------------
  // ---------------- TERMINAR / REINICIAR ----------------
  function terminarJogo() {
    setJogando(false);
    setGameOver(true);
  }

  function reiniciar() {
    setCobra([{ x: startX, y: startY }]);
    latestDirRef.current = DIRECOES.DIREITA;
    setDirecao(DIRECOES.DIREITA);

    const initComida = gerarComida([{ x: startX, y: startY }]);
    setComida(initComida);
    comidaRef.current = initComida;

    setPontos(0);
    setVelocidade(MOVE_INTERVAL_MS);
    setCobraInimiga([{ x: GRID_SIZE - 2, y: GRID_SIZE - 2 }]);

    animSegments.current = [
      new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
    ];

    setGameOver(false);
    iniciarContagem();
  }

  // ---------------- CONTAGEM INICIAL ----------------
  function iniciarContagem() {
    setContador(3);
    let c = 3;
    const id = setInterval(() => {
      c -= 1;
      setContador(c);
      if (c <= 0) {
        clearInterval(id);
        setContador(null);
        setJogando(true);
        lastTimeRef.current = 0;
      }
    }, 1000);
  }

  // ---------------- MENU PRINCIPAL (APENAS UMA TELA) ----------------
  if (!jogando && !gameOver && contador === null) {
    return (
      <View style={styles.root}>

        <Text style={styles.title}>JogoCobra — SNAKE</Text>

        {/* --------- BOTÕES DE MODO (ACIMA DO JOGAR) --------- */}
        <Text style={[styles.instructionsTitle, { marginBottom: 8 }]}>
          Escolhe o Modo
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 12 }}>
          {(["FACIL", "MEDIO", "DIFICIL"] as Modo[]).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setModoSelecionado(m)}
              style={[
                styles.modeBtn,
                modoSelecionado === m && styles.modeBtnSelected,
              ]}
            >
              <Text style={styles.modeBtnText}>
                {m === "FACIL"
                  ? "Fácil"
                  : m === "MEDIO"
                  ? "Médio"
                  : "Difícil"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* --------- DESCRIÇÃO DO MODO --------- */}
        <Text style={[styles.instructionsText, { marginBottom: 16 }]}>
          {!modoSelecionado &&
            "Escolhe um modo para desbloquear o botão JOGAR."}
          {modoSelecionado === "FACIL" &&
            "Modo Fácil — velocidade constante, ideal para aprender."}
          {modoSelecionado === "MEDIO" &&
            "Modo Médio — a cobra acelera sempre que come fruta."}
          {modoSelecionado === "DIFICIL" &&
            "Modo Difícil — uma cobra inimiga persegue-te!"}
        </Text>

        {/* --------- BOTÃO JOGAR (APENAS ATIVO QUANDO HÁ MODO) --------- */}
        <TouchableOpacity
          style={[
            styles.playBtn,
            !modoSelecionado && { backgroundColor: "#666" },
          ]}
          onPress={() => modoSelecionado && iniciarContagem()}
          disabled={!modoSelecionado}
        >
          <Text style={styles.playText}>JOGAR</Text>
        </TouchableOpacity>

        {/* --------- INSTRUÇÕES --------- */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Como Jogar</Text>
          <Text style={styles.instructionsText}>
            • Deslize o dedo (swipe) no tabuleiro para mover a cobra.
          </Text>
          <Text style={styles.instructionsText}>
            • Evite paredes e o próprio corpo.
          </Text>
          <Text style={styles.instructionsText}>
            • Capture a fruta para ganhar pontos.
          </Text>
        </View>
      </View>
    );
  }

  // ---------------- CONTAGEM ----------------
  if (contador !== null) {
    return (
      <View style={styles.root}>
        <Text style={styles.countdown}>
          {contador > 0 ? String(contador) : "JÁ!"}
        </Text>
      </View>
    );
  }

  // ---------------- GAME OVER ----------------
  if (gameOver) {
    return (
      <View style={styles.root}>
        <Text style={styles.gameOverTitle}>GAME OVER</Text>
        <Text style={styles.score}>Pontuação: {pontos}</Text>
        <Text style={styles.score}>Recorde: {melhor}</Text>

        <TouchableOpacity style={styles.playBtn} onPress={reiniciar}>
          <Text style={styles.playText}>REINICIAR</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: "#777" }]}
          onPress={() => {
            // Volta ao menu
            setGameOver(false);
            setJogando(false);
            setModoSelecionado(null);
            setVelocidade(MOVE_INTERVAL_MS);

            setCobra([{ x: startX, y: startY }]);
            latestDirRef.current = DIRECOES.DIREITA;
          }}
        >
          <Text style={styles.playText}>Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ---------------- PARTE 2 TERMINA AQUI ----------------
  // ---------------- JOGO ATIVO ----------------
  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.scoreTop}>
        Pontos: {pontos} · Recorde: {melhor}
      </Text>

      <View style={styles.board}>
        {/* GRID */}
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <View
              key={`grid-${row}-${col}`}
              style={{
                position: "absolute",
                width: CELULA,
                height: CELULA,
                left: col * CELULA,
                top: row * CELULA,
                borderWidth: 0.5,
                borderColor: "#999",
                borderStyle: "dashed",
              }}
            />
          ))
        )}

        {/* COBRA DO JOGADOR */}
        {cobra.map((seg, idx) => {
          const anim = animSegments.current[idx];
          const transformStyle = anim
            ? [{ translateX: anim.x }, { translateY: anim.y }]
            : [
                { translateX: seg.x * CELULA },
                { translateY: seg.y * CELULA },
              ];

          return (
            <Animated.View
              key={`seg-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { backgroundColor: corCobra },
                { transform: transformStyle },
              ]}
            />
          );
        })}

        {/* MAÇÃ */}
        <Animated.View
          style={{
            position: "absolute",
            left: comida.x * CELULA + 2,
            top: comida.y * CELULA + 2,
            width: CELULA - 4,
            height: CELULA - 4,
            borderRadius: 6,
            backgroundColor: "#d32f2f",
            transform: [{ scale: eatAnim }],
          }}
        />

        {/* COBRA INIMIGA — MODO DIFÍCIL */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg, idx) => (
            <View
              key={`enemy-${idx}-${seg.x}-${seg.y}`}
              style={{
                position: "absolute",
                width: CELULA - 4,
                height: CELULA - 4,
                left: seg.x * CELULA + 2,
                top: seg.y * CELULA + 2,
                borderRadius: 6,
                backgroundColor: "#b71c1c",
                borderColor: "#7f0000",
                borderWidth: 1,
              }}
            />
          ))}
      </View>

      <Text style={styles.playHint}>
        Deslize no ecrã para mudar a direção
      </Text>
    </View>
  );
}

// ---------------- ESTILOS ----------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 28,
    color: "#fff",
    marginBottom: 14,
    fontWeight: "700",
    textAlign: "center",
  },

  playBtn: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 36,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 14,
    marginTop: 4,
  },

  playText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  instructionsBox: {
    marginTop: 18,
    backgroundColor: "#333",
    padding: 14,
    borderRadius: 10,
    width: "82%",
  },

  instructionsTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },

  instructionsText: {
    color: "#ccc",
    fontSize: 14,
    marginBottom: 4,
    textAlign: "center",
  },

  countdown: {
    color: "#fff",
    fontSize: 72,
    fontWeight: "700",
  },

  scoreTop: {
    color: "#fff",
    marginBottom: 12,
    fontSize: 16,
  },

  board: {
    width: GRID_SIZE * CELULA,
    height: GRID_SIZE * CELULA,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#555",
    position: "relative",
    overflow: "hidden",
  },

  segment: {
    position: "absolute",
    width: CELULA - 4,
    height: CELULA - 4,
    borderRadius: 6,
  },

  playHint: {
    color: "#ddd",
    marginTop: 12,
  },

  gameOverTitle: {
    fontSize: 36,
    color: "#ff5252",
    marginBottom: 10,
    textAlign: "center",
  },

  score: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 6,
    textAlign: "center",
  },

  /* BOTÕES DOS MODOS */
  modeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 6,
    borderRadius: 8,
    backgroundColor: "#333",
    borderWidth: 1,
    borderColor: "#444",
  },

  modeBtnSelected: {
    backgroundColor: "#4caf50",
    borderColor: "#4caf50",
  },

  modeBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
});
