import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Board } from '../components/Board';
import { useGameContext } from '../context/GameContext';
import { SHIPS_CONFIG } from '../utils/constants';

// Nota: remove a indicação de 'placed' por nome, porque Ship não tem 'name' no modelo atual.

export function SetupScreen() {
  const { gameState, setPlayerReady } = useGameContext();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  if (gameState.players.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sem jogadores criados</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players[currentPlayerIndex];
  const allShipsPlaced = currentPlayer.board.ships.length === SHIPS_CONFIG.length;

  function handleReady() {
    if (!allShipsPlaced) {
      Alert.alert('Erro', `Coloca todos os ${SHIPS_CONFIG.length} navios primeiro!`);
      return;
    }

    setPlayerReady(currentPlayer.id);

    if (currentPlayerIndex < gameState.players.length - 1) {
      Alert.alert(
        'Próximo Jogador',
        `${gameState.players[currentPlayerIndex + 1].name}, é a sua vez de colocar os navios!`,
        [{ text: 'OK', onPress: () => setCurrentPlayerIndex(currentPlayerIndex + 1) }]
      );
    } else {
      Alert.alert('Jogo Pronto!', 'Todos os jogadores colocaram seus navios. O jogo vai começar!');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Colocação de Navios</Text>
        <Text style={styles.playerName}>{currentPlayer.name}</Text>
        <Text style={styles.subtitle}>
          Navios colocados: {currentPlayer.board.ships.length} / {SHIPS_CONFIG.length}
        </Text>
      </View>

      <View style={styles.shipsInfo}>
        <Text style={styles.shipsTitle}>Frota a colocar:</Text>
        {SHIPS_CONFIG.map((ship, index) => (
          <Text key={index} style={styles.shipText}>
            • {ship.name} ({ship.size} células)
          </Text>
        ))}
      </View>

      <Board board={currentPlayer.board} showShips={true} />

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleReady} disabled={!allShipsPlaced}>
          <Text style={styles.buttonText}>
            {currentPlayerIndex < gameState.players.length - 1 ? 'Próximo Jogador' : 'Iniciar Jogo'}
          </Text>
        </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 8,
  },
  playerName: {
    fontSize: 20,
    color: '#e0e0e0',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  shipsInfo: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  shipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 10,
  },
  shipText: {
    fontSize: 14,
    color: '#e0e0e0',
    marginBottom: 5,
  },
  buttons: {
    marginTop: 20,
    width: '100%',
    gap: 12,
  },
  buttonPrimary: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});