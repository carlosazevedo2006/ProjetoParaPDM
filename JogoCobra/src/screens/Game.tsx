// src/Game.tsx
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, PanResponder, Animated } from "react-native";
import { Modo } from "../types/types";

import WelcomeScreen from "../screens/WelcomeScreen";
import ModeSelectScreen from "../screens/ModeSelectScreen";
import CountdownScreen from "../screens/CountdownScreen";
import GameOverScreen from "../screens/GameOverScreen";

import GameBoard from "../components/GameBoard";
import useSnakeMovement from "../hooks/useSnakeMovement";
import useEnemyMovement from "../hooks/useEnemyMovement";
import useGameLoop from "../hooks/useGameLoop";
import { DIRECOES } from "../utils/constants";

export default function Game() {
  // fluxo de telas
  const [showWelcome, setShowWelcome] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(false);

  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);
  const [contador, setContador] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [jogando, setJogando] = useState(false);

  // refs
  const latestDirRef = useRef(DIRECOES.DIREITA);
  const animSegments = useRef<any[]>([]);
  const enemyAnimSegments = useRef<any[]>([]);
  const eatAnim = useRef(new Animated.Value(1)).current;

  // === COBRA DO JOGADOR ===
  const {
    cobra,
    comida,
    pontos,
    melhor,
    velocidade,
    corCobra,

    requestDirecao,
    step,
    resetCobra,
  } = useSnakeMovement({
    latestDirRef,
    eatAnim,
    animSegments,
    modoSelecionado,
    onGameOver: () => {
      setJogando(false);
      setGameOver(true);
    },
  });

  // === COBRA INIMIGA (modo difícil) ===
  const {
    cobraInimiga,
    setCobraInimiga,
    moverCobraInimiga,
  } = useEnemyMovement({
    modoSelecionado,
    cobra,
    enemyAnimSegments,
    terminarJogo: () => {
      setJogando(false);
      setGameOver(true);
    },
  });

  // loop do jogo
  useGameLoop(jogando, velocidade, () => {
    step();
    moverCobraInimiga();
  });

  // === CONTAGEM ANTES DO JOGO ===
  function iniciarContagem() {
    setJogando(false);
    setContador(3);

    let c = 3;
    const id = setInterval(() => {
      c--;
      setContador(c);

      if (c <= 0) {
        clearInterval(id);
        setContador(null);
        setJogando(true);
      }
    }, 1000);
  }

  // === REINICIAR JOGO ===
  function reiniciar() {
    resetCobra();
    latestDirRef.current = DIRECOES.DIREITA;

    setCobraInimiga([{ x: 8, y: 8 }]);
    enemyAnimSegments.current = [];

    setPontos(0);
    setGameOver(false);
    iniciarContagem();
  }

  // === SWIPE (gestos) ===
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderRelease: (_, g) => {
        const { dx, dy } = g;
        const thresh = 14;

        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        if (absX < thresh && absY < thresh) return;

        if (absX > absY) {
          requestDirecao(dx > 0 ? DIRECOES.DIREITA : DIRECOES.ESQUERDA);
        } else {
          requestDirecao(dy > 0 ? DIRECOES.BAIXO : DIRECOES.CIMA);
        }
      },
    })
  ).current;

  // ============================
  //         RENDER FLOW
  // ============================

  if (showWelcome) {
    return (
      <WelcomeScreen
        onContinue={() => {
          setShowWelcome(false);
          setShowModeSelection(true);
        }}
      />
    );
  }

  if (showModeSelection) {
    return (
      <ModeSelectScreen
        onSelect={(modo: Modo) => {
          setModoSelecionado(modo);

          // reset tudo ao entrar no modo
          resetCobra();
          setCobraInimiga([{ x: 8, y: 8 }]);
          enemyAnimSegments.current = [];

          setShowModeSelection(false);
          iniciarContagem();
        }}
      />
    );
  }

  if (contador !== null) {
    return <CountdownScreen value={contador} />;
  }

  if (gameOver) {
    return (
      <GameOverScreen
        pontos={pontos}
        melhor={melhor}
        onRestart={reiniciar}
        onMenu={() => {
          resetCobra();
          setShowModeSelection(true);
          setModoSelecionado(null);
        }}
      />
    );
  }

  // === JOGO A DECORRER ===
  return (
    <View style={styles.root}>
      <Text style={styles.score}>
        {modoSelecionado} | {pontos} pts | REC: {melhor}
      </Text>

      <GameBoard
        cobra={cobra}
        cobraInimiga={cobraInimiga}
        comida={comida}
        animSegments={animSegments.current}
        enemyAnimSegments={enemyAnimSegments.current}
        eatAnim={eatAnim}
        corCobra={corCobra}
        modoSelecionado={modoSelecionado}
        panHandlers={panResponder.panHandlers}
      />

      <Text style={styles.tip}>Deslize para mover a cobra</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
  },

  score: {
    fontSize: 20,
    color: "#00ff66",
    marginBottom: 16,
  },

  tip: {
    color: "#fff",
    fontSize: 14,
    marginTop: 20,
  },
});
