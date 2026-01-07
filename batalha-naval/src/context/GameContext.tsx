// Game context for managing game state
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState, Player, Position, Ship, Statistics, NetworkMessage } from '../types';
import { createEmptyBoard, processFireOnBoard, areAllShipsSunk, placeShip, getOpponentBoardView } from '../utils/boardUtils';
import { getNetwork, resetNetwork } from '../services/network';

interface GameContextType {
  gameState: GameState | null;
  myPlayerId: string | null;
  isMyTurn: boolean;
  connectionStatus: 'disconnected' | 'connecting' | 'connected' | 'error';
  statistics: Statistics;
  
  // Local game actions
  startLocalGame: () => void;
  placeShipOnBoard: (playerIndex: 0 | 1, ship: Ship) => void;
  fireAtPosition: (position: Position) => void;
  setPlayerReady: (playerIndex: 0 | 1) => void;
  resetGame: () => void;
  
  // Multiplayer actions
  connectToServer: (serverUrl: string) => Promise<void>;
  joinOrCreateRoom: (roomId: string, playerName: string) => void;
  createRoom: () => Promise<string>; // Returns room code
  joinRoom: (code: string) => Promise<boolean>; // Returns success
  disconnectFromServer: () => void;
  testConnection: (serverUrl: string) => Promise<boolean>;
  
  // Statistics actions
  updateStatistics: (won: boolean) => Promise<void>;
  clearStatistics: () => Promise<void>;
  loadStatistics: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [statistics, setStatistics] = useState<Statistics>({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    winRate: 0
  });

  // Initialize local game
  const startLocalGame = useCallback(() => {
    const player1: Player = {
      id: 'player1',
      name: 'Player 1',
      board: createEmptyBoard(),
      opponentBoard: createEmptyBoard(),
      ready: false,
    };

    const player2: Player = {
      id: 'player2',
      name: 'Player 2',
      board: createEmptyBoard(),
      opponentBoard: createEmptyBoard(),
      ready: false,
    };

    setGameState({
      roomId: 'local',
      players: [player1, player2],
      currentTurn: 0,
      phase: 'setup',
      mode: 'local',
      statistics,
    });
    
    setMyPlayerId('player1');
  }, [statistics]);

  // Place ship on board
  const placeShipOnBoard = useCallback((playerIndex: 0 | 1, ship: Ship) => {
    if (!gameState) return;

    const player = gameState.players[playerIndex];
    if (!player) return;

    const updatedBoard = placeShip(player.board, ship);
    const updatedPlayer = { ...player, board: updatedBoard };
    const updatedPlayers: [Player | null, Player | null] = [...gameState.players];
    updatedPlayers[playerIndex] = updatedPlayer;

    setGameState({
      ...gameState,
      players: updatedPlayers,
    });
  }, [gameState]);

  // Fire at position
  const fireAtPosition = useCallback((position: Position) => {
    if (!gameState || gameState.phase !== 'playing') return;

    const currentPlayer = gameState.players[gameState.currentTurn];
    const opponentIndex = gameState.currentTurn === 0 ? 1 : 0;
    const opponent = gameState.players[opponentIndex];

    if (!currentPlayer || !opponent) return;

    // In multiplayer mode, only allow firing if it's my turn
    if (gameState.mode === 'multiplayer') {
      if (currentPlayer.id !== myPlayerId) {
        console.log('[GameContext] Not your turn!');
        return;
      }

      // Send fire command to server
      const network = getNetwork();
      network.send({ type: 'FIRE', position });
      return; // Server will update state
    }

    // Local mode - process immediately
    const result = processFireOnBoard(opponent.board, position);
    
    // Update opponent's actual board
    const updatedOpponent = { ...opponent, board: result.board };
    
    // Update current player's view of opponent board
    const updatedOpponentView = getOpponentBoardView(result.board);
    const updatedCurrentPlayer = { ...currentPlayer, opponentBoard: updatedOpponentView };

    const updatedPlayers: [Player | null, Player | null] = [...gameState.players];
    updatedPlayers[gameState.currentTurn] = updatedCurrentPlayer;
    updatedPlayers[opponentIndex] = updatedOpponent;

    // Check for winner
    const allSunk = areAllShipsSunk(result.board);
    
    setGameState({
      ...gameState,
      players: updatedPlayers,
      currentTurn: allSunk ? gameState.currentTurn : opponentIndex,
      phase: allSunk ? 'finished' : 'playing',
      winner: allSunk ? gameState.currentTurn : undefined,
    });
  }, [gameState, myPlayerId]);

  // Set player ready
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

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
