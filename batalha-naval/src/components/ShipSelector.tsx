/**
 * ============================================
 * SHIP SELECTOR - SELETOR DE NAVIOS
 * ============================================
 * 
 * Componente para selecionar navios durante a fase de configuração.
 * Exibe lista de navios disponíveis para posicionar no tabuleiro.
 * 
 * FUNCIONALIDADES:
 * - Exibir lista de navios ainda não colocados
 * - Destacar navio atualmente selecionado
 * - Mostrar nome e tamanho de cada navio
 * - Feedback visual ao selecionar
 * 
 * FLUXO DE USO:
 * 1. Jogador vê lista de navios disponíveis
 * 2. Clica num navio para selecionar
 * 3. Navio fica destacado (fundo azul claro)
 * 4. Jogador posiciona navio no tabuleiro
 * 5. Navio desaparece da lista (já colocado)
 * 6. Repetir até todos navios colocados
 * 
 * @component
 * @author Carlos Azevedo
 * @date 2026
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { ShipType, SHIP_SIZES, SHIP_NAMES } from '../types';
import { Colors } from '../styles/colors';
import { Spacing, BorderRadius } from '../styles/common';

/**
 * Props do componente ShipSelector
 */
interface ShipSelectorProps {
  /** 
   * Lista de navios ainda não colocados
   * Apenas navios neste array são exibidos
   */
  availableShips: ShipType[];
  
  /** 
   * Navio atualmente selecionado
   * null se nenhum selecionado
   */
  selectedShip: ShipType | null;
  
  /** 
   * Callback quando jogador seleciona um navio
   * @param ship - Tipo de navio selecionado
   */
  onSelectShip: (ship: ShipType) => void;
}

/**
 * Componente ShipSelector
 * 
 * Renderiza lista vertical de botões com navios disponíveis.
 * O navio selecionado é destacado com cor azul e borda.
 * 
 * @example
 * const [availableShips, setAvailableShips] = useState<ShipType[]>([
 *   'carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'
 * ]);
 * const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
 * 
 * <ShipSelector
 *   availableShips={availableShips}
 *   selectedShip={selectedShip}
 *   onSelectShip={(ship) => {
 *     setSelectedShip(ship);
 *     // Aguardar jogador clicar no tabuleiro para posicionar
 *   }}
 * />
 */
export function ShipSelector({ availableShips, selectedShip, onSelectShip }: ShipSelectorProps) {
  return (
    <View style={styles.container}>
      {/* Título da secção */}
      <Text style={styles.title}>Selecione um navio para posicionar:</Text>
      
      {/* Lista de navios disponíveis */}
      <View style={styles.shipList}>
        {availableShips.map((shipType) => {
          // Verificar se este navio está selecionado
          const isSelected = selectedShip === shipType;
          
          return (
            <Pressable
              key={shipType}
              style={[
                styles.shipButton,
                isSelected && styles.selectedShip, // Estilo diferente se selecionado
              ]}
              onPress={() => onSelectShip(shipType)}
            >
              {/* Nome do navio (ex: "Porta-aviões") */}
              <Text style={[styles.shipName, isSelected && styles.selectedText]}>
                {SHIP_NAMES[shipType]}
              </Text>
              
              {/* Tamanho do navio (ex: "Tamanho: 5") */}
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

/**
 * Estilos do componente ShipSelector
 * 
 * DECISÃO DE DESIGN:
 * - Cards com espaçamento generoso para fácil toque em mobile
 * - Navio selecionado tem fundo azul translúcido e borda azul sólida
 * - Nomes de navios em negrito para destaque
 * - Tamanho em texto secundário mais pequeno
 */
const styles = StyleSheet.create({
  /** Container principal */
  container: {
    padding: 15,
  },
  
  /** Título da secção */
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.textPrimary,
    textAlign: 'center',
    
    // Sombra no texto para melhor legibilidade
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  /** Lista vertical de navios */
  shipList: {
    gap: 10, // Espaço entre botões
  },
  
  /** Botão de navio individual */
  shipButton: {
    padding: 15,
    backgroundColor: Colors.bgMedium,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  
  /** Estilo quando navio está selecionado */
  selectedShip: {
    backgroundColor: Colors.primaryFaded, // Fundo azul translúcido
    borderColor: Colors.primary,          // Borda azul sólida
    borderWidth: 2,
  },
  
  /** Nome do navio */
  shipName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  /** Tamanho do navio */
  shipSize: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  
  /** Cor do texto quando selecionado */
  selectedText: {
    color: Colors.textPrimary,
  },
  
  /** Cor do subtexto quando selecionado */
  selectedSubtext: {
    color: Colors.textSecondary,
  },
});
