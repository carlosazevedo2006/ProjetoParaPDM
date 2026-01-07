/**
 * ============================================
 * COLORS - SISTEMA DE CORES DA APLICAÇÃO
 * ============================================
 * 
 * Paleta de cores centralizada para toda a aplicação.
 * Garante consistência visual em todos os ecrãs e facilita manutenção.
 * 
 * DECISÃO DE DESIGN:
 * Utilizamos uma paleta escura (dark theme) para:
 * 1. Reduzir fadiga ocular durante sessões longas
 * 2. Melhorar o contraste dos elementos do jogo
 * 3. Criar atmosfera imersiva de batalha naval
 * 4. Economizar bateria em ecrãs OLED
 * 
 * ORGANIZAÇÃO:
 * - Backgrounds: Fundos em tons escuros progressivos
 * - Primary: Azul vibrante para elementos interativos
 * - Text: Cores de texto com diferentes níveis de ênfase
 * - Status: Cores semânticas (sucesso, erro, aviso)
 * - Game States: Cores específicas para estados do jogo
 * - Borders & Shadows: Elementos de profundidade
 * 
 * ACESSIBILIDADE:
 * Todas as combinações de cores seguem padrões WCAG AA para contraste mínimo,
 * garantindo legibilidade para utilizadores com deficiências visuais.
 * 
 * @author Carlos Azevedo
 * @date 2026
 */

export const Colors = {
  // ============================================
  // BACKGROUNDS - Fundos da aplicação
  // ============================================
  
  /** Fundo principal da aplicação (mais escuro) */
  bgDark: '#1a1a2e',
  
  /** Fundo de cards, secções e containers (médio) */
  bgMedium: '#16213e',
  
  /** Fundo de inputs e elementos interativos (mais claro) */
  bgLight: '#0f3460',
  
  // ============================================
  // PRIMARY COLORS - Cor principal da marca
  // ============================================
  
  /** Azul principal - botões, links, destaques */
  primary: '#4da6ff',
  
  /** Azul escuro - estado hover, pressed */
  primaryDark: '#3d8ce6',
  
  /** Azul claro - estado disabled, loading */
  primaryLight: '#6db8ff',
  
  /** Azul transparente - overlays, fundos subtis */
  primaryFaded: '#4da6ff33',
  
  // ============================================
  // TEXT COLORS - Cores de texto
  // ============================================
  
  /** Texto principal - máxima legibilidade (branco puro) */
  textPrimary: '#FFFFFF',
  
  /** Texto secundário - boa legibilidade (branco suave) */
  textSecondary: '#E0E0E0',
  
  /** Texto desativado - hints, placeholders (cinza) */
  textMuted: '#999999',
  
  /** Texto sobre fundos claros (preto) */
  textDark: '#000000',
  
  /** Texto sobre cor primária (branco) */
  textOnPrimary: '#FFFFFF',
  
  // ============================================
  // STATUS COLORS - Cores semânticas
  // ============================================
  
  /** Verde - sucesso, vitória, confirmação */
  success: '#5cb85c',
  
  /** Vermelho - erro, derrota, cancelar */
  error: '#d9534f',
  
  /** Laranja - avisos, atenção */
  warning: '#f0ad4e',
  
  /** Azul claro - informações neutras */
  info: '#5bc0de',
  
  // ============================================
  // GAME STATES - Estados do jogo
  // ============================================
  
  /** Água intacta - azul oceano vibrante */
  water: '#4a90e2',
  
  /** Água atingida (miss) - cinza */
  waterHit: '#95a5a6',
  
  /** Navio intacto não revelado - cinza escuro */
  shipHealthy: '#34495e',
  
  /** Navio durante colocação - verde (feedback visual) */
  shipPlacement: '#2ecc71',
  
  /** Navio atingido (hit) - vermelho vibrante */
  shipHit: '#e74c3c',
  
  /** Navio completamente afundado - vermelho escuro */
  shipSunk: '#c0392b',
  
  /** Radar inimigo - células não reveladas (escuro) */
  enemyRadar: '#2c3e50',
  
  // ============================================
  // BORDERS - Bordas
  // ============================================
  
  /** Borda padrão - mesma cor primária para consistência */
  border: '#4da6ff',
  
  /** Borda sutil - elementos discretos */
  borderLight: '#2c3e50',
  
  /** Borda escura - tabuleiros de jogo */
  borderDark: '#000000',
  
  // ============================================
  // SHADOWS - Sombras (para profundidade)
  // ============================================
  
  /** Sombra padrão - elevação média */
  shadow: 'rgba(0, 0, 0, 0.3)',
  
  /** Sombra sutil - elevação baixa */
  shadowLight: 'rgba(0, 0, 0, 0.15)',
  
  /** Sombra forte - elevação alta */
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // ============================================
  // OVERLAYS - Camadas de sobreposição
  // ============================================
  
  /** Overlay escuro - modais, diálogos */
  overlay: 'rgba(0, 0, 0, 0.6)',
  
  /** Overlay sutil - efeitos suaves */
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // ============================================
  // TRANSPARENT - Transparente
  // ============================================
  
  /** Cor transparente - fundos invisíveis */
  transparent: 'transparent',
};

/**
 * Rácios de contraste WCAG (Web Content Accessibility Guidelines)
 * 
 * Define os padrões mínimos de contraste entre texto e fundo
 * para garantir acessibilidade.
 * 
 * NÍVEIS DE CONFORMIDADE:
 * - WCAG AA: Padrão mínimo recomendado (4.5:1 texto normal)
 * - WCAG AAA: Padrão ideal/máximo (7:1 texto normal)
 * 
 * Mais informação: https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html
 */
export const CONTRAST_RATIOS = {
  /** Texto normal (< 18pt) - mínimo WCAG AA */
  MIN_NORMAL_TEXT: 4.5,
  
  /** Texto grande (≥ 18pt ou ≥ 14pt bold) - mínimo WCAG AA */
  MIN_LARGE_TEXT: 3.0,
  
  /** Contraste ideal - WCAG AAA (máxima acessibilidade) */
  IDEAL: 7.0,
};
