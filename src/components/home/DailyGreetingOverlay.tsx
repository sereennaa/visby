import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  FadeIn,
  FadeOut,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { FloatingParticles } from '../effects/FloatingParticles';
import { useStore, getGrowthStage } from '../../store/useStore';
import { getPersonalityGreeting, calculateTraitLevels, getDominantTrait } from '../../config/visbyPersonality';
import { hapticService } from '../../services/haptics';
import { soundService } from '../../services/sound';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface DailyGreetingOverlayProps {
  onDismiss: () => void;
  surpriseAura?: number;
}

export const DailyGreetingOverlay: React.FC<DailyGreetingOverlayProps> = ({
  onDismiss,
  surpriseAura,
}) => {
  const user = useStore((s) => s.user);
  const visby = useStore((s) => s.visby);
  const stamps = useStore((s) => s.stamps);
  const bites = useStore((s) => s.bites);
  const lessonProgress = useStore((s) => s.lessonProgress);
  const badges = useStore((s) => s.badges);

  const [giftOpened, setGiftOpened] = useState(false);
  const giftTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const bgOpacity = useSharedValue(0);
  const visbyScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const streakScale = useSharedValue(0);
  const giftWobble = useSharedValue(0);
  const giftScale = useSharedValue(0);
  const giftBurstScale = useSharedValue(0);
  const giftBurstOpacity = useSharedValue(0);
  const ctaOpacity = useSharedValue(0);

  const streak = user?.currentStreak ?? 0;
  const stage = getGrowthStage(user?.totalCarePoints ?? 0);
  const appearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default' as const,
    eyeColor: colors.visby.features.eyeDefault,
    eyeShape: 'round' as const,
  };

  const sustainLessons = lessonProgress.filter(
    (p) => p.completed && ['sustain_travel', 'sustain_food', 'sustain_oceans'].includes(p.lessonId),
  ).length;
  const traitLevels = calculateTraitLevels({
    bites: bites.length,
    lessonsCompleted: lessonProgress.filter((p) => p.completed).length,
    countriesVisited: user?.visitedCountries?.length ?? 0,
    chatMessages: 0,
    wordMatchGames: 0,
    gamesPlayed: 0,
    stampsCollected: stamps.length,
    averageNeedLevel: 50,
    sustainabilityLessonsCompleted: sustainLessons,
  });
  const dominant = getDominantTrait(traitLevels);
  const greeting = getPersonalityGreeting(dominant, stage);

  const hour = new Date().getHours();
  const timeGreeting =
    hour < 6 ? 'Sweet dreams' : hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Goodnight';

  useEffect(() => {
    bgOpacity.value = withTiming(1, { duration: 400 });
    visbyScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 100 }));
    textOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));

    if (streak > 1) {
      streakScale.value = withDelay(800, withSpring(1, { damping: 10, stiffness: 120 }));
    }

    if (surpriseAura && surpriseAura > 0) {
      giftScale.value = withDelay(1100, withSpring(1, { damping: 10, stiffness: 120 }));
      giftWobble.value = withDelay(1400, withRepeat(
        withSequence(
          withTiming(-8, { duration: 150 }),
          withTiming(8, { duration: 150 }),
        ),
        -1,
        true,
      ));
    }

    ctaOpacity.value = withDelay(surpriseAura ? 1600 : 1000, withTiming(1, { duration: 400 }));

    const autoDismissTimer = setTimeout(onDismiss, 8000);
    return () => {
      clearTimeout(autoDismissTimer);
      if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
    };
  }, []);

  const handleGiftTap = useCallback(() => {
    if (giftOpened) return;
    setGiftOpened(true);
    hapticService.heavy();
    giftWobble.value = 0;
    giftScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 200 }),
      withTiming(0, { duration: 300 }),
    );
    giftBurstScale.value = withSpring(1.5, { damping: 8, stiffness: 100 });
    giftBurstOpacity.value = withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(600, withTiming(0, { duration: 400 })),
    );
    giftTimerRef.current = setTimeout(() => {
      hapticService.success();
      soundService.playStampCollected();
    }, 300);
  }, [giftOpened]);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const visbyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: visbyScale.value }],
  }));
  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) }],
  }));
  const streakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
    opacity: streakScale.value,
  }));
  const giftStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: giftScale.value },
      { rotate: `${giftWobble.value}deg` },
    ],
    opacity: giftScale.value,
  }));
  const giftBurstStyle = useAnimatedStyle(() => ({
    transform: [{ scale: giftBurstScale.value }],
    opacity: giftBurstOpacity.value,
  }));
  const ctaStyle = useAnimatedStyle(() => ({
    opacity: ctaOpacity.value,
    transform: [{ translateY: interpolate(ctaOpacity.value, [0, 1], [10, 0]) }],
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <TouchableOpacity style={styles.touchable} activeOpacity={1} onPress={onDismiss}>
        <LinearGradient
          colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight]}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          <FloatingParticles count={8} variant="sparkle" opacity={0.4} speed="slow" />

          {/* Visby character */}
          <Animated.View style={[styles.visbyWrap, visbyStyle]}>
            <VisbyCharacter
              stage={stage}
              size={160}
              mood="excited"
              appearance={appearance}
              equipped={visby?.equipped}
            />
          </Animated.View>

          {/* Greeting text */}
          <Animated.View style={[styles.textWrap, textStyle]}>
            <Caption style={styles.timeGreeting}>{timeGreeting}!</Caption>
            <Heading level={2} style={styles.greetingText}>{greeting}</Heading>
          </Animated.View>

          {/* Streak flame */}
          {streak > 1 && (
            <Animated.View style={[styles.streakBadge, streakStyle]}>
              <Icon name="flame" size={22} color={colors.status.streak} />
              <Text variant="body" style={styles.streakText}>Day {streak}!</Text>
            </Animated.View>
          )}

          {/* Surprise gift */}
          {surpriseAura && surpriseAura > 0 && !giftOpened && (
            <Animated.View style={[styles.giftWrap, giftStyle]}>
              <TouchableOpacity onPress={handleGiftTap} activeOpacity={0.8} style={styles.giftBtn}>
                <Icon name="gift" size={40} color={colors.reward.peachDark} />
                <Caption style={styles.giftHint}>Tap to open!</Caption>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Gift burst */}
          {giftOpened && (
            <Animated.View style={[styles.giftBurst, giftBurstStyle]}>
              <Icon name="sparkles" size={28} color={colors.reward.gold} />
              <Text variant="h3" style={styles.giftAuraText}>+{surpriseAura} Aura</Text>
            </Animated.View>
          )}

          {/* CTA */}
          <Animated.View style={[styles.ctaWrap, ctaStyle]}>
            <TouchableOpacity style={styles.ctaBtn} onPress={onDismiss} activeOpacity={0.85}>
              <Text variant="body" style={styles.ctaBtnText}>Start today's adventure</Text>
              <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
            <Caption style={styles.tapHint}>Tap anywhere to continue</Caption>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9998,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
  },
  visbyWrap: {
    marginBottom: spacing.lg,
  },
  textWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  timeGreeting: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  greetingText: {
    textAlign: 'center',
    color: colors.text.primary,
    lineHeight: 30,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.status.streakBg,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  streakText: {
    fontFamily: 'Nunito-Bold',
    color: colors.status.streak,
  },
  giftWrap: {
    marginBottom: spacing.lg,
  },
  giftBtn: {
    alignItems: 'center',
    backgroundColor: colors.reward.peachLight,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 20,
    gap: 4,
  },
  giftHint: {
    color: colors.reward.peachDark,
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
  },
  giftBurst: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  giftAuraText: {
    color: colors.reward.gold,
    fontFamily: 'Baloo2-Bold',
  },
  ctaWrap: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 80,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
  ctaBtnText: {
    fontFamily: 'Nunito-Bold',
    color: colors.primary.wisteriaDark,
  },
  tapHint: {
    color: colors.text.muted,
    fontSize: 11,
  },
});
