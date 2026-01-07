/**
 * ============================================
 * COMMON - ESTILOS COMUNS REUTILIZÁVEIS
 * ============================================
 * 
 * Este ficheiro centraliza todos os estilos reutilizáveis da aplicação,
 * promovendo consistência visual e reduzindo duplicação de código.
 * 
 * COMPONENTES INCLUÍDOS:
 * - Typography: Estilos de texto (títulos, corpo, botões)
 * - Buttons: Estilos de botões (primário, secundário, sucesso, erro)
 * - Containers: Layouts e cards
 * - Inputs: Campos de entrada
 * - Spacing: Constantes de espaçamento
 * - BorderRadius: Raios de borda padronizados
 * - Shadows: Sombras para elevação
 * 
 * FILOSOFIA DE DESIGN:
 * - Design System consistente em toda a aplicação
 * - Componentes atómicos reutilizáveis
 * - Facilita manutenção e evolução do design
 * - Reduz tamanho do código e bugs de estilo
 * 
 * USO:
 * ```typescript
 * import { Typography, Buttons, Containers } from '../styles/common';
 * 
 * <View style={Containers.screen}>
 *   <Text style={Typography.title}>Batalha Naval</Text>
 *   <TouchableOpacity style={Buttons.primary}>
 *     <Text style={Typography.buttonText}>Jogar</Text>
 *   </TouchableOpacity>
 * </View>
 * ```
 * 
 * @author Carlos Azevedo
 * @date 2026
 */
import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';

// ============================================
// TYPOGRAPHY - Estilos de Texto
// ============================================

/**
 * Estilos de tipografia padronizados
 * 
 * Define hierarquia visual clara através de tamanhos e pesos de fonte.
 * Todos os estilos seguem boas práticas de legibilidade e acessibilidade.
 * 
 * HIERARQUIA:
 * 1. title (32px) - Títulos principais de ecrãs
 * 2. sectionTitle (24px) - Títulos de secções
 * 3. subtitle (18px) - Subtítulos
 * 4. body (16px) - Texto principal
 * 5. bodySmall (14px) - Texto secundário
 * 6. muted (13px) - Texto de apoio
 */
export const Typography = StyleSheet.create({
  /** 
   * Título principal de ecrã
   * Uso: Nome do ecrã no topo (ex: "Batalha Naval", "Configuração")
   */
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  } as TextStyle,
  
  /** 
   * Título de secção
   * Uso: Cabeçalhos de secções dentro de ecrãs (ex: "Seus Navios")
   */
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  } as TextStyle,
  
  /** 
   * Subtítulo
   * Uso: Texto secundário abaixo de títulos (ex: "Escolha o modo de jogo")
   */
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  } as TextStyle,
  
  /** 
   * Texto de corpo principal
   * Uso: Parágrafos, descrições, conteúdo principal
   */
  body: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  } as TextStyle,
  
  /** 
   * Texto de corpo pequeno
   * Uso: Informações secundárias, metadados
   */
  bodySmall: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  
  /** 
   * Texto muted/hint
   * Uso: Placeholders, hints, informações menos importantes
   */
  muted: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  } as TextStyle,
  
  /** 
   * Texto de botão
   * Uso: Texto dentro de botões (sempre bold para destaque)
   */
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
  } as TextStyle,
  
  /** 
   * Texto com sombra
   * Uso: Texto sobre fundos complexos para garantir legibilidade
   */
  textWithShadow: {
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  } as TextStyle,
});

// ============================================
// BUTTONS - Estilos de Botões
// ============================================

/**
 * Estilos de botões padronizados
 * 
 * Fornece variantes de botões para diferentes ações e estados.
 * Todos incluem sombras para criar sensação de profundidade e clicabilidade.
 * 
 * VARIANTES:
 * - primary: Ação principal (azul)
 * - secondary: Ação secundária (outline)
 * - success: Confirmar/Sucesso (verde)
 * - danger: Cancelar/Destruir (vermelho)
 * - disabled: Estado desativado (cinza opaco)
 */
