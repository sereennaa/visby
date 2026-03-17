import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
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
  type SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { VisbyMini } from '../avatar/VisbyMini';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { hapticService } from '../../services/haptics';
import type { JourneyTier } from '../../types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const TIER_CONFIG: Record<JourneyTier, {
  title: string;
  subtitle: string;
  icon: IconName;
  aura: number;
  gradient: [string, string];
  accentColor: string;
  particleCount: number;
}> = {
  newcomer: {
    title: 'Welcome!',
    subtitle: 'Your journey begins',
    icon: 'compass',
    aura: 0,
    gradient: [colors.calm.sky, colors.calm.ocean],
    accentColor: colors.calm.ocean,
    particleCount: 8,
  },
  explorer: {
    title: 'Explorer',
    subtitle: 'You\'re finding your way around',
    icon: 'map',
    aura: 50,
    gradient: [colors.primary.wisteria, colors.primary.wisteriaDark],
    accentColor: colors.primary.wisteria,
    particleCount: 14,
  },
  adventurer: {
    title: 'Adventurer',
    subtitle: 'Deep into the culture',
    icon: 'star',
    aura: 100,
    gradient: [colors.reward.peach, colors.reward.amber],
    accentColor: colors.reward.amber,
    particleCount: 20,
  },
  local: {
    title: 'Local',
    subtitle: 'You practically live here',
    icon: 'home',
    aura: 200,
    gradient: ['#50C878', '#2E8B57'],
    accentColor: '#50C878',
    particleCount: 28,
  },
  master: {
    title: 'Master',
    subtitle: 'You\'ve seen it all!',
    icon: 'crown',
    aura: 500,
    gradient: [colors.reward.gold, '#FF6347'],
    accentColor: colors.reward.gold,
    particleCount: 36,
  },
};

const PARTICLE_COLORS = ['#FFD700', '#FF69B4', '#40E0D0', '#FF6347', '#9B59B6', '#87CEEB', '#50C878', '#B8A5E0'];

interface TierUpCelebrationProps {
  tier: JourneyTier;
  countryName: string;
  onDismiss: () => void;
}

