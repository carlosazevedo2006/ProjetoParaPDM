import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Vibration,
  Animated,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GRID_SIZE, 
  DIRECTIONS, 
  COLORS, 
  generateFood, 
  positionsEqual 
} from '../utils/constants';
import { Position, GameState, GameStatus } from '../types';

const { width, height } = Dimensions.get('window');

// Configuração do jogo
const GAME_CONFIG = {
  baseSpeed: 200,
  minSpeed: 100,
  speedIncrease: 8,
  enemyActive: true,
  enemySpeed: 1.8,
};

export default function Game() {
  // Estado do jogo
  const [gameState, setGameState] = useState<GameState>(() => {
    const center = Math.floor(GRID_SIZE / 2);
    return {
      snake: [{ x: center, y: center }],
      enemy: [{ x: center - 3, y: center - 3 }],
      food: { x: -1, y: -1 },
      direction: DIRECTIONS.RIGHT,
      enemyDirection: DIRECTIONS.LEFT,
      gameOver: false,
      score: 0,
      isPaused: false,
    };
  });

  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState<GameStatus>('countdown');
  const [countdown, setCountdown] = useState(3);
  
  // Refs
  const gameStateRef = useRef(gameState);
  const gameStatusRef = useRef(gameStatus);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const enemyLoopRef = useRef<NodeJS.Timeout>();

  // ✅ NOVO: Estado para mostrar direção do gesto
  const [swipeDirection, setSwipeDirection] = useState<string>('');
  const swipeAnimation = useRef(new Animated.Value(0)).current;

  // Efeitos de animação
  const foodScale = useRef(new Animated.Value(1)).current;
  const scoreScale = useRef(new Animated.Value(1)).current;

  // ✅ ATUALIZAR REFS
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    gameStatusRef.current = gameStatus;
  }, [gameStatus]);

  // ✅ CARREGAR RECORDE
  useEffect(() => {
    loadHighScore();
  }, []);

  const loadHighScore = async () => {
    try {
      const value = await AsyncStorage.getItem('highScore');
      if (value) setHighScore(parseInt(value));
    } catch (error) {
      console.error('Erro ao carregar recorde:', error);
    }
  };

  // ✅ SALVAR RECORDE
  useEffect(() => {
    if (gameState.gameOver && gameState.score > highScore) {
      AsyncStorage.setItem('highScore', gameState.score.toString());
      setHighScore(gameState.score);
    }
  }, [gameState.gameOver, gameState.score, highScore]);

  // ✅ CONTAGEM REGRESSIVA
  useEffect(() => {
    if (gameStatus !== 'countdown') return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setGameStatus('playing');
          initializeFood();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // ✅ INICIALIZAR COMIDA
  const initializeFood = () => {
    setGameState(prev => ({
      ...prev,
      food: generateFood(prev.snake, prev.enemy)
    }));
  };

  // ✅ CALCULAR VELOCIDADE
  const getGameSpeed = useCallback(() => {
    const reduction = gameState.score * GAME_CONFIG.speedIncrease;
    return Math.max(GAME_CONFIG.minSpeed, GAME_CONFIG.baseSpeed - reduction);
  }, [gameState.score]);

  // ✅ EFEITO DE COMIDA
  const animateFood = useCallback(() => {
    Animated.sequence([
      Animated.timing(foodScale, {
        toValue: 1.3,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(foodScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [foodScale]);

  // ✅ EFEITO DE PONTUAÇÃO
  const animateScore = useCallback(() => {
    Animated.sequence([
      Animated.timing(scoreScale, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scoreScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scoreScale]);

  // ✅ EFEITO VISUAL DO GESTO
  const showSwipeFeedback = useCallback((direction: string) => {
    setSwipeDirection(direction);
    
    // Animação de feedback
    Animated.sequence([
      Animated.timing(swipeAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(swipeAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSwipeDirection('');
    });
  }, [swipeAnimation]);

  // ✅ MOVIMENTO DA COBRA INIMIGA (SEGUE O JOGADOR)
  const moveEnemy = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;

    setGameState(prev => {
      const { enemy, enemyDirection, snake } = prev;
      const head = enemy[0];
      const playerHead = snake[0];

      // Calcular direção para seguir o jogador
      const dx = playerHead.x - head.x;
      const dy = playerHead.y - head.y;

      let newDirection = enemyDirection;

      // Escolher direção baseada na maior distância
      if (Math.abs(dx) > Math.abs(dy)) {
        newDirection = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
      } else {
        newDirection = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
      }

      // Evitar movimento inverso
      if (newDirection.x === -enemyDirection.x && newDirection.y === -enemyDirection.y) {
        newDirection = enemyDirection;
      }

      const newHead = {
        x: head.x + newDirection.x,
        y: head.y + newDirection.y,
      };

      // Verificar limites
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        return prev; // Não mover se for sair do grid
      }

      let newEnemy = [newHead, ...enemy];
      
      // Verificar se comeu comida (mas não aumenta pontuação)
      if (positionsEqual(newHead, prev.food)) {
        // Gera nova comida
        setGameState(current => ({
          ...current,
          food: generateFood(current.snake, newEnemy)
        }));
        animateFood();
      } else {
        newEnemy.pop();
      }

      return {
        ...prev,
        enemy: newEnemy,
        enemyDirection: newDirection,
      };
    });
  }, [animateFood]);

  // ✅ LOOP PRINCIPAL DO JOGO
  const gameLoop = useCallback(() => {
    if (gameStatusRef.current !== 'playing') return;

    setGameState(prev => {
      const { snake, direction, enemy, food } = prev;
      const head = snake[0];

      // Calcular nova posição da cabeça
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      // ✅ VERIFICAÇÕES DE COLISÃO
      // Colisão com paredes
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        Vibration.vibrate(400);
        setGameStatus('game-over');
        return { ...prev, gameOver: true };
      }

      // Colisão com próprio corpo
      if (snake.slice(1).some(segment => positionsEqual(segment, newHead))) {
        Vibration.vibrate(400);
        setGameStatus('game-over');
        return { ...prev, gameOver: true };
      }

      // Colisão com inimiga
      if (GAME_CONFIG.enemyActive && 
          enemy.some(segment => positionsEqual(segment, newHead))) {
        Vibration.vibrate(400);
        setGameStatus('game-over');
        return { ...prev, gameOver: true };
      }

      let newSnake = [newHead, ...snake];
      let newScore = prev.score;
      let newFood = food;

      // ✅ VERIFICAR SE COMEU COMIDA
      if (positionsEqual(newHead, food)) {
        newScore += 1;
        newFood = generateFood(newSnake, enemy);
        animateFood();
        animateScore();
        Vibration.vibrate(50);
      } else {
        newSnake.pop();
      }

      return {
        ...prev,
        snake: newSnake,
        score: newScore,
        food: newFood,
      };
    });
  }, [animateFood, animateScore]);

  // ✅ CONFIGURAR INTERVALOS DE JOGO
  useEffect(() => {
    if (gameStatus === 'playing') {
      const speed = getGameSpeed();
      
      // Loop principal
      gameLoopRef.current = setInterval(gameLoop, speed);
      
      // Loop da inimiga (mais lento)
      if (GAME_CONFIG.enemyActive) {
        enemyLoopRef.current = setInterval(moveEnemy, speed * GAME_CONFIG.enemySpeed);
      }
    }

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      if (enemyLoopRef.current) clearInterval(enemyLoopRef.current);
    };
  }, [gameStatus, getGameSpeed, gameLoop, moveEnemy]);

  // ✅ ✅ ✅ SISTEMA DE GESTOS COMPLETAMENTE REFEITO
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Sempre permitir que o PanResponder capture o gesto
        return true;
      },
      onPanResponderMove: (_, gestureState) => {
        // Podemos usar isso para feedback visual em tempo real se necessário
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gameStatus !== 'playing') return;

        const { dx, dy } = gestureState;
        const currentDirection = gameStateRef.current.direction;

        // ✅ LIMIARES AJUSTADOS PARA MAIOR PRECISÃO
        const SWIPE_THRESHOLD = 20;
        const VELOCITY_THRESHOLD = 0.5;

        // Ignorar gestos muito curtos
        if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) {
          return;
        }

        // ✅ DETECÇÃO MELHORADA DE DIREÇÃO
        const isHorizontal = Math.abs(dx) > Math.abs(dy);
        const isFastSwipe = Math.abs(gestureState.vx) > VELOCITY_THRESHOLD || 
                           Math.abs(gestureState.vy) > VELOCITY_THRESHOLD;

        let newDirection = currentDirection;
        let directionName = '';

        if (isHorizontal) {
          // GESTO HORIZONTAL
          if (dx > 0) {
            // ✅ DIREITA - Verificar se não é movimento inverso
            if (currentDirection !== DIRECTIONS.LEFT) {
              newDirection = DIRECTIONS.RIGHT;
              directionName = 'DIREITA';
              showSwipeFeedback('→');
            }
          } else {
            // ✅ ESQUERDA - Verificar se não é movimento inverso
            if (currentDirection !== DIRECTIONS.RIGHT) {
              newDirection = DIRECTIONS.LEFT;
              directionName = 'ESQUERDA';
              showSwipeFeedback('←');
            }
          }
        } else {
          // GESTO VERTICAL
          if (dy > 0) {
            // ✅ BAIXO - Verificar se não é movimento inverso
            if (currentDirection !== DIRECTIONS.UP) {
              newDirection = DIRECTIONS.DOWN;
              directionName = 'BAIXO';
              showSwipeFeedback('↓');
            }
          } else {
            // ✅ CIMA - Verificar se não é movimento inverso
            if (currentDirection !== DIRECTIONS.DOWN) {
              newDirection = DIRECTIONS.UP;
              directionName = 'CIMA';
              showSwipeFeedback('↑');
            }
          }
        }

        // ✅ APLICAR NOVA DIREÇÃO SE FOR VÁLIDA
        if (newDirection !== currentDirection) {
          setGameState(prev => ({ 
            ...prev, 
            direction: newDirection 
          }));
          
          // Feedback de vibração suave para confirmação
          if (isFastSwipe) {
            Vibration.vibrate(25);
          }
        }
      },
    })
  ).current;

  // ✅ REINICIAR JOGO
  const restartGame = () => {
    const center = Math.floor(GRID_SIZE / 2);
    setGameState({
      snake: [{ x: center, y: center }],
      enemy: [{ x: center - 3, y: center - 3 }],
      food: { x: -1, y: -1 },
      direction: DIRECTIONS.RIGHT,
      enemyDirection: DIRECTIONS.LEFT,
      gameOver: false,
      score: 0,
      isPaused: false,
    });
    setGameStatus('countdown');
    setCountdown(3);
  };

  // ✅ PAUSAR/RECOMEÇAR
  const togglePause = () => {
    if (gameStatus === 'playing') {
      setGameStatus('paused');
    } else if (gameStatus === 'paused') {
      setGameStatus('playing');
    }
  };

  // ✅ CALCULAR TAMANHO DO GRID
  const calculateGridSize = () => {
    const maxGridWidth = width * 0.85;
    const maxGridHeight = height * 0.6;
    const cellSizeBasedOnWidth = Math.floor(maxGridWidth / GRID_SIZE);
    const cellSizeBasedOnHeight = Math.floor(maxGridHeight / GRID_SIZE);
    return Math.min(cellSizeBasedOnWidth, cellSizeBasedOnHeight, 35);
  };

  const cellSize = calculateGridSize();
  const gridSize = cellSize * GRID_SIZE;

  // ✅ RENDERIZAR CÉLULA DO GRID
  const renderCell = (x: number, y: number) => {
    const { snake, enemy, food } = gameState;
    
    const isSnake = snake.some(pos => positionsEqual(pos, { x, y }));
    const isSnakeHead = positionsEqual(snake[0], { x, y });
    const isEnemy = enemy.some(pos => positionsEqual(pos, { x, y }));
    const isEnemyHead = positionsEqual(enemy[0], { x, y });
    const isFood = positionsEqual(food, { x, y });

    let backgroundColor = COLORS.grid;
    let borderColor = COLORS.gridLine;

    if (isSnakeHead) {
      backgroundColor = COLORS.snakeHead;
      borderColor = COLORS.snakeHead;
    } else if (isSnake) {
      backgroundColor = COLORS.snake;
      borderColor = COLORS.snake;
    } else if (isEnemyHead) {
      backgroundColor = COLORS.enemyHead;
      borderColor = COLORS.enemyHead;
    } else if (isEnemy) {
      backgroundColor = COLORS.enemy;
      borderColor = COLORS.enemy;
    } else if (isFood) {
      backgroundColor = COLORS.food;
      borderColor = COLORS.food;
    }

    return (
      <View
        key={`${x}-${y}`}
        style={[
          styles.cell,
          {
            width: cellSize,
            height: cellSize,
            backgroundColor,
            borderColor,
          },
        ]}
      >
        {isFood && (
          <Animated.View
            style={[
              styles.foodInner,
              {
                transform: [{ scale: foodScale }],
                backgroundColor: COLORS.food,
              },
            ]}
          />
        )}
      </View>
    );
  };

  // ✅ RENDERIZAR FEEDBACK DO GESTO
  const renderSwipeFeedback = () => {
    if (!swipeDirection) return null;

    return (
      <Animated.View
        style={[
          styles.swipeFeedback,
          {
            opacity: swipeAnimation,
            transform: [
              { 
                scale: swipeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1.2]
                })
              }
            ],
          },
        ]}
      >
        <Text style={styles.swipeFeedbackText}>{swipeDirection}</Text>
      </Animated.View>
    );
  };

  // ✅ RENDERIZAR TELA
  return (
    <View style={styles.container}>
      {/* CABEÇALHO */}
      <View style={styles.header}>
        <Animated.Text 
          style={[
            styles.score, 
            { transform: [{ scale: scoreScale }] }
          ]}
        >
          Pontuação: {gameState.score}
        </Animated.Text>
        <Text style={styles.highScore}>Recorde: {highScore}</Text>
      </View>

      {/* ✅ ÁREA DE GESTOS EXPANDIDA - AGORA COBRE TODA A TELA DO JOGO */}
      <View 
        style={styles.gestureArea}
        {...panResponder.panHandlers}
      >
        {/* TABULEIRO */}
        <View style={styles.gameArea}>
          <View 
            style={[
              styles.gridContainer,
              { width: gridSize, height: gridSize }
            ]}
          >
            <View style={styles.grid}>
              {Array.from({ length: GRID_SIZE }).map((_, y) =>
                Array.from({ length: GRID_SIZE }).map((_, x) =>
                  renderCell(x, y)
                )
              )}
            </View>
          </View>

          {/* ✅ FEEDBACK VISUAL DOS GESTOS */}
          {renderSwipeFeedback()}

          {/* ✅ INSTRUÇÕES DE CONTROLE (apenas no início) */}
          {gameStatus === 'countdown' && countdown === 3 && (
            <View style={styles.instructions}>
              <Text style={styles.instructionsText}>
                Deslize para controlar a cobra
              </Text>
              <View style={styles.arrows}>
                <Text style={styles.arrow}>↑</Text>
                <Text style={styles.arrow}>↓</Text>
                <Text style={styles.arrow}>←</Text>
                <Text style={styles.arrow}>→</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* CONTROLES */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={togglePause}>
          <Text style={styles.buttonText}>
            {gameStatus === 'paused' ? 'Continuar' : 'Pausar'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={restartGame}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAYS */}
      
      {/* CONTAGEM REGRESSIVA */}
      {gameStatus === 'countdown' && countdown > 0 && (
        <View style={styles.overlay}>
          <Text style={styles.countdownText}>{countdown}</Text>
        </View>
      )}

      {/* JOGO PAUSADO */}
      {gameStatus === 'paused' && (
        <View style={styles.overlay}>
          <Text style={styles.pausedText}>Jogo Pausado</Text>
          <TouchableOpacity style={styles.bigButton} onPress={togglePause}>
            <Text style={styles.bigButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FIM DE JOGO */}
      {gameStatus === 'game-over' && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Fim de Jogo!</Text>
          <Text style={styles.finalScore}>Pontuação: {gameState.score}</Text>
          <TouchableOpacity style={styles.bigButton} onPress={restartGame}>
            <Text style={styles.bigButtonText}>Jogar Novamente</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ✅ ESTILOS ATUALIZADOS COM NOVOS ELEMENTOS DE GESTO
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gridLine,
  },
  score: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  highScore: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  // ✅ NOVA: Área de gestos expandida
  gestureArea: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gridContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  grid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.grid,
  },
  cell: {
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foodInner: {
    width: '70%',
    height: '70%',
    borderRadius: 20,
  },
  // ✅ NOVO: Feedback visual dos gestos
  swipeFeedback: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  swipeFeedbackText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  // ✅ NOVO: Instruções de controle
  instructions: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
  },
  instructionsText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  arrows: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  arrow: {
    color: COLORS.textSecondary,
    fontSize: 20,
    marginHorizontal: 10,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom: 30,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.gridLine,
  },
  button: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    color: COLORS.text,
    fontSize: 120,
    fontWeight: 'bold',
  },
  pausedText: {
    color: COLORS.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  gameOverText: {
    color: COLORS.food,
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 40,
  },
  bigButton: {
    backgroundColor: COLORS.button,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 20,
  },
  bigButtonText: {
    color: COLORS.buttonText,
    fontSize: 18,
    fontWeight: 'bold',
  },
});