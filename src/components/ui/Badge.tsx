import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Icon } from './Icon';

interface BadgeProps {
  label?: string;
  count?: number;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'aura' | 'level';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  count,
  variant = 'default',
  size = 'md',
  glow = false,
  style,
}) => {
  const glowAnimation = useSharedValue(1);

  React.useEffect(() => {
    if (glow) {
      glowAnimation.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [glow]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glow ? glowAnimation.value : 1 }],
  }));

  const getColors = (): [string, string] => {
    switch (variant) {
      case 'primary':
        return [colors.primary.wisteria, colors.primary.wisteriaDark];
      case 'success':
        return [colors.success.honeydew, colors.success.mint];
      case 'warning':
        return [colors.reward.peach, colors.reward.peachDark];
      case 'aura':
        return [colors.reward.gold, colors.reward.amber];
      case 'level':
        return [colors.calm.sky, colors.calm.ocean];
      default:
        return [colors.base.parchment, colors.base.cream];
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return colors.text.inverse;
      case 'aura':
      case 'warning':
        return colors.text.primary;
      default:
        return colors.text.secondary;
    }
  };

  const sizeStyles = {
    sm: { paddingH: spacing.sm, paddingV: spacing.xxs, fontSize: 10 },
    md: { paddingH: spacing.md, paddingV: spacing.xs, fontSize: 12 },
    lg: { paddingH: spacing.lg, paddingV: spacing.sm, fontSize: 14 },
  };

  const currentSize = sizeStyles[size];

  const displayText = count !== undefined ? count.toString() : label;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <LinearGradient
        colors={getColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.badge,
          {
            paddingHorizontal: currentSize.paddingH,
            paddingVertical: currentSize.paddingV,
          },
          glow && styles.glowShadow,
        ]}
      >
        <Text
          variant="label"
          style={[
            styles.text,
            { fontSize: currentSize.fontSize, color: getTextColor() },
          ]}
        >
          {displayText}
        </Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Aura Badge with sparkle icon
export const AuraBadge: React.FC<{ amount: number; style?: ViewStyle }> = ({
  amount,
  style,
}) => {
  return (
    <View style={[styles.auraBadgeContainer, style]}>
      <Icon name="sparkles" size={16} color={colors.reward.gold} />
      <Badge count={amount} variant="aura" size="md" />
    </View>
  );
};

// Level Badge
export const LevelBadge: React.FC<{ level: number; style?: ViewStyle }> = ({
  level,
  style,
}) => {
  return (
    <View style={[styles.levelBadgeContainer, style]}>
      <LinearGradient
        colors={[colors.calm.sky, colors.calm.ocean]}
        style={styles.levelBadge}
      >
        <Text style={styles.levelText}>Lv</Text>
        <Text style={styles.levelNumber}>{level}</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: spacing.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  glowShadow: {
    shadowColor: colors.reward.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  auraBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  levelBadgeContainer: {},
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  levelText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 10,
    color: colors.text.inverse,
    marginRight: 2,
  },
  levelNumber: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 16,
    color: colors.text.inverse,
  },
});

export default Badge;
