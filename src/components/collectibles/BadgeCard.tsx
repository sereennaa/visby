import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { Badge, UserBadge, CosmeticRarity } from '../../types';

interface BadgeCardProps {
  badge: Badge;
  userBadge?: UserBadge;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  userBadge,
  onPress,
  size = 'md',
  showProgress = true,
}) => {
  const scale = useSharedValue(1);
  const glow = useSharedValue(0);

  const isEarned = !!userBadge;
  const isNew = userBadge?.isNew;
  const progress = userBadge?.progress || 0;

  useEffect(() => {
    if (isNew) {
      // Pulsing glow for new badges
      glow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000 }),
          withTiming(0.5, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [isNew]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: glow.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.92, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const getRarityColors = (rarity: CosmeticRarity): [string, string] => {
    switch (rarity) {
      case 'common':
        return [colors.base.parchment, colors.text.light];
      case 'uncommon':
        return [colors.success.honeydew, colors.success.mint];
      case 'rare':
        return [colors.calm.sky, colors.calm.ocean];
      case 'epic':
        return [colors.primary.wisteria, colors.primary.wisteriaDark];
      case 'legendary':
        return [colors.reward.gold, colors.reward.amber];
      default:
        return [colors.base.cream, colors.base.parchment];
    }
  };

  const sizeStyles = {
    sm: { width: 80, height: 100, iconSize: 32, padding: spacing.sm },
    md: { width: 100, height: 130, iconSize: 44, padding: spacing.md },
    lg: { width: 140, height: 180, iconSize: 60, padding: spacing.lg },
  };

  const currentSize = sizeStyles[size];
  const rarityColors = getRarityColors(badge.rarity);

  // Map emoji to icon name (for badges that still use emoji)
  const getIconForBadge = (): IconName => {
    // This would be the badge's icon property
    return 'trophy';
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[animatedStyle]}
    >
      <Animated.View
        style={[
          styles.card,
          { width: currentSize.width, height: currentSize.height },
          isNew && styles.glowShadow,
          isNew && glowStyle,
          !isEarned && styles.locked,
        ]}
      >
        <LinearGradient
          colors={isEarned ? rarityColors : ['#E0E0E0', '#C0C0C0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Badge content */}
          <View style={[styles.content, { padding: currentSize.padding }]}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <Icon 
                name={getIconForBadge()} 
                size={currentSize.iconSize} 
                color={isEarned ? rarityColors[1] : colors.text.muted}
              />
              {!isEarned && (
                <View style={styles.lockOverlay}>
                  <Icon name="lock" size={14} color={colors.text.muted} />
                </View>
              )}
            </View>

            {/* Badge name */}
            <Text
              variant="bodySmall"
              numberOfLines={2}
              align="center"
              style={[
                styles.name,
                !isEarned && styles.lockedText,
              ]}
            >
              {badge.name}
            </Text>

            {/* Progress bar (if not earned and showing progress) */}
            {!isEarned && showProgress && progress > 0 && (
              <View style={styles.progressContainer}>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${progress}%` },
                    ]}
                  />
                </View>
                <Caption style={styles.progressText}>
                  {Math.round(progress)}%
                </Caption>
              </View>
            )}

            {/* New badge indicator */}
            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newText}>NEW!</Text>
              </View>
            )}
          </View>

          {/* Rarity indicator */}
          <View
            style={[
              styles.rarityDot,
              { backgroundColor: isEarned ? rarityColors[1] : colors.text.light },
            ]}
          />
        </LinearGradient>
      </Animated.View>
    </AnimatedTouchable>
  );
};

// Achievement row for lists
export const BadgeRow: React.FC<{
  badge: Badge;
  userBadge?: UserBadge;
  onPress?: () => void;
}> = ({ badge, userBadge, onPress }) => {
  const isEarned = !!userBadge;
  const progress = userBadge?.progress || 0;
  const rarityColors = {
    common: colors.text.muted,
    uncommon: colors.success.emerald,
    rare: colors.calm.ocean,
    epic: colors.primary.wisteriaDark,
    legendary: colors.reward.gold,
  };

  return (
    <TouchableOpacity onPress={onPress} style={styles.rowContainer}>
      <View style={[styles.rowIcon, !isEarned && styles.rowLocked]}>
        <Icon 
          name="trophy" 
          size={24} 
          color={isEarned ? colors.primary.wisteriaDark : colors.text.muted} 
        />
        {!isEarned && (
          <View style={styles.rowLockIcon}>
            <Icon name="lock" size={12} color={colors.text.muted} />
          </View>
        )}
      </View>
      
      <View style={styles.rowInfo}>
        <View style={styles.rowHeader}>
          <Text variant="body" style={[!isEarned && styles.lockedText]}>
            {badge.name}
          </Text>
          <View
            style={[
              styles.rarityTag,
              { backgroundColor: rarityColors[badge.rarity] + '20' },
            ]}
          >
            <Text
              style={[
                styles.rarityText,
                { color: rarityColors[badge.rarity] },
              ]}
            >
              {badge.rarity.toUpperCase()}
            </Text>
          </View>
        </View>
        
        <Caption style={[!isEarned && styles.lockedText]}>
          {badge.description}
        </Caption>

        {!isEarned && (
          <View style={styles.rowProgress}>
            <View style={styles.rowProgressTrack}>
              <View
                style={[
                  styles.rowProgressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <Caption>{Math.round(progress)}%</Caption>
          </View>
        )}
      </View>

      {isEarned && (
        <View style={styles.checkmark}>
          <Icon name="check" size={16} color={colors.success.emerald} />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  glowShadow: {
    shadowColor: colors.reward.gold,
    shadowRadius: 16,
    elevation: 8,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  lockOverlay: {
    position: 'absolute',
    top: -5,
    right: -10,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    padding: 2,
  },
  name: {
    fontFamily: 'Fredoka-Medium',
    color: colors.text.primary,
  },
  locked: {
    opacity: 0.7,
  },
  lockedText: {
    color: colors.text.muted,
  },
  progressContainer: {
    width: '100%',
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  progressTrack: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.wisteria,
    borderRadius: 2,
  },
  progressText: {
    marginTop: 2,
    color: colors.text.secondary,
  },
  newBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: colors.reward.peach,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  newText: {
    fontSize: 8,
    fontFamily: 'Fredoka-Bold',
    color: colors.text.primary,
  },
  rarityDot: {
    position: 'absolute',
    bottom: spacing.sm,
    alignSelf: 'center',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  // Row styles
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  rowIcon: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.lg,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  rowLocked: {
    backgroundColor: colors.base.parchment,
  },
  rowLockIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  rowInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  rowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rarityTag: {
    marginLeft: spacing.sm,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
  },
  rarityText: {
    fontSize: 8,
    fontFamily: 'Quicksand-Bold',
  },
  rowProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.sm,
  },
  rowProgressTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.base.parchment,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rowProgressFill: {
    height: '100%',
    backgroundColor: colors.primary.wisteria,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.success.honeydew,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BadgeCard;
