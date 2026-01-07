// Ship placement component
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShipType, SHIP_SIZES, SHIP_NAMES } from '../types';
import { Colors } from '../styles/colors';
import { Spacing, BorderRadius } from '../styles/common';

interface ShipSelectorProps {
  availableShips: ShipType[];
  selectedShip: ShipType | null;
  onSelectShip: (ship: ShipType) => void;
}

export function ShipSelector({ availableShips, selectedShip, onSelectShip }: ShipSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um navio para posicionar:</Text>
      <View style={styles.shipList}>
        {availableShips.map((shipType) => {
          const isSelected = selectedShip === shipType;
          return (
            <Pressable
              key={shipType}
              style={[
                styles.shipButton,
                isSelected && styles.selectedShip,
              ]}
              onPress={() => onSelectShip(shipType)}
            >
              <Text style={[styles.shipName, isSelected && styles.selectedText]}>
                {SHIP_NAMES[shipType]}
              </Text>
              <Text style={[styles.shipSize, isSelected && styles.selectedSubtext]}>
                Tamanho: {SHIP_SIZES[shipType]}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.textPrimary,
    textAlign: 'center',
    
    // Adicionar sombra para melhor legibilidade
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  shipList: {
    gap: 10,
  },
  shipButton: {
    padding: 15,
    backgroundColor: Colors.bgMedium,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  selectedShip: {
    backgroundColor: Colors.primaryFaded,
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  shipName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  shipSize: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  selectedText: {
    color: Colors.textPrimary,
  },
  selectedSubtext: {
    color: Colors.textSecondary,
  },
});
