import { useState } from 'react';
import { GameState, GamePhase } from '../models/GameState';
import { Player } from '../models/Player';
import { Board } from '../models/Board';
import { createEmptyBoard } from '../utils/boardHelpers';
import { shoot, areAllShipsSunk } from '../services/gameLogic';
import { ShotResult } from '../models/ShotResult';

/**
 * Hook principal que gere o estado do jogo
 */
export function useGame() {
  const [gameState, setGameState] = useState<GameState>({
    players: [],
    currentTurnPlayerId: '',
    phase: 'lobby',
    preferences: {
      vibrationEnabled: true,
    },
  });

  /**
   * Cria os dois jogadores
   */
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

    setGameState(prev => ({
      ...prev,
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
    }));
  }

  /**
   * Marca jogador como pronto
   */
  function setPlayerReady(playerId: string) {
    setGameState(prev => {
      const players = prev.players.map(player =>
        player.id === playerId
          ? { ...player, isReady: true }
          : player
      );

      const allReady = players.every(p => p.isReady);

      return {
        ...prev,
        players,
        phase: allReady ? 'playing' : prev.phase,
      };
    });
  }

  /**
   * Executa um disparo
   */
  function fire(
    attackerId: string,
    targetRow: number,
    targetCol: number
  ): ShotResult | null {
    const attackerIndex = gameState.players.findIndex(
      p => p.id === attackerId
    );

    if (attackerIndex === -1) return null;

    // Não é o turno dele
    if (gameState.currentTurnPlayerId !== attackerId) {
      return null;
    }

    const defenderIndex = attackerIndex === 0 ? 1 : 0;
    const defender = gameState.players[defenderIndex];

    const { result, updatedBoard } = shoot(defender.board, targetRow, targetCol);

    // Verificar fim de jogo
    const gameFinished = areAllShipsSunk(updatedBoard);

    setGameState(prev => {
      let nextTurn = prev.currentTurnPlayerId;

      // Regra escolhida: alterna sempre
      if (!gameFinished) {
        nextTurn = prev.players[defenderIndex].id;
      }

      // Update the defender's board with the shot result
      const updatedPlayers = prev.players.map((p, i) => 
        i === defenderIndex ? { ...p, board: updatedBoard } : p
      );

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

  /**
   * Reinicia o jogo
   */
  function resetGame() {
    setGameState(prev => ({
      players: [],
      currentTurnPlayerId: '',
      phase: 'lobby',
      preferences: prev.preferences,
    }));
  }

  return {
    gameState,
    createPlayers,
    setPlayerReady,
    fire,
    resetGame,
  };
}
