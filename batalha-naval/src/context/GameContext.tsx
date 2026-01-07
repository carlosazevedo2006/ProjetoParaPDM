/**
 * ============================================
 * GAME CONTEXT - CONTEXTO PRINCIPAL DO JOGO
 * ============================================
 * 
 * Este ficheiro é o cérebro do jogo. É o sistema central que mantém e gere
 * todo o estado do jogo de Batalha Naval, tanto em modo local como multiplayer.
 * 
 * RESPONSABILIDADES:
 * 
 * 1. ESTADO GLOBAL:
 *    - Estado atual do jogo (fase, tabuleiros, jogadores, turnos)
 *    - Sincronização entre componentes via Context API
 *    - Persistência de estatísticas (AsyncStorage)
 * 
 * 2. LÓGICA DE JOGO:
 *    - Criar e gerir tabuleiros
 *    - Posicionar navios (validação feita em boardUtils)
 *    - Processar disparos
 *    - Verificar condições de vitória
 *    - Alternar turnos
 * 
 * 3. MODOS DE JOGO:
 *    - Local: Dois jogadores no mesmo dispositivo (hot-seat)
 *    - Multiplayer: Dois jogadores em dispositivos diferentes via WebSocket
 * 
 * 4. NETWORKING (Multiplayer):
 *    - Conectar ao servidor WebSocket
 *    - Criar/entrar em salas
 *    - Sincronizar estado entre jogadores
 *    - Enviar/receber ações do jogo
 * 
 * 5. ESTATÍSTICAS:
 *    - Rastrear jogos jogados, vitórias, derrotas
 *    - Calcular taxa de vitória
 *    - Guardar/carregar do dispositivo
 * 
 * ARQUITETURA:
 * ```
 * GameProvider (este ficheiro)
 *     ├─ Estado: gameState, myPlayerId, statistics, connectionStatus
 *     ├─ Ações Locais: startLocalGame, placeShipOnBoard, fireAtPosition
 *     ├─ Ações Multiplayer: connectToServer, createRoom, joinRoom
 *     └─ Ações Stats: updateStatistics, loadStatistics
 * 
 * Componentes consumidores (via useGameContext()):
 *     ├─ SetupScreen: Posicionar navios
 *     ├─ GameScreen: Jogar (disparar)
 *     ├─ ResultScreen: Ver estatísticas
 *     └─ Outros ecrãs: Aceder ao estado
 * ```
 * 
 * COMO USAR:
 * ```typescript
 * // Em qualquer componente:
 * import { useGameContext } from '../context/GameContext';
 * 
 * function MyComponent() {
 *   const { gameState, fireAtPosition, resetGame } = useGameContext();
 *   
 *   // Aceder ao estado
 *   console.log(gameState.currentPhase);
 *   
 *   // Disparar numa célula
 *   fireAtPosition({row: 5, col: 3});
 *   
 *   // Reiniciar jogo
 *   resetGame();
 * }
 * ```
 * 
 * DECISÕES DE DESIGN:
 * 
 * 1. Context API vs Redux:
 *    Escolhemos Context API por ser mais simples para esta aplicação.
 *    O estado não é excessivamente complexo e não precisa de middleware.
 * 
 * 2. Separação Local/Multiplayer:
 *    No modo local, o estado é atualizado imediatamente.
 *    No modo multiplayer, enviamos ações ao servidor e aguardamos resposta.
 * 
 * 3. Imutabilidade:
 *    Sempre criamos novos objetos ao atualizar estado, nunca modificamos diretamente.
 *    Isto previne bugs e facilita debugging.
 * 
 * @context
 * @author Carlos Azevedo
 * @date 2026
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Player, Position, Ship, Statistics, NetworkMessage } from '../types';
import { createEmptyBoard, processFireOnBoard, areAllShipsSunk, placeShip, getOpponentBoardView } from '../utils/boardUtils';
import { getNetwork, resetNetwork } from '../services/network';

/**
 * Interface do GameContext
 * 
 * Define todas as funções e estado disponíveis para componentes que usam
 * o contexto via useGameContext().
 * 
 * CATEGORIAS:
 * - Estado: gameState, myPlayerId, isMyTurn, connectionStatus, statistics
 * - Ações Locais: Jogo no mesmo dispositivo
 * - Ações Multiplayer: Jogo em rede
 * - Ações Estatísticas: Persistência de dados
 */
