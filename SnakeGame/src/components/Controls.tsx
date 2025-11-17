import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { Direction } from '../types/gameTypes';

interface ControlsProps {
  onDirectionChange: (direction: Direction) => void; // Callback para mudança de direção
  onPause: () => void;      // Callback para pausar/retomar
  onRestart: () => void;    // Callback para reiniciar jogo
  isPlaying: boolean;       // Indica se o jogo está rodando
}

/**
 * Componente de controles do jogo
 * - Botões de ação (Pause/Resume, Restart)
 * - Área de gestos swipe para controles direcionais
 * - Botões visuais de direção (D-pad)
 * - Suporte a múltiplos métodos de input
 */
const Controls: React.FC<ControlsProps> = ({
  onDirectionChange,
  onPause,
  onRestart,
  isPlaying
}) => {
  return (
    /**
     * GestureHandlerRootView é necessário para o react-native-gesture-handler
     * Deve envolver todos os componentes que usam gestos
     */
    <GestureHandlerRootView>
      <View style={styles.container}>
        {/* LINHA DE BOTÕES DE AÇÃO */}
        <View style={styles.buttonRow}>
          {/* BOTÃO PAUSE/RESUME */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={onPause}
            accessibilityLabel={isPlaying ? "Pausar jogo" : "Continuar jogo"}
            accessibilityHint="Pausa ou continua o jogo atual"
          >
            <Text style={styles.buttonText}>
              {isPlaying ? '⏸️ Pause' : '▶️ Resume'}
            </Text>
          </TouchableOpacity>
          
          {/* BOTÃO RESTART */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={onRestart}
            accessibilityLabel="Reiniciar jogo"
            accessibilityHint="Começa um novo jogo"
          >
            <Text style={styles.buttonText}>🔄 Restart</Text>
          </TouchableOpacity>
        </View>
        
        {/* ÁREA DE GESTOS SWIPE */}
        {/**
         * Swipeable detecta gestos de deslizar em todas as direções
         * Cada direção chama o callback correspondente
         */}
        <Swipeable
          onSwipeableLeft={() => onDirectionChange('LEFT')}
          onSwipeableRight={() => onDirectionChange('RIGHT')}
          onSwipeableUp={() => onDirectionChange('UP')}
          onSwipeableDown={() => onDirectionChange('DOWN')}
          // Configuração de sensibilidade do gesto
          minimumDistance={10} // Distância mínima em pixels para considerar o gesto
        >
          <View style={styles.swipeArea}>
            <Text style={styles.swipeText}>
              📱 Deslize para mover ↑↓←→
            </Text>
            <Text style={styles.swipeSubtext}>
              Ou use os botões abaixo
            </Text>
          </View>
        </Swipeable>

        {/* D-PAD VISUAL (BOTÕES DE DIREÇÃO) */}
        <View style={styles.directionPad}>
          {/* LINHA SUPERIOR - APENAS BOTÃO UP */}
          <View style={styles.directionRow}>
            <View style={styles.placeholder} /> {/* Espaço vazio */}
            <TouchableOpacity 
              style={styles.directionButton} 
              onPress={() => onDirectionChange('UP')}
              accessibilityLabel="Mover para cima"
              accessibilityHint="Faz a cobra mover na direção para cima"
            >
              <Text style={styles.directionText}>↑</Text>
            </TouchableOpacity>
            <View style={styles.placeholder} /> {/* Espaço vazio */}
          </View>
          
          {/* LINHA DO MEIO - BOTÕES LEFT E RIGHT */}
          <View style={styles.directionRow}>
            <TouchableOpacity 
              style={styles.directionButton} 
              onPress={() => onDirectionChange('LEFT')}
              accessibilityLabel="Mover para esquerda"
              accessibilityHint="Faz a cobra mover na direção para esquerda"
            >
              <Text style={styles.directionText}>←</Text>
            </TouchableOpacity>
            
            <View style={styles.placeholder} /> {/* Espaço central vazio */}
            
            <TouchableOpacity 
              style={styles.directionButton} 
              onPress={() => onDirectionChange('RIGHT')}
              accessibilityLabel="Mover para direita" 
              accessibilityHint="Faz a cobra mover na direção para direita"
            >
              <Text style={styles.directionText}>→</Text>
            </TouchableOpacity>
          </View>
          
          {/* LINHA INFERIOR - APENAS BOTÃO DOWN */}
          <View style={styles.directionRow}>
            <View style={styles.placeholder} /> {/* Espaço vazio */}
            <TouchableOpacity 
              style={styles.directionButton} 
              onPress={() => onDirectionChange('DOWN')}
              accessibilityLabel="Mover para baixo"
              accessibilityHint="Faz a cobra mover na direção para baixo"
            >
              <Text style={styles.directionText}>↓</Text>
            </TouchableOpacity>
            <View style={styles.placeholder} /> {/* Espaço vazio */}
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',      // Centraliza horizontalmente
    marginTop: 20,             // Espaço acima do componente
    paddingHorizontal: 10,     // Padding lateral
  },
  buttonRow: {
    flexDirection: 'row',      // Botões em linha horizontal
    marginBottom: 25,          // Espaço abaixo dos botões
    justifyContent: 'center',  // Centraliza os botões
  },
  button: {
    backgroundColor: '#007AFF', // Azul estilo iOS
    paddingHorizontal: 24,      // Padding horizontal generoso
    paddingVertical: 12,        // Padding vertical confortável
    borderRadius: 12,           // Bordas mais arredondadas
    marginHorizontal: 8,        // Espaço entre botões
    minWidth: 120,              // Largura mínima para consistência
    alignItems: 'center',       // Centraliza texto
    // Sombra para destaque
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: 'white',            // Texto branco para contraste
    fontSize: 16,              // Tamanho legível
    fontWeight: '600',         // Peso semi-negrito
  },
  swipeArea: {
    padding: 20,               // Espaço interno generoso
    backgroundColor: '#f8f8f8', // Fundo sutilmente diferente
    borderRadius: 12,          // Bordas arredondadas
    marginBottom: 25,          // Espaço abaixo
    borderWidth: 1,            // Borda sutil
    borderColor: '#e0e0e0',    // Cor da borda
    alignItems: 'center',      // Centraliza conteúdo
  },
  swipeText: {
    textAlign: 'center',       // Texto centralizado
    color: '#666',             // Cor cinza médio
    fontSize: 16,              // Tamanho legível
    fontWeight: '500',         // Peso médio
  },
  swipeSubtext: {
    textAlign: 'center',       // Texto centralizado
    color: '#999',             // Cor cinza claro
    fontSize: 12,              // Tamanho menor
    marginTop: 4,              // Espaço acima
  },
  directionPad: {
    backgroundColor: '#ffffff', // Fundo branco
    padding: 20,               // Espaço interno
    borderRadius: 20,          // Bordas bem arredondadas
    // Sombra para efeito de elevação
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  directionRow: {
    flexDirection: 'row',      // Botões em linha
    justifyContent: 'center',  // Centraliza horizontalmente
  },
  directionButton: {
    width: 64,                 // Tamanho fixo para consistência
    height: 64,                // Tamanho fixo para consistência
    backgroundColor: '#f0f0f0', // Fundo cinza claro
    justifyContent: 'center',   // Centraliza verticalmente
    alignItems: 'center',       // Centraliza horizontalmente
    borderRadius: 32,          // Totalmente circular (metade da largura/altura)
    margin: 6,                 // Espaço entre botões
    // Sombra sutil
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    // Efeito de press
    borderWidth: 2,
    borderColor: 'transparent', // Borda transparente por padrão
  },
  directionText: {
    fontSize: 28,              // Tamanho grande para ícones
    color: '#333',             // Cor escura para contraste
    fontWeight: 'bold',        // Negrito para destaque
  },
  placeholder: {
    width: 64,                 // Mesma largura dos botões
    height: 64,                // Mesma altura dos botões
    margin: 6,                 // Mesma margem dos botões
  },
});

export default Controls;

/**
 * MELHORIAS DE ACESSIBILIDADE IMPLEMENTADAS:
 * 
 * 1. accessibilityLabel: Descreve o que o elemento faz
 * 2. accessibilityHint: Explica o resultado da ação
 * 3. Tamanhos de toque adequados (44px mínimo recomendado)
 * 4. Contraste de cores suficiente
 * 5. Feedback visual claro
 */

/**
 * ALTERNATIVAS DE CONTROLE (PARA IMPLEMENTAR):
 * 
 * 1. Giroscópio/Acelerômetro:
 *    - Inclinar dispositivo para controlar direção
 *    - Usar react-native-sensors
 * 
 * 2. Comandos de Voz:
 *    - "cima", "baixo", "esquerda", "direita"
 *    - Usar react-native-voice
 * 
 * 3. Gamepad/Controle Externo:
 *    - Suporte a Bluetooth gamepads
 *    - Usar react-native-gamepad
 */