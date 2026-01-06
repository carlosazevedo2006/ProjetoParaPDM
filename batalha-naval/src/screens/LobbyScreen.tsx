// Lobby screen - waiting for players
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';

export default function LobbyScreen() {
  const router = useRouter();
  const { gameState, connectionStatus, myPlayerId } = useGame();

  useEffect(() => {
    // If both players are ready and game starts, navigate to setup
    if (gameState && gameState.players[0] && gameState.players[1]) {
      router.replace('/setup' as any);
    }
  }, [gameState]);

  const player1 = gameState?.players[0];
  const player2 = gameState?.players[1];
  const isPlayer1 = player1?.id === myPlayerId;
  const isPlayer2 = player2?.id === myPlayerId;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Sala de Espera</Text>

      <View style={[styles.statusBar, { backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : '#FFA500' }]}>
        <Text style={styles.statusText}>
          {connectionStatus === 'connected' ? '✅ Conectado ao Servidor' : '⏳ Conectando...'}
        </Text>
      </View>

      {gameState && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>ID da Sala:</Text>
          <Text style={styles.infoValue}>{gameState.roomId}</Text>
          
          <Text style={styles.infoLabel}>Modo:</Text>
          <Text style={styles.infoValue}>
            {gameState.mode === 'multiplayer' ? '🌐 Multiplayer Online' : '🎮 Local'}
          </Text>
        </View>
      )}

      <View style={styles.playersContainer}>
        <Text style={styles.sectionTitle}>Jogadores:</Text>

        <View style={[styles.playerCard, player1 && isPlayer1 && styles.myPlayerCard]}>
          {player1 ? (
            <>
              <Text style={styles.playerName}>
                {player1.name} {isPlayer1 && '(Você)'}
              </Text>
              <Text style={styles.playerStatus}>✅ Conectado</Text>
            </>
          ) : (
            <>
              <Text style={styles.playerName}>Jogador 1</Text>
              <ActivityIndicator color="#4A90E2" />
              <Text style={styles.playerStatus}>Aguardando...</Text>
            </>
          )}
        </View>

        <View style={[styles.playerCard, player2 && isPlayer2 && styles.myPlayerCard]}>
          {player2 ? (
            <>
              <Text style={styles.playerName}>
                {player2.name} {isPlayer2 && '(Você)'}
              </Text>
              <Text style={styles.playerStatus}>✅ Conectado</Text>
            </>
          ) : (
            <>
              <Text style={styles.playerName}>Jogador 2</Text>
              <ActivityIndicator color="#4A90E2" />
              <Text style={styles.playerStatus}>Aguardando...</Text>
            </>
          )}
        </View>
      </View>

      {player1 && player2 && (
        <View style={styles.readyBox}>
          <Text style={styles.readyText}>✅ Todos os jogadores conectados!</Text>
          <Text style={styles.readySubtext}>Prepare-se para posicionar seus navios</Text>
        </View>
      )}

      <View style={styles.instructions}>
        <Text style={styles.instructionsTitle}>📋 Instruções:</Text>
        <Text style={styles.instructionsText}>
          • Compartilhe o ID da sala com seu oponente{'\n'}
          • Aguarde até que ambos os jogadores estejam conectados{'\n'}
          • O jogo começará automaticamente quando ambos estiverem prontos
        </Text>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  statusBar: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 14,
    color: '#87CEEB',
    marginTop: 5,
  },
  infoValue: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  playersContainer: {
    gap: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  myPlayerCard: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  playerStatus: {
    fontSize: 14,
    color: '#87CEEB',
  },
  readyBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  readySubtext: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  instructions: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
