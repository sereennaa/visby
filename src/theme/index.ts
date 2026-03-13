// Visby Theme System
// Cozy, magical, wholesome design tokens

export * from './colors';
export * from './spacing';
export * from './typography';

import { colors } from './colors';
import { spacing } from './spacing';
import { typography, textStyles } from './typography';

// Complete theme object
export const theme = {
  colors,
  spacing,
  typography,
  textStyles,
  
  // Shadow presets
  shadows: {
    soft: {
      shadowColor: colors.shadow.light,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 2,
    },
    medium: {
      shadowColor: colors.shadow.medium,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 4,
    },
    float: {
      shadowColor: colors.shadow.colored,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 6,
    },
    glow: {
      shadowColor: colors.primary.wisteria,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
    verySlow: 800,
  },
  
  // Z-Index layers
  zIndex: {
    base: 0,
    card: 10,
    dropdown: 100,
    modal: 1000,
    toast: 2000,
    tooltip: 3000,
  },
};

export type Theme = typeof theme;
export default theme;
