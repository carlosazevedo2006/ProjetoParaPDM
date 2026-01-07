import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { getServerUrl } from '../config';

export default function CreateRoomScreen() {
  const router = useRouter();
  const { gameState, connectToServer, connectionStatus, createRoom } = useGame();
  const [roomCode, setRoomCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [waiting, setWaiting] = useState(false);

  useEffect(() => {
    // Create room automatically when component mounts
    createRoomAndGetCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createRoomAndGetCode() {
    setLoading(true);
    try {
      // Connect to server first if not connected
      const serverUrl = getServerUrl();
      if (connectionStatus !== 'connected') {
        await connectToServer(serverUrl);
      }
      
      // Create room and get code
      const code = await createRoom();
      setRoomCode(code);
      setWaiting(true);
    } catch (error) {
      console.error('[CreateRoomScreen] Error creating room:', error);
      Alert.alert('Erro', 'Não foi possível criar a sala. Verifica a conexão.');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function handleCopyCode() {
    await Clipboard.setStringAsync(roomCode);
    Alert.alert('✅ Copiado!', 'Código copiado para a área de transferência');
  }

  function handleCancel() {
    Alert.alert(
      'Cancelar',
      'Tens certeza que desejas cancelar a criação da sala?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            router.back();
          },
        },
      ]
    );
  }

  function handleBack() {
    handleCancel();
  }

  // When second player connects, navigate to lobby
  useEffect(() => {
    if (gameState?.roomPlayerCount === 2) {
      router.replace('/lobby' as any);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.roomPlayerCount]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Criar Sala</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Criando sala...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.label}>Código da Sala:</Text>

          <View style={styles.codeContainer}>
            <Text style={styles.code}>{roomCode}</Text>
          </View>

          <Pressable style={styles.copyButton} onPress={handleCopyCode}>
            <Text style={styles.copyButtonText}>📋 Copiar Código</Text>
          </Pressable>

          {waiting && (
            <View style={styles.waitingContainer}>
              <ActivityIndicator size="small" color="#4A90E2" />
              <Text style={styles.waitingText}>Aguardando outro jogador...</Text>
            </View>
          )}

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Partilha este código com o outro jogador!{'\n\n'}
              Ele deve escolher "Entrar em Sala" e inserir este código.
            </Text>
          </View>

          <Pressable style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelButtonText}>❌ Cancelar</Text>
          </Pressable>
        </View>
      )}

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
    marginBottom: 40,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 18,
    color: '#87CEEB',
    textAlign: 'center',
    marginBottom: 20,
  },
  codeContainer: {
    backgroundColor: '#4A90E2',
    padding: 30,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#2E5C8A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  code: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFF',
    letterSpacing: 8,
    fontFamily: 'monospace',
  },
  copyButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  copyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#87CEEB',
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 20,
  },
  waitingText: {
    fontSize: 16,
    color: '#4A90E2',
  },
  infoBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  infoText: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#d9534f',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
});
