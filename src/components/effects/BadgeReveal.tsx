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
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

interface BadgeRevealProps {
  icon: IconName;
  name: string;
  description?: string;
  rarity: BadgeRarity;
  auraReward?: number;
  onDismiss: () => void;
}

const RARITY_CONFIG: Record<BadgeRarity, {
  title: string;
  bgColors: [string, string];
  accentColor: string;
  glowColor: string;
  particleCount: number;
  burstCount: number;
}> = {
  common: {
    title: 'Badge Earned',
    bgColors: ['rgba(45, 45, 58, 0.92)', 'rgba(30, 28, 45, 0.96)'],
    accentColor: colors.calm.sky,
    glowColor: 'rgba(200, 228, 248, 0.15)',
    particleCount: 6,
    burstCount: 4,
  },
  uncommon: {
    title: 'Badge Earned',
    bgColors: ['rgba(40, 42, 55, 0.93)', 'rgba(28, 30, 45, 0.97)'],
    accentColor: colors.success.mint,
    glowColor: 'rgba(184, 240, 188, 0.15)',
    particleCount: 10,
    burstCount: 6,
  },
  rare: {
    title: 'Rare Badge!',
    bgColors: ['rgba(38, 32, 50, 0.94)', 'rgba(22, 18, 38, 0.97)'],
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.2)',
    particleCount: 16,
    burstCount: 8,
  },
  epic: {
    title: 'Epic Badge!!',
    bgColors: ['rgba(35, 25, 55, 0.95)', 'rgba(18, 12, 35, 0.98)'],
    accentColor: '#9B59B6',
    glowColor: 'rgba(155, 89, 182, 0.25)',
    particleCount: 24,
    burstCount: 12,
  },
  legendary: {
    title: 'LEGENDARY!!!',
    bgColors: ['rgba(30, 15, 45, 0.96)', 'rgba(12, 8, 25, 0.99)'],
    accentColor: '#FFD700',
    glowColor: 'rgba(255, 215, 0, 0.3)',
    particleCount: 36,
    burstCount: 16,
  },
};

const BURST_COLORS: Record<BadgeRarity, string[]> = {
  common: ['#C8E4F8', '#B0D4F1', '#E0ECFF', '#87CEEB'],
  uncommon: ['#B8F0BC', '#A8E6A3', '#DFF5E1', '#66BB6A'],
  rare: ['#FFD700', '#FFE57F', '#FFBF00', '#FFC107'],
  epic: ['#9B59B6', '#CE93D8', '#AB47BC', '#7B1FA2', '#FFD700', '#E040FB'],
  legendary: ['#FFD700', '#FF6347', '#FF69B4', '#9B59B6', '#40E0D0', '#FF8C00', '#7B68EE', '#00CED1'],
};

