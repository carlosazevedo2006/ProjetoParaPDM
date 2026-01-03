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

    setGameState({
      players: [player1, player2],
      currentTurnPlayerId: player1.id,
      phase: 'setup',
    });
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
    const updatedDefender: Player = { ...defender, board: updatedBoard };
    const updatedPlayers = gameState.players.map((p, i) => (i === defenderIndex ? updatedDefender : p));

    // Verificar fim de jogo
    const gameFinished = areAllShipsSunk(updatedDefender.board);

    setGameState(prev => {
      let nextTurn = prev.currentTurnPlayerId;

      // Regra escolhida: alterna sempre
      if (!gameFinished) {
        nextTurn = prev.players[defenderIndex].id;
      }

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
    setGameState({
      players: [],
      currentTurnPlayerId: '',
      phase: 'lobby',
    });
  }

  return {
    gameState,
    createPlayers,
    setPlayerReady,
    fire,
    resetGame,
  };
}
