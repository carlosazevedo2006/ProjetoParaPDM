// Start screen - main menu
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function StartScreen() {
  const router = useRouter();

  const handlePlay = () => {
    router.push('/play-menu' as any);
  };

  const handleHowToPlay = () => {
    router.push('/how-to-play' as any);
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

        <Pressable style={styles.button} onPress={handleHowToPlay}>
          <Text style={styles.buttonText}>📚 Como Jogar</Text>
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
    fontSize: 24,
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
  exitButton: {
    ...Buttons.danger,
    paddingVertical: 20,
    borderWidth: 3,
    borderColor: '#a94442',
    ...Shadows.large,
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.textPrimary,
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
