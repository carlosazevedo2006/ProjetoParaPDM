// Lobby screen - waiting for players
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

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
    backgroundColor: Colors.bgDark,
    padding: Spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  statusBar: {
    padding: 12,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: Colors.bgMedium,
    padding: 15,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.info,
    marginTop: 5,
  },
  infoValue: {
    fontSize: 18,
    color: Colors.textPrimary,
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
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  playerCard: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  myPlayerCard: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(92, 184, 92, 0.2)',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  playerStatus: {
    fontSize: 14,
    color: Colors.info,
  },
  readyBox: {
    backgroundColor: 'rgba(92, 184, 92, 0.2)',
    padding: 20,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: Colors.success,
  },
  readyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  readySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  instructions: {
    backgroundColor: Colors.bgMedium,
    padding: 15,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: Colors.info,
    fontSize: 16,
  },
});
