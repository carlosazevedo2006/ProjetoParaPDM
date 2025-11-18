import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { GameConfig } from '../game/types';

interface SettingsPanelProps {
  config: GameConfig;
  onConfigChange: (config: GameConfig) => void;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ config, onConfigChange, onClose }) => {
  const colorOptions = [
    { name: 'Verde', value: '#10b981' },
    { name: 'Azul', value: '#3b82f6' },
    { name: 'Roxo', value: '#8b5cf6' },
    { name: 'Rosa', value: '#ec4899' },
    { name: 'Laranja', value: '#f59e0b' },
  ];

  return (
    <ScrollView style={styles.settingsContainer}>
      <Text style={styles.settingsTitle}>⚙️ Configurações</Text>
      
      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>
          Tamanho do Tabuleiro: {config.gridSize}x{config.gridSize}
        </Text>
        <View style={styles.buttonRow}>
          {[8, 10, 12, 15].map(size => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                config.gridSize === size && styles.sizeButtonActive
              ]}
              onPress={() => onConfigChange({ ...config, gridSize: size })}
            >
              <Text style={styles.sizeButtonText}>{size}x{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Cor da Cobra</Text>
        <View style={styles.colorRow}>
          {colorOptions.map(color => (
            <TouchableOpacity
              key={color.value}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                config.snakeColor === color.value && styles.colorButtonActive
              ]}
              onPress={() => onConfigChange({ ...config, snakeColor: color.value })}
            />
          ))}
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.settingLabel}>Velocidade Inicial: {config.initialSpeed}ms</Text>
        <View style={styles.buttonRow}>
          {[300, 200, 150, 100].map(speed => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedButton,
                config.initialSpeed === speed && styles.speedButtonActive
              ]}
              onPress={() => onConfigChange({ ...config, initialSpeed: speed })}
            >
              <Text style={styles.speedButtonText}>
                {speed === 300 ? 'Lenta' : speed === 200 ? 'Normal' : speed === 150 ? 'Rápida' : 'Muito Rápida'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={styles.checkboxRow}
        onPress={() => onConfigChange({ ...config, speedIncrease: !config.speedIncrease })}
      >
        <View style={[styles.checkbox, config.speedIncrease && styles.checkboxActive]}>
          {config.speedIncrease && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.checkboxLabel}>Aumentar velocidade com pontuação</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Voltar ao Jogo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    backgroundColor: '#111827',
    padding: 20,
    paddingTop: 50,
  },
  settingsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingSection: {
    marginBottom: 25,
  },
  settingLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sizeButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    minWidth: 70,
  },
  sizeButtonActive: {
    backgroundColor: '#10b981',
  },
  sizeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  colorRow: {
    flexDirection: 'row',
    gap: 15,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorButtonActive: {
    borderColor: 'white',
    transform: [{ scale: 1.1 }],
  },
  speedButton: {
    backgroundColor: '#4b5563',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    minWidth: 80,
  },
  speedButtonActive: {
    backgroundColor: '#3b82f6',
  },
  speedButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6b7280',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    color: 'white',
    fontSize: 16,
    flex: 1,
  },
  closeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});