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
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 2,
    },
    medium: {
      shadowColor: 'rgba(0, 0, 0, 0.08)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 16,
      elevation: 3,
    },
    float: {
      shadowColor: 'rgba(184, 165, 224, 0.2)',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 1,
      shadowRadius: 20,
      elevation: 5,
    },
    glow: {
      shadowColor: colors.primary.wisteria,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 6,
    },
    magic: {
      shadowColor: 'rgba(184, 165, 224, 0.4)',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 28,
      elevation: 8,
    },
    dream: {
      shadowColor: 'rgba(107, 176, 224, 0.25)',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 1,
      shadowRadius: 32,
      elevation: 10,
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
