// Join room screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';

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
    const regex = /^[A-Z0-9]{6}$/;
    return regex.test(code);
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
      const defaultServerUrl = 'ws://192.168.1.100:3000'; // TODO: Make configurable
      if (connectionStatus !== 'connected') {
        await connectToServer(defaultServerUrl);
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
    backgroundColor: '#1E3A5F',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: '#87CEEB',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#4A90E2',
    color: '#FFF',
    padding: 20,
    borderRadius: 8,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 8,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: '#2E5C8A',
    marginBottom: 10,
    fontFamily: 'monospace',
  },
  hint: {
    fontSize: 12,
    color: '#87CEEB',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  infoText: {
    fontSize: 13,
    color: '#E0E0E0',
    lineHeight: 20,
    textAlign: 'center',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
