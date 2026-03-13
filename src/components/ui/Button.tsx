import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'reward' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 350 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 300 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }
      onPress();
    }
  };

  const getGradientColors = (): [string, string] => {
    if (disabled) return ['#D0D0DC', '#B8B8C8'];
    switch (variant) {
      case 'primary':
        return ['#B8A5E0', '#9B80D0'];
      case 'secondary':
        return ['#E6F2FC', '#C8E4F8'];
      case 'reward':
        return ['#FFE0A8', '#FFD070'];
      case 'success':
        return ['#C8F0CA', '#A0E0A4'];
      case 'ghost':
        return [colors.transparent, colors.transparent];
      default:
        return ['#B8A5E0', '#9B80D0'];
    }
  };

  const getTextColor = () => {
    if (disabled) return '#FFFFFF';
    switch (variant) {
      case 'ghost':
        return colors.primary.wisteriaDark;
      case 'secondary':
        return colors.calm.ocean;
      case 'reward':
        return '#7A5A00';
      case 'success':
        return '#2A7A2A';
      default:
        return '#FFFFFF';
    }
  };

  const sizeStyles = {
    sm: { height: spacing.button.sm, paddingHorizontal: spacing.lg, fontSize: 13 },
    md: { height: spacing.button.md, paddingHorizontal: spacing.xl, fontSize: 15 },
    lg: { height: spacing.button.lg, paddingHorizontal: spacing.xxl, fontSize: 17 },
  };

  const currentSize = sizeStyles[size];

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[animatedStyle, fullWidth && styles.fullWidth, style]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          { height: currentSize.height, paddingHorizontal: currentSize.paddingHorizontal },
          variant === 'ghost' && styles.ghostButton,
          disabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} size="small" />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
            )}
            <Text style={[styles.text, { fontSize: currentSize.fontSize, color: getTextColor() }, textStyle]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Animated.View style={styles.iconRight}>{icon}</Animated.View>
            )}
          </>
        )}
      </LinearGradient>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius.round,
  },
  ghostButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
  },
  text: {
    fontFamily: typography.fonts.headingMedium,
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.6,
  },
  fullWidth: {
    width: '100%',
  },
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },
});

export default Button;
