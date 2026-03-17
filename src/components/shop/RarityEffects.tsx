import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { CosmeticRarity } from '../../types';

const RARITY_BORDER_COLORS: Record<CosmeticRarity, string> = {
  common: 'transparent',
  uncommon: '#5CB85C',
  rare: '#4A90D9',
  epic: '#9B59B6',
  legendary: '#FFD700',
};

interface RarityWrapperProps {
  rarity: CosmeticRarity;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const RarityWrapper: React.FC<RarityWrapperProps> = ({ rarity, children, style }) => {
  const pulse = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (rarity === 'uncommon') {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    } else if (rarity === 'rare' || rarity === 'epic' || rarity === 'legendary') {
      shimmer.value = withRepeat(
        withTiming(1, { duration: rarity === 'legendary' ? 2000 : 3000, easing: Easing.linear }),
        -1,
        false,
      );
    }
  }, [rarity]);

  const borderStyle = useAnimatedStyle(() => {
    if (rarity === 'uncommon') {
      return {
        borderWidth: 2,
        borderColor: RARITY_BORDER_COLORS.uncommon,
        opacity: interpolate(pulse.value, [0, 1], [0.4, 1]),
      };
    }
    if (rarity === 'legendary') {
      const hue = interpolate(shimmer.value, [0, 1], [0, 360]);
      return {
        borderWidth: 2.5,
        borderColor: `hsl(${hue}, 80%, 60%)`,
      };
    }
    return {};
  });

  const glowStyle = useAnimatedStyle(() => {
    if (rarity === 'legendary') {
      return {
        opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
      };
    }
    if (rarity === 'epic') {
      return {
        opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.1, 0.4, 0.1]),
      };
    }
    return { opacity: 0 };
  });

  if (rarity === 'common') {
    return <View style={style}>{children}</View>;
  }

  return (
    <Animated.View style={[style, borderStyle, { borderRadius: 22, overflow: 'hidden', position: 'relative' }]}>
      {(rarity === 'epic' || rarity === 'legendary') && (
        <Animated.View style={[styles.glow, glowStyle, { backgroundColor: RARITY_BORDER_COLORS[rarity], pointerEvents: 'none' }]} />
      )}
      {children}
      {rarity === 'rare' && <ShimmerOverlay shimmer={shimmer} color={RARITY_BORDER_COLORS.rare} />}
    </Animated.View>
  );
};

const ShimmerOverlay: React.FC<{ shimmer: Animated.SharedValue<number>; color: string }> = ({ shimmer, color }) => {
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-200, 200]) }],
  }));

  return (
    <Animated.View style={[styles.shimmerOverlay, animStyle, { pointerEvents: 'none' }]}>
      <LinearGradient
        colors={['transparent', `${color}30`, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  glow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 22,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 120,
    left: 0,
  },
});
