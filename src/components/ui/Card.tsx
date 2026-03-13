import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glow';
  gradientColors?: string[];
  onPress?: () => void;
  padding?: keyof typeof spacing | number;
  borderRadius?: keyof typeof spacing.radius | number;
  style?: ViewStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  gradientColors,
  onPress,
  padding = 'cardPadding',
  borderRadius = 'lg',
  style,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98, { damping: 15, stiffness: 400 });
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const getPadding = () => {
    if (typeof padding === 'number') return padding;
    return spacing[padding] || spacing.cardPadding;
  };

  const getBorderRadius = () => {
    if (typeof borderRadius === 'number') return borderRadius;
    return spacing.radius[borderRadius] || spacing.radius.lg;
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          ...theme.shadows.medium,
          backgroundColor: colors.base.cream,
        };
      case 'glow':
        return {
          ...theme.shadows.glow,
          backgroundColor: colors.base.cream,
        };
      case 'gradient':
        return {};
      default:
        return {
          ...theme.shadows.soft,
          backgroundColor: colors.base.cream,
        };
    }
  };

  const cardStyle: ViewStyle = {
    padding: getPadding(),
    borderRadius: getBorderRadius(),
    ...getVariantStyles(),
  };

  const content = variant === 'gradient' ? (
    <LinearGradient
      colors={gradientColors || [colors.primary.wisteriaFaded, colors.base.cream]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { borderRadius: getBorderRadius(), padding: getPadding() }]}
    >
      {children}
    </LinearGradient>
  ) : (
    children
  );

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[animatedStyle]}
      >
        <View style={[styles.card, cardStyle, variant === 'gradient' && styles.gradientWrapper, style]}>
          {content}
        </View>
      </AnimatedTouchable>
    );
  }

  return (
    <View style={[styles.card, cardStyle, variant === 'gradient' && styles.gradientWrapper, style]}>
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  gradientWrapper: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  gradient: {
    width: '100%',
  },
});

export default Card;
