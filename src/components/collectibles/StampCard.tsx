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
import { Icon, IconName } from '../ui/Icon';
import { Stamp, StampType } from '../../types';
import { STAMP_TYPES_INFO } from '../../config/constants';

interface StampCardProps {
  stamp: Stamp;
  onPress?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const StampCard: React.FC<StampCardProps> = React.memo(({
  stamp,
  onPress,
  size = 'md',
}) => {
  const scale = useSharedValue(1);
  const typeInfo = STAMP_TYPES_INFO[stamp.type] || { icon: 'location' as IconName, label: 'Location', color: colors.primary.wisteria };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const sizeStyles = {
    sm: { width: 100, height: 120, iconSize: 28, padding: spacing.sm },
    md: { width: 140, height: 170, iconSize: 36, padding: spacing.md },
    lg: { width: 180, height: 220, iconSize: 48, padding: spacing.lg },
  };

  const currentSize = sizeStyles[size];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={stamp.locationName || `${stamp.city}, ${stamp.country}`}
    >
      <View style={[styles.card, { width: currentSize.width, height: currentSize.height }]}>
        {/* Stamp border design */}
        <View style={styles.stampBorder}>
          <LinearGradient
            colors={[typeInfo.color, colors.base.cream]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Photo or icon display */}
            {stamp.photoUrl ? (
              <Image
                source={{ uri: stamp.photoUrl }}
                style={styles.photo}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: typeInfo.color + '30' }]}>
                <Icon 
                  name={typeInfo.icon} 
                  size={currentSize.iconSize} 
                  color={typeInfo.color} 
                />
              </View>
            )}

            {/* Location info */}
            <View style={[styles.info, { padding: currentSize.padding }]}>
              <Text
                variant="bodySmall"
                numberOfLines={1}
                style={styles.locationName}
              >
                {stamp.locationName}
              </Text>
              <Caption numberOfLines={1} style={styles.cityCountry}>
                {stamp.source === 'learning' ? stamp.country : `${stamp.city}, ${stamp.country}`}
              </Caption>
              <Caption style={styles.date}>{formatDate(stamp.collectedAt)}</Caption>
            </View>

            {/* Source indicator */}
            {stamp.source === 'learning' ? (
              <View style={styles.sourceBadge}>
                <Icon name="book" size={12} color={colors.primary.wisteria} />
              </View>
            ) : stamp.isFastTravel ? (
              <View style={styles.fastTravelBadge}>
                <Icon name="airplane" size={12} color={colors.calm.ocean} />
              </View>
            ) : (
              <View style={styles.sourceBadge}>
                <Icon name="location" size={12} color={colors.calm.ocean} />
              </View>
            )}
          </LinearGradient>
        </View>

        {/* Stamp perforations decoration */}
        <View style={styles.perforationsTop}>
          {[...Array(Math.floor(currentSize.width / 12))].map((_, i) => (
            <View key={i} style={styles.perforation} />
          ))}
        </View>
        <View style={styles.perforationsBottom}>
          {[...Array(Math.floor(currentSize.width / 12))].map((_, i) => (
            <View key={i} style={styles.perforation} />
          ))}
        </View>
      </View>
    </AnimatedTouchable>
  );
}) as React.FC<StampCardProps>;

// Mini stamp for lists
export const StampMini: React.FC<{ type: StampType; count: number; onPress?: () => void }> = React.memo(({
  type,
  count,
  onPress,
}) => {
  const typeInfo = STAMP_TYPES_INFO[type];
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.miniContainer}>
      <View style={[styles.miniStamp, { backgroundColor: typeInfo.color + '30' }]}>
        <Icon name={typeInfo.icon} size={28} color={typeInfo.color} />
      </View>
      <Text variant="bodySmall" style={styles.miniLabel}>{typeInfo.label}</Text>
      <Text variant="caption" color={colors.text.muted}>{count}</Text>
    </TouchableOpacity>
  );
}) as React.FC<{ type: StampType; count: number; onPress?: () => void }>;

const styles = StyleSheet.create({
  card: {
    position: 'relative',
  },
  stampBorder: {
    flex: 1,
    borderRadius: spacing.radius.md,
    overflow: 'hidden',
    backgroundColor: colors.base.cream,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  gradient: {
    flex: 1,
  },
  photo: {
    width: '100%',
    height: '55%',
  },
  iconContainer: {
    width: '100%',
    height: '55%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  locationName: {
    fontFamily: 'Baloo2-SemiBold',
    color: colors.text.primary,
    marginBottom: 2,
  },
  cityCountry: {
    color: colors.text.secondary,
  },
  date: {
    color: colors.text.muted,
    marginTop: 4,
  },
  fastTravelBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    padding: 4,
  },
  sourceBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    padding: 4,
  },
  perforationsTop: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  perforationsBottom: {
    position: 'absolute',
    bottom: -4,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  perforation: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.base.parchment,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  // Mini stamp styles
  miniContainer: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  miniStamp: {
    width: 56,
    height: 56,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  miniLabel: {
    color: colors.text.primary,
    marginBottom: 2,
  },
});

export default StampCard;
