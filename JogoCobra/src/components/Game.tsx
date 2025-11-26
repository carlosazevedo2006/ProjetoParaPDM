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
 * Game.tsx — versão completa dividida em 4 partes
 *
 * Fluxo:
 * 1) Tela de Boas-Vindas (com instruções) — aparece sempre
 * 2) Tela "Play" simples (botão JOGAR) — leva à seleção de modo
 * 3) Tela de Seleção de Modo (Fácil / Médio / Difícil)
 * 4) Contagem
 * 5) Jogo
 *
 * Modos:
 * - FACIL  : velocidade constante
 * - MEDIO  : velocidade aumenta (intervalo diminui) a cada fruta comida
 * - DIFICIL: cobra inimiga que persegue a cabeça do jogador
 */

// Intervalo base em ms
const MOVE_INTERVAL_MS = 300;
const STORAGE_KEY_MELHOR = "@JogoCobra_MelhorPontuacao";
const STORAGE_KEY_COR = "@JogoCobra_CorCobra";

type Modo = "FACIL" | "MEDIO" | "DIFICIL";

export default function Game() {
  // posição inicial
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  // ------------------ ESTADOS PRINCIPAIS ------------------
  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>(DIRECOES.DIREITA);
  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const [pontos, setPontos] = useState<number>(0);
  const [melhor, setMelhor] = useState<number>(0);

  const [jogando, setJogando] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [contador, setContador] = useState<number | null>(null);

  const [corCobra, setCorCobra] = useState<string>("#43a047");

  // ------------------ FLUXO E MODOS ------------------
  // showWelcome: true = exibe a tela de boas-vindas
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // showPlayScreen: true = tela simples de "Play" (após welcome)
  const [showPlayScreen, setShowPlayScreen] = useState<boolean>(false);

  // showModeSelection: true = tela de seleção de modos (após Play)
  const [showModeSelection, setShowModeSelection] = useState<boolean>(false);

  // modo escolhido (null = nenhum ainda)
  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);

  // velocidade (ms entre passos) — estado mutável para o modo MEDIO
  const [velocidade, setVelocidade] = useState<number>(MOVE_INTERVAL_MS);

  // cobra inimiga (para o modo DIFICIL)
  const [cobraInimiga, setCobraInimiga] = useState<Posicao[]>([
    { x: GRID_SIZE - 2, y: GRID_SIZE - 2 },
  ]);

  // ------------------ REFs E ANIMAÇÕES ------------------
  const latestDirRef = useRef<Posicao>(direcao);
  const comidaRef = useRef<Posicao>(comida);
  const eatAnim = useRef(new Animated.Value(1)).current;

  const lastTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const animSegments = useRef<Animated.ValueXY[]>([
    new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA }),
  ]);

  // animação "pulse" para a tela de boas-vindas
  const welcomePulse = useRef(new Animated.Value(1)).current;

  // ------------------ CARREGAR CONFIGURAÇÕES SALVAS ------------------
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY_MELHOR);
        if (raw) setMelhor(Number(raw));
        const savedCor = await AsyncStorage.getItem(STORAGE_KEY_COR);
        if (savedCor) setCorCobra(savedCor);
      } catch (e) {
        // ignorar erros de leitura
      }
    })();
  }, []);

  // iniciar animação da welcome
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(welcomePulse, {
          toValue: 1.06,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(welcomePulse, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [welcomePulse]);

  useEffect(() => {
    latestDirRef.current = direcao;
  }, [direcao]);

  useEffect(() => {
    comidaRef.current = comida;
  }, [comida]);

  // ------------------ LOOP PRINCIPAL (requestAnimationFrame) ------------------
  const loop = (timestamp?: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp || 0;
    const delta = (timestamp || 0) - lastTimeRef.current;

    // usar 'velocidade' como base do tick
    if (delta >= velocidade && jogando) {
      step();
      lastTimeRef.current = timestamp || 0;
    }

    rafRef.current = requestAnimationFrame(loop);
  };

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [jogando, velocidade]);

  // ------------------ FIM PARTE 1 ------------------
  // ------------------ MOVIMENTO DA COBRA ------------------
  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead: Posicao = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão com paredes
      if (
        novaHead.x < 0 ||
        novaHead.x >= GRID_SIZE ||
        novaHead.y < 0 ||
        novaHead.y >= GRID_SIZE
      ) {
        terminarJogo();
        return prev;
      }

      // colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        terminarJogo();
        return prev;
      }

      let novaCobra = [novaHead, ...prev];

      // -------------------------------------------
      //              COMER A MAÇÃ
      // -------------------------------------------
      if (igual(novaHead, comidaRef.current)) {
        setPontos((p) => {
          const novoTotal = p + 1;

          // atualizar melhor pontuação
          if (novoTotal > melhor) {
            setMelhor(novoTotal);
            AsyncStorage.setItem(STORAGE_KEY_MELHOR, String(novoTotal)).catch(() => {});
          }

          // modo MEDIO → aumentar velocidade (diminuir intervalo)
          if (modoSelecionado === "MEDIO") {
            setVelocidade((v) => Math.max(80, v - 18)); // limite mínimo
          }

          return novoTotal;
        });

        // animação ao comer
        Animated.sequence([
          Animated.timing(eatAnim, {
            toValue: 1.4,
            duration: 100,
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

        // gerar nova comida
        const novaComida = gerarComida(novaCobra);
        setComida(novaComida);
        comidaRef.current = novaComida;
      } else {
        // remover cauda
        novaCobra.pop();
      }

      // -------------------------------------------
      //  ANIMAÇÃO DO MOVIMENTO (cada segmento)
      // -------------------------------------------
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

      return novaCobra;
    });

    // -------------------------------------------
    //                MODO DIFÍCIL
    //    cobra inimiga segue o jogador
    // -------------------------------------------
    if (modoSelecionado === "DIFICIL") {
      moverCobraInimiga();
    }
  }

  // ------------------ COBRA INIMIGA (MODO DIFÍCIL) ------------------
  function moverCobraInimiga() {
    setCobraInimiga((prev) => {
      const head = prev[0];
      const target = cobra[0];

      // movimento "na direção da cabeça do jogador"
      const dx = target.x - head.x;
      const dy = target.y - head.y;

      const stepX = dx === 0 ? 0 : dx > 0 ? 1 : -1;
      const stepY = dy === 0 ? 0 : dy > 0 ? 1 : -1;

      const nova = { x: head.x + stepX, y: head.y + stepY };

      // colisão do inimigo com o jogador
      if (igual(nova, target)) {
        terminarJogo();
        return prev;
      }

      // colisão com paredes
      if (
        nova.x < 0 ||
        nova.x >= GRID_SIZE ||
        nova.y < 0 ||
        nova.y >= GRID_SIZE
      ) {
        return prev; // inimigo para
      }

      return [nova]; // inimigo tem sempre 1 segmento
    });
  }

  // ------------------ DIREÇÃO DO JOGADOR ------------------
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    // impedir inversão direta
    if (nova.x === -atual.x && nova.y === -atual.y) return;

    latestDirRef.current = nova;
    setDirecao(nova);

    // resposta imediata
    step();
  }

  // ------------------ PANRESPONDER (SWIPE) ------------------
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderRelease: (_evt, g) => {
        const { dx, dy } = g;
        const threshold = 12;

        if (Math.abs(dx) > Math.abs(dy)) {
          dx > threshold
            ? requestDirecao(DIRECOES.DIREITA)
            : dx < -threshold && requestDirecao(DIRECOES.ESQUERDA);
        } else {
          dy > threshold
            ? requestDirecao(DIRECOES.BAIXO)
            : dy < -threshold && requestDirecao(DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // ------------------ TERMINAR JOGO ------------------
  function terminarJogo() {
    setJogando(false);
    setGameOver(true);
  }

  // ------------------ REINICIAR ------------------
  function reiniciar() {
    setCobra([{ x: startX, y: startY }]);
    setCobraInimiga([{ x: GRID_SIZE - 2, y: GRID_SIZE - 2 }]);
    latestDirRef.current = DIRECOES.DIREITA;
    setDirecao(DIRECOES.DIREITA);

    const nova = gerarComida([{ x: startX, y: startY }]);
    setComida(nova);
    comidaRef.current = nova;

    setPontos(0);
    setGameOver(false);

    // reset da velocidade
    setVelocidade(MOVE_INTERVAL_MS);

    animSegments.current = [
      new Animated.ValueXY({
        x: startX * CELULA,
        y: startY * CELULA,
      }),
    ];

    iniciarContagem();
  }

  // ------------------ CONTAGEM ------------------
  function iniciarContagem() {
    setContador(3);
    let c = 3;

    const interval = setInterval(() => {
      c -= 1;
      setContador(c);

      if (c <= 0) {
        clearInterval(interval);
        setContador(null);

        // iniciar jogo
        setJogando(true);
        lastTimeRef.current = 0;
      }
    }, 1000);
  }

  // ------------------ FIM PARTE 2 ------------------
  // ------------------ RENDER ------------------

  // =====================================================
  //               TELA DE BOAS-VINDAS
  // =====================================================
  if (showWelcome) {
    return (
      <View style={styles.root}>
        <Animated.View
          style={{
            transform: [{ scale: welcomePulse }],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.title}>Jogo Cobra</Text>
          <Text style={styles.subtitle}>Bem-vindo!</Text>
        </Animated.View>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setShowWelcome(false);
            setShowPlayScreen(true);
          }}
        >
          <Text style={styles.playText}>Continuar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  //               TELA DE PLAY (SIMPLIFICADA)
  // =====================================================
  if (showPlayScreen) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Jogar</Text>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setShowPlayScreen(false);
            setShowModeSelection(true);
          }}
        >
          <Text style={styles.playText}>Escolher Modo</Text>
        </TouchableOpacity>

        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Como Jogar</Text>
          <Text style={styles.instructionsText}>• Deslize o dedo para mover a cobra.</Text>
          <Text style={styles.instructionsText}>• Evite paredes e seu próprio corpo.</Text>
          <Text style={styles.instructionsText}>• Coma a maçã para ganhar pontos.</Text>
        </View>
      </View>
    );
  }

  // =====================================================
  //            TELA DE SELEÇÃO DE MODO
  // =====================================================
  if (showModeSelection) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>Escolher Modo</Text>

        {/* FÁCIL */}
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setModoSelecionado("FACIL");
            setShowModeSelection(false);
            iniciarContagem();
          }}
        >
          <Text style={styles.playText}>Fácil</Text>
        </TouchableOpacity>

        {/* MÉDIO */}
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setModoSelecionado("MEDIO");
            setShowModeSelection(false);
            iniciarContagem();
          }}
        >
          <Text style={styles.playText}>Médio</Text>
        </TouchableOpacity>

        {/* DIFÍCIL */}
        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => {
            setModoSelecionado("DIFICIL");
            setShowModeSelection(false);
            iniciarContagem();
          }}
        >
          <Text style={styles.playText}>Difícil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  //                      CONTAGEM
  // =====================================================
  if (contador !== null) {
    return (
      <View style={styles.root}>
        <Text style={styles.countdown}>
          {contador > 0 ? contador : "JÁ!"}
        </Text>
      </View>
    );
  }

  // =====================================================
  //                      GAME OVER
  // =====================================================
  if (gameOver) {
    return (
      <View style={styles.root}>
        <Text style={styles.gameOverTitle}>GAME OVER</Text>

        <Text style={styles.score}>Pontuação: {pontos}</Text>
        <Text style={styles.score}>Melhor: {melhor}</Text>

        <TouchableOpacity style={styles.playBtn} onPress={reiniciar}>
          <Text style={styles.playText}>Reiniciar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: "#1976d2", marginTop: 10 }]}
          onPress={() => {
            setGameOver(false);
            setShowModeSelection(true);
            setModoSelecionado(null);
            setVelocidade(MOVE_INTERVAL_MS);
          }}
        >
          <Text style={styles.playText}>Voltar ao Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // =====================================================
  //                 JOGO ATIVO — TABULEIRO
  // =====================================================

  return (
    <View style={styles.root} {...pan.panHandlers}>
      <Text style={styles.scoreTop}>
        Modo: {modoSelecionado} | Pontos: {pontos} | Melhor: {melhor}
      </Text>

      <View style={styles.board}>
        {/* Grid */}
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <View
              key={`g-${row}-${col}`}
              style={{
                position: "absolute",
                width: CELULA,
                height: CELULA,
                left: col * CELULA,
                top: row * CELULA,
                borderWidth: 0.5,
                borderColor: "#ddd",
                borderStyle: "dashed",
              }}
            />
          ))
        )}

        {/* Cobra do Jogador */}
        {cobra.map((seg, idx) => {
          const anim = animSegments.current[idx];
          const transform = anim
            ? [{ translateX: anim.x }, { translateY: anim.y }]
            : [{ translateX: seg.x * CELULA }, { translateY: seg.y * CELULA }];

          return (
            <Animated.View
              key={`c-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { backgroundColor: corCobra },
                { transform },
              ]}
            />
          );
        })}

        {/* Cobra Inimiga — modo difícil */}
        {modoSelecionado === "DIFICIL" &&
          cobraInimiga.map((seg, i) => (
            <View
              key={`enemy-${i}`}
              style={{
                position: "absolute",
                width: CELULA - 4,
                height: CELULA - 4,
                left: seg.x * CELULA + 2,
                top: seg.y * CELULA + 2,
                backgroundColor: "#d32f2f",
                borderRadius: 4,
              }}
            />
          ))}

        {/* Comida */}
        <Animated.View
          style={{
            position: "absolute",
            left: comida.x * CELULA + 2,
            top: comida.y * CELULA + 2,
            width: CELULA - 4,
            height: CELULA - 4,
            backgroundColor: "#e53935",
            borderRadius: 5,
            transform: [{ scale: eatAnim }],
          }}
        />
      </View>

      <Text style={styles.playHint}>Deslize para mover</Text>
    </View>
  );

  // ------------------ FIM PARTE 3 ------------------
  // =====================================================
  //                STYLESHEET FINAL
  // =====================================================
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },

  // Títulos
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#ccc",
    marginBottom: 30,
  },

  // Botões
  playBtn: {
    backgroundColor: "#4caf50",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  playText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  // Instruções / caixas
  instructionsBox: {
    marginTop: 20,
    backgroundColor: "#222",
    padding: 14,
    borderRadius: 10,
    width: "80%",
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
  },

  // Contagem
  countdown: {
    color: "#fff",
    fontSize: 70,
    fontWeight: "700",
  },

  // Jogo
  scoreTop: {
    color: "#fff",
    marginBottom: 12,
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
    borderRadius: 5,
  },

  playHint: {
    color: "#bbb",
    marginTop: 10,
  },

  // Game Over
  gameOverTitle: {
    fontSize: 36,
    color: "#ff5252",
    marginBottom: 12,
    fontWeight: "700",
  },
  score: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 6,
  },
});
// ------------------ FIM PARTE 4 ------------------
