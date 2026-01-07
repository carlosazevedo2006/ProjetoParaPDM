// Board component for displaying the game grid
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Board as BoardType, Position, BOARD_SIZE } from '../types';
import { Colors } from '../styles/colors';

interface BoardProps {
  board: BoardType;
  onCellPress?: (position: Position) => void;
  disabled?: boolean;
  showShips?: boolean;
  title?: string;
}

export function Board({ board, onCellPress, disabled = false, showShips = true, title }: BoardProps) {
  const getCellColor = (row: number, col: number): string => {
    const cell = board.cells[row][col];
    
    switch (cell.status) {
      case 'hit':
        return Colors.shipHit; // Red for hit
      case 'miss':
        return Colors.waterHit; // Gray for miss
      case 'ship':
        return showShips ? Colors.shipHealthy : Colors.water; // Blue if showing ships, water if hidden
      case 'empty':
      default:
        return Colors.water; // Water blue
    }
  };

  const getCellText = (row: number, col: number): string => {
    const cell = board.cells[row][col];
    
    if (cell.status === 'hit') {
      return '✕';
    } else if (cell.status === 'miss') {
      return '○';
    }
    return '';
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.board}>
        {/* Column headers */}
        <View style={styles.row}>
          <View style={styles.headerCell} />
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <View key={`col-${i}`} style={styles.headerCell}>
              <Text style={styles.headerText}>{i + 1}</Text>
            </View>
          ))}
        </View>
        
        {/* Board rows */}
        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <View key={`row-${row}`} style={styles.row}>
            {/* Row header */}
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>{String.fromCharCode(65 + row)}</Text>
            </View>
            
            {/* Cells */}
            {Array.from({ length: BOARD_SIZE }, (_, col) => (
              <Pressable
                key={`cell-${row}-${col}`}
                style={[
                  styles.cell,
                  { backgroundColor: getCellColor(row, col) },
                  disabled && styles.disabledCell,
                ]}
                onPress={() => !disabled && onCellPress?.({ row, col })}
                disabled={disabled}
              >
                <Text style={styles.cellText}>{getCellText(row, col)}</Text>
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  board: {
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgMedium,
    borderRadius: 8,
    overflow: 'hidden',
    
    // Sombra para elevação
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledCell: {
    opacity: 0.6,
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
