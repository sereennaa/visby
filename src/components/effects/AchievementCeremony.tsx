import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface AchievementCeremonyProps {
  icon: IconName;
  title: string;
  subtitle?: string;
  auraReward?: number;
  onDismiss: () => void;
}

const CONFETTI_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#FF6347', '#9B59B6', '#87CEEB', '#50C878', '#FF8C00'];

export const AchievementCeremony: React.FC<AchievementCeremonyProps> = ({
  icon,
  title,
  subtitle,
  auraReward,
  onDismiss,
}) => {
  const iconScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const auraOpacity = useSharedValue(0);
  const bgOpacity = useSharedValue(0);
  const glowPulse = useSharedValue(0);

  useEffect(() => {
    hapticService.success();
    bgOpacity.value = withTiming(1, { duration: 300 });
    iconScale.value = withDelay(200, withSpring(1, { damping: 8, stiffness: 120 }));
    titleOpacity.value = withDelay(500, withTiming(1, { duration: 400 }));
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    auraOpacity.value = withDelay(1100, withSpring(1, { damping: 12 }));
    glowPulse.value = withDelay(300, withSequence(
      withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
      withTiming(0.5, { duration: 800 }),
      withTiming(0.8, { duration: 600 }),
    ));
  }, []);

  const bgStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [20, 0]) }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: interpolate(subtitleOpacity.value, [0, 1], [15, 0]) }],
  }));

  const auraStyle = useAnimatedStyle(() => ({
    opacity: auraOpacity.value,
    transform: [{ scale: auraOpacity.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowPulse.value * 0.3,
    transform: [{ scale: interpolate(glowPulse.value, [0, 1], [0.5, 1.5]) }],
  }));

  return (
    <Animated.View style={[styles.container, bgStyle]}>
      <TouchableOpacity style={styles.touchable} activeOpacity={1} onPress={onDismiss}>
        <LinearGradient
          colors={['rgba(45, 45, 58, 0.95)', 'rgba(25, 25, 40, 0.98)']}
          style={styles.gradient}
        >
          {/* Confetti */}
          {Array.from({ length: 20 }, (_, i) => (
            <ConfettiPiece key={i} index={i} />
          ))}

          {/* Glow ring */}
          <Animated.View style={[styles.glowRing, glowStyle]} />

          {/* Icon badge */}
          <Animated.View style={[styles.iconBadge, iconStyle]}>
            <LinearGradient
              colors={['#FFD700', '#FF8C00']}
              style={styles.iconGradient}
            >
              <Icon name={icon} size={48} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View>

          {/* Title */}
          <Animated.View style={titleStyle}>
            <Heading level={1} style={styles.title}>{title}</Heading>
          </Animated.View>

          {/* Subtitle */}
          {subtitle && (
            <Animated.View style={subtitleStyle}>
              <Text variant="body" style={styles.subtitle}>{subtitle}</Text>
            </Animated.View>
          )}

          {/* Aura reward */}
          {auraReward && auraReward > 0 && (
            <Animated.View style={[styles.auraReward, auraStyle]}>
              <Icon name="sparkles" size={18} color={colors.reward.gold} />
              <Text variant="h2" style={styles.auraText}>+{auraReward} Aura</Text>
            </Animated.View>
          )}

          <Animated.View style={[styles.tapHint, subtitleStyle]}>
            <Text variant="caption" style={styles.tapText}>Tap to continue</Text>
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ConfettiPiece: React.FC<{ index: number }> = ({ index }) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(0);

  const startX = (index % 5) * (SCREEN_W / 5) + Math.random() * (SCREEN_W / 5);
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];

  useEffect(() => {
    const delay = 200 + index * 50;
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withDelay(1500, withTiming(0, { duration: 500 })),
    ));
    translateY.value = withDelay(delay, withTiming(SCREEN_H * 0.8, {
      duration: 2000 + Math.random() * 1000,
      easing: Easing.out(Easing.quad),
    }));
    translateX.value = withDelay(delay, withTiming((Math.random() - 0.5) * 80, {
      duration: 2000,
      easing: Easing.inOut(Easing.sin),
    }));
    rotation.value = withDelay(delay, withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
      duration: 2000,
    }));
  }, []);

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: startX,
    top: -10,
    width: 8,
    height: 8,
    borderRadius: index % 3 === 0 ? 4 : 1,
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

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  touchable: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
  },
  iconBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 20,
  },
  auraReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  auraText: {
    color: '#FFD700',
  },
  tapHint: {
    position: 'absolute',
    bottom: 60,
  },
  tapText: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
});
