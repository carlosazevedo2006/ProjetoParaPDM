// Settings screen - preferences and statistics
import React from 'react';
import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useGame } from '../context/GameContext';
import { Colors } from '../styles/colors';
import { Typography, Buttons, Spacing, BorderRadius, Shadows } from '../styles/common';

export default function SettingsScreen() {
  const router = useRouter();
  const { statistics, clearStatistics } = useGame();

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
                {statistics.gamesPlayed}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias</Text>
              <Text style={styles.statValue}>
                {statistics.wins}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas</Text>
              <Text style={styles.statValue}>
                {statistics.losses}
              </Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Taxa de Vitória</Text>
              <Text style={styles.statValue}>
                {statistics.winRate}%
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
    backgroundColor: Colors.bgDark,
  },
  content: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: BorderRadius.lg,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  statsContainer: {
    gap: 15,
  },
  statItem: {
    backgroundColor: Colors.bgLight,
    padding: 15,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  clearButton: {
    ...Buttons.danger,
    paddingVertical: 12,
    marginTop: 15,
  },
  clearButtonText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
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
