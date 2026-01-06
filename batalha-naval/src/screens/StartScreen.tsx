// Start screen - main menu
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';

export default function StartScreen() {
  const router = useRouter();

  const handlePlay = () => {
    router.push('/play-menu' as any);
  };

  const handleSettings = () => {
    router.push('/settings' as any);
  };

  const handleExit = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do jogo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: () => BackHandler.exitApp() 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚓ Batalha Naval ⚓</Text>
      <Text style={styles.subtitle}>Bem-vindo!</Text>

      <View style={styles.buttonContainer}>
        <Pressable style={styles.button} onPress={handlePlay}>
          <Text style={styles.buttonText}>🎮 Jogar</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={handleSettings}>
          <Text style={styles.buttonText}>⚙️ Definições</Text>
        </Pressable>

        <Pressable style={styles.exitButton} onPress={handleExit}>
          <Text style={styles.buttonText}>🚪 Sair</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Desenvolvido para PDM{'\n'}
          Batalha Naval com WebSocket
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    color: '#87CEEB',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 20,
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
  exitButton: {
    backgroundColor: '#d9534f',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#a94442',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#87CEEB',
    textAlign: 'center',
  },
});
