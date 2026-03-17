import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter, VisbyAppearance } from '../avatar/VisbyCharacter';
import { CosmeticRarity } from '../../types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const NUM_PARTICLES = 24;

const RARITY_GLOW: Record<CosmeticRarity, [string, string]> = {
  common: ['rgba(155,155,155,0.15)', 'rgba(155,155,155,0)'],
  uncommon: ['rgba(92,184,92,0.25)', 'rgba(92,184,92,0)'],
  rare: ['rgba(74,144,217,0.3)', 'rgba(74,144,217,0)'],
  epic: ['rgba(155,89,182,0.35)', 'rgba(155,89,182,0)'],
  legendary: ['rgba(255,215,0,0.4)', 'rgba(255,215,0,0)'],
};

const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A78BFA', '#F472B6', '#60A5FA', '#FBBF24', '#34D399'];

interface ConfettiPieceProps {
  index: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  const startX = (Math.random() - 0.5) * SCREEN_W;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 6 + Math.random() * 6;
  const delay = Math.random() * 400;

  useEffect(() => {
    translateY.value = withDelay(delay, withTiming(SCREEN_H * 0.6, { duration: 1800 + Math.random() * 800, easing: Easing.out(Easing.quad) }));
    translateX.value = withDelay(delay, withTiming(startX + (Math.random() - 0.5) * 100, { duration: 2000, easing: Easing.out(Easing.quad) }));
    rotate.value = withDelay(delay, withTiming(360 * (1 + Math.random() * 2), { duration: 2000 }));
    opacity.value = withDelay(1500, withTiming(0, { duration: 800 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: SCREEN_H * 0.25,
          left: SCREEN_W / 2,
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: 2,
        },
        style,
      ]}
    />
  );
};

interface PurchaseCelebrationProps {
  visible: boolean;
  itemName: string;
  rarity: CosmeticRarity;
  appearance: VisbyAppearance;
  equipped: Record<string, string | undefined>;
  onDismiss: () => void;
}

export const PurchaseCelebration: React.FC<PurchaseCelebrationProps> = ({
  visible,
  itemName,
  rarity,
  appearance,
  equipped,
  onDismiss,
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
      const timeout = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timeout);
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const characterStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={onDismiss} />
      
      {Array.from({ length: NUM_PARTICLES }).map((_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}

      <View style={styles.content}>
        <LinearGradient
          colors={RARITY_GLOW[rarity]}
          style={styles.glow}
        />
        <Animated.View style={characterStyle}>
          <VisbyCharacter
            appearance={appearance}
            equipped={equipped}
            mood="excited"
            size={180}
            animated
          />
        </Animated.View>
        <View style={styles.textBlock}>
          <Heading level={2} align="center">Your Visby loves it!</Heading>
          <View style={styles.itemRow}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="h3" color={colors.primary.wisteriaDark}>{itemName}</Text>
          </View>
        </View>
        <Text variant="caption" color={colors.text.muted} style={styles.tapHint}>Tap anywhere to continue</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    top: -50,
  },
  textBlock: {
    alignItems: 'center',
    marginTop: spacing.lg,
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tapHint: {
    marginTop: spacing.xl,
    opacity: 0.7,
  },
});
