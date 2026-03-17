export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  gutter: 16,
  cardPadding: 18,
  screenPadding: 22,
  sectionGap: 24,
  itemGap: 12,
  panelPadding: 14,
  compactGap: 6,
  roomyGap: 18,

  radius: {
    xs: 6,
    sm: 10,
    md: 14,
    lg: 20,
    xl: 28,
    xxl: 36,
    round: 9999,
  },

  icon: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 32,
    xl: 48,
    xxl: 64,
  },

  avatar: {
    xs: 32,
    sm: 48,
    md: 64,
    lg: 96,
    xl: 128,
    xxl: 180,
  },

  button: {
    sm: 40,
    md: 48,
    lg: 56,
  },

  card: {
    minHeight: 120,
    stampSize: 100,
    biteSize: 140,
    badgeSize: 80,
  },
};

/** Alias for spacing.radius (border radius tokens). */
export const radii = spacing.radius;

export type SpacingKey = keyof typeof spacing;
