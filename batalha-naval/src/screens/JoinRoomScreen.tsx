import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { getServerUrl, ROOM_CODE_REGEX } from '../config';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Inputs, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function JoinRoomScreen() {
  const router = useRouter();
  const { connectToServer, connectionStatus, joinRoom } = useGame();
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);

  function handleBack() {
    router.back();
  }

  function validateCode(code: string): boolean {
    // Code must be 6 alphanumeric characters
    return ROOM_CODE_REGEX.test(code);
  }

  async function handleJoin() {
    const code = roomCode.toUpperCase().trim();

    if (!code) {
      Alert.alert('Erro', 'Por favor, insere um código');
      return;
    }

    if (!validateCode(code)) {
      Alert.alert('Código Inválido', 'O código deve ter 6 caracteres (letras e números)');
      return;
    }

    setLoading(true);
    try {
      // Connect to server if not connected
      const serverUrl = getServerUrl();
      if (connectionStatus !== 'connected') {
        await connectToServer(serverUrl);
      }
      
      // Try to join room
      const success = await joinRoom(code);
      
      if (success) {
        // Navigate to lobby
        router.replace('/lobby' as any);
      } else {
        Alert.alert('Erro', 'Sala não encontrada ou está cheia');
      }
    } catch (error) {
      console.error('[JoinRoomScreen] Error joining room:', error);
      Alert.alert('Erro', 'Não foi possível entrar na sala. Verifica o código.');
    } finally {
      setLoading(false);
    }
  }

  function handleCodeChange(text: string) {
    // Only letters and numbers, max 6, uppercase
    const filtered = text.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    setRoomCode(filtered);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔑 Entrar em Sala</Text>
      <Text style={styles.subtitle}>Insere o código da sala</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Código (6 caracteres):</Text>

        <TextInput
          style={styles.input}
          value={roomCode}
          onChangeText={handleCodeChange}
          placeholder="ABC123"
          placeholderTextColor="#999"
          maxLength={6}
          autoCapitalize="characters"
          autoCorrect={false}
          editable={!loading}
        />

        <Text style={styles.hint}>
          Letras e números apenas
        </Text>

        <Pressable
          style={[styles.button, (loading || roomCode.length !== 6) && styles.buttonDisabled]}
          onPress={handleJoin}
          disabled={loading || roomCode.length !== 6}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>✅ Entrar</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Pede o código ao jogador que criou a sala.{'\n\n'}
          O código tem 6 caracteres (letras e números).
        </Text>
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
    padding: Spacing.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.info,
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: BorderRadius.md,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  label: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.primary,
    color: Colors.textPrimary,
    padding: 20,
    borderRadius: BorderRadius.md,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryDark,
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: Colors.info,
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    ...Buttons.success,
  },
  buttonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: Colors.bgMedium,
    padding: 15,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
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
});
