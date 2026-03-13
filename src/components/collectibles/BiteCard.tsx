import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
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

interface BiteCardProps {
  bite: Bite;
  onPress?: () => void;
  variant?: 'default' | 'compact';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const BiteCard: React.FC<BiteCardProps> = ({
  bite,
  onPress,
  variant = 'default',
}) => {
  const scale = useSharedValue(1);
  const categoryInfo = BITE_CATEGORIES_INFO[bite.category] || { icon: 'food', label: 'Food' };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
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
      >
        <View style={styles.compactCard}>
          {bite.photoUrl ? (
            <Image source={{ uri: bite.photoUrl }} style={styles.compactPhoto} />
          ) : (
            <View style={styles.compactIcon}>
              <Icon name={categoryInfo.icon} size={24} color={colors.reward.peachDark} />
            </View>
          )}
          <View style={styles.compactInfo}>
            <Text variant="bodySmall" numberOfLines={1} style={styles.compactName}>
              {bite.name}
            </Text>
            <Caption numberOfLines={1}>{bite.cuisine}</Caption>
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
    >
      <View style={styles.card}>
        {/* Photo section */}
        <View style={styles.photoContainer}>
          {bite.photoUrl ? (
            <Image source={{ uri: bite.photoUrl }} style={styles.photo} />
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

          {/* Home cooked badge */}
          {bite.isMadeAtHome && (
            <View style={styles.homeCooked}>
              <Icon name="homemade" size={12} color={colors.success.emerald} />
              <Text style={styles.homeCookedText}>Homemade</Text>
            </View>
          )}
        </View>

        {/* Info section */}
        <View style={styles.info}>
          <Text variant="h3" numberOfLines={1} style={styles.name}>
            {bite.name}
          </Text>
          
          <View style={styles.cuisineRow}>
            <Text variant="bodySmall" color={colors.text.secondary}>
              {bite.cuisine}
            </Text>
            {bite.country && (
              <Caption> • {bite.country}</Caption>
            )}
          </View>

          {renderRating(bite.rating)}

          {bite.notes && (
            <Text variant="caption" numberOfLines={2} style={styles.notes}>
              "{bite.notes}"
            </Text>
          )}

          {/* Recipe indicator */}
          {bite.recipe && (
            <View style={styles.recipeIndicator}>
              <Icon name="recipe" size={12} color={colors.calm.ocean} />
              <Text style={styles.recipeText}>Has Recipe</Text>
            </View>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// Grid item for collection view
export const BiteGridItem: React.FC<{
  bite: Bite;
  onPress?: () => void;
}> = ({ bite, onPress }) => {
  const categoryInfo = BITE_CATEGORIES_INFO[bite.category];
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.gridItem}>
      {bite.photoUrl ? (
        <Image source={{ uri: bite.photoUrl }} style={styles.gridPhoto} />
      ) : (
        <View style={styles.gridPlaceholder}>
          <Icon name={categoryInfo.icon} size={40} color={colors.reward.peachDark} />
        </View>
      )}
      <View style={styles.gridOverlay}>
        <View style={styles.gridRating}>
          {[...Array(Math.round(bite.rating))].map((_, i) => (
            <Icon key={i} name="star" size={10} color={colors.reward.gold} />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

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
    resizeMode: 'cover',
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
});

export default BiteCard;
