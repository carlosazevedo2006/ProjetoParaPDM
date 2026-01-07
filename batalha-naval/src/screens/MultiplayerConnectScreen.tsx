// Multiplayer connect screen
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function MultiplayerConnectScreen() {
  const router = useRouter();
  const { connectToServer, connectionStatus, testConnection, joinOrCreateRoom } = useGame();
  
  const defaultServerUrl = Constants.expoConfig?.extra?.serverUrl || 'ws://192.168.1.69:3000';
  
  const [serverUrl, setServerUrl] = useState(defaultServerUrl);
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const success = await testConnection(serverUrl);
      if (success) {
        Alert.alert('✅ Sucesso', 'Conexão com servidor bem-sucedida!');
      } else {
        Alert.alert('❌ Erro', 'Não foi possível conectar ao servidor. Verifique o endereço IP e se o servidor está rodando.');
      }
    } catch (error) {
      Alert.alert('❌ Erro', 'Falha ao testar conexão.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleConnect = async () => {
    if (!serverUrl.trim()) {
      Alert.alert('Erro', 'Digite o endereço do servidor');
      return;
    }
    
    if (!roomId.trim()) {
      Alert.alert('Erro', 'Digite o ID da sala');
      return;
    }
    
    if (!playerName.trim()) {
      Alert.alert('Erro', 'Digite seu nome');
      return;
    }

    try {
      await connectToServer(serverUrl);
      // After connecting, join the room
      joinOrCreateRoom(roomId, playerName);
      // Navigate to lobby with params
      router.push({
        pathname: '/lobby',
        params: { roomId, playerName }
      } as any);
    } catch (error) {
      Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o servidor está rodando e o endereço IP está correto.');
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return '#4CAF50';
      case 'connecting':
        return '#FFA500';
      case 'error':
        return '#F44336';
      default:
        return '#999';
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '✅ Conectado';
      case 'connecting':
        return '⏳ Conectando...';
      case 'error':
        return '❌ Erro de conexão';
      default:
        return '⚪ Desconectado';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌐 Multiplayer Online</Text>
      
      <View style={[styles.statusBar, { backgroundColor: getStatusColor() }]}>
        <Text style={styles.statusText}>{getStatusText()}</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Endereço do Servidor</Text>
          <TextInput
            style={styles.input}
            value={serverUrl}
            onChangeText={setServerUrl}
            placeholder="ws://192.168.1.69:3000"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.hint}>
            Exemplo: ws://192.168.1.69:3000{'\n'}
            Substitua pelo IP do computador com o servidor
          </Text>
        </View>

        <Pressable
          style={[styles.testButton, isTesting && styles.disabledButton]}
          onPress={handleTestConnection}
          disabled={isTesting}
        >
          {isTesting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.testButtonText}>🔍 Testar Conexão</Text>
          )}
        </Pressable>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>ID da Sala</Text>
          <TextInput
            style={styles.input}
            value={roomId}
            onChangeText={setRoomId}
            placeholder="Ex: sala1"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />
          <Text style={styles.hint}>
            Use o mesmo ID para jogar com um amigo
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Seu Nome</Text>
          <TextInput
            style={styles.input}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Digite seu nome"
            placeholderTextColor="#999"
          />
        </View>

        <Pressable
          style={[styles.connectButton, connectionStatus === 'connecting' && styles.disabledButton]}
          onPress={handleConnect}
          disabled={connectionStatus === 'connecting'}
        >
          {connectionStatus === 'connecting' ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.connectButtonText}>Conectar e Entrar na Sala</Text>
          )}
        </Pressable>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.helpBox}>
        <Text style={styles.helpTitle}>💡 Como configurar:</Text>
        <Text style={styles.helpText}>
          1. Execute o servidor: npm run server{'\n'}
          2. Anote o IP mostrado no console{'\n'}
          3. Digite o IP no formato: ws://IP:3000{'\n'}
          4. Certifique-se de estar na mesma rede WiFi
        </Text>
      </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  statusBar: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  form: {
    gap: 15,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  hint: {
    fontSize: 12,
    color: '#87CEEB',
  },
  testButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: '#4CAF50',
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  connectButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.6,
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#87CEEB',
    fontSize: 16,
  },
  helpBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#87CEEB',
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 22,
  },
});
