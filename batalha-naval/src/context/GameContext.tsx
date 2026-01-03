import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GameState, GamePhase } from '../models/GameState';
import { Player } from '../models/Player';
import { createEmptyBoard } from '../utils/boardHelpers';
import { shoot, areAllShipsSunk } from '../services/gameLogic';
import { ShotResult } from '../models/ShotResult';

interface GameContextType {
  gameState: GameState;
  createPlayers: (player1Name: string, player2Name: string) => void;
  setPlayerReady: (playerId: string) => void;
  fire: (attackerId: string, targetRow: number, targetCol: number) => ShotResult | null;
  resetGame: () => void;
  updatePhase: (phase: GamePhase) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurnPlayerId: '',
    phase: 'lobby',
  });

  function createPlayers(player1Name: string, player2Name: string) {
    const player1: Player = {
      id: 'player1',
      name: player1Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    const player2: Player = {
      id: 'player2',
      name: player2Name,
      board: createEmptyBoard(),
      isReady: false,
    };

    setGameState({
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
    });
  }

  function setPlayerReady(playerId: string) {
    setGameState(prev => {
      const players = prev.players.map(player =>
        player.id === playerId ? { ...player, isReady: true } : player
      );

      const allReady = players.every(p => p.isReady);

      return {
        ...prev,
        players,
        phase: allReady ? 'playing' : prev.phase,
        currentTurnPlayerId: allReady ? players[0].id : prev.currentTurnPlayerId,
      };
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
      const nextTurn = prev.players[defenderIndex].id; // Regra B: alterna sempre
      return {
        ...prev,
        players: updatedPlayers,
        currentTurnPlayerId: nextTurn,
        phase: gameFinished ? 'finished' : prev.phase,
        winnerId: gameFinished ? attackerId : prev.winnerId,
      };
    });

    return result;
  }

  function resetGame() {
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