import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { useGameContext } from '../context/GameContext';
import { TopBar } from '../components/TopBar';

export function StartScreen() {
  const { updatePhase } = useGameContext();

  function handlePlay() {
    updatePhase('playMenu');
  }

  function handleSettings() {
    updatePhase('settings');
  }

  function handleExit() {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: () => BackHandler.exitApp()
        },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <TopBar rightText="" />
      <View style={styles.content}>
        <Text style={styles.title}>⚓ Batalha Naval ⚓</Text>
        <Text style={styles.subtitle}>Bem-vindo!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handlePlay}>
            <Text style={styles.buttonText}>🎮 Jogar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSettings}>
            <Text style={styles.buttonText}>⚙️ Definições</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.exitButton]} onPress={handleExit}>
            <Text style={styles.buttonText}>🚪 Sair</Text>
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
    fontSize: 42,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 60,
  },
  buttonContainer: {
    alignItems: 'stretch',
    gap: 20,
  },
  button: {
    backgroundColor: '#4da6ff',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#66b3ff',
  },
  exitButton: {
    backgroundColor: '#d9534f',
    borderColor: '#c9302c',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
