import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  withRepeat,
  cancelAnimation,
  Easing,
  FadeIn,
  ZoomIn,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export type CelebrationTier = 'good' | 'great' | 'perfect';

interface GameCelebrationProps {
  tier: CelebrationTier;
  score: number;
  maxScore: number;
  auraEarned: number;
  gameName: string;
  onDismiss: () => void;
}

const TIER_CONFIG = {
  good: {
    title: 'Nice work!',
    icon: 'sparkles' as IconName,
    confettiCount: 12,
    bgColors: ['rgba(45, 45, 58, 0.9)', 'rgba(30, 30, 48, 0.95)'] as [string, string],
    accentColor: colors.calm.sky,
    glowColor: 'rgba(200, 228, 248, 0.2)',
    iconGradient: [colors.calm.sky, colors.calm.ocean] as [string, string],
  },
  great: {
    title: 'Awesome!',
    icon: 'star' as IconName,
    confettiCount: 24,
    bgColors: ['rgba(40, 35, 55, 0.92)', 'rgba(25, 20, 40, 0.96)'] as [string, string],
    accentColor: colors.reward.gold,
    glowColor: 'rgba(255, 215, 0, 0.15)',
    iconGradient: [colors.reward.gold, colors.reward.amber] as [string, string],
  },
  perfect: {
    title: 'LEGENDARY!',
    icon: 'crown' as IconName,
    confettiCount: 40,
    bgColors: ['rgba(35, 20, 50, 0.95)', 'rgba(15, 10, 30, 0.98)'] as [string, string],
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.25)',
    iconGradient: ['#FFD700', '#FF6347'] as [string, string],
  },
};

const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#FF6347', '#9B59B6', '#87CEEB', '#50C878', '#FF8C00', '#7B68EE', '#00CED1'];

