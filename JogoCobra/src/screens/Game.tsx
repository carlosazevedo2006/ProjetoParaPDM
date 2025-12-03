// src/Game.tsx
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, PanResponder } from "react-native";
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
  // Fluxo de telas
  const [showWelcome, setShowWelcome] = useState(true);
  const [showModeSelection, setShowModeSelection] = useState(false);

  const [modoSelecionado, setModoSelecionado] = useState<Modo | null>(null);
  const [contador, setContador] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Refs e animações
  const latestDirRef = useRef(DIRECOES.DIREITA);
  const eatAnim = useRef(new Animated.Value(1)).current;
  const animSegments = useRef<any[]>([]);

  // Hook principal da cobra
  const {
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
  } = useSnakeMovement({
    latestDirRef,
    eatAnim,
    animSegments,
    modoSelecionado,
    onGameOver: () => setGameOver(true),
  });

  // Hook inimigo (modo difícil)
  const { cobraInimiga, setCobraInimiga, moverCobraInimiga } = useEnemyMovement({
    modoSelecionado,
    cobra,
    terminarJogo: () => setGameOver(true),
  });

  // Loop do jogo
  const [jogando, setJogando] = useState(false);
  useGameLoop(jogando, velocidade, () => {
    step();
    moverCobraInimiga();
  });

  // Contagem inicial
  function iniciarContagem() {
    setJogando (false);
    setContador(3);
    let c = 3;

    const id = setInterval(() => {
      c -= 1;
      setContador(c);

      if (c <= 0) {
        clearInterval(id);
        setContador(null);
        setJogando(true);
      }
    }, 1000);
  }

  // Reiniciar jogo
  function reiniciar() {
    resetCobra();
    latestDirRef.current = DIRECOES.DIREITA;
    setJogando(false);
    setCobraInimiga([{ x: 8, y: 8 }]);
    setPontos(0);
    setGameOver(false);
    iniciarContagem();
  }

  
  // Swipe — TIPO 1 (clássico)
const panResponder = useRef(
  PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,

    onPanResponderRelease: (_evt, g) => {
      const { dx, dy } = g;

      // novo threshold mais seguro
      const thresh = 14;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      // IGNORA movimentos fracos / toques rápidos
      if (absX < thresh && absY < thresh) return;

      // detectar eixo dominante
      if (absX > absY) {
        // horizontal
        if (dx > 0) requestDirecao(DIRECOES.DIREITA);
        else requestDirecao(DIRECOES.ESQUERDA);
      } else {
        // vertical
        if (dy > 0) requestDirecao(DIRECOES.BAIXO);
        else requestDirecao(DIRECOES.CIMA);
      }
    },
  })
).current;


  // -----------------------------
  // RENDER FLOW
  // -----------------------------
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

    // 🔥 reset total ao estado da cobra ANTES da contagem
    resetCobra();              
    setVelocidade(300);        
    latestDirRef.current = DIRECOES.DIREITA;
    setCobraInimiga([{ x: 8, y: 8 }]);

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
          setShowModeSelection(true);
          setModoSelecionado(null);
        }}
      />
    );
  }

  // Jogo ativo
  return (
    <View style={styles.root}>
      <Text style={styles.score}>
        Modo: {modoSelecionado} | Pontos: {pontos} | Melhor: {melhor}
      </Text>

      <GameBoard
        cobra={cobra}
        cobraInimiga={cobraInimiga}
        comida={comida}
        animSegments={animSegments.current}
        eatAnim={eatAnim}
        corCobra={corCobra}
        modoSelecionado={modoSelecionado}
        panHandlers={panResponder.panHandlers}
        onRequestDirecao={requestDirecao}
      />
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
    color: "#fff",
    marginBottom: 16,
    fontSize: 16,
  },
});

