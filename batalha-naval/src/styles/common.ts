import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Colors } from './colors';

/**
 * Estilos comuns reutilizáveis
 * Promove consistência e reduz duplicação
 */

// === TYPOGRAPHY ===
export const Typography = StyleSheet.create({
  // Títulos principais
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.textPrimary,
    textAlign: 'center',
  } as TextStyle,
  
  // Títulos de secção
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 15,
  } as TextStyle,
  
  // Subtítulos
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
  } as TextStyle,
  
  // Texto de corpo principal
  body: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  } as TextStyle,
  
  // Texto de corpo pequeno
  bodySmall: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  } as TextStyle,
  
  // Texto muted/hint
  muted: {
    fontSize: 13,
    color: Colors.textMuted,
    fontStyle: 'italic',
  } as TextStyle,
  
  // Texto de botão
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textOnPrimary,
  } as TextStyle,
  
  // Texto com sombra para melhor legibilidade
  textWithShadow: {
    textShadowColor: Colors.shadowDark,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  } as TextStyle,
});

// === BUTTONS ===
export const Buttons = StyleSheet.create({
  // Botão primário padrão
  primary: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
    // Sombra para elevação
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // Android
  } as ViewStyle,
  
  // Botão secundário (outline)
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
  
  // Botão de sucesso
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
  
  // Botão de erro/cancelar
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
  
  // Botão desativado
  disabled: {
    backgroundColor: Colors.primaryLight,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  } as ViewStyle,
  
  // Botão largo (full width)
  wide: {
    width: '100%',
  } as ViewStyle,
});

// === CONTAINERS ===
export const Containers = StyleSheet.create({
  // Container principal
  screen: {
    flex: 1,
    backgroundColor: Colors.bgDark,
  } as ViewStyle,
  
  // Container com padding
  screenPadded: {
    flex: 1,
    backgroundColor: Colors.bgDark,
    padding: 20,
  } as ViewStyle,
  
  // Card padrão
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
  
  // Card com margem
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
  
  // Secção com fundo
  section: {
    backgroundColor: Colors.bgMedium,
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  } as ViewStyle,
  
  // Container centralizado
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});

// === INPUTS ===
export const Inputs = StyleSheet.create({
  // Input padrão
  default: {
    backgroundColor: Colors.bgLight,
    color: Colors.textPrimary,
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 2,
    borderColor: Colors.border,
  } as TextStyle,
  
  // Input com foco
  focused: {
    borderColor: Colors.primary,
    borderWidth: 2,
  } as ViewStyle,
  
  // Input com erro
  error: {
    borderColor: Colors.error,
    borderWidth: 2,
  } as ViewStyle,
});

// === SPACING ===
export const Spacing = {
  xs: 5,
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 40,
};

// === BORDER RADIUS ===
export const BorderRadius = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
  round: 999, // Completamente redondo
};

// === SHADOWS ===
export const Shadows = {
  small: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
};