export const GameCelebration: React.FC<GameCelebrationProps> = ({
  tier,
  score,
  maxScore,
  auraEarned,
  gameName,
  onDismiss,
}) => {
  const config = TIER_CONFIG[tier];
  const bgOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const scoreOpacity = useSharedValue(0);
  const auraOpacity = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const starBurst = useSharedValue(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    if (tier === 'perfect') {
      hapticService.heavy();
      timers.push(setTimeout(() => hapticService.success(), 200));
    } else if (tier === 'great') {
      hapticService.success();
    } else {
      hapticService.tap();
    }

    bgOpacity.value = withTiming(1, { duration: 300 });
    iconScale.value = withDelay(200, withSpring(1, { damping: 6, stiffness: 100 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    scoreOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    auraOpacity.value = withDelay(1000, withSpring(1, { damping: 12 }));

    if (tier === 'perfect') {
      glowPulse.value = withDelay(300, withRepeat(
        withSequence(
          withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }),
          withTiming(0.4, { duration: 800 }),
        ),
        -1,
        true,
      ));
      starBurst.value = withDelay(200, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    } else if (tier === 'great') {
      glowPulse.value = withDelay(300, withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.5, { duration: 800 }),
        withTiming(0.7, { duration: 600 }),
      ));
    }
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimation(glowPulse);
      cancelAnimation(starBurst);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));
  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [20, 0]) }],
  }));
  const scoreStyle = useAnimatedStyle(() => ({
    opacity: scoreOpacity.value,
    transform: [{ scale: scoreOpacity.value }],
  }));
  const auraStyle = useAnimatedStyle(() => ({
    opacity: auraOpacity.value,
    transform: [{ scale: auraOpacity.value }],
  }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value * 0.4,
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.5, tier === 'perfect' ? 2.0 : 1.5]) }],
  }));

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <TouchableOpacity style={styles.touchable} activeOpacity={1} onPress={onDismiss}>
        <LinearGradient colors={config.bgColors} style={styles.gradient}>
          {Array.from({ length: config.confettiCount }, (_, i) => (
            <CelebrationConfetti key={i} index={i} tier={tier} />
          ))}

          <Animated.View style={[styles.glowRing, { backgroundColor: config.glowColor }, glowStyle]} />

          {tier === 'perfect' && (
            <>
              {Array.from({ length: 8 }, (_, i) => (
                <StarBurst key={`star_${i}`} index={i} trigger={starBurst} />
              ))}
            </>
          )}

          <Animated.View style={iconStyle}>
            <View style={styles.emojiContainer}>
              <Icon name={config.icon} size={48} color={config.accentColor} />
            </View>
          </Animated.View>

          <Animated.View style={titleStyle}>
            <Heading level={1} style={[styles.title, tier === 'perfect' && styles.perfectTitle]}>
              {config.title}
            </Heading>
          </Animated.View>

          <Animated.View style={[styles.scoreCard, scoreStyle]}>
            <Text variant="caption" style={styles.scoreLabel}>{gameName}</Text>
            <Text variant="h1" style={styles.scoreText}>{percentage}%</Text>
            <Text variant="caption" style={styles.scoreSubtext}>
              {score} / {maxScore} correct
            </Text>
          </Animated.View>

          {auraEarned > 0 && (
            <Animated.View style={[styles.auraReward, auraStyle]}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text variant="h2" style={styles.auraText}>+{auraEarned} Aura</Text>
            </Animated.View>
          )}

          <Animated.View style={[styles.tapHint, { opacity: scoreOpacity }]}>
            <Text variant="caption" style={styles.tapText}>Tap to continue</Text>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CelebrationConfetti: React.FC<{ index: number; tier: CelebrationTier }> = ({ index, tier }) => {
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);
  const config = TIER_CONFIG[tier];

  const startX = Math.random() * SCREEN_W;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const isRect = index % 3 !== 0;
  const size = isRect ? { w: 8, h: 5 } : { w: 6, h: 6 };

  useEffect(() => {
    const delay = 100 + index * 40;
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 150 }),
      withDelay(tier === 'perfect' ? 2500 : 1500, withTiming(0, { duration: 500 })),
    ));
    translateY.value = withDelay(delay, withTiming(SCREEN_H * 0.85, {
      duration: 1800 + Math.random() * 1200,
      easing: Easing.out(Easing.quad),
    }));
    translateX.value = withDelay(delay, withTiming((Math.random() - 0.5) * 120, {
      duration: 1800,
      easing: Easing.inOut(Easing.sin),
    }));
    rotation.value = withDelay(delay, withTiming(360 * (Math.random() > 0.5 ? 2 : -2), {
      duration: 2000,
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: startX,
    top: -10,
    width: size.w,
    height: size.h,
    borderRadius: isRect ? 1 : size.w / 2,
    backgroundColor: color,
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
};

const StarBurst: React.FC<{ index: number; trigger: { value: number } }> = ({ index, trigger }) => {
  const angle = (index / 8) * Math.PI * 2;
  const dist = 100 + Math.random() * 50;

  const style = useAnimatedStyle(() => {
    const progress = trigger.value;
    return {
      position: 'absolute' as const,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#FFD700',
      opacity: interpolate(progress, [0, 0.3, 0.8, 1], [0, 1, 0.6, 0]),
      transform: [
        { translateX: interpolate(progress, [0, 1], [0, Math.cos(angle) * dist]) },
        { translateY: interpolate(progress, [0, 1], [0, Math.sin(angle) * dist]) },
        { scale: interpolate(progress, [0, 0.5, 1], [0, 1.5, 0.3]) },
      ],
    };
  });

  return <Animated.View style={style} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  touchable: { flex: 1 },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  emojiContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: spacing.lg,
  },
  emoji: { fontSize: 48 },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  perfectTitle: {
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  scoreCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.cardPadding,
    alignItems: 'center',
    marginBottom: spacing.radius.lg,
  },
  scoreLabel: { color: 'rgba(255, 255, 255, 0.5)', marginBottom: spacing.xs },
  scoreText: { color: '#FFFFFF', fontSize: 36 },
  scoreSubtext: { color: 'rgba(255, 255, 255, 0.6)', marginTop: spacing.xs },
  auraReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: spacing.radius.xl,
    marginBottom: spacing.xl,
  },
  auraText: { color: colors.reward.gold },
  tapHint: { position: 'absolute', bottom: spacing.xxxl + spacing.md },
  tapText: { color: colors.overlay.whiteMuted },
});

export function getCelebrationTier(score: number, maxScore: number): CelebrationTier {
  if (maxScore === 0) return 'good';
  const pct = (score / maxScore) * 100;
  if (pct >= 95) return 'perfect';
  if (pct >= 80) return 'great';
  return 'good';
}
