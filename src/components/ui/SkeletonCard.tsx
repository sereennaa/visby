import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Shimmer } from '../effects/Shimmer';

interface SkeletonCardProps {
  width?: number;
  height?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = 160,
  height = 200,
  style,
}) => (
  <View style={[styles.card, { width, height }, style]}>
    <View style={styles.placeholder} />
    <Shimmer
      width={width}
      height={height}
      borderRadius={16}
      style={styles.shimmerOverlay}
    />
  </View>
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.surface.cardWarm,
    position: 'relative',
  },
  placeholder: {
    flex: 1,
    backgroundColor: colors.base.parchment,
    opacity: 0.6,
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
});
