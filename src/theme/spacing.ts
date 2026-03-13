// Visby Spacing System
// Based on 4px grid system for consistent, cozy layouts

export const spacing = {
  // Base Units
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  // Semantic Spacing
  gutter: 16,
  cardPadding: 16,
  screenPadding: 20,
  sectionGap: 24,
  itemGap: 12,

  // Border Radius (soft, rounded corners)
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    round: 9999,
  },

  // Icon Sizes
  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },

  // Avatar Sizes
  avatar: {
    xs: 32,
    sm: 48,
    md: 64,
    lg: 96,
    xl: 128,
    xxl: 180,
  },

  // Button Heights
  button: {
    sm: 36,
    md: 44,
    lg: 52,
  },

  // Card Sizes
  card: {
    minHeight: 120,
    stampSize: 100,
    biteSize: 140,
    badgeSize: 80,
  },
};

export type SpacingKey = keyof typeof spacing;
