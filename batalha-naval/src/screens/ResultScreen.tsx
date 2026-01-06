// Result screen - game over
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';

export default function ResultScreen() {
  const router = useRouter();
  const { gameState, resetGame, myPlayerId } = useGame();

  if (!gameState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Estado do jogo não encontrado</Text>
      </View>
    );
  }

  const winner = gameState.winner !== undefined ? gameState.players[gameState.winner] : null;
  const myPlayerIndex = gameState.players.findIndex(p => p?.id === myPlayerId);
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
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  winnerText: {
    fontSize: 24,
    color: '#87CEEB',
    marginBottom: 30,
    textAlign: 'center',
  },
  statsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  playerStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  myPlayerStats: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  playerStatsName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  playerStatsText: {
    fontSize: 14,
    color: '#E0E0E0',
    marginBottom: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E5C8A',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#87CEEB',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#87CEEB',
  },
  messageBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 8,
    width: '100%',
  },
  messageText: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
  },
});
