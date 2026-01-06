import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameContext } from '../context/GameContext';
import { TopBar } from '../components/TopBar';

export function PlayMenuScreen() {
  const { updatePhase } = useGameContext();

  function handleLocal() {
    updatePhase('lobby');
  }

  function handleMultiplayer() {
    updatePhase('connect');
  }

  function handleBack() {
    updatePhase('start');
  }

  return (
    <View style={styles.container}>
      <TopBar onBack={handleBack} backLabel="Voltar" rightText="" />
      <View style={styles.content}>
        <Text style={styles.title}>Escolha o Modo de Jogo</Text>
        <Text style={styles.subtitle}>Selecione como deseja jogar</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLocal}>
            <Text style={styles.buttonIcon}>📱</Text>
            <Text style={styles.buttonText}>Local</Text>
            <Text style={styles.buttonDescription}>Mesmo dispositivo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleMultiplayer}>
            <Text style={styles.buttonIcon}>🌐</Text>
            <Text style={styles.buttonText}>Multiplayer</Text>
            <Text style={styles.buttonDescription}>Mesma WLAN</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    alignItems: 'stretch',
    gap: 25,
  },
  button: {
    backgroundColor: '#16213e',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4da6ff',
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  buttonText: {
    color: '#4da6ff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonDescription: {
    color: '#e0e0e0',
    fontSize: 14,
  },
});
