// Setup screen - ship placement
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Board } from '../components/Board';
import { ShipSelector } from '../components/ShipSelector';
import { ShipType, SHIP_SIZES, Position, Ship } from '../types';
import { canPlaceShip, generateShipPositions } from '../utils/boardUtils';
import uuid from 'react-native-uuid';

const REQUIRED_SHIPS: ShipType[] = ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'];

export default function SetupScreen() {
  const router = useRouter();
  const { gameState, placeShipOnBoard, setPlayerReady, myPlayerId } = useGame();
  
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [placedShips, setPlacedShips] = useState<ShipType[]>([]);

  if (!gameState) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Estado do jogo não encontrado</Text>
      </View>
    );
  }

  const isMultiplayer = gameState.mode === 'multiplayer';
  const myPlayerIndex = gameState.players.findIndex(p => p?.id === myPlayerId);
  const currentPlayer = gameState.players[myPlayerIndex >= 0 ? myPlayerIndex : 0];
  
  if (!currentPlayer) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erro: Jogador não encontrado</Text>
      </View>
    );
  }

  const availableShips = REQUIRED_SHIPS.filter(ship => !placedShips.includes(ship));
  const allShipsPlaced = placedShips.length === REQUIRED_SHIPS.length;

  const handleCellPress = (position: Position) => {
    if (!selectedShip) {
      Alert.alert('Selecione um navio', 'Primeiro selecione um navio para posicionar');
      return;
    }

    const size = SHIP_SIZES[selectedShip];
    const positions = generateShipPositions(position, size, isHorizontal);

    if (!canPlaceShip(currentPlayer.board, positions)) {
      Alert.alert('Posição inválida', 'Não é possível colocar o navio nesta posição');
      return;
    }

    const ship: Ship = {
      id: uuid.v4() as string,
      type: selectedShip,
      size,
      positions,
      hits: 0,
      sunk: false,
    };

    placeShipOnBoard(myPlayerIndex >= 0 ? myPlayerIndex as 0 | 1 : 0, ship);
    setPlacedShips([...placedShips, selectedShip]);
    setSelectedShip(null);
  };

  const handleReady = () => {
    if (!allShipsPlaced) {
      Alert.alert('Posicione todos os navios', 'Você precisa posicionar todos os navios antes de ficar pronto');
      return;
    }

    setPlayerReady(myPlayerIndex >= 0 ? myPlayerIndex as 0 | 1 : 0);
    
    if (gameState.phase === 'playing' || (currentPlayer.ready && gameState.players.every(p => p?.ready))) {
      router.replace('/game' as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚓ Posicione seus Navios</Text>

        {isMultiplayer && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Você é: {currentPlayer.name}
            </Text>
          </View>
        )}

        <View style={styles.controls}>
          <Pressable
            style={styles.orientationButton}
            onPress={() => setIsHorizontal(!isHorizontal)}
          >
            <Text style={styles.orientationButtonText}>
              Orientação: {isHorizontal ? '➡️ Horizontal' : '⬇️ Vertical'}
            </Text>
          </Pressable>
        </View>

        {availableShips.length > 0 && (
          <ShipSelector
            availableShips={availableShips}
            selectedShip={selectedShip}
            onSelectShip={setSelectedShip}
          />
        )}

        <View style={styles.boardContainer}>
          <Board
            board={currentPlayer.board}
            onCellPress={handleCellPress}
            showShips={true}
            title="Seu Tabuleiro"
          />
        </View>

        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Navios posicionados: {placedShips.length}/{REQUIRED_SHIPS.length}
          </Text>
        </View>

        {allShipsPlaced && (
          <Pressable style={styles.readyButton} onPress={handleReady}>
            <Text style={styles.readyButtonText}>
              ✅ Estou Pronto!
            </Text>
          </Pressable>
        )}

        {currentPlayer.ready && (
          <View style={styles.waitingBox}>
            <Text style={styles.waitingText}>
              ⏳ Aguardando oponente posicionar navios...
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
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  controls: {
    marginBottom: 20,
  },
  orientationButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  orientationButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  progressContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  readyButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  readyButtonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  waitingBox: {
    backgroundColor: 'rgba(255, 165, 0, 0.3)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#FFA500',
  },
  waitingText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
  errorText: {
    fontSize: 18,
    color: '#FF4444',
    textAlign: 'center',
  },
});
