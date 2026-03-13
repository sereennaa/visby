import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text } from './Text';
import { Icon } from './Icon';

interface ProgressBarProps {
  progress: number; // 0-100
  variant?: 'default' | 'aura' | 'level' | 'streak';
  showLabel?: boolean;
  label?: string;
  showPercentage?: boolean;
  height?: number;
  animated?: boolean;
  style?: ViewStyle;
}

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  variant = 'default',
  showLabel = false,
  label,
  showPercentage = false,
  height = 12,
  animated = true,
  style,
}) => {
  const progressValue = useSharedValue(0);
  const clampedProgress = Math.min(100, Math.max(0, progress));

  useEffect(() => {
    if (animated) {
      progressValue.value = withSpring(clampedProgress, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      progressValue.value = clampedProgress;
    }
  }, [clampedProgress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const getColors = (): [string, string] => {
    switch (variant) {
      case 'aura':
        return [colors.reward.gold, colors.reward.amber];
      case 'level':
        return [colors.primary.wisteria, colors.primary.wisteriaDark];
      case 'streak':
        return [colors.reward.peach, colors.reward.coral];
      default:
        return [colors.calm.sky, colors.calm.ocean];
    }
  };

  const getBackgroundColor = () => {
    switch (variant) {
      case 'aura':
        return colors.reward.peachLight;
      case 'level':
        return colors.primary.wisteriaFaded;
      case 'streak':
        return colors.accent.blush;
      default:
        return colors.calm.skyLight;
    }
  };

  return (
    <View style={[styles.container, style]}>
      {(showLabel || showPercentage) && (
        <View style={styles.labelContainer}>
          {showLabel && label && (
            <Text variant="bodySmall" color={colors.text.secondary}>
              {label}
            </Text>
          )}
          {showPercentage && (
            <Text variant="bodySmall" color={colors.text.secondary}>
              {Math.round(clampedProgress)}%
            </Text>
          )}
        </View>
      )}
      
      <View
        style={[
          styles.track,
          { height, backgroundColor: getBackgroundColor() },
        ]}
      >
        <AnimatedLinearGradient
          colors={getColors()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { height }, animatedStyle]}
        />
        
        {/* Sparkle effect at the end */}
        {clampedProgress > 5 && (
          <Animated.View
            style={[
              styles.sparkle,
              animatedStyle,
              { height: height - 4 },
            ]}
          />
        )}
      </View>
    </View>
  );
};

// XP/Level Progress Bar with current and required display
interface LevelProgressProps {
  currentXP: number;
  requiredXP: number;
  level: number;
  style?: ViewStyle;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  currentXP,
  requiredXP,
  level,
  style,
}) => {
  const progress = (currentXP / requiredXP) * 100;

  return (
    <View style={[styles.levelProgressContainer, style]}>
      <View style={styles.levelHeader}>
        <View style={styles.levelBadge}>
          <Text variant="label" color={colors.text.inverse}>
            Level {level}
          </Text>
        </View>
        <Text variant="bodySmall" color={colors.text.secondary}>
          {currentXP.toLocaleString()} / {requiredXP.toLocaleString()} Aura
        </Text>
      </View>
      <ProgressBar progress={progress} variant="level" height={16} />
    </View>
  );
};

// Streak Progress
interface StreakProgressProps {
  currentStreak: number;
  targetStreak: number;
  style?: ViewStyle;
}

export const StreakProgress: React.FC<StreakProgressProps> = ({
  currentStreak,
  targetStreak,
  style,
}) => {
  const progress = (currentStreak / targetStreak) * 100;

  return (
    <View style={[styles.streakContainer, style]}>
      <View style={styles.streakHeader}>
        <Icon name="flame" size={24} color={colors.reward.coral} />
        <Text variant="h3" color={colors.text.primary} style={styles.streakText}>
          {currentStreak} day streak!
        </Text>
      </View>
      <ProgressBar
        progress={progress}
        variant="streak"
        height={10}
        showPercentage={false}
      />
      <Text variant="caption" style={styles.streakCaption}>
        {targetStreak - currentStreak} more days to unlock bonus!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  track: {
    width: '100%',
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: spacing.radius.round,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  sparkle: {
    position: 'absolute',
    right: 2,
    top: 2,
    width: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  levelProgressContainer: {
    width: '100%',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  levelBadge: {
    backgroundColor: colors.primary.wisteriaDark,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  streakContainer: {
    width: '100%',
    padding: spacing.md,
    backgroundColor: colors.accent.blush,
    borderRadius: spacing.radius.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  streakText: {
    marginLeft: spacing.sm,
  },
  streakCaption: {
    marginTop: spacing.xs,
    textAlign: 'center',
    color: colors.text.secondary,
  },
});

export default ProgressBar;
