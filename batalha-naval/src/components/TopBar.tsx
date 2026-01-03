import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getServerUrl } from '../utils/config';

interface TopBarProps {
  onBack?: () => void;
  backLabel?: string;
  rightText?: string;
}

export function TopBar({ onBack, backLabel = 'Voltar', rightText }: TopBarProps) {
  const [showHelp, setShowHelp] = useState(false);
  const insets = useSafeAreaInsets();
  const serverUrl = getServerUrl();
  const isMultiplayer = !!serverUrl;
  
  const modeText = rightText || (isMultiplayer ? 'Multiplayer' : 'Local');

  return (
    <>
      <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
        <View style={styles.leftSection}>
          {onBack && (
            <TouchableOpacity style={styles.button} onPress={onBack}>
              <Text style={styles.buttonText}>← {backLabel}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <TouchableOpacity style={styles.helpButton} onPress={() => setShowHelp(true)}>
            <Text style={styles.helpButtonText}>❓ Ajuda</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.modeText}>{modeText}</Text>
        </View>
      </View>

      <Modal
        visible={showHelp}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelp(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📖 Como Jogar</Text>
            
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.sectionTitle}>🎮 Modo Local</Text>
              <Text style={styles.helpText}>
                • Dois jogadores no mesmo dispositivo{'\n'}
                • Digite os nomes e inicie o jogo{'\n'}
                • Navios são colocados automaticamente{'\n'}
                • Alternem turnos para disparar no tabuleiro inimigo
              </Text>

              <Text style={styles.sectionTitle}>🌐 Modo Multiplayer (WLAN)</Text>
              <Text style={styles.helpText}>
                Para jogar em rede local (WiFi):{'\n\n'}
                
                <Text style={styles.boldText}>1. Configure o servidor:</Text>{'\n'}
                • Ambos os dispositivos na mesma rede WiFi{'\n'}
                • Configure serverUrl no app.json{'\n'}
                • Consulte a documentação do desenvolvedor{'\n\n'}
                
                <Text style={styles.boldText}>2. Emparelhamento:</Text>{'\n'}
                • Cada dispositivo digita os MESMOS dois nomes{'\n'}
                • No seu dispositivo, digite SEU nome em "Jogador 1"{'\n'}
                • Digite o nome do oponente em "Jogador 2"{'\n'}
                • Exemplo:{'\n'}
                  - Dispositivo A: J1="Alice", J2="Bob"{'\n'}
                  - Dispositivo B: J1="Bob", J2="Alice"{'\n\n'}
                
                <Text style={styles.boldText}>3. Jogar:</Text>{'\n'}
                • Ambos clicam "Iniciar Jogo"{'\n'}
                • Navios são colocados automaticamente{'\n'}
                • Só pode disparar quando for seu turno{'\n'}
                • O jogo sincroniza entre os dispositivos
              </Text>

              <Text style={styles.sectionTitle}>🎯 Como Jogar</Text>
              <Text style={styles.helpText}>
                • <Text style={styles.boldText}>Objetivo:</Text> Afundar toda a frota inimiga{'\n'}
                • <Text style={styles.boldText}>Seu Oceano:</Text> Veja seus navios e ataques recebidos{'\n'}
                • <Text style={styles.boldText}>Radar do Inimigo:</Text> Toque para disparar{'\n'}
                • 💦 Azul claro = água atingida{'\n'}
                • 🔥 Vermelho = acerto!{'\n'}
                • Afunde todos os navios para vencer
              </Text>

              <Text style={styles.sectionTitle}>⚙️ Dicas</Text>
              <Text style={styles.helpText}>
                • Use o botão "Voltar" para sair ou reiniciar{'\n'}
                • Em multiplayer, cada dispositivo controla um jogador{'\n'}
                • Só pode disparar no seu turno{'\n'}
                • Veja "Turno:" para saber de quem é a vez
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowHelp(false)}
            >
              <Text style={styles.closeButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#16213e',
    paddingHorizontal: 12,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#4da6ff',
    width: '100%',
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#0f3460',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4da6ff',
  },
  buttonText: {
    color: '#4da6ff',
    fontSize: 14,
    fontWeight: '600',
  },
  helpButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#4da6ff',
    borderRadius: 6,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modeText: {
    color: '#e0e0e0',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: '#4da6ff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalScroll: {
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginTop: 15,
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#4da6ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
