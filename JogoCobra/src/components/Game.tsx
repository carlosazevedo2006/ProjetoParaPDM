// src/components/Game.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, PanResponder, TouchableOpacity } from "react-native";
import { gerarComida, igual } from "../utils/constants"; // usa a tua função existente
import { Posicao } from "../types/types";
import { useSettings } from "../context/SettingsContext";
import { DIFICULDADES } from "../config/dificuldades";

// Notas:
// - Este Game.tsx foi adaptado para ler as configurações do contexto.
// - O GRID_SIZE e CELULA dinâmico: para simplificar, usamos CELULA fixo e recalculamos o board baseado no gridSize.
// - Mantivemos animações e lógica ortogonal; adicionámos cobra inimiga com movimento simples.

const DEFAULT_CELULA = 30; // cada célula em px (podes ajustar)
const MIN_CELL = 18;

export default function Game({ navigation }: any) {
  const { settings, getActiveDificuldade } = useSettings();

  // grid e célula (dentro de limites razoáveis)
  const GRID_SIZE = Math.max(8, Math.min(20, settings.customGridSize || 12));
  // garantir que a célula não fique demasiado grande para o ecrã é tarefa de UI,
  // aqui fixamos um valor razoável; podes calcular dinamicamente via Dimensions se quiseres
  const CELULA = Math.max(MIN_CELL, DEFAULT_CELULA);

  // calcular dificuldade activa
  const dific = getActiveDificuldade();

  // velocidade base (ms por passo)
  const velocidadeBaseMs = dific ? dific.velocidadeBaseMs : 300;
  const aumentaVel = dific ? dific.aumentaVelocidade : false;
  const incrementoPor3 = dific ? (dific.incrementoPor3ComidasMs ?? 0) : 0;
  const inimigaAtiva = dific ? dific.cobraInimiga : false;
  const inimigaFactor = dific ? (dific.inimigaSpeedFactor ?? 1.0) : 1.0;

  // estado do jogo
  const startX = Math.floor(GRID_SIZE / 2);
  const startY = Math.floor(GRID_SIZE / 2);

  const [cobra, setCobra] = useState<Posicao[]>([{ x: startX, y: startY }]);
  const [direcao, setDirecao] = useState<Posicao>({ x: 1, y: 0 });
  const latestDirRef = useRef(direcao);
  useEffect(() => { latestDirRef.current = direcao; }, [direcao]);

  const [comida, setComida] = useState<Posicao>(() => gerarComida([{ x: startX, y: startY }]));
  const comidaRef = useRef(comida);
  useEffect(() => { comidaRef.current = comida; }, [comida]);

  const [pontos, setPontos] = useState(0);
  const [melhor, setMelhor] = useState<number>(() => 0);
  const [jogando, setJogando] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [contador, setContador] = useState<number | null>(null);

  // animações
  const animSegments = useRef<Animated.ValueXY[]>([new Animated.ValueXY({ x: startX * CELULA, y: startY * CELULA })]).current;
  const eatAnim = useRef(new Animated.Value(1)).current;

  // velocidade actual (ms), recalculada com base na base + pontos
  const [velMs, setVelMs] = useState<number>(velocidadeBaseMs);

  // cobra inimiga (ghost) — simples AI
  const [enemy, setEnemy] = useState<Posicao[] | null>(inimigaAtiva ? [{ x: 1, y: 1 }, { x: 1, y: 2 }] : null);
  const enemyDirRef = useRef<Posicao>({ x: 1, y: 0 });
  const enemyAnimSegments = useRef<Animated.ValueXY[]>([]);

  // inicializar enemyAnimSegments
  useEffect(() => {
    if (enemy) {
      enemyAnimSegments.current = enemy.map((seg) => new Animated.ValueXY({ x: seg.x * CELULA, y: seg.y * CELULA }));
    } else {
      enemyAnimSegments.current = [];
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enemy]);

  // ajustar velMs quando dificuldade muda ou quando pontos mudarem (se aumentaVel)
  useEffect(() => {
    let base = velocidadeBaseMs;
    if (aumentaVel && incrementoPor3 > 0) {
      // a cada 3 pontos reduzimos base em incrementoPor3 ms (até um limite)
      const factor = Math.floor(pontos / 3);
      base = Math.max(80, velocidadeBaseMs - factor * incrementoPor3);
    }
    setVelMs(base);
  }, [pontos, velocidadeBaseMs, aumentaVel, incrementoPor3]);

  // Contagem 3..2..1
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
      }
    }, 1000);
  }

  // iniciar jogo ao mount
  useEffect(() => {
    iniciarContagem();
    // carregar melhor pontuação se quiseres (AsyncStorage) — deixei fora para não duplicar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loop do jogador
  useEffect(() => {
    if (!jogando) return;
    const id = setInterval(() => step(), velMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jogando, velMs, cobra]);

  // Loop da inimiga (se activa) — usa factor de velocidade
  useEffect(() => {
    if (!jogando || !enemy) return;
    const enemyMs = Math.max(60, Math.round(velMs / inimigaFactor));
    const id = setInterval(() => stepEnemy(), enemyMs);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jogando, velMs, enemy]);

  // MOVIMENTO DO JOGADOR (1 célula por step)
  function step() {
    setCobra((prev) => {
      const head = prev[0];
      const dir = latestDirRef.current;
      const novaHead = { x: head.x + dir.x, y: head.y + dir.y };

      // colisão paredes
      if (novaHead.x < 0 || novaHead.x >= GRID_SIZE || novaHead.y < 0 || novaHead.y >= GRID_SIZE) {
        acabarJogo();
        return prev;
      }

      // colisão com o próprio corpo
      if (prev.some((seg) => igual(seg, novaHead))) {
        acabarJogo();
        return prev;
      }

      // colisão com inimiga (se activa)
      if (enemy) {
        if (enemy.some((seg) => seg.x === novaHead.x && seg.y === novaHead.y)) {
          acabarJogo();
          return prev;
        }
      }

      let nova = [novaHead, ...prev];

      // comer comida?
      if (novaHead.x === comidaRef.current.x && novaHead.y === comidaRef.current.y) {
        // pontua
        setPontos((p) => {
          const np = p + 1;
          if (np > melhor) setMelhor(np);
          return np;
        });

        // animação comida
        Animated.sequence([
          Animated.timing(eatAnim, { toValue: 1.3, duration: 100, useNativeDriver: true }),
          Animated.timing(eatAnim, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]).start();

        // gerar nova comida num local livre (inclui inimiga e cobra)
        const ocupados = nova.concat(enemy ?? []);
        const next = gerarComida(ocupados);
        setComida(next);
        comidaRef.current = next;
        // não remover cauda (cresce)
      } else {
        // movimento normal: remove cauda
        nova.pop();
      }

      // animações dos segmentos sincronizados com celula
      while (animSegments.length < nova.length) {
        animSegments.push(new Animated.ValueXY({ x: nova[animSegments.length].x * CELULA, y: nova[animSegments.length].y * CELULA }));
      }
      nova.forEach((seg, idx) => {
        Animated.timing(animSegments[idx], {
          toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
          duration: velMs,
          useNativeDriver: false,
        }).start();
      });

      return nova;
    });
  }

  // MOVIMENTO DA COBRA INIMIGA (simples AI aleatória com prevenção de inversão)
  function stepEnemy() {
    if (!enemy) return;
    setEnemy((prev) => {
      if (!prev || prev.length === 0) return prev;
      const head = prev[0];
      const dir = enemyDirRef.current;

      // tenta manter a direcção, mas escolher aleatoriamente nova direção válida
      const poss = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 },
      ];

      // filtrar inversão direta
      const filtered = poss.filter((p) => !(p.x === -dir.x && p.y === -dir.y));

      // ordenar por prioridade: mover em direção à comida/jogador com probabilidade
      // simples heurística: 50% escolhe direção aleatória válida; 50% tenta aproximar-se do jogador
      let novoDir = filtered[Math.floor(Math.random() * filtered.length)];

      if (Math.random() < 0.5) {
        // tentar aproximar ao jogador
        const target = cobra[0];
        const dx = target.x - head.x;
        const dy = target.y - head.y;
        const cand: Posicao[] = [];
        if (Math.abs(dx) > Math.abs(dy)) {
          cand.push({ x: Math.sign(dx), y: 0 }, { x: 0, y: Math.sign(dy) });
        } else {
          cand.push({ x: 0, y: Math.sign(dy) }, { x: Math.sign(dx), y: 0 });
        }
        // validar candidatos
        for (const c of cand) {
          const nx = head.x + c.x;
          const ny = head.y + c.y;
          const collides = (nx < 0 || ny < 0 || nx >= GRID_SIZE || ny >= GRID_SIZE)
            || enemy!.some((s) => s.x === nx && s.y === ny)
            || cobra.some((s) => s.x === nx && s.y === ny);
          if (!collides) {
            novoDir = c;
            break;
          }
        }
      }

      // agora aplicar novoDir se válido; senão escolher outro aleatório
      let newHead = { x: head.x + novoDir.x, y: head.y + novoDir.y };
      let attempts = 0;
      while ((newHead.x < 0 || newHead.y < 0 || newHead.x >= GRID_SIZE || newHead.y >= GRID_SIZE
             || prev.some((s) => s.x === newHead.x && s.y === newHead.y)
             || cobra.some((s) => s.x === newHead.x && s.y === newHead.y))
             && attempts < 10) {
        novoDir = filtered[Math.floor(Math.random() * filtered.length)];
        newHead = { x: head.x + novoDir.x, y: head.y + novoDir.y };
        attempts++;
      }

      // Se não encontrou movimento válido, mantém
      if (attempts >= 10 && (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE)) {
        return prev; // sem movimento
      }

      enemyDirRef.current = novoDir;

      const novaEnemy = [{ x: newHead.x, y: newHead.y }, ...prev];
      // a inimiga NÃO cresce com comida (simplificação) — remove cauda
      novaEnemy.pop();

      // colisões entre inimiga e jogador
      // se heads colidirem -> game over
      if (novaEnemy[0].x === cobra[0].x && novaEnemy[0].y === cobra[0].y) {
        acabarJogo();
        return prev;
      }
      // se inimiga chocar corpo do jogador -> jogador perde
      if (cobra.some((s) => s.x === novaEnemy[0].x && s.y === novaEnemy[0].y)) {
        acabarJogo();
        return prev;
      }

      // animar enemy
      while (enemyAnimSegments.current.length < novaEnemy.length) {
        enemyAnimSegments.current.push(new Animated.ValueXY({ x: novaEnemy[enemyAnimSegments.current.length].x * CELULA, y: novaEnemy[enemyAnimSegments.current.length].y * CELULA }));
      }
      novaEnemy.forEach((seg, idx) => {
        Animated.timing(enemyAnimSegments.current[idx], {
          toValue: { x: seg.x * CELULA, y: seg.y * CELULA },
          duration: Math.max(60, Math.round(velMs / inimigaFactor)),
          useNativeDriver: false,
        }).start();
      });

      return novaEnemy;
    });
  }

  // Pedir mudança de direcção via swipe (apenas ao fim do passo — evita diagonais)
  function requestDirecao(nova: Posicao) {
    const atual = latestDirRef.current;
    if (nova.x === -atual.x && nova.y === -atual.y) return; // evita inversao
    // garantir virar só entre células (simplificação: aceitável aqui)
    latestDirRef.current = nova;
    setDirecao(nova);
  }

  // terminar jogo
  function acabarJogo() {
    setJogando(false);
    setGameOver(true);
  }

  // reiniciar
  function reiniciar() {
    setCobra([{ x: startX, y: startY }]);
    setDirecao({ x: 1, y: 0 });
    latestDirRef.current = { x: 1, y: 0 };
    const initComida = gerarComida([{ x: startX, y: startY }]);
    setComida(initComida);
    comidaRef.current = initComida;
    setPontos(0);
    setGameOver(false);
    if (inimigaAtiva) {
      setEnemy([{ x: 1, y: 1 }, { x: 1, y: 2 }]);
    } else {
      setEnemy(null);
    }
    iniciarContagem();
  }

  // swipe handler
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (_e, gesture) => {
      const { dx, dy } = gesture;
      const thresh = 12;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > thresh) requestDirecao({ x: 1, y: 0 });
        else if (dx < -thresh) requestDirecao({ x: -1, y: 0 });
      } else {
        if (dy > thresh) requestDirecao({ x: 0, y: 1 });
        else if (dy < -thresh) requestDirecao({ x: 0, y: -1 });
      }
    },
  })).current;

  // RENDER
  return (
    <View style={styles.root} {...pan.panHandlers}>
      {/* Cabeçalho */}
      <View style={{ width: GRID_SIZE * CELULA, alignItems: "center", marginBottom: 8 }}>
        <Text style={{ color: "#fff", fontSize: 18 }}>Pontos: {pontos} · Melhor: {melhor}</Text>
      </View>

      {/* Tabuleiro centralizado */}
      <View style={[styles.board, { width: GRID_SIZE * CELULA, height: GRID_SIZE * CELULA, backgroundColor: settings.corTabuleiro }]}>
        {/* Grid tracejada opcional (se quiseres manter) */}
        {Array.from({ length: GRID_SIZE }).map((_, row) =>
          Array.from({ length: GRID_SIZE }).map((_, col) => (
            <View
              key={`g-${row}-${col}`}
              style={{
                position: "absolute",
                left: col * CELULA,
                top: row * CELULA,
                width: CELULA,
                height: CELULA,
                borderWidth: 0.4,
                borderColor: "#999",
                borderStyle: "dashed",
              }}
            />
          ))
        )}

        {/* Cobra do jogador (cada segmento animado) */}
        {cobra.map((seg, idx) => {
          const anim = animSegments[idx] ?? new Animated.ValueXY({ x: seg.x * CELULA, y: seg.y * CELULA });
          return (
            <Animated.View
              key={`pseg-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { width: CELULA - 4, height: CELULA - 4, borderRadius: 6, backgroundColor: settings.corCobra },
                { transform: [{ translateX: anim.x }, { translateY: anim.y }] },
              ]}
            />
          );
        })}

        {/* Cobra inimiga (ghost) semi-transparente */}
        {enemy && enemyAnimSegments.current && enemyAnimSegments.current.map((anim, idx) => {
          const seg = (enemy as Posicao[])[idx];
          return (
            <Animated.View
              key={`enseg-${idx}-${seg.x}-${seg.y}`}
              style={[
                styles.segment,
                { width: CELULA - 4, height: CELULA - 4, borderRadius: 6, backgroundColor: "black", opacity: 0.35 },
                { transform: [{ translateX: anim.x }, { translateY: anim.y }] },
              ]}
            />
          );
        })}

        {/* Maçã */}
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
      </View>

      {/* Controles / UI */}
      {!jogando && contador !== null && <Text style={{ color: "#fff", marginTop: 12, fontSize: 36 }}>{contador > 0 ? String(contador) : "JÁ!"}</Text>}

      {gameOver && (
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <Text style={{ color: "#ff5252", fontSize: 28, marginBottom: 8 }}>GAME OVER</Text>
          <TouchableOpacity style={styles.playBtn} onPress={reiniciar}><Text style={{ color: "#fff" }}>REINICIAR</Text></TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#222", alignItems: "center", justifyContent: "center" },
  board: { backgroundColor: "#fff", borderWidth: 2, borderColor: "#555", position: "relative", overflow: "hidden" },
  segment: { position: "absolute" },
  playBtn: { backgroundColor: "#4caf50", paddingHorizontal: 18, paddingVertical: 8, borderRadius: 8 },
});