interface GameContextType {
  // ============================================
  // ESTADO
  // ============================================
  
  /** Estado atual completo do jogo (null se não iniciado) */
  gameState: GameState | null;
  
  /** ID do jogador neste dispositivo (usado em multiplayer) */
  myPlayerId: string | null;
  
  /** Verdadeiro se é o turno deste jogador (apenas multiplayer) */
  isMyTurn: boolean;
  
  /** Estado da conexão ao servidor (apenas multiplayer) */
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  
  /** Estatísticas do jogador (carregadas do dispositivo) */
  statistics: Statistics;
  
  // ============================================
  // AÇÕES LOCAIS (Modo Local - Mesmo Dispositivo)
  // ============================================
  
  /**
   * Iniciar novo jogo local
   * Cria dois jogadores e tabuleiros vazios, entra em fase de setup
   */
  startLocalGame: () => void;
  
  /**
   * Colocar um navio no tabuleiro de um jogador
   * 
   * @param playerIndex - Índice do jogador (0 ou 1)
   * @param ship - Navio a colocar (com posições já definidas)
   */
  placeShipOnBoard: (playerIndex: 0 | 1, ship: Ship) => void;
  
  /**
   * Disparar numa posição do tabuleiro adversário
   * 
   * No modo local: Processa imediatamente
   * No modo multiplayer: Envia ao servidor e aguarda resposta
   * 
   * @param position - Coordenadas onde disparar
   */
  fireAtPosition: (position: Position) => void;
  
  /**
   * Marcar jogador como pronto (terminou de posicionar navios)
   * Quando ambos jogadores estão prontos, o jogo começa
   * 
   * @param playerIndex - Índice do jogador (0 ou 1)
   */
  setPlayerReady: (playerIndex: 0 | 1) => void;
  
  /**
   * Reiniciar o jogo
   * Limpa estado e volta ao início
   */
  resetGame: () => void;
  
  // ============================================
  // AÇÕES MULTIPLAYER (Modo Rede)
  // ============================================
  
  /**
   * Conectar ao servidor WebSocket
   * 
   * @param serverUrl - URL do servidor (formato: ws://IP:PORTA)
   * @returns Promise que resolve quando conectado
   * @throws Erro se não conseguir conectar
   */
  connectToServer: (serverUrl: string) => Promise<void>;
  
  /**
   * Entrar ou criar sala (modo legado)
   * 
   * @param roomId - ID da sala
   * @param playerName - Nome do jogador
   */
  joinOrCreateRoom: (roomId: string, playerName: string) => void;
  
  /**
   * Criar nova sala de jogo
   * 
   * @returns Promise com código da sala (6 caracteres, ex: 'ABC123')
   */
  createRoom: () => Promise<string>;
  
  /**
   * Entrar numa sala existente
   * 
   * @param code - Código da sala (6 caracteres)
   * @returns Promise com true se entrou, false se sala não existe/cheia
   */
  joinRoom: (code: string) => Promise<boolean>;
  
  /**
   * Desconectar do servidor
   * Limpa estado de rede e volta ao menu
   */
  disconnectFromServer: () => void;
  
  /**
   * Testar conexão ao servidor
   * Útil para verificar se servidor está online antes de conectar
   * 
   * @param serverUrl - URL do servidor a testar
   * @returns Promise com true se servidor responde, false caso contrário
   */
  testConnection: (serverUrl: string) => Promise<boolean>;
  
  // ============================================
  // AÇÕES ESTATÍSTICAS
  // ============================================
  
  /**
   * Atualizar estatísticas após jogo terminar
   * 
   * @param won - true se este jogador ganhou, false se perdeu
   * @returns Promise que resolve quando guardado
   */
  updateStatistics: (won: boolean) => Promise<void>;
  
  /**
   * Limpar todas as estatísticas
   * Reseta para valores iniciais (0 jogos, 0 vitórias, etc.)
   * 
   * @returns Promise que resolve quando limpo
   */
  clearStatistics: () => Promise<void>;
  
  /**
   * Carregar estatísticas do dispositivo
   * Chamado automaticamente ao iniciar app
   * 
   * @returns Promise que resolve quando carregado
   */
  loadStatistics: () => Promise<void>;
}

