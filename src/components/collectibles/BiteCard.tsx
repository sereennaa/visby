import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { Bite, BiteCategory } from '../../types';
import { BITE_CATEGORIES_INFO } from '../../config/constants';
import { getDishById } from '../../config/worldFoods';

interface BiteCardProps {
  bite: Bite;
  onPress?: () => void;
  variant?: 'default' | 'compact';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BiteCard: React.FC<BiteCardProps> = React.memo(({
  bite,
  onPress,
  variant = 'default',
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const worldDish = bite.worldDishId ? getDishById(bite.worldDishId) : undefined;
  const isDiscovery = Boolean(worldDish);
  const categoryInfo = BITE_CATEGORIES_INFO[worldDish?.category || bite.category] || { icon: 'food', label: 'Food' };
  const imageUrl = worldDish?.imageUrl || bite.photoUrl;
  const title = worldDish?.name || bite.name;
  const subtitle = worldDish?.countryName || bite.cuisine;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
    if (isDiscovery) {
      rotate.value = withSpring(1.5, { damping: 15 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    if (isDiscovery) {
      rotate.value = withSpring(0, { damping: 15 });
    }
  };

  // Render star rating
  const renderRating = (rating: number) => {
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'starOutline'}
            size={14}
            color={star <= rating ? colors.reward.gold : colors.text.light}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  if (variant === 'compact') {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={animatedStyle}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.compactCard}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.compactPhoto}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
            />
          ) : (
            <View style={styles.compactIcon}>
              <Icon name={categoryInfo.icon} size={24} color={colors.reward.peachDark} />
            </View>
          )}
          <View style={styles.compactInfo}>
            <Text variant="bodySmall" numberOfLines={1} style={styles.compactName}>
              {title}
            </Text>
            <Caption numberOfLines={1}>{subtitle}</Caption>
          </View>
        </View>
      </AnimatedTouchable>
    );
  }

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.card}>
        <View style={styles.photoContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.photo}
              contentFit="cover"
              transition={200}
              placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
            />
          ) : (
            <LinearGradient
              colors={[colors.reward.peachLight, colors.base.cream]}
              style={styles.placeholderPhoto}
            >
              <Icon name={categoryInfo.icon} size={64} color={colors.reward.peachDark} />
            </LinearGradient>
          )}
          
          {/* Category badge */}
          <View style={styles.categoryBadge}>
            <Icon name={categoryInfo.icon} size={20} color={colors.reward.peachDark} />
          </View>

          {isDiscovery ? (
            <View style={styles.discoveryBadge}>
              <Icon name="check" size={12} color={colors.text.inverse} />
              <Text style={styles.discoveryBadgeText}>Discovered</Text>
            </View>
          ) : bite.isMadeAtHome ? (
            <View style={styles.homeCooked}>
              <Icon name="homemade" size={12} color={colors.success.emerald} />
              <Text style={styles.homeCookedText}>Homemade</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.info}>
          <Text variant="h3" numberOfLines={1} style={styles.name}>
            {title}
          </Text>
          
          <View style={styles.cuisineRow}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              {subtitle}
            </Text>
            {!isDiscovery && bite.country && (
              <Caption> • {bite.country}</Caption>
            )}
          </View>

          {isDiscovery ? (
            <Text variant="caption" numberOfLines={2} style={styles.discoveryText}>
              {worldDish?.culturalSignificance}
            </Text>
          ) : (
            renderRating(bite.rating)
          )}

          {!isDiscovery && bite.notes && (
            <Text variant="caption" numberOfLines={2} style={styles.notes}>
              "{bite.notes}"
            </Text>
          )}

          {(bite.recipe || worldDish?.recipe) && (
            <View style={styles.recipeIndicator}>
              <Icon name="recipe" size={12} color={colors.calm.ocean} />
              <Text style={styles.recipeText}>{isDiscovery ? 'Recipe unlocked' : 'Has Recipe'}</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
}) as React.FC<BiteCardProps>;

// Grid item for collection view
export const BiteGridItem: React.FC<{
  bite: Bite;
  onPress?: () => void;
}> = React.memo(({ bite, onPress }) => {
  const worldDish = bite.worldDishId ? getDishById(bite.worldDishId) : undefined;
  const categoryInfo = BITE_CATEGORIES_INFO[worldDish?.category || bite.category] || { icon: 'food', label: 'Food' };
  const imageUrl = worldDish?.imageUrl || bite.photoUrl;
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.gridItem} accessibilityRole="button" accessibilityLabel={worldDish?.name || bite.name}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.gridPhoto}
          contentFit="cover"
          transition={200}
          placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
        />
      ) : (
        <View style={styles.gridPlaceholder}>
          <Icon name={categoryInfo.icon} size={40} color={colors.reward.peachDark} />
        </View>
      )}
      <View style={styles.gridOverlay}>
        {worldDish ? (
          <Text style={styles.gridDiscoveryLabel}>{worldDish.name}</Text>
        ) : (
          <View style={styles.gridRating}>
            {[...Array(Math.round(bite.rating))].map((_, i) => (
              <Icon key={i} name="star" size={10} color={colors.reward.gold} />
            ))}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}) as React.FC<{
  bite: Bite;
  onPress?: () => void;
}>;

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: spacing.md,
  },
  photoContainer: {
    position: 'relative',
    height: 180,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    padding: spacing.xs,
  },
  homeCooked: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.success.honeydew,
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  homeCookedText: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: colors.success.emerald,
  },
  discoveryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.reward.peachDark,
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  discoveryBadgeText: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: colors.text.inverse,
  },
  info: {
    padding: spacing.md,
  },
  name: {
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  cuisineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  starIcon: {
    marginRight: 2,
  },
  notes: {
    fontStyle: 'italic',
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  discoveryText: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  recipeIndicator: {
    backgroundColor: colors.calm.skyLight,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.round,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  recipeText: {
    fontSize: 11,
    fontFamily: 'Nunito-Medium',
    color: colors.calm.ocean,
  },
  // Compact styles
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.lg,
    padding: spacing.sm,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  compactPhoto: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.md,
  },
  compactIcon: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.md,
    backgroundColor: colors.reward.peachLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  compactName: {
    fontFamily: 'Baloo2-Medium',
  },
  // Grid styles
  gridItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  gridPhoto: {
    width: '100%',
    height: '100%',
  },
  gridPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.reward.peachLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: spacing.xs,
  },
  gridRating: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  gridDiscoveryLabel: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: colors.text.inverse,
    textAlign: 'center',
  },
});

export default BiteCard;
