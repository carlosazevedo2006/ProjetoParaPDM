import { View, StyleSheet, Text } from 'react-native';
import { Board as BoardModel } from '../models/Board';
import { Cell } from './Cell';
import { BOARD_ROWS } from '../utils/constants';

interface BoardProps {
  board: BoardModel;
  onCellPress?: (row: number, col: number) => void;
  showShips?: boolean;
}

export function Board({ board, onCellPress, showShips = false }: BoardProps) {
  return (
    <View style={styles.container}>
      {/* Column headers (1-10) */}
      <View style={styles.headerRow}>
        <View style={styles.cornerCell} />
        {Array.from({ length: 10 }, (_, i) => (
          <View key={i} style={styles.headerCell}>
            <Text style={styles.headerText}>{i + 1}</Text>
          </View>
        ))}
      </View>

      {/* Board rows with row labels (A-J) */}
      {board.grid.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {/* Row label */}
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>{BOARD_ROWS[rowIndex]}</Text>
          </View>
          
          {/* Cells */}
          {row.map((cell, colIndex) => (
            <Cell
              key={colIndex}
              cell={cell}
              showShips={showShips}
              onPress={
                onCellPress
                  ? () => onCellPress(rowIndex, colIndex)
                  : undefined
              }
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f3460',
    padding: 8,
    borderRadius: 8,
  },
  headerRow: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
  },
  cornerCell: {
    width: 28,
    height: 28,
  },
  headerCell: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    color: '#4da6ff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
