// Visby Theme System
// Cozy, magical, wholesome design tokens

export * from './colors';
export * from './spacing';
export * from './typography';
export { getShadowStyle } from './shadows';

import { Platform } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { typography, textStyles } from './typography';
import { getShadowStyle } from './shadows';

const shadowSoft = { shadowColor: 'rgba(0, 0, 0, 0.05)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 10, elevation: 2 };
const shadowMedium = { shadowColor: 'rgba(0, 0, 0, 0.08)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 16, elevation: 3 };
const shadowFloat = { shadowColor: 'rgba(184, 165, 224, 0.2)', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 1, shadowRadius: 20, elevation: 5 };
const shadowGlow = { shadowColor: colors.primary.wisteria, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 24, elevation: 6 };
const shadowMagic = { shadowColor: 'rgba(184, 165, 224, 0.4)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 28, elevation: 8 };
const shadowDream = { shadowColor: 'rgba(107, 176, 224, 0.25)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 32, elevation: 10 };

const isWeb = Platform.OS === 'web';

// Complete theme object
export const theme = {
  colors,
  spacing,
  typography,
  textStyles,

  // Shadow presets (web-safe: use boxShadow on web to avoid deprecation)
  shadows: {
    soft: isWeb ? getShadowStyle(shadowSoft) : shadowSoft,
    medium: isWeb ? getShadowStyle(shadowMedium) : shadowMedium,
    float: isWeb ? getShadowStyle(shadowFloat) : shadowFloat,
    glow: isWeb ? getShadowStyle(shadowGlow) : shadowGlow,
    magic: isWeb ? getShadowStyle(shadowMagic) : shadowMagic,
    dream: isWeb ? getShadowStyle(shadowDream) : shadowDream,
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
