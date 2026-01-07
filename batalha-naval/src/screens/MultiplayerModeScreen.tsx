// Multiplayer mode selection screen
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function MultiplayerModeScreen() {
  const router = useRouter();

  function handleCreateRoom() {
    router.push('/create-room' as any);
  }

  function handleJoinRoom() {
    router.push('/join-room' as any);
  }

  function handleBack() {
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Multiplayer</Text>
      <Text style={styles.subtitle}>Escolhe uma opção</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handleCreateRoom}>
          <Text style={styles.buttonIcon}>🎮</Text>
          <Text style={styles.buttonText}>Criar Sala</Text>
          <Text style={styles.buttonDescription}>Iniciar nova partida</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleJoinRoom}>
          <Text style={styles.buttonIcon}>🔑</Text>
          <Text style={styles.buttonText}>Entrar em Sala</Text>
          <Text style={styles.buttonDescription}>Juntar-se com código</Text>
        </Pressable>
      </View>

      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Voltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.info,
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    alignItems: 'stretch',
    gap: 25,
  },
  button: {
    ...Buttons.primary,
    paddingVertical: 25,
    borderWidth: 3,
    borderColor: Colors.primaryDark,
    ...Shadows.large,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: Colors.info,
    fontSize: 16,
  },
});
