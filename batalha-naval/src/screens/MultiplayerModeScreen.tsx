// Multiplayer mode selection screen
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

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
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#87CEEB',
    textAlign: 'center',
    marginBottom: 50,
  },
  buttonContainer: {
    alignItems: 'stretch',
    gap: 25,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2E5C8A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  buttonDescription: {
    color: '#E0E0E0',
    fontSize: 14,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  backButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
