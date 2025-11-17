import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Direction } from '../types/gameTypes';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void;
  onPause: () => void;
  onRestart: () => void;
  isPlaying: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onPause,
  onRestart,
  isPlaying
}) => {
  return (
    // REMOVA O GestureHandlerRootView e Swipeable temporariamente
    <View style={styles.container}>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={onPause}>
          <Text style={styles.buttonText}>{isPlaying ? '⏸️ Pause' : '▶️ Resume'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onRestart}>
          <Text style={styles.buttonText}>🔄 Restart</Text>
        </TouchableOpacity>
      </View>
      
      {/* ÁREA DE CONTROLES DIRECIONAIS SIMPLES */}
      <View style={styles.directionPad}>
        <Text style={styles.instructions}>
          Use os botões abaixo para controlar a cobra
        </Text>
        
        <View style={styles.directionRow}>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('UP')}
          >
            <Text style={styles.directionText}>↑</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.directionRow}>
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('LEFT')}
          >
            <Text style={styles.directionText}>←</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('RIGHT')}
          >
            <Text style={styles.directionText}>→</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.directionRow}>
          <View style={styles.placeholder} />
          <TouchableOpacity 
            style={styles.directionButton} 
            onPress={() => onDirectionChange('DOWN')}
          >
            <Text style={styles.directionText}>↓</Text>
          </TouchableOpacity>
          <View style={styles.placeholder} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 25,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 15,
  },
  directionPad: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  directionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  directionButton: {
    width: 64,
    height: 64,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
    margin: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  directionText: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
  },
  placeholder: {
    width: 64,
    height: 64,
    margin: 6,
  },
});

export default Controls;