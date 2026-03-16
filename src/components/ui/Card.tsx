import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { theme } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'gradient' | 'glow' | 'magic';
  gradientColors?: string[];
  onPress?: () => void;
  padding?: keyof typeof spacing | number;
  borderRadius?: keyof typeof spacing.radius | number;
  style?: StyleProp<ViewStyle>;
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
  const magicGlow = useSharedValue(0);

  useEffect(() => {
    if (variant === 'magic') {
      magicGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0, { duration: 2500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      );
    }
  }, [variant]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const isWeb = Platform.OS === 'web';
  const magicStyle = useAnimatedStyle(() => {
    if (variant !== 'magic') return {};
    const opacity = interpolate(magicGlow.value, [0, 1], [0.15, 0.5]);
    const radius = interpolate(magicGlow.value, [0, 1], [8, 24]);
    if (isWeb) {
      return { boxShadow: `0 0 ${radius}px rgba(199,184,234,${opacity})` };
    }
    return {
      shadowColor: '#C7B8EA',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: interpolate(magicGlow.value, [0, 1], [3, 10]),
    };
  });

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.97, { damping: 15, stiffness: 400 });
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
      case 'magic':
        return {
          backgroundColor: colors.base.cream,
          borderWidth: 1,
          borderColor: 'rgba(199, 184, 234, 0.2)',
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
    padding: getPadding() as number,
    borderRadius: getBorderRadius(),
    ...getVariantStyles(),
  };

  const content = variant === 'gradient' ? (
    <LinearGradient
      colors={(gradientColors ?? [colors.primary.wisteriaFaded, colors.base.cream]) as [string, string]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.gradient, { borderRadius: getBorderRadius(), padding: getPadding() as number }]}
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
        accessibilityRole="button"
        style={[animatedStyle, variant === 'magic' && magicStyle]}
      >
        <View style={[styles.card, cardStyle, variant === 'gradient' && styles.gradientWrapper, style]}>
          {content}
        </View>
      </AnimatedTouchable>
    );
  }

  return (
    <Animated.View style={variant === 'magic' ? magicStyle : undefined}>
      <View style={[styles.card, cardStyle, variant === 'gradient' && styles.gradientWrapper, style]}>
        {content}
      </View>
    </Animated.View>
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
