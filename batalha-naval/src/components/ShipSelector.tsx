// Ship placement component
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShipType, SHIP_SIZES, SHIP_NAMES } from '../types';

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
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  shipList: {
    gap: 10,
  },
  shipButton: {
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedShip: {
    backgroundColor: '#4A90E2',
    borderColor: '#2E5C8A',
  },
  shipName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  shipSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedText: {
    color: '#FFF',
  },
  selectedSubtext: {
    color: '#E0E0E0',
  },
});
