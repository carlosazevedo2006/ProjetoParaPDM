import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Board } from '../components/Board';
import { useGameContext } from '../context/GameContext';
import { SHIPS_CONFIG } from '../utils/constants';
import { TopBar } from '../components/TopBar';

// Nota: remove a indicação de 'placed' por nome, porque Ship não tem 'name' no modelo atual.

export function SetupScreen() {
  const { gameState, setPlayerReady, resetGame, myPlayerId } = useGameContext();
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);

  function handleBack() {
    Alert.alert(
      'Voltar ao Lobby',
      'Tem certeza que deseja voltar? O progresso será perdido.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Voltar', onPress: () => resetGame() },
      ]
    );
  }

  if (gameState.players.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Sem jogadores criados</Text>
      </View>
    );
  }

  const currentPlayer = gameState.players[currentPlayerIndex];
  const allShipsPlaced = currentPlayer.board.ships.length === SHIPS_CONFIG.length;
  
  // In multiplayer, show which player this device controls
  const devicePlayerText = myPlayerId 
    ? `Você controla: ${gameState.players.find(p => p.id === myPlayerId)?.name || 'N/A'}`
    : undefined;

  function handleReady() {
    // Em modo multiplayer ou se os navios estiverem colocados, permite continuar
    // A função setPlayerReady irá auto-colocar os navios se necessário
    setPlayerReady(currentPlayer.id);

    if (currentPlayerIndex < gameState.players.length - 1) {
      Alert.alert(
        'Próximo Jogador',
        `${gameState.players[currentPlayerIndex + 1].name}, é a sua vez de preparar!`,
        [{ text: 'OK', onPress: () => setCurrentPlayerIndex(currentPlayerIndex + 1) }]
      );
    } else {
      const message = allShipsPlaced
        ? 'Todos os jogadores colocaram seus navios. O jogo vai começar!'
        : 'Os navios serão colocados automaticamente. O jogo vai começar!';
      Alert.alert('Jogo Pronto!', message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TopBar onBack={handleBack} rightText={devicePlayerText} />
      <View style={styles.content}>
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
          <TouchableOpacity style={styles.buttonPrimary} onPress={handleReady}>
            <Text style={styles.buttonText}>
              {currentPlayerIndex < gameState.players.length - 1 ? 'Próximo Jogador' : 'Iniciar Jogo'}
            </Text>
          </TouchableOpacity>
          {!allShipsPlaced && (
            <Text style={styles.autoPlaceNote}>
              💡 Os navios serão colocados automaticamente
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flexGrow: 1,
    padding: 20,
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
  autoPlaceNote: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
});