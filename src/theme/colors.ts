export const colors = {
  primary: {
    wisteria: '#B8A5E0',
    wisteriaLight: '#DDD4F2',
    wisteriaDark: '#8B6FC0',
    wisteriaFaded: '#F0ECF9',
  },

  success: {
    honeydew: '#DFF5E1',
    honeydewDark: '#A8E6A3',
    mint: '#B8F0BC',
    emerald: '#48B048',
  },

  calm: {
    sky: '#C8E4F8',
    skyLight: '#E6F2FC',
    skyDark: '#90C8EE',
    ocean: '#6BB0E0',
  },

  base: {
    cream: '#FDFBF8',
    parchment: '#F7F4EF',
    ivory: '#FFFEF8',
    warmWhite: '#FEFDFB',
  },

  reward: {
    peach: '#FFD1A0',
    peachLight: '#FFEAD0',
    peachDark: '#FFC070',
    gold: '#FFD700',
    goldSoft: '#FFE57F',
    amber: '#FFBF00',
    coral: '#FF9080',
  },

  accent: {
    coral: '#FF9080',
    lavender: '#E6E0FA',
    blush: '#FFE0DE',
    seafoam: '#C0EDDA',
    buttercream: '#FFF8C8',
    rose: '#FFC4D8',
    lilac: '#D4A0D8',
  },

  text: {
    primary: '#2D2D3A',
    secondary: '#6B6B80',
    muted: '#9898AC',
    light: '#C8C8D4',
    inverse: '#FFFFFF',
  },

  shadow: {
    light: 'rgba(0, 0, 0, 0.04)',
    medium: 'rgba(0, 0, 0, 0.08)',
    strong: 'rgba(0, 0, 0, 0.12)',
    colored: 'rgba(184, 165, 224, 0.25)',
  },

  status: {
    error: '#F06060',
    errorLight: '#FFF0F0',
    warning: '#FFAA40',
    warningLight: '#FFF6E8',
    info: '#60A8F0',
    infoLight: '#EDF4FF',
    streak: '#FF6B3D',
    streakBg: '#FFF3EC',
  },

  /** Card and surface tints (whimsical consistency) */
  surface: {
    card: '#FFFFFF',
    cardWarm: '#FFF8F5',
    lavender: '#F5EFFF',
    peach: '#FFF5E6',
    mint: '#F0FFF0',
  },

  visby: {
    skin: {
      light: '#FFDAB9',
      medium: '#E8B89D',
      tan: '#D4A574',
      dark: '#8B5A3C',
    },
    hair: {
      blonde: '#F7E07D',
      brown: '#8B4513',
      auburn: '#A0522D',
      black: '#2F2F2F',
      red: '#D75C37',
      purple: '#9B6FA6',
      blue: '#6B9BC3',
      pink: '#FFB6C1',
    },
    tunic: {
      green: '#6B9B6B',
      blue: '#6B8EB8',
      red: '#C76B6B',
      purple: '#9B6BA6',
      yellow: '#D9C36B',
      teal: '#6B9B9B',
    },
    features: {
      mouth: '#D88C7A',
      blush: '#FFB6C1',
      eyeWhite: '#FFFFFF',
    },
  },

  magic: {
    aurora: '#B8A5E0',
    stardust: 'rgba(255, 215, 0, 0.18)',
    moonbeam: 'rgba(184, 165, 224, 0.12)',
    twilight: '#2A1860',
    nebula: '#180E30',
    shimmer: 'rgba(255, 255, 255, 0.12)',
  },

  transparent: 'transparent',
};

export type ColorName = keyof typeof colors;
