/**
 * Paleta de cores centralizada para toda a aplicação
 * Garante consistência visual e facilita manutenção
 */

export const Colors = {
  // === BACKGROUNDS ===
  bgDark: '#1a1a2e',      // Fundo principal da app
  bgMedium: '#16213e',    // Cards, secções, containers
  bgLight: '#0f3460',     // Inputs, elementos interativos
  
  // === PRIMARY COLORS ===
  primary: '#4da6ff',         // Azul principal (botões, links, destaques)
  primaryDark: '#3d8ce6',     // Azul escuro (hover, pressed)
  primaryLight: '#6db8ff',    // Azul claro (disabled, loading)
  primaryFaded: '#4da6ff33',  // Azul transparente (overlays)
  
  // === TEXT COLORS ===
  textPrimary: '#FFFFFF',     // Texto principal (máxima legibilidade)
  textSecondary: '#E0E0E0',   // Texto secundário (boa legibilidade)
  textMuted: '#999999',       // Texto desativado, hints, placeholders
  textDark: '#000000',        // Texto sobre fundos claros
  textOnPrimary: '#FFFFFF',   // Texto sobre cor primária
  
  // === STATUS COLORS ===
  success: '#5cb85c',     // Verde - Sucesso, vitória, confirmação
  error: '#d9534f',       // Vermelho - Erro, derrota, cancelar
  warning: '#f0ad4e',     // Laranja - Avisos, atenção
  info: '#5bc0de',        // Azul claro - Informações
  
  // === GAME STATES ===
  water: '#4a90e2',           // Água intacta (azul oceano vibrante)
  waterHit: '#95a5a6',        // Água atingida (cinza)
  shipHealthy: '#34495e',     // Navio intacto (cinza escuro)
  shipPlacement: '#2ecc71',   // Navio durante colocação (verde)
  shipHit: '#e74c3c',         // Navio atingido (vermelho vibrante)
  shipSunk: '#c0392b',        // Navio completamente afundado (vermelho escuro)
  enemyRadar: '#2c3e50',      // Radar inimigo (células não reveladas)
  
  // === BORDERS ===
  border: '#4da6ff',          // Borda padrão (mesma cor primária)
  borderLight: '#2c3e50',     // Borda sutil (elementos discretos)
  borderDark: '#000000',      // Borda escura (tabuleiros)
  
  // === SHADOWS ===
  shadow: 'rgba(0, 0, 0, 0.3)',       // Sombra padrão
  shadowLight: 'rgba(0, 0, 0, 0.15)',  // Sombra sutil
  shadowDark: 'rgba(0, 0, 0, 0.5)',    // Sombra forte
  
  // === OVERLAYS ===
  overlay: 'rgba(0, 0, 0, 0.6)',      // Overlay escuro (modais)
  overlayLight: 'rgba(0, 0, 0, 0.3)',  // Overlay sutil
  
  // === TRANSPARENT ===
  transparent: 'transparent',
};

/**
 * Constantes de contraste WCAG AA
 * Garante acessibilidade mínima
 */
export const CONTRAST_RATIOS = {
  MIN_NORMAL_TEXT: 4.5,   // Texto normal (mínimo WCAG AA)
  MIN_LARGE_TEXT: 3.0,    // Texto grande (mínimo WCAG AA)
  IDEAL: 7.0,             // Contraste ideal (WCAG AAA)
};
