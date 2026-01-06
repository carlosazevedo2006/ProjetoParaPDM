// Settings screen - preferences and statistics
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';

export default function SettingsScreen() {
  const router = useRouter();
  const { gameState, clearStatistics } = useGame();

  const handleClearStatistics = () => {
    Alert.alert(
      'Limpar Estatísticas',
      'Tens certeza que desejas apagar todas as estatísticas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Limpar', 
          style: 'destructive',
          onPress: async () => {
            await clearStatistics();
            Alert.alert('Sucesso', 'Estatísticas limpas!');
          }
        }
      ]
    );
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>⚙️ Definições</Text>

        {/* Statistics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Jogos Jogados</Text>
              <Text style={styles.statValue}>
                {gameState?.statistics?.gamesPlayed || 0}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias</Text>
              <Text style={styles.statValue}>
                {gameState?.statistics?.wins || 0}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas</Text>
              <Text style={styles.statValue}>
                {gameState?.statistics?.losses || 0}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Taxa de Vitória</Text>
              <Text style={styles.statValue}>
                {gameState?.statistics?.winRate || 0}%
              </Text>
            </View>
          </View>
          
          <Pressable 
            style={styles.clearButton} 
            onPress={handleClearStatistics}
          >
            <Text style={styles.clearButtonText}>🗑️ Limpar Estatísticas</Text>
          </Pressable>
        </View>

        <Pressable style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E3A5F',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  statsContainer: {
    gap: 15,
  },
  statItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  clearButton: {
    backgroundColor: '#d9534f',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
