import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameContext } from '../context/GameContext';

export function ResultScreen() {
  const { gameState, resetGame } = useGameContext();

  const winner = gameState.players.find(p => p.id === gameState.winnerId);
  const loser = gameState.players.find(p => p.id !== gameState.winnerId);

  if (!winner || !loser) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Dados do jogo não disponíveis</Text>
      </View>
    );
  }

  const winnerShots = loser.board.cells.flat().filter(c => c.hit).length;
  const winnerHits = loser.board.cells.flat().filter(c => c.hit && c.shipId).length;
  const winnerMisses = winnerShots - winnerHits;
  const accuracy = winnerShots > 0 ? ((winnerHits / winnerShots) * 100).toFixed(1) : '0';

  function handleRestart() {
    resetGame();
  }

  return (
    <View style={styles.container}>
      <View style={styles.trophy}>
        <Text style={styles.trophyIcon}>🏆</Text>
        <Text style={styles.winnerTitle}>Vitória!</Text>
        <Text style={styles.winnerName}>{winner.name}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Estatísticas do Vencedor</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total de Disparos:</Text>
          <Text style={styles.statValue}>{winnerShots}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🎯 Acertos:</Text>
          <Text style={styles.statValue}>{winnerHits}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>💦 Erros:</Text>
          <Text style={styles.statValue}>{winnerMisses}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>📈 Precisão:</Text>
          <Text style={styles.statValue}>{accuracy}%</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>🚢 Navios Afundados:</Text>
          <Text style={styles.statValue}>{loser.board.ships.length}</Text>
        </View>
      </View>

      <View style={styles.shipsInfo}>
        <Text style={styles.shipsTitle}>Frota Inimiga Destruída:</Text>
        {loser.board.ships.map((ship, index) => (
          <View key={index} style={styles.shipRow}>
            <Text style={styles.shipIcon}>💥</Text>
            <Text style={styles.shipName}>{ship.name}</Text>
            <Text style={styles.shipSize}>({ship.size} células)</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRestart}>
        <Text style={styles.buttonText}>🔄 Nova Partida</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
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
  trophy: {
    alignItems: 'center',
    marginBottom: 30,
  },
  trophyIcon: {
    fontSize: 80,
    marginBottom: 10,
  },
  winnerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 8,
  },
  winnerName: {
    fontSize: 28,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  statsContainer: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  statLabel: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  statValue: {
    fontSize: 16,
    color: '#4da6ff',
    fontWeight: 'bold',
  },
  shipsInfo: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  shipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 10,
  },
  shipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  shipIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  shipName: {
    fontSize: 14,
    color: '#e0e0e0',
    flex: 1,
  },
  shipSize: {
    fontSize: 12,
    color: '#999',
  },
  button: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
