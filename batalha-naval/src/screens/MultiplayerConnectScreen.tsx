import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useGameContext } from '../context/GameContext';
import { TopBar } from '../components/TopBar';
import { getServerUrl } from '../utils/config';

export function MultiplayerConnectScreen() {
  const { updatePhase, connectServer } = useGameContext();
  
  // Initialize with server URL from config if available
  const defaultUrl = getServerUrl() || 'ws://192.168.1.100:3000';
  const [serverUrl, setServerUrl] = useState(defaultUrl);
  const [connecting, setConnecting] = useState(false);

  function handleBack() {
    updatePhase('playMenu');
  }

  async function handleConnect() {
    if (!serverUrl.trim()) {
      Alert.alert('Erro', 'Por favor, insira um URL do servidor');
      return;
    }

    // Basic validation for WebSocket URL
    if (!serverUrl.startsWith('ws://') && !serverUrl.startsWith('wss://')) {
      Alert.alert(
        'URL Inválido',
        'O URL deve começar com ws:// ou wss://'
      );
      return;
    }

    setConnecting(true);
    try {
      await connectServer(serverUrl.trim());
      Alert.alert(
        'Conectado',
        'Ligado ao servidor com sucesso! Pode agora ir para o Lobby.',
        [
          {
            text: 'Ir para Lobby',
            onPress: () => updatePhase('lobby'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Erro de Conexão',
        'Não foi possível conectar ao servidor. Verifique o URL e tente novamente.'
      );
    } finally {
      setConnecting(false);
    }
  }

  function handleGoToLobby() {
    updatePhase('lobby');
  }

  return (
    <View style={styles.container}>
      <TopBar onBack={handleBack} backLabel="Voltar" rightText="" />
      <View style={styles.content}>
        <Text style={styles.title}>🌐 Multiplayer</Text>
        <Text style={styles.subtitle}>Conectar ao Servidor</Text>

        <View style={styles.form}>
          <Text style={styles.label}>URL do Servidor WebSocket:</Text>
          <Text style={styles.hint}>Exemplo: ws://192.168.1.100:3000</Text>
          
          <TextInput
            style={styles.input}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder="ws://IP:PORTA"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!connecting}
          />

          <TouchableOpacity 
            style={[styles.button, connecting && styles.buttonDisabled]} 
            onPress={handleConnect}
            disabled={connecting}
          >
            {connecting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>🔌 Conectar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={[styles.button, styles.secondaryButton]} 
            onPress={handleGoToLobby}
            disabled={connecting}
          >
            <Text style={styles.buttonText}>Já estou ligado — Ir para Lobby</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ Informação</Text>
          <Text style={styles.infoText}>
            • Ambos os dispositivos devem estar na mesma rede WiFi{'\n'}
            • O servidor WebSocket deve estar em execução{'\n'}
            • Use o endereço IP local do servidor{'\n'}
            • Consulte a documentação para configurar o servidor
          </Text>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 30,
  },
  form: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#e0e0e0',
    marginBottom: 5,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#0f3460',
    color: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#4da6ff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  secondaryButton: {
    backgroundColor: '#0f3460',
    borderWidth: 2,
    borderColor: '#4da6ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#4da6ff',
  },
  dividerText: {
    color: '#e0e0e0',
    marginHorizontal: 10,
    fontSize: 14,
  },
  infoBox: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4da6ff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 20,
  },
});
