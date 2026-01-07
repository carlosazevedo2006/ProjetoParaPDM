/**
 * ============================================
 * BOARD - COMPONENTE DO TABULEIRO DE JOGO
 * ============================================
 * 
 * Componente React que renderiza o tabuleiro 10x10 da Batalha Naval.
 * Exibe o oceano com navios, disparos e marcações.
 * 
 * FUNCIONALIDADES:
 * - Renderização de matriz 10x10 de células
 * - Cabeçalhos com coordenadas (A-J, 1-10)
 * - Cores diferentes por estado (água, navio, acerto, falha)
 * - Interatividade opcional (clique em células)
 * - Modo "ocultar navios" para tabuleiro adversário
 * - Símbolos visuais (✕ para acerto, ○ para água)
 * 
 * CORES POR ESTADO:
 * - Água (empty): Azul oceano
 * - Navio não atingido (ship): Cinza escuro (se showShips=true) ou Azul (se oculto)
 * - Acerto (hit): Vermelho vibrante
 * - Falha (miss): Cinza claro
 * 
 * CASOS DE USO:
 * 1. SetupScreen: Mostrar próprio tabuleiro durante configuração (showShips=true)
 * 2. GameScreen - Próprio: Mostrar tabuleiro com navios (showShips=true)
 * 3. GameScreen - Adversário: Ocultar navios não atingidos (showShips=false)
 * 
 * @component
 * @author Carlos Azevedo
 * @date 2026
 */
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Board as BoardType, Position, BOARD_SIZE } from '../types';
import { Colors } from '../styles/colors';

/**
 * Props do componente Board
 */
interface BoardProps {
  /** Dados do tabuleiro (células e navios) */
  board: BoardType;
  
  /** 
   * Callback quando célula é pressionada
   * Se undefined, o tabuleiro não é interativo
   */
  onCellPress?: (position: Position) => void;
  
  /** 
   * Se true, células não podem ser clicadas
   * Útil durante turno do adversário
   */
  disabled?: boolean;
  
  /** 
   * Se true, mostra navios não atingidos
   * Se false, oculta navios (modo adversário)
   */
  showShips?: boolean;
  
  /** 
   * Título opcional acima do tabuleiro
   * Ex: "Teu Tabuleiro", "Tabuleiro Adversário"
   */
  title?: string;
}

/**
 * Componente Board
 * 
 * Renderiza tabuleiro 10x10 com cabeçalhos de coordenadas.
 * 
 * @example
 * // Tabuleiro próprio (mostrar navios)
 * <Board 
 *   board={myBoard} 
 *   showShips={true}
 *   title="Teu Tabuleiro"
 * />
 * 
 * @example
 * // Tabuleiro adversário (ocultar navios, permitir disparos)
 * <Board 
 *   board={opponentBoard} 
 *   showShips={false}
 *   onCellPress={(pos) => fireAtPosition(pos)}
 *   disabled={!isMyTurn}
 *   title="Tabuleiro Adversário"
 * />
 */
export function Board({ board, onCellPress, disabled = false, showShips = true, title }: BoardProps) {
  /**
   * Determinar cor de fundo de uma célula
   * 
   * Lógica de cores:
   * - hit (acerto): Vermelho vibrante
   * - miss (água): Cinza claro
   * - ship (navio): Cinza escuro se showShips, senão azul (oculto)
   * - empty (vazio): Azul oceano
   * 
   * @param row - Linha da célula (0-9)
   * @param col - Coluna da célula (0-9)
   * @returns Cor em formato string hexadecimal
   */
  const getCellColor = (row: number, col: number): string => {
    const cell = board.cells[row][col];
    
    switch (cell.status) {
      case 'hit':
        // Acerto - vermelho vibrante
        return Colors.shipHit;
        
      case 'miss':
        // Falha - cinza claro
        return Colors.waterHit;
        
      case 'ship':
        // Navio: Mostra cinza escuro se showShips=true
        // Senão mostra azul (oculto, parece água)
        return showShips ? Colors.shipHealthy : Colors.water;
        
      case 'empty':
      default:
        // Água vazia - azul oceano
        return Colors.water;
    }
  };

  /**
   * Determinar símbolo a exibir numa célula
   * 
   * Símbolos:
   * - ✕ (X): Acerto em navio
   * - ○ (O): Disparo na água
   * - '' (vazio): Célula não atacada
   * 
   * @param row - Linha da célula (0-9)
   * @param col - Coluna da célula (0-9)
   * @returns String com símbolo ou vazio
   */
  const getCellText = (row: number, col: number): string => {
    const cell = board.cells[row][col];
    
    if (cell.status === 'hit') {
      return '✕'; // X para acerto
    } else if (cell.status === 'miss') {
      return '○'; // O para falha
    }
    return ''; // Vazio se não atacado
  };

  return (
    <View style={styles.container}>
      {/* Título opcional acima do tabuleiro */}
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.board}>
        {/* Linha de cabeçalho com números das colunas (1-10) */}
        <View style={styles.row}>
          {/* Célula vazia no canto superior esquerdo */}
          <View style={styles.headerCell} />
          
          {/* Cabeçalhos de colunas: 1, 2, 3, ..., 10 */}
          {Array.from({ length: BOARD_SIZE }, (_, i) => (
            <View key={`col-${i}`} style={styles.headerCell}>
              <Text style={styles.headerText}>{i + 1}</Text>
            </View>
          ))}
        </View>
        
        {/* Linhas do tabuleiro (A-J) */}
        {Array.from({ length: BOARD_SIZE }, (_, row) => (
          <View key={`row-${row}`} style={styles.row}>
            {/* Cabeçalho da linha (letra A-J) */}
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>
                {String.fromCharCode(65 + row)}
              </Text>
            </View>
            
            {/* Células da linha */}
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

/**
 * Estilos do componente Board
 * 
 * DECISÃO DE DESIGN:
 * - Células quadradas de 30x30 para boa visualização em mobile
 * - Borda escura para destaque do tabuleiro
 * - Sombra para criar profundidade
 * - Cabeçalhos em fundo diferente para destacar
 */
const styles = StyleSheet.create({
  /** Container principal */
  container: {
    alignItems: 'center',
  },
  
  /** Título acima do tabuleiro */
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  
  /** Container do tabuleiro */
  board: {
    borderWidth: 2,
    borderColor: Colors.borderDark,
    backgroundColor: Colors.bgMedium,
    borderRadius: 8,
    overflow: 'hidden',
    
    // Sombra para criar elevação visual
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  
  /** Linha (horizontal) do tabuleiro */
  row: {
    flexDirection: 'row',
  },
  
  /** Célula de cabeçalho (letras e números) */
  headerCell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgMedium,
  },
  
  /** Texto nos cabeçalhos */
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  
  /** Célula individual do oceano */
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  /** Célula desativada (não clicável) */
  disabledCell: {
    opacity: 0.6,
  },
  
  /** Texto dentro da célula (✕ ou ○) */
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
});
