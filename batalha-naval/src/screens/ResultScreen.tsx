// Result screen - game over
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function ResultScreen() {
  const router = useRouter();
  const { gameState, resetGame, myPlayerId, updateStatistics } = useGame();
  const statisticsUpdated = useRef(false);

  useEffect(() => {
    // Save statistics when game ends (only once)
    if (!statisticsUpdated.current && gameState && gameState.winner !== undefined) {
      const winner = gameState.players[gameState.winner];
      const localPlayerWon = winner?.id === myPlayerId;
      updateStatistics(localPlayerWon);
      statisticsUpdated.current = true;
    }
  }, [gameState, myPlayerId, updateStatistics]);

  if (!gameState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Estado do jogo não encontrado</Text>
      </View>
    );
  }

  const winner = gameState.winner !== undefined ? gameState.players[gameState.winner] : null;
  const iWon = winner?.id === myPlayerId;
  
  const isMultiplayer = gameState.mode === 'multiplayer';

  const handlePlayAgain = () => {
    resetGame();
    router.replace('/' as any);
  };

  const handleBackToHome = () => {
    router.replace('/' as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {winner ? (
          <>
            <Text style={styles.resultEmoji}>
              {iWon ? '🎉' : '😔'}
            </Text>
            <Text style={styles.resultTitle}>
              {iWon ? 'VITÓRIA!' : 'DERROTA'}
            </Text>
            <Text style={styles.winnerText}>
              {iWon ? 'Parabéns! Você venceu!' : `${winner.name} venceu!`}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.resultEmoji}>🏁</Text>
            <Text style={styles.resultTitle}>FIM DE JOGO</Text>
          </>
        )}

        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>📊 Estatísticas do Jogo</Text>
          
          {gameState.players.map((player, index) => {
            if (!player) return null;
            
            const totalShips = player.board.ships.length;
            const sunkShips = player.board.ships.filter(s => s.sunk).length;
            const isMe = player.id === myPlayerId;
            
            return (
              <View key={player.id} style={[styles.playerStats, isMe && styles.myPlayerStats]}>
                <Text style={styles.playerStatsName}>
                  {player.name} {isMe && '(Você)'}
                </Text>
                <Text style={styles.playerStatsText}>
                  Navios afundados: {sunkShips}/{totalShips}
                </Text>
                <Text style={styles.playerStatsText}>
                  Navios restantes: {totalShips - sunkShips}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.buttonContainer}>
          {isMultiplayer ? (
            <Pressable style={styles.button} onPress={handleBackToHome}>
              <Text style={styles.buttonText}>🏠 Voltar ao Menu</Text>
            </Pressable>
          ) : (
            <>
              <Pressable style={styles.button} onPress={handlePlayAgain}>
                <Text style={styles.buttonText}>🔄 Jogar Novamente</Text>
              </Pressable>
              <Pressable style={styles.secondaryButton} onPress={handleBackToHome}>
                <Text style={styles.secondaryButtonText}>🏠 Menu Principal</Text>
              </Pressable>
            </>
          )}
        </View>

        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            {iWon 
              ? '🎯 Excelente estratégia! Você afundou todos os navios do oponente!'
              : '💪 Não desista! Tente novamente e melhore sua estratégia!'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
  resultEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  winnerText: {
    fontSize: 24,
    color: Colors.info,
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: BorderRadius.lg,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  playerStats: {
    backgroundColor: Colors.bgLight,
    padding: 15,
    borderRadius: BorderRadius.md,
    marginBottom: 10,
  },
  myPlayerStats: {
    borderWidth: 2,
    borderColor: Colors.success,
    backgroundColor: 'rgba(92, 184, 92, 0.2)',
  },
  playerStatsName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  playerStatsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    ...Buttons.primary,
    paddingVertical: 18,
    borderWidth: 3,
    borderColor: Colors.primaryDark,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  secondaryButton: {
    ...Buttons.secondary,
    paddingVertical: 18,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.info,
  },
  messageBox: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: BorderRadius.md,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
  },
});
