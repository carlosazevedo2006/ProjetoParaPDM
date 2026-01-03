import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useGameContext } from '../context/GameContext';
import { TopBar } from '../components/TopBar';

export function LobbyScreen() {
  const [player1Name, setPlayer1Name] = useState('Jogador 1');
  const [player2Name, setPlayer2Name] = useState('Jogador 2');
  const { createPlayers } = useGameContext();

  function handleStartGame() {
    if (!player1Name.trim() || !player2Name.trim()) {
      Alert.alert('Erro', 'Por favor, insira o nome dos dois jogadores');
      return;
    }
    createPlayers(player1Name.trim(), player2Name.trim());
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.content}>
        <Text style={styles.title}>⚓ Batalha Naval ⚓</Text>
        <Text style={styles.subtitle}>Multiplayer WLAN</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Nome do Jogador 1:</Text>
          <TextInput
            style={styles.input}
            value={player1Name}
            onChangeText={setPlayer1Name}
            placeholder="Digite o nome do Jogador 1"
            placeholderTextColor="#999"
          />

          <Text style={styles.label}>Nome do Jogador 2:</Text>
          <TextInput
            style={styles.input}
            value={player2Name}
            onChangeText={setPlayer2Name}
            placeholder="Digite o nome do Jogador 2"
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.button} onPress={handleStartGame}>
            <Text style={styles.buttonText}>Iniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4da6ff',
  },
  button: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});