// Game screen - main gameplay
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Board';
import { Position } from '../types';
import { Colors } from '../styles/colors';
import { Typography, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, myPlayerId, isMyTurn, fireAtPosition, connectionStatus, resetGame } = useGame();

  if (!gameState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Estado do jogo não encontrado</Text>
      </View>
    );
  }

  const myPlayerIndex = gameState.players.findIndex(p => p?.id === myPlayerId);
  const opponentIndex = myPlayerIndex === 0 ? 1 : 0;
  
  const currentPlayer = gameState.players[myPlayerIndex >= 0 ? myPlayerIndex : 0];
  const opponent = gameState.players[opponentIndex];
  const currentTurnPlayer = gameState.players[gameState.currentTurn];

  if (!currentPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Jogador não encontrado</Text>
      </View>
    );
  }

  if (gameState.phase === 'finished') {
    router.replace('/result' as any);
    return null;
  }

  const handleFireAtPosition = (position: Position) => {
    if (!isMyTurn) {
      Alert.alert('Não é sua vez', 'Aguarde o oponente jogar');
      return;
    }

    const cell = currentPlayer.opponentBoard.cells[position.row][position.col];
    if (cell.status === 'hit' || cell.status === 'miss') {
      Alert.alert('Posição já atacada', 'Escolha outra posição');
      return;
    }

    fireAtPosition(position);
  };

  const handleExitGame = () => {
    Alert.alert(
      'Sair do Jogo',
      'Tens certeza que desejas sair? O jogo será encerrado.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => {
            resetGame();
            router.replace('/' as any);
          }
        }
      ]
    );
  };

  const isMultiplayer = gameState.mode === 'multiplayer';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>⚓ Batalha Naval</Text>
          <Pressable style={styles.exitButton} onPress={handleExitGame}>
            <Text style={styles.exitButtonText}>🚪 Sair</Text>
          </Pressable>
        </View>

        {/* Connection status for multiplayer */}
        {isMultiplayer && (
          <View style={[
            styles.statusBar,
            { backgroundColor: connectionStatus === 'connected' ? '#4CAF50' : '#F44336' }
          ]}>
            <Text style={styles.statusText}>
              {connectionStatus === 'connected' ? '✅ Conectado' : '❌ Desconectado'}
            </Text>
          </View>
        )}

        {/* Turn indicator */}
        <View style={[
          styles.turnIndicator,
          { backgroundColor: isMyTurn ? '#4CAF50' : '#FFA500' }
        ]}>
          <Text style={styles.turnText}>
            {isMyTurn ? '🎯 SUA VEZ!' : '⏳ VEZ DO OPONENTE'}
          </Text>
          {currentTurnPlayer && (
            <Text style={styles.turnSubtext}>
              Jogador atual: {currentTurnPlayer.name}
            </Text>
          )}
        </View>

        {/* Player info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Você:</Text>
            <Text style={styles.infoValue}>{currentPlayer.name}</Text>
          </View>
          {opponent && (
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Oponente:</Text>
              <Text style={styles.infoValue}>{opponent.name}</Text>
            </View>
          )}
        </View>

        {/* Opponent board - where you attack */}
        <View style={styles.boardSection}>
          <Text style={styles.boardTitle}>🎯 Tabuleiro do Oponente</Text>
          <Text style={styles.boardSubtitle}>Clique para atacar</Text>
          <View style={styles.boardContainer}>
            <Board
              board={currentPlayer.opponentBoard}
              onCellPress={handleFireAtPosition}
              disabled={!isMyTurn}
              showShips={false}
            />
          </View>
        </View>

        {/* Your board - your ships */}
        <View style={styles.boardSection}>
          <Text style={styles.boardTitle}>🛡️ Seu Tabuleiro</Text>
          <Text style={styles.boardSubtitle}>Seus navios e ataques recebidos</Text>
          <View style={styles.boardContainer}>
            <Board
              board={currentPlayer.board}
              disabled={true}
              showShips={true}
            />
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda:</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.water }]} />
            <Text style={styles.legendText}>Água</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.shipHealthy }]} />
            <Text style={styles.legendText}>Seu navio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.shipHit }]} />
            <Text style={styles.legendText}>✕ Acerto</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: Colors.waterHit }]} />
            <Text style={styles.legendText}>○ Erro</Text>
          </View>
        </View>

        {/* Disconnection warning */}
        {isMultiplayer && connectionStatus !== 'connected' && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Conexão perdida! Tentando reconectar...
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  exitButton: {
    backgroundColor: Colors.error,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
    position: 'absolute',
    right: 0,
    ...Shadows.small,
  },
  exitButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusBar: {
    padding: 10,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  turnIndicator: {
    padding: 20,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: Colors.textPrimary,
    ...Shadows.medium,
  },
  turnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  turnSubtext: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: Colors.bgMedium,
    padding: 15,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.info,
    marginBottom: 5,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: 'bold',
  },
  boardSection: {
    marginBottom: 30,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 5,
  },
  boardSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 15,
  },
  boardContainer: {
    alignItems: 'center',
  },
  legend: {
    backgroundColor: Colors.bgMedium,
    padding: 15,
    borderRadius: BorderRadius.md,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 30,
    height: 30,
    borderRadius: 4,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  legendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  warningBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.2)',
    padding: 15,
    borderRadius: BorderRadius.md,
    marginTop: 20,
    borderWidth: 2,
    borderColor: Colors.error,
  },
  warningText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: Colors.error,
    textAlign: 'center',
    marginTop: 50,
  },
});
