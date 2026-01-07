// Play menu screen - game mode selection
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function PlayMenuScreen() {
  const router = useRouter();
  const { startLocalGame } = useGame();

  const handleLocalGame = () => {
    startLocalGame();
    router.push('/setup' as any);
  };

  const handleMultiplayerGame = () => {
    router.push('/multiplayer-mode' as any);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚓ Batalha Naval</Text>
      <Text style={styles.subtitle}>Selecione o modo de jogo</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleLocalGame}>
          <Text style={styles.buttonText}>🎮 Jogo Local</Text>
          <Text style={styles.buttonSubtext}>Jogar no mesmo dispositivo</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleMultiplayerGame}>
          <Text style={styles.buttonText}>🌐 Multiplayer Online</Text>
          <Text style={styles.buttonSubtext}>Jogar via WiFi (2 dispositivos)</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Escolha como deseja jogar
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.info,
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  button: {
    ...Buttons.primary,
    paddingVertical: 20,
    borderWidth: 3,
    borderColor: Colors.primaryDark,
    ...Shadows.large,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  buttonSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: Colors.info,
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: Colors.info,
    textAlign: 'center',
  },
});