export const Buttons = StyleSheet.create({
  /** 
   * Botão primário (ação principal)
   * Uso: Ação mais importante do ecrã (ex: "Começar Jogo", "Disparar")
   */
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
    // Sombra para criar elevação e feedback visual
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Sombra para Android
  } as ViewStyle,
  
  /** 
   * Botão secundário (outline)
   * Uso: Ações secundárias menos prioritárias (ex: "Voltar", "Cancelar")
   */
  secondary: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  
  /** 
   * Botão de sucesso
   * Uso: Confirmações positivas (ex: "Confirmar", "Pronto")
   */
  success: {
    backgroundColor: Colors.success,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  } as ViewStyle,
  
  /** 
   * Botão de erro/perigo
   * Uso: Ações destrutivas (ex: "Eliminar", "Sair")
   */
  danger: {
    backgroundColor: Colors.error,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  } as ViewStyle,
  
  /** 
   * Botão desativado
   * Uso: Botões que não podem ser clicados no momento (ex: aguardar input)
   */
  disabled: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  } as ViewStyle,
  
  /** 
   * Modificador: Botão largo (full width)
   * Uso: Combinar com outros estilos para botão de largura total
   * Exemplo: style={[Buttons.primary, Buttons.wide]}
   */
  wide: {
    width: '100%',
  } as ViewStyle,
});

// ============================================
// CONTAINERS - Layouts e Cards
// ============================================

/**
 * Estilos de containers e layouts
 * 
 * Define estruturas de página e componentes de agrupamento.
 * Promove layouts consistentes em toda a aplicação.
 */
export const Containers = StyleSheet.create({
  /** 
   * Container de ecrã básico
   * Uso: View principal de cada ecrã
   */
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  } as ViewStyle,
  
  /** 
   * Container de ecrã com padding
   * Uso: Ecrãs que precisam de margem interna
   */
  screenPadded: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: 20,
  } as ViewStyle,
  
  /** 
   * Card padrão
   * Uso: Agrupar conteúdo relacionado com elevação visual
   */
  card: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  
  /** 
   * Card com margem inferior
   * Uso: Cards empilhados verticalmente
   */
  cardWithMargin: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 20,
    
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  
  /** 
   * Secção com fundo
   * Uso: Agrupar conteúdo relacionado sem tanta elevação quanto card
   */
  section: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  
  /** 
   * Container centralizado
   * Uso: Centrar conteúdo vertical e horizontalmente
   */
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

// ============================================
// INPUTS - Campos de Entrada
// ============================================

/**
 * Estilos de inputs de formulário
 * 
 * Define aparência de campos de texto e diferentes estados.
 */
export const Inputs = StyleSheet.create({
  /** 
   * Input padrão
   * Uso: TextInput básico
   */
  default: {
    backgroundColor: Colors.bgLight,
    color: Colors.textPrimary,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  } as TextStyle,
  
  /** 
   * Input com foco
   * Uso: Aplicar quando TextInput está focado
   * Exemplo: style={[Inputs.default, isFocused && Inputs.focused]}
   */
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  } as ViewStyle,
  
  /** 
   * Input com erro
   * Uso: Aplicar quando input tem erro de validação
   */
  error: {
    borderColor: Colors.error,
    borderWidth: 2,
  } as ViewStyle,
});

// ============================================
// SPACING - Espaçamento Padronizado
// ============================================

/**
 * Constantes de espaçamento
 * 
 * Define escala de espaçamento consistente para usar em margins e paddings.
 * Baseada em múltiplos de 5 para harmonia visual.
 * 
 * @example
 * <View style={{ marginTop: Spacing.md, padding: Spacing.lg }}>
 */
export const Spacing = {
  xs: 5,    // Extra pequeno - ajustes finos
  sm: 10,   // Pequeno - espaçamento mínimo
  md: 15,   // Médio - padrão
  lg: 20,   // Grande - separação clara
  xl: 30,   // Extra grande - secções
  xxl: 40,  // Muito grande - separação máxima
};

// ============================================
// BORDER RADIUS - Raios de Borda
// ============================================

/**
 * Constantes de raio de borda
 * 
 * Define arredondamento padronizado para elementos.
 * 
 * @example
 * <View style={{ borderRadius: BorderRadius.lg }}>
 */
export const BorderRadius = {
  sm: 5,      // Pequeno - arredondamento sutil
  md: 10,     // Médio - padrão da aplicação
  lg: 15,     // Grande - destaque
  xl: 20,     // Extra grande - cards especiais
  round: 999, // Completamente redondo - avatares, badges
};

// ============================================
// SHADOWS - Sombras para Elevação
// ============================================

/**
 * Sombras padronizadas para criar hierarquia visual
 * 
 * Usa Material Design elevation system como inspiração.
 * Cada nível de sombra representa elevação diferente.
 * 
 * NÍVEIS:
 * - small: Elevação baixa (botões secundários)
 * - medium: Elevação média (cards)
 * - large: Elevação alta (modais, botões primários)
 * 
 * @example
 * <View style={[Containers.card, Shadows.medium]}>
 */
export const Shadows = {
  /** Sombra pequena - elevação baixa (2dp) */
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  
  /** Sombra média - elevação média (3dp) */
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  
  /** Sombra grande - elevação alta (5dp) */
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
};