export const BadgeReveal: React.FC<BadgeRevealProps> = ({
  icon,
  name,
  description,
  rarity,
  auraReward,
  onDismiss,
}) => {
  const config = RARITY_CONFIG[rarity];
  const burstColors = BURST_COLORS[rarity];

  const bgOpacity = useSharedValue(0);
  const flipProgress = useSharedValue(0);
  const glowPulse = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);
  const burstTrigger = useSharedValue(0);

  useEffect(() => {
    const isHigh = rarity === 'epic' || rarity === 'legendary';

    if (isHigh) hapticService.heavy();
    else hapticService.success();

    bgOpacity.value = withTiming(1, { duration: 300 });

    flipProgress.value = withDelay(400, withTiming(1, {
      duration: 700,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    }));

    burstTrigger.value = withDelay(700, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));

    if (isHigh) {
      glowPulse.value = withDelay(500, withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
        true,
      ));
    } else {
      glowPulse.value = withDelay(500, withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.4, { duration: 800 }),
      ));
    }

    titleOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    detailsOpacity.value = withDelay(1100, withTiming(1, { duration: 400 }));

    const timers: ReturnType<typeof setTimeout>[] = [];
    if (rarity === 'legendary') {
      timers.push(setTimeout(() => hapticService.success(), 700));
      timers.push(setTimeout(() => hapticService.tap(), 1100));
    }
    return () => {
      timers.forEach(clearTimeout);
      cancelAnimation(glowPulse);
      cancelAnimation(burstTrigger);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));

  const badgeContainerStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipProgress.value, [0, 1], [180, 360]);
    return {
      transform: [
        { perspective: 800 },
        { rotateY: `${rotateY}deg` },
        { scale: interpolate(flipProgress.value, [0, 0.5, 1], [0.6, 1.1, 1]) },
      ],
    };
  });

  const mysteryStyle = useAnimatedStyle(() => {
    const visible = flipProgress.value < 0.5;
    return {
      opacity: visible ? 1 : 0,
      backfaceVisibility: 'hidden' as const,
    };
  });

  const revealedStyle = useAnimatedStyle(() => {
    const visible = flipProgress.value >= 0.5;
    return {
      opacity: visible ? 1 : 0,
      backfaceVisibility: 'hidden' as const,
    };
  });

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value * 0.4,
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.8, rarity === 'legendary' ? 2.0 : 1.5]) }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [15, 0]) }],
  }));

  const detailsStyle = useAnimatedStyle(() => ({
    opacity: detailsOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <TouchableOpacity style={styles.touchable} activeOpacity={1} onPress={onDismiss}>
        <LinearGradient colors={config.bgColors} style={styles.gradient}>
          {Array.from({ length: config.burstCount }, (_, i) => (
            <RarityBurst
              key={i}
              index={i}
              total={config.burstCount}
              trigger={burstTrigger}
              color={burstColors[i % burstColors.length]}
              rarity={rarity}
            />
          ))}

          <Animated.View style={[styles.glow, { backgroundColor: config.glowColor }, glowStyle]} />

          <Animated.View style={[styles.badgeContainer, badgeContainerStyle]}>
            {/* Mystery side (?) */}
            <Animated.View style={[styles.badgeFace, styles.mysteryFace, mysteryStyle]}>
              <Text style={styles.mysteryText}>?</Text>
            </Animated.View>

            {/* Revealed side */}
            <Animated.View style={[styles.badgeFace, revealedStyle]}>
              <LinearGradient
                colors={rarity === 'legendary'
                  ? ['#FFD700', '#FF6347']
                  : [config.accentColor, config.accentColor + '88']}
                style={styles.badgeGradient}
              >
                <Icon name={icon} size={44} color="#FFFFFF" />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          <Animated.View style={titleStyle}>
            <Text variant="caption" style={[styles.rarityLabel, { color: config.accentColor }]}>
              {rarity.toUpperCase()}
            </Text>
            <Heading level={2} style={styles.badgeName}>{name}</Heading>
          </Animated.View>

          {(description || (auraReward && auraReward > 0)) && (
            <Animated.View style={detailsStyle}>
              {description && (
                <Text variant="body" style={styles.description}>{description}</Text>
              )}
              {auraReward && auraReward > 0 && (
                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={16} color={colors.reward.gold} />
                  <Text variant="h3" style={styles.auraText}>+{auraReward} Aura</Text>
                </View>
              )}
            </Animated.View>
          )}

          <Animated.View style={[styles.tapHint, detailsStyle]}>
            <Text variant="caption" style={styles.tapText}>Tap to continue</Text>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const RarityBurst: React.FC<{
  index: number;
  total: number;
  trigger: { value: number };
  color: string;
  rarity: BadgeRarity;
}> = ({ index, total, trigger, color, rarity }) => {
  const angle = (index / total) * Math.PI * 2;
  const dist = rarity === 'legendary' ? 140 : rarity === 'epic' ? 110 : 80;
  const size = rarity === 'legendary' ? 6 : rarity === 'epic' ? 5 : 4;

  const style = useAnimatedStyle(() => {
    const p = trigger.value;
    return {
      position: 'absolute' as const,
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: color,
      left: SCREEN_W / 2 + Math.cos(angle) * dist * p - size / 2,
      top: SCREEN_H * 0.38 + Math.sin(angle) * dist * p - size / 2,
      opacity: interpolate(p, [0, 0.2, 0.6, 1], [0, 1, 0.8, 0]),
      transform: [{ scale: interpolate(p, [0, 0.3, 1], [0, 1.5, 0.3]) }],
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
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  badgeContainer: {
    width: 100,
    height: 100,
    marginBottom: spacing.radius.lg,
  },
  badgeFace: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mysteryFace: {
    backgroundColor: colors.magic.shimmer,
  },
  mysteryText: {
    fontSize: 40,
    color: 'rgba(255, 255, 255, 0.3)',
    fontFamily: 'Baloo2-Bold',
  },
  badgeGradient: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rarityLabel: {
    textAlign: 'center',
    letterSpacing: 2,
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  badgeName: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  description: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: spacing.radius.lg,
    borderRadius: spacing.radius.lg,
  },
  auraText: { color: colors.reward.gold },
  tapHint: { position: 'absolute', bottom: spacing.xxxl + spacing.md },
  tapText: { color: colors.overlay.whiteMuted },
});
