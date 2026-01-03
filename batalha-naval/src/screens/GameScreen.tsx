import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import { Board } from '../components/Board';
import { useGameContext } from '../context/GameContext';

interface GameScreenProps {
  onGameEnd: () => void;
}

export function GameScreen({ onGameEnd }: GameScreenProps) {
  const { gameState, fire } = useGameContext();
  const [lastShotResult, setLastShotResult] = useState<string>('');

  if (gameState.players.length < 2) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Jogo não iniciado</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players.find(
    p => p.id === gameState.currentTurnPlayerId
  );

  const opponent = gameState.players.find(
    p => p.id !== gameState.currentTurnPlayerId
  );

  if (!currentPlayer || !opponent) {
    return null;
  }

  function handleFire(row: number, col: number) {
    if (!currentPlayer || !opponent) {
      return;
    }

    // Verificar se já foi atingida
    if (opponent.board.grid[row][col].hit) {
      Alert.alert('Atenção', 'Já disparaste nesta posição!');
      return;
    }

    const result = fire(currentPlayer.id, row, col);

    if (!result) return;

    let message = '';
    if (result === 'water') {
      message = '💦 Água!';
      setLastShotResult('water');
    } else if (result === 'hit') {
      message = '💥 Acertou!';
      setLastShotResult('hit');
    } else if (result === 'sunk') {
      message = '🔥 Navio Afundado!';
      setLastShotResult('sunk');
    }

    setTimeout(() => {
      Alert.alert('Resultado do Disparo', message);
    }, 100);
  }

  // Verificar fim de jogo
  useEffect(() => {
    if (gameState.phase === 'finished' && gameState.winnerId) {
      const winner = gameState.players.find(p => p.id === gameState.winnerId);
      setTimeout(() => {
        Alert.alert(
          '🎉 Fim de Jogo!',
          `Vencedor: ${winner?.name}`,
          [{ text: 'Ver Resultados', onPress: onGameEnd }]
        );
      }, 500);
    }
  }, [gameState.phase]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.turnIndicator}>
        <Text style={styles.turnText}>
          Turno: {currentPlayer.name}
        </Text>
        {lastShotResult && (
          <View style={[
            styles.resultBadge,
            lastShotResult === 'water' && styles.resultWater,
            lastShotResult === 'hit' && styles.resultHit,
            lastShotResult === 'sunk' && styles.resultSunk,
          ]}>
            <Text style={styles.resultText}>
              {lastShotResult === 'water' && '💦 Água'}
              {lastShotResult === 'hit' && '💥 Acerto'}
              {lastShotResult === 'sunk' && '🔥 Afundado'}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.boardSection}>
        <Text style={styles.boardTitle}>Meu Oceano 🌊</Text>
        <Text style={styles.boardSubtitle}>
          Navios: {currentPlayer.board.ships.filter(s => s.hits < s.size).length} / {currentPlayer.board.ships.length}
        </Text>
        <Board
          board={currentPlayer.board}
          showShips={true}
        />
      </View>

      <View style={styles.boardSection}>
        <Text style={styles.boardTitle}>Radar do Inimigo 🎯</Text>
        <Text style={styles.boardSubtitle}>
          Toca numa célula para disparar
        </Text>
        <Board
          board={opponent.board}
          onCellPress={handleFire}
          showShips={false}
        />
      </View>

      <View style={styles.statsBox}>
        <Text style={styles.statsTitle}>Estatísticas:</Text>
        <Text style={styles.statsText}>
          📊 Total de disparos: {opponent.board.grid.flat().filter(c => c.hit).length}
        </Text>
        <Text style={styles.statsText}>
          🎯 Acertos: {opponent.board.grid.flat().filter(c => c.hit && c.hasShip).length}
        </Text>
        <Text style={styles.statsText}>
          💦 Água: {opponent.board.grid.flat().filter(c => c.hit && !c.hasShip).length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 16,
  },
  turnIndicator: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  turnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  resultWater: {
    backgroundColor: '#2196F3',
  },
  resultHit: {
    backgroundColor: '#FF9800',
  },
  resultSunk: {
    backgroundColor: '#F44336',
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  boardSection: {
    marginBottom: 30,
    alignItems: 'center',
    width: '100%',
  },
  boardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 8,
  },
  boardSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 12,
  },
  statsBox: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginTop: 10,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 8,
  },
  statsText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 4,
  },
});
