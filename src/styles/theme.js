/**
 * BudgetAI App Theme
 * 
 * This file contains the theme configuration for the BudgetAI app,
 * including colors, typography, spacing, and other design constants.
 */

export const COLORS = {
  // Primary colors
  primary: '#6C63FF', // Vibrant purple for main actions and branding
  primaryDark: '#5A52D9',
  primaryLight: '#8F88FF',
  
  // Secondary colors
  secondary: '#00D9C0', // Teal for accents and secondary actions
  secondaryDark: '#00B5A0',
  secondaryLight: '#4EEEE0',
  
  // Accent colors for gamification and rewards
  success: '#4CAF50', // Green for positive feedback
  warning: '#FFC107', // Amber for warnings
  error: '#F44336', // Red for errors
  info: '#2196F3', // Blue for information
  
  // Neutrals
  white: '#FFFFFF',
  offWhite: '#F8F9FA',
  lightGray: '#E9ECEF',
  gray: '#CED4DA',
  darkGray: '#6C757D',
  charcoal: '#343A40',
  black: '#212529',
  
  // Background colors
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  modalBackground: '#FFFFFF',
  
  // Text colors
  textPrimary: '#212529',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  textInverted: '#FFFFFF',
  
  // Transparent colors
  transparent: 'transparent',
  semiTransparent: 'rgba(0, 0, 0, 0.5)',
  
  // Category colors for expense tracking
  categories: {
    housing: '#FF6B6B', // Red
    transportation: '#4ECDC4', // Teal
    food: '#FFD166', // Yellow
    utilities: '#118AB2', // Blue
    healthcare: '#EF476F', // Pink
    personal: '#06D6A0', // Green
    entertainment: '#9D4EDD', // Purple
    education: '#FF9F1C', // Orange
    savings: '#073B4C', // Dark Blue
    other: '#6C757D', // Gray
  },
};

export const TYPOGRAPHY = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
  },
  
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  
  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
    display: 48,
  },
  
  // Font weights
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// Animation timing
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Z-index values
export const Z_INDEX = {
  base: 1,
  card: 10,
  modal: 100,
  toast: 1000,
};

// Screen dimensions
export const DIMENSIONS = {
  fullWidth: '100%',
  fullHeight: '100%',
};

// Default theme object
const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  shadows: SHADOWS,
  borderRadius: BORDER_RADIUS,
  animation: ANIMATION,
  zIndex: Z_INDEX,
  dimensions: DIMENSIONS,
};

export default theme;
