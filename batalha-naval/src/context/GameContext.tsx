import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Constants from 'expo-constants';
import { GameState, GamePhase } from '../models/GameState';
import { Player } from '../models/Player';
import { createEmptyBoard, placeFleetRandomly } from '../utils/boardHelpers';
import { shoot, areAllShipsSunk } from '../services/gameLogic';
import { ShotResult } from '../models/ShotResult';
import { Network } from '../services/network';
import { SHIPS_CONFIG } from '../utils/constants';

interface GameContextType {
  gameState: GameState;
  createPlayers: (player1Name: string, player2Name: string) => void;
  setPlayerReady: (playerId: string) => void;
  fire: (attackerId: string, targetRow: number, targetCol: number) => ShotResult | null;
  resetGame: () => void;
  updatePhase: (phase: GamePhase) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Simple deterministic room ID from two names
function makeRoomId(name1: string, name2: string, salt: string): string {
  const clean1 = name1.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const clean2 = name2.toLowerCase().trim().replace(/[^a-z0-9]/g, '_');
  const sorted = [clean1, clean2].sort();
  return `room:${sorted[0]}:${sorted[1]}:${salt.replace(/[^a-z0-9]/g, '_')}`;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurnPlayerId: '',
    phase: 'lobby',
  });

  const [network, setNetwork] = useState<Network | null>(null);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  useEffect(() => {
    const serverUrl = Constants.expoConfig?.extra?.serverUrl || '';
    const roomSalt = Constants.expoConfig?.extra?.roomSalt || 'default-salt';
    
    if (serverUrl && serverUrl.trim()) {
      const net = new Network();
      net.connect(serverUrl).then(() => {
        setNetwork(net);
        setIsMultiplayer(true);
        
        // Listen for server state updates
        net.on('SERVER_STATE', (payload: GameState) => {
          setGameState(payload);
        });
      }).catch((err) => {
        console.error('Failed to connect to server:', err);
        setIsMultiplayer(false);
      });
    }
  }, []);

  function createPlayers(player1Name: string, player2Name: string) {
    const selfId = network ? network.makePlayerId() : 'player1';
    
    const player1: Player = {
      id: isMultiplayer ? selfId : 'player1',
      name: player1Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    const player2: Player = {
      id: isMultiplayer ? 'remote' : 'player2',
      name: player2Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    const newState: GameState = {
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
      selfId: isMultiplayer ? selfId : undefined,
      roomId: undefined,
    };

    // If multiplayer, create/join room
    if (isMultiplayer && network) {
      const roomSalt = Constants.expoConfig?.extra?.roomSalt || 'default-salt';
      const roomId = makeRoomId(player1Name, player2Name, roomSalt);
      newState.roomId = roomId;
      
      network.emit('JOIN_ROOM', { roomId, playerId: selfId, playerName: player1Name });
    }

    setGameState(newState);
  }

  function setPlayerReady(playerId: string) {
    setGameState(prev => {
      const players = prev.players.map(player => {
        if (player.id === playerId) {
          // Auto-place fleet if no ships placed
          if (player.board.ships.length === 0) {
            const newBoard = createEmptyBoard();
            placeFleetRandomly(newBoard, SHIPS_CONFIG);
            return { ...player, board: newBoard, isReady: true };
          }
          return { ...player, isReady: true };
        }
        return player;
      });

      const allReady = players.every(p => p.isReady);

      const newState = {
        ...prev,
        players,
        phase: allReady ? 'playing' : prev.phase,
        currentTurnPlayerId: allReady ? players[0].id : prev.currentTurnPlayerId,
      };

      // Emit ready state in multiplayer
      if (isMultiplayer && network) {
        network.emit('PLAYER_READY', { playerId, roomId: prev.roomId });
      }

      return newState;
    });
  }

  function fire(attackerId: string, targetRow: number, targetCol: number): ShotResult | null {
    const attackerIndex = gameState.players.findIndex(p => p.id === attackerId);
    if (attackerIndex === -1) return null;
    if (gameState.currentTurnPlayerId !== attackerId) return null;

    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = gameState.players[defenderIndex];

    const { result, updatedBoard } = shoot(defender.board, targetRow, targetCol);
    const updatedDefender: Player = { ...defender, board: updatedBoard };
    const updatedPlayers = gameState.players.map((p, i) => (i === defenderIndex ? updatedDefender : p));

    const gameFinished = areAllShipsSunk(updatedDefender.board);

    setGameState(prev => {
      const nextTurn = prev.players[defenderIndex].id; // Rule B: always alternate
      return {
        ...prev,
        players: updatedPlayers,
        currentTurnPlayerId: nextTurn,
        phase: gameFinished ? 'finished' : prev.phase,
        winnerId: gameFinished ? attackerId : prev.winnerId,
      };
    });

    // Emit fire event in multiplayer
    if (isMultiplayer && network) {
      network.emit('FIRE', {
        roomId: gameState.roomId,
        attackerId,
        targetRow,
        targetCol,
      });
    }

    return result;
  }

  function resetGame() {
    if (isMultiplayer && network) {
      network.emit('RESET', { roomId: gameState.roomId });
    }

    setGameState({
      players: [],
      currentTurnPlayerId: '',
      phase: 'lobby',
    });
  }

  function updatePhase(phase: GamePhase) {
    setGameState(prev => ({ ...prev, phase }));
  }

  return (
    <GameContext.Provider
      value={{
        gameState,
        createPlayers,
        setPlayerReady,
        fire,
        resetGame,
        updatePhase,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}