export const TierUpCelebration: React.FC<TierUpCelebrationProps> = ({
  tier,
  countryName,
  onDismiss,
}) => {
  const config = TIER_CONFIG[tier];
  const bgOpacity = useSharedValue(0);
  const badgeScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const detailsOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const particles = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    hapticService.press();

    bgOpacity.value = withTiming(1, { duration: 400 });
    badgeScale.value = withDelay(250, withSpring(1, { damping: 8, stiffness: 130, mass: 0.9 }));
    titleOpacity.value = withDelay(550, withTiming(1, { duration: 400 }));
    detailsOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    buttonOpacity.value = withDelay(1100, withTiming(1, { duration: 400 }));
    particles.value = withDelay(200, withTiming(1, { duration: 2200, easing: Easing.out(Easing.ease) }));

    shimmer.value = withDelay(600, withRepeat(
      withSequence(
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    ));

    return () => {
      cancelAnimation(bgOpacity);
      cancelAnimation(badgeScale);
      cancelAnimation(shimmer);
      cancelAnimation(particles);
    };
  }, []);

  const bgStyle = useAnimatedStyle(() => ({ opacity: bgOpacity.value }));
  const badgeStyle = useAnimatedStyle(() => ({ transform: [{ scale: badgeScale.value }] }));
  const titleStyle = useAnimatedStyle(() => ({ opacity: titleOpacity.value }));
  const detailsStyle = useAnimatedStyle(() => ({ opacity: detailsOpacity.value }));
  const buttonStyle = useAnimatedStyle(() => ({ opacity: buttonOpacity.value }));
  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 1], [0.05, 0.15]),
  }));

  const particleData = Array.from({ length: config.particleCount }, (_, i) => ({
    id: i,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    startX: Math.random() * SCREEN_W,
    size: 4 + Math.random() * 5,
    drift: -25 + Math.random() * 50,
    spin: Math.random() * 360,
  }));

  return (
    <Animated.View style={[styles.overlay, bgStyle]}>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onDismiss} activeOpacity={1} />
      <LinearGradient
        colors={['rgba(30, 20, 45, 0.94)', 'rgba(15, 10, 30, 0.97)']}
        style={StyleSheet.absoluteFill}
      />

      {particleData.map((p) => (
        <Particle key={p.id} piece={p} progress={particles} />
      ))}

      <Animated.View style={[styles.glow, { backgroundColor: config.accentColor }, glowStyle]} />

      <View style={styles.content}>
        <Animated.View style={[styles.badgeWrap, badgeStyle]}>
          <LinearGradient colors={config.gradient} style={styles.badgeCircle}>
            <Icon name={config.icon} size={40} color="#FFF" />
          </LinearGradient>
          <View style={styles.visbyPeek}>
            <VisbyMini size={28} />
          </View>
        </Animated.View>

        <Animated.View style={titleStyle}>
          <Text style={styles.tierLabel}>NEW TIER</Text>
          <Heading level={1} style={[styles.tierName, { color: config.accentColor }]}>{config.title}</Heading>
          <Text style={styles.subtitle}>{config.subtitle}</Text>
          <Text style={styles.countryLabel}>{countryName}</Text>
        </Animated.View>

        {config.aura > 0 && (
          <Animated.View style={[styles.auraCard, detailsStyle]}>
            <Icon name="sparkles" size={22} color={colors.reward.gold} />
            <Text style={styles.auraAmount}>+{config.aura}</Text>
            <Text style={styles.auraLabel}>Aura bonus</Text>
          </Animated.View>
        )}

        <Animated.View style={buttonStyle}>
          <TouchableOpacity onPress={onDismiss} activeOpacity={0.85}>
            <LinearGradient
              colors={config.gradient}
              style={styles.button}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Keep Exploring</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const Particle: React.FC<{
  piece: { startX: number; size: number; color: string; drift: number; spin: number };
  progress: SharedValue<number>;
}> = ({ piece, progress }) => {
  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
      transform: [
        { translateY: interpolate(p, [0, 1], [-30, SCREEN_H * 0.65]) },
        { translateX: piece.drift * p },
        { rotate: `${piece.spin + p * 600}deg` },
        { scale: interpolate(p, [0, 0.15, 1], [0, 1, 0.5]) },
      ],
    };
  });
  return (
    <Animated.View style={[{
      position: 'absolute', left: piece.startX, top: -20,
      width: piece.size, height: piece.size * 0.6, borderRadius: 2,
      backgroundColor: piece.color,
    }, style]} />
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    ...Platform.select({
      web: { boxShadow: '0 0 140px rgba(255,215,0,0.2)' },
      default: { shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.2, shadowRadius: 70 },
    }),
  },
  content: { alignItems: 'center', paddingHorizontal: spacing.xl, zIndex: 10 },
  badgeWrap: { marginBottom: spacing.lg, alignItems: 'center' },
  badgeCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 6px 24px rgba(0,0,0,0.3)' },
      default: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12 },
    }),
  },
  visbyPeek: {
    position: 'absolute', bottom: -6, right: -10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.base.cream,
    borderWidth: 2, borderColor: '#FFF',
    alignItems: 'center', justifyContent: 'center',
  },
  tierLabel: {
    fontFamily: 'Nunito-Bold', fontSize: 11, color: 'rgba(255,255,255,0.5)',
    letterSpacing: 2, textAlign: 'center', marginBottom: 4,
  },
  tierName: { textAlign: 'center', marginBottom: 4 },
  subtitle: {
    fontFamily: 'Nunito-SemiBold', fontSize: 15, color: 'rgba(255,255,255,0.7)',
    textAlign: 'center', marginBottom: 4,
  },
  countryLabel: {
    fontFamily: 'Nunito-Bold', fontSize: 13, color: 'rgba(255,255,255,0.5)',
    textAlign: 'center', marginBottom: spacing.lg,
  },
  auraCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14,
    paddingVertical: 10, paddingHorizontal: 20, marginBottom: spacing.xl,
  },
  auraAmount: { fontFamily: 'Baloo2-Bold', fontSize: 26, color: colors.reward.gold },
  auraLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: 'rgba(255,255,255,0.6)' },
  button: {
    paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontFamily: 'Nunito-Bold', fontSize: 16, color: '#FFF' },
});

export default TierUpCelebration;
