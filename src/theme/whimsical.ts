/**
 * Whimsical palette: gradients and magic combos for a stunning, cohesive look.
 * All values reference theme colors or extend the magic palette.
 */
import { colors } from './colors';

import { typography } from './typography';

export const whimsicalGradients = {
  hero: [colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight] as const,
  cardGlow: [colors.primary.wisteriaLight, colors.reward.peachLight, colors.calm.skyLight] as const,
  empty: [colors.primary.wisteriaFaded, colors.base.cream] as const,
  reward: [colors.reward.peachLight, colors.reward.goldSoft] as const,
};

/** @deprecated Prefer copy from src/config/copy.ts for new code */
export const whimsicalCopy = {
  comingSoon: "We're brewing something special here.",
  noActivityYet: "Your adventure is just beginning. Go explore!",
  noStamps: "No stamps yet — visit a place and collect your first.",
  noBites: "Your Taste Atlas is empty — discover a dish to begin.",
};

/** Use for hero titles and magical moments - ensures Baloo2 ExtraBold */
export const whimsicalText = {
  heroTitle: {
    fontFamily: typography.fonts.headingExtra,
    fontSize: 32,
    letterSpacing: -0.5,
  },
  tagline: {
    fontFamily: typography.fonts.body,
    fontSize: 16,
    lineHeight: 24,
  },
};