/** Contexto React - não usar diretamente, use useGameContext() */
const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * Componente GameProvider
 * 
 * Provider do Context API que envolve toda a aplicação.
 * Mantém estado global e fornece funções para manipulá-lo.
 * 
 * INICIALIZAÇÃO:
 * - Carrega estatísticas do AsyncStorage ao montar
 * - Configura listeners de rede quando conectado ao servidor
 * 
 * @param children - Componentes filhos (toda a app)
 */
export function GameProvider({ children }: { children: React.ReactNode }) {
  // ============================================
  // ESTADO DO COMPONENTE
  // ============================================
  
  /** Estado completo do jogo (null = jogo não iniciado) */
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  /** ID do jogador neste dispositivo (usado em multiplayer para saber quem somos) */
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  
  /** Estado da conexão WebSocket */
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  
  /** Estatísticas do jogador (carregadas do AsyncStorage) */
  const [statistics, setStatistics] = useState<Statistics>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    winRate: 0
  });

  // ============================================
  // AÇÕES LOCAIS
  // ============================================

  /**
   * Iniciar novo jogo local (modo hot-seat)
   * 
   * Cria dois jogadores com tabuleiros vazios e entra na fase de setup.
   * Cada jogador irá posicionar os seus navios antes de começar a jogar.
   * 
   * FLUXO:
   * 1. Criar Player 1 e Player 2 com tabuleiros vazios
   * 2. Definir estado inicial (fase: setup, turno: 0)
   * 3. Definir modo como 'local'
   * 4. Definir jogador atual como 'player1'
   */
  const startLocalGame = useCallback(() => {
    // Criar jogador 1
    const player1: Player = {
      id: 'player1',
      name: 'Player 1',
      board: createEmptyBoard(),              // Tabuleiro próprio (vazio)
      opponentBoard: createEmptyBoard(),       // Vista do adversário (vazia)
      ready: false,                            // Ainda não posicionou navios
    };

    // Criar jogador 2
    const player2: Player = {
      id: 'player2',
      name: 'Player 2',
      board: createEmptyBoard(),
      opponentBoard: createEmptyBoard(),
      ready: false,
    };

    // Definir estado inicial
    setGameState({
      roomId: 'local',                  // ID especial para jogos locais
      players: [player1, player2],      // Array com exatamente 2 jogadores
      currentTurn: 0,                   // Jogador 1 começa
      phase: 'setup',                   // Fase de posicionamento de navios
      mode: 'local',                    // Modo local (não multiplayer)
      statistics,                       // Estatísticas atuais
    });
    
    // No modo local, sempre somos o player1
    setMyPlayerId('player1');
  }, [statistics]);

  /**
   * Colocar um navio no tabuleiro de um jogador
   * 
   * Adiciona um navio ao tabuleiro do jogador especificado.
   * NOTA: Esta função NÃO valida se o posicionamento é legal.
   * A validação deve ser feita antes de chamar esta função.
   * 
   * @param playerIndex - Índice do jogador (0 = player1, 1 = player2)
   * @param ship - Navio a colocar (com posições já calculadas)
   */
  const placeShipOnBoard = useCallback((playerIndex: 0 | 1, ship: Ship) => {
    if (!gameState) return;

    const player = gameState.players[playerIndex];
    if (!player) return;

    // Usar função auxiliar para colocar navio (retorna novo tabuleiro)
    const updatedBoard = placeShip(player.board, ship);
    
    // Criar novo jogador com tabuleiro atualizado
    const updatedPlayer = { ...player, board: updatedBoard };
    
    // Criar novo array de jogadores (imutabilidade)
    const updatedPlayers: [Player | null, Player | null] = [...gameState.players];
    updatedPlayers[playerIndex] = updatedPlayer;

    // Atualizar estado global
    setGameState({
      ...gameState,
      players: updatedPlayers,
    });
  }, [gameState]);

  /**
   * Disparar numa posição do tabuleiro adversário
   * 
   * Função central do jogo que processa um disparo.
   * Comportamento diferente em modo local vs multiplayer:
   * 
   * MODO LOCAL:
   * - Processa disparo imediatamente
   * - Atualiza estado local
   * - Alterna turno
   * - Verifica vitória
   * 
   * MODO MULTIPLAYER:
   * - Apenas permite disparar se for o turno deste jogador
   * - Envia mensagem FIRE ao servidor
   * - Aguarda servidor processar e enviar novo estado
   * - Não atualiza estado local diretamente
   * 
   * @param position - Coordenadas onde disparar {row, col}
   */
  const fireAtPosition = useCallback((position: Position) => {
    if (!gameState || gameState.phase !== 'playing') return;

    // Identificar jogador atual e adversário
    const currentPlayer = gameState.players[gameState.currentTurn];
    const opponentIndex = gameState.currentTurn === 0 ? 1 : 0;
    const opponent = gameState.players[opponentIndex];

    if (!currentPlayer || !opponent) return;

    // MODO MULTIPLAYER: Enviar ao servidor
    if (gameState.mode === 'multiplayer') {
      // Verificar se é o nosso turno
      if (currentPlayer.id !== myPlayerId) {
        console.log('[GameContext] Não é o teu turno!');
        return;
      }

      // Enviar comando de disparo ao servidor
      const network = getNetwork();
      network.send({ type: 'FIRE', position });
      return; // Servidor irá processar e enviar novo estado
    }

    // MODO LOCAL: Processar imediatamente
    
    // Processar disparo no tabuleiro do adversário
    const result = processFireOnBoard(opponent.board, position);
    
    // Atualizar tabuleiro real do adversário
    const updatedOpponent = { ...opponent, board: result.board };
    
    // Atualizar vista do jogador atual sobre o tabuleiro adversário
    // (oculta navios não atingidos)
    const updatedOpponentView = getOpponentBoardView(result.board);
    const updatedCurrentPlayer = { ...currentPlayer, opponentBoard: updatedOpponentView };

    // Criar novo array de jogadores
    const updatedPlayers: [Player | null, Player | null] = [...gameState.players];
    updatedPlayers[gameState.currentTurn] = updatedCurrentPlayer;
    updatedPlayers[opponentIndex] = updatedOpponent;

    // Verificar se adversário perdeu (todos os navios afundados)
    const allSunk = areAllShipsSunk(result.board);
    
    // Atualizar estado global
    setGameState({
      ...gameState,
      players: updatedPlayers,
      // Se afundou todos, mantém turno atual (vencedor)
      // Senão, alterna para adversário
      currentTurn: allSunk ? gameState.currentTurn : opponentIndex,
      // Se afundou todos, jogo termina
      phase: allSunk ? 'finished' : 'playing',
      // Vencedor é o jogador atual se afundou todos os navios adversários
      winner: allSunk ? gameState.currentTurn : undefined,
    });
  }, [gameState, myPlayerId]);

  /**
   * Marcar jogador como pronto
   * 
   * Chamado quando um jogador termina de posicionar todos os seus navios.
   * Quando AMBOS jogadores estão prontos, o jogo começa (fase: playing).
   * 
   * No modo multiplayer, envia mensagem PLAYER_READY ao servidor.
   * 
   * @param playerIndex - Índice do jogador que está pronto (0 ou 1)
   */
  const setPlayerReady = useCallback((playerIndex: 0 | 1) => {
    if (!gameState) return;

    const player = gameState.players[playerIndex];
    if (!player) return;

    const updatedPlayer = { ...player, ready: true };
    const updatedPlayers: [Player | null, Player | null] = [...gameState.players];
    updatedPlayers[playerIndex] = updatedPlayer;

    // Check if both players are ready
    const bothReady = updatedPlayers[0]?.ready && updatedPlayers[1]?.ready;

    // In multiplayer mode, send ready signal to server
    if (gameState.mode === 'multiplayer' && player.id === myPlayerId) {
      const network = getNetwork();
      network.send({ type: 'PLAYER_READY', ships: player.board.ships });
      return; // Server will update state
    }

    setGameState({
      ...gameState,
      players: updatedPlayers,
      phase: bothReady ? 'playing' : 'setup',
    });
  }, [gameState, myPlayerId]);

  // Reset game
  const resetGame = useCallback(() => {
    if (gameState?.mode === 'multiplayer') {
      const network = getNetwork();
      network.send({ type: 'RESET' });
      return; // Server will update state
    }
    
    setGameState(null);
    setMyPlayerId(null);
  }, [gameState]);

  // Connect to server
  const connectToServer = useCallback(async (serverUrl: string) => {
    try {
      setConnectionStatus('connecting');
      const network = getNetwork(serverUrl);
      
      // Setup message handler
      network.onMessage((message) => {
        console.log('[GameContext] Received message:', message.type);
        
        switch (message.type) {
          case 'PLAYER_ASSIGNED':
            setMyPlayerId(message.playerId);
            console.log('[GameContext] My player ID:', message.playerId);
            break;
            
          case 'SERVER_STATE':
            setGameState(message.gameState);
            setConnectionStatus('connected');
            break;
            
          case 'ERROR':
            console.error('[GameContext] Server error:', message.message);
            setConnectionStatus('error');
            break;
            
          case 'CONNECTION_ERROR':
          case 'DISCONNECT':
            setConnectionStatus('disconnected');
            break;
        }
      });
      
      await network.connect();
      setConnectionStatus('connected');
    } catch (error) {
      console.error('[GameContext] Connection failed:', error);
      setConnectionStatus('error');
      throw error;
    }
  }, []);

  // Join or create room
  const joinOrCreateRoom = useCallback((roomId: string, playerName: string) => {
    const network = getNetwork();
    network.send({ type: 'JOIN_OR_CREATE', roomId, playerName });
    
    // Set mode to multiplayer
    if (gameState) {
      setGameState({ ...gameState, mode: 'multiplayer' });
    }
  }, [gameState]);

  // Disconnect from server
  const disconnectFromServer = useCallback(() => {
    resetNetwork();
    setConnectionStatus('disconnected');
    setGameState(null);
    setMyPlayerId(null);
  }, []);

  // Test connection
  const testConnection = useCallback(async (serverUrl: string): Promise<boolean> => {
    try {
      const testNetwork = new (await import('../services/network')).Network(serverUrl);
      await testNetwork.connect();
      testNetwork.disconnect();
      return true;
    } catch (error) {
      console.error('[GameContext] Connection test failed:', error);
      return false;
    }
  }, []);

  // Create a new room
  const createRoom = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      const network = getNetwork();
      
      if (!network.isConnected()) {
        reject(new Error('Not connected to server'));
        return;
      }

      // Set up handler for room creation response
      const unsubscribe = network.on('ROOM_CREATED', (message: any) => {
        if (message.type === 'ROOM_CREATED') {
          const code = message.payload.code;
          console.log('[GameContext] Room created with code:', code);
          
          // Update game state with room code
          setGameState(prev => prev ? {
            ...prev,
            roomCode: code,
            roomPlayerCount: 1,
          } : null);
          
          unsubscribe();
          resolve(code);
        }
      });

      // Set timeout
      setTimeout(() => {
        unsubscribe();
        reject(new Error('Timeout waiting for room creation'));
      }, 10000);

      // Send room creation request
      const createRoomMessage: NetworkMessage = { type: 'CREATE_ROOM' };
      network.send(createRoomMessage);
    });
  }, []);

  // Join an existing room
  const joinRoom = useCallback(async (code: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const network = getNetwork();
      
      if (!network.isConnected()) {
        reject(new Error('Not connected to server'));
        return;
      }

      let resolved = false;

      const successHandler = (message: any) => {
        if (!resolved && message.type === 'ROOM_JOINED') {
          resolved = true;
          console.log('[GameContext] Joined room:', message.payload.code);
          
          // Update game state
          setGameState(prev => prev ? {
            ...prev,
            roomCode: message.payload.code,
            roomPlayerCount: message.payload.playerCount,
          } : null);
          
          cleanup();
          resolve(true);
        }
      };

      const readyHandler = (message: any) => {
        if (!resolved && message.type === 'ROOM_READY') {
          console.log('[GameContext] Room is ready');
          // Update player count to 2
          setGameState(prev => prev ? {
            ...prev,
            roomPlayerCount: 2,
          } : null);
        }
      };

      const notFoundHandler = (message: any) => {
        if (!resolved && message.type === 'ROOM_NOT_FOUND') {
          resolved = true;
          console.log('[GameContext] Room not found');
          cleanup();
          resolve(false);
        }
      };

      const fullHandler = (message: any) => {
        if (!resolved && message.type === 'ROOM_FULL') {
          resolved = true;
          console.log('[GameContext] Room is full');
          cleanup();
          resolve(false);
        }
      };

      const unsubscribeSuccess = network.on('ROOM_JOINED', successHandler);
      const unsubscribeReady = network.on('ROOM_READY', readyHandler);
      const unsubscribeNotFound = network.on('ROOM_NOT_FOUND', notFoundHandler);
      const unsubscribeFull = network.on('ROOM_FULL', fullHandler);

      const cleanup = () => {
        unsubscribeSuccess();
        unsubscribeReady();
        unsubscribeNotFound();
        unsubscribeFull();
      };

      // Set timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          cleanup();
          reject(new Error('Timeout waiting for room join'));
        }
      }, 10000);

      // Send join room request
      const joinRoomMessage: NetworkMessage = { 
        type: 'JOIN_ROOM', 
        payload: { code } 
      };
      network.send(joinRoomMessage);
    });
  }, []);

  // Load statistics from AsyncStorage
  const loadStatistics = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('statistics');
      if (stored) {
        const stats = JSON.parse(stored);
        setStatistics(stats);
        // Also update gameState if it exists
        setGameState(prev => prev ? { ...prev, statistics: stats } : null);
      } else {
        // Initialize with zeros (already done in state initialization)
        const defaultStats: Statistics = {
          gamesPlayed: 0,
          wins: 0,
          losses: 0,
          winRate: 0
        };
        await AsyncStorage.setItem('statistics', JSON.stringify(defaultStats));
      }
    } catch (e) {
      console.warn('Failed to load statistics', e);
    }
  }, []);

  // Update statistics after each game
  const updateStatistics = useCallback(async (won: boolean) => {
    const updated: Statistics = {
      gamesPlayed: statistics.gamesPlayed + 1,
      wins: won ? statistics.wins + 1 : statistics.wins,
      losses: won ? statistics.losses : statistics.losses + 1,
      winRate: 0 // will be calculated below
    };
    updated.winRate = updated.gamesPlayed > 0 
      ? Math.round((updated.wins / updated.gamesPlayed) * 100) 
      : 0;
    
    setStatistics(updated);
    setGameState(prev => prev ? { ...prev, statistics: updated } : null);
    
    try {
      await AsyncStorage.setItem('statistics', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save statistics', e);
    }
  }, [statistics]);

  // Clear statistics
  const clearStatistics = useCallback(async () => {
    const resetStats: Statistics = {
      gamesPlayed: 0,
      wins: 0,
      losses: 0,
      winRate: 0
    };
    setStatistics(resetStats);
    setGameState(prev => prev ? { ...prev, statistics: resetStats } : null);
    try {
      await AsyncStorage.setItem('statistics', JSON.stringify(resetStats));
    } catch (e) {
      console.warn('Failed to clear statistics', e);
    }
  }, []);

  // Determine if it's my turn
  const isMyTurn = gameState?.mode === 'multiplayer' 
    ? gameState.players[gameState.currentTurn]?.id === myPlayerId
    : true; // In local mode, always allow actions

  // Load statistics on mount
  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      resetNetwork();
    };
  }, []);

  const value: GameContextType = {
    gameState,
    myPlayerId,
    isMyTurn,
    connectionStatus,
    statistics,
    startLocalGame,
    placeShipOnBoard,
    fireAtPosition,
    setPlayerReady,
    resetGame,
    connectToServer,
    joinOrCreateRoom,
    createRoom,
    joinRoom,
    disconnectFromServer,
    testConnection,
    updateStatistics,
    clearStatistics,
    loadStatistics,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

/**
 * Hook para aceder ao GameContext
 * 
 * Use este hook em qualquer componente para aceder ao estado do jogo
 * e às funções para manipulá-lo.
 * 
 * IMPORTANTE: Apenas funciona dentro de componentes que estão dentro
 * de um <GameProvider>. Se usar fora, lança erro.
 * 
 * @returns Objeto com todo o estado e funções do jogo
 * @throws Erro se usado fora de GameProvider
 * 
 * @example
 * function MyComponent() {
 *   const { gameState, fireAtPosition } = useGame();
 *   
 *   if (!gameState) return <Text>Sem jogo ativo</Text>;
 *   
 *   return (
 *     <View>
 *       <Text>Fase: {gameState.phase}</Text>
 *       <Button onPress={() => fireAtPosition({row: 0, col: 0})}>
 *         Disparar em A1
 *       </Button>
 *     </View>
 *   );
 * }
 */
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
