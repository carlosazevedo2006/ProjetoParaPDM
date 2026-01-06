// Game screen - main gameplay
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Board';
import { Position } from '../types';

export default function GameScreen() {
  const router = useRouter();
  const { gameState, myPlayerId, isMyTurn, fireAtPosition, connectionStatus } = useGame();

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

  const isMultiplayer = gameState.mode === 'multiplayer';

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚓ Batalha Naval</Text>

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
            <View style={[styles.legendColor, { backgroundColor: '#87CEEB' }]} />
            <Text style={styles.legendText}>Água</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4A90E2' }]} />
            <Text style={styles.legendText}>Seu navio</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF4444' }]} />
            <Text style={styles.legendText}>✕ Acerto</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#666666' }]} />
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
    backgroundColor: '#1E3A5F',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
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
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  statusText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  turnIndicator: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  turnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  turnSubtext: {
    fontSize: 14,
    color: '#FFF',
    marginTop: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  infoBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#87CEEB',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  boardSection: {
    marginBottom: 30,
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
  },
  boardSubtitle: {
    fontSize: 14,
    color: '#87CEEB',
    textAlign: 'center',
    marginBottom: 15,
  },
  boardContainer: {
    alignItems: 'center',
  },
  legend: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
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
    borderColor: '#333',
  },
  legendText: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  warningBox: {
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  warningText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
    marginTop: 50,
  },
});
