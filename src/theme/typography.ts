export const typography = {
  fonts: {
    heading: 'Baloo2-Bold',
    headingExtra: 'Baloo2-ExtraBold',
    headingMedium: 'Baloo2-SemiBold',
    headingLight: 'Baloo2-Medium',

    body: 'Nunito-Medium',
    bodyBold: 'Nunito-Bold',
    bodyExtra: 'Nunito-ExtraBold',
    bodyLight: 'Nunito-Regular',
    bodySemiBold: 'Nunito-SemiBold',

    system: 'System',
  },

  sizes: {
    display: {
      hero: 48,
      title: 36,
      subtitle: 28,
    },

    heading: {
      h1: 24,
      h2: 20,
      h3: 18,
      h4: 16,
    },

    body: {
      lg: 16,
      md: 14,
      sm: 12,
      xs: 10,
    },

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

export const textStyles = {
  heroTitle: {
    fontFamily: typography.fonts.headingExtra,
    fontSize: typography.sizes.display.hero,
    lineHeight: typography.sizes.display.hero * typography.lineHeights.tight,
  },
  displayTitle: {
    fontFamily: typography.fonts.heading,
    fontSize: typography.sizes.display.title,
    lineHeight: typography.sizes.display.title * typography.lineHeights.tight,
  },

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
