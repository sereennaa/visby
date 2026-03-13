// Visby Color Palette
// "wanderlust, sunshine, fresh air, golden hour, moonlight, safe, hopeful, magical"

export const colors = {
  // Primary Colors
  primary: {
    wisteria: '#C7B8EA',
    wisteriaLight: '#E1D8F5',
    wisteriaDark: '#9B89D0',
    wisteriaFaded: '#EDE8F7',
  },

  // Success / Positive
  success: {
    honeydew: '#DFF5E1',
    honeydewDark: '#A8E6A3',
    mint: '#B8F0BC',
    emerald: '#5CB85C',
  },

  // Navigation / Calm
  calm: {
    sky: '#CFE9F7',
    skyLight: '#E8F4FB',
    skyDark: '#A3D4F0',
    ocean: '#7FBDE8',
  },

  // Base / Neutral
  base: {
    cream: '#FAF9F6',
    parchment: '#F5F3EE',
    ivory: '#FFFEF8',
    warmWhite: '#FEFDFB',
  },

  // Rewards / Highlights
  reward: {
    peach: '#FFD8A8',
    peachLight: '#FFEBCF',
    peachDark: '#FFC780',
    gold: '#FFD700',
    goldSoft: '#FFE57F',
    amber: '#FFBF00',
    coral: '#FF9F80',
  },

  // Additional Accent Colors
  accent: {
    coral: '#FF9F80',
    lavender: '#E6E6FA',
    blush: '#FFE4E1',
    seafoam: '#C4EDD8',
    buttercream: '#FFFACD',
    rose: '#FFC8DD',
    lilac: '#D4A5D8',
  },

  // Text Colors
  text: {
    primary: '#3D3D3D',
    secondary: '#6B6B6B',
    muted: '#9B9B9B',
    light: '#CACACA',
    inverse: '#FFFFFF',
  },

  // Shadow & Overlay
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    strong: 'rgba(0, 0, 0, 0.15)',
    colored: 'rgba(199, 184, 234, 0.3)',
  },

  // Status Colors
  status: {
    error: '#FF6B6B',
    errorLight: '#FFE0E0',
    warning: '#FFB74D',
    warningLight: '#FFF3E0',
    info: '#64B5F6',
    infoLight: '#E3F2FD',
  },

  // Visby Avatar Colors
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

  // Magic / Whimsy
  magic: {
    aurora: '#C7B8EA',
    stardust: 'rgba(255, 215, 0, 0.2)',
    moonbeam: 'rgba(199, 184, 234, 0.15)',
    twilight: '#2D1B69',
    nebula: '#1A1035',
    shimmer: 'rgba(255, 255, 255, 0.15)',
  },

  // Transparent
  transparent: 'transparent',
};

export type ColorName = keyof typeof colors;
