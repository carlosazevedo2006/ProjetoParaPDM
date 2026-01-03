import { Pressable, View, StyleSheet } from 'react-native';
import { Cell as CellModel } from '../models/Cell';

interface CellProps {
  cell: CellModel;
  onPress?: () => void;
  showShips?: boolean;
}

export function Cell({ cell, onPress, showShips = false }: CellProps) {
  let backgroundColor = '#4da6ff'; // água

  if (cell.hit && !cell.hasShip) {
    backgroundColor = '#e0e0e0'; // água atingida
  }

  if (cell.hit && cell.hasShip) {
    backgroundColor = '#ff4d4d'; // acerto
  }

  if (!cell.hit && cell.hasShip && showShips) {
    backgroundColor = '#666'; // navio visível
  }

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={[styles.cell, { backgroundColor }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#0f3460',
    margin: 0.5,
  },
});
