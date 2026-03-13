// Visby Typography System
// Friendly, playful fonts with cozy readability

export const typography = {
  fonts: {
    // Primary font - playful and friendly
    heading: 'Fredoka-Bold',
    headingMedium: 'Fredoka-SemiBold',
    headingLight: 'Fredoka-Medium',
    
    // Body font - clean and readable
    body: 'Quicksand-Medium',
    bodyBold: 'Quicksand-Bold',
    bodyLight: 'Quicksand-Regular',
    
    // System fallback
    system: 'System',
  },

  sizes: {
    // Display sizes (for big moments, rewards)
    display: {
      hero: 48,
      title: 36,
      subtitle: 28,
    },
    
    // Heading sizes
    heading: {
      h1: 24,
      h2: 20,
      h3: 18,
      h4: 16,
    },
    
    // Body sizes
    body: {
      lg: 16,
      md: 14,
      sm: 12,
      xs: 10,
    },
    
    // Special sizes
    label: 11,
    badge: 9,
    tiny: 8,
  },

  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Pre-built text styles
export const textStyles = {
  // Display styles
  heroTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display.hero,
    lineHeight: typography.sizes.display.hero * typography.lineHeights.tight,
  },
  displayTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display.title,
    lineHeight: typography.sizes.display.title * typography.lineHeights.tight,
  },
  
  // Heading styles
  h1: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.heading.h1,
    lineHeight: typography.sizes.heading.h1 * typography.lineHeights.tight,
  },
  h2: {
    fontFamily: typography.fonts.headingMedium,
    fontSize: typography.sizes.heading.h2,
    lineHeight: typography.sizes.heading.h2 * typography.lineHeights.tight,
  },
  h3: {
    fontFamily: typography.fonts.headingLight,
    fontSize: typography.sizes.heading.h3,
    lineHeight: typography.sizes.heading.h3 * typography.lineHeights.normal,
  },
  
  // Body styles
  bodyLarge: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body.lg,
    lineHeight: typography.sizes.body.lg * typography.lineHeights.relaxed,
  },
  body: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body.md,
    lineHeight: typography.sizes.body.md * typography.lineHeights.relaxed,
  },
  bodySmall: {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body.sm,
    lineHeight: typography.sizes.body.sm * typography.lineHeights.normal,
  },
  
  // Label & caption
  label: {
    fontFamily: typography.fonts.bodyBold,
    fontSize: typography.sizes.label,
    lineHeight: typography.sizes.label * typography.lineHeights.normal,
    letterSpacing: typography.letterSpacing.wide,
    textTransform: 'uppercase' as const,
  },
  caption: {
    fontFamily: typography.fonts.bodyLight,
    fontSize: typography.sizes.body.xs,
    lineHeight: typography.sizes.body.xs * typography.lineHeights.normal,
  },
};

export type FontFamily = keyof typeof typography.fonts;
