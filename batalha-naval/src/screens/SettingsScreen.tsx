import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useGameContext } from '../context/GameContext';
import { TopBar } from '../components/TopBar';

export function SettingsScreen() {
  const { gameState, updatePhase, toggleVibration } = useGameContext();

  function handleBack() {
    updatePhase('start');
  }

  async function handleToggleVibration() {
    await toggleVibration();
  }

  return (
    <View style={styles.container}>
      <TopBar onBack={handleBack} backLabel="Voltar" rightText="" />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>⚙️ Definições</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferências</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Vibração</Text>
              <Text style={styles.settingDescription}>
                Ativar feedback vibratório durante o jogo
              </Text>
            </View>
            <Switch
              value={gameState.preferences.vibrationEnabled}
              onValueChange={handleToggleVibration}
              trackColor={{ false: '#767577', true: '#4da6ff' }}
              thumbColor={gameState.preferences.vibrationEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Jogos Jogados</Text>
              <Text style={styles.statValue}>—</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias</Text>
              <Text style={styles.statValue}>—</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas</Text>
              <Text style={styles.statValue}>—</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Taxa de Vitória</Text>
              <Text style={styles.statValue}>—</Text>
            </View>
          </View>
          
          <Text style={styles.statsNote}>
            ℹ️ As estatísticas serão implementadas numa versão futura
          </Text>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4da6ff',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  section: {
    backgroundColor: '#16213e',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4da6ff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4da6ff',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e0e0e0',
    marginBottom: 5,
  },
  settingDescription: {
    fontSize: 13,
    color: '#999',
  },
  statsContainer: {
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#0f3460',
  },
  statLabel: {
    fontSize: 15,
    color: '#e0e0e0',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4da6ff',
  },
  statsNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 15,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#4da6ff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
