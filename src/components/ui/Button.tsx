import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
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
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const handlePress = () => {
    if (!disabled && !loading) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const getGradientColors = (): [string, string] => {
    if (disabled) return [colors.text.light, colors.text.muted];
    switch (variant) {
      case 'primary':
        return [colors.primary.wisteria, colors.primary.wisteriaDark];
      case 'secondary':
        return [colors.calm.sky, colors.calm.skyDark];
      case 'reward':
        return [colors.reward.peach, colors.reward.gold];
      case 'success':
        return [colors.success.honeydew, colors.success.honeydewDark];
      case 'ghost':
        return [colors.transparent, colors.transparent];
      default:
        return [colors.primary.wisteria, colors.primary.wisteriaDark];
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.inverse;
    switch (variant) {
      case 'ghost':
        return colors.primary.wisteriaDark;
      case 'reward':
        return colors.text.primary;
      case 'success':
        return colors.success.emerald;
      default:
        return colors.text.inverse;
    }
  };

  const sizeStyles = {
    sm: {
      height: spacing.button.sm,
      paddingHorizontal: spacing.md,
      fontSize: typography.sizes.body.sm,
    },
    md: {
      height: spacing.button.md,
      paddingHorizontal: spacing.lg,
      fontSize: typography.sizes.body.md,
    },
    lg: {
      height: spacing.button.lg,
      paddingHorizontal: spacing.xl,
      fontSize: typography.sizes.body.lg,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      activeOpacity={0.9}
      style={[
        animatedStyle,
        fullWidth && styles.fullWidth,
        style,
      ]}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.button,
          {
            height: currentSize.height,
            paddingHorizontal: currentSize.paddingHorizontal,
          },
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
            <Text
              style={[
                styles.text,
                {
                  fontSize: currentSize.fontSize,
                  color: getTextColor(),
                },
                textStyle,
              ]}
            >
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
    borderRadius: spacing.radius.xl,
    shadowColor: colors.shadow.colored,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  ghostButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
    shadowOpacity: 0,
    elevation: 0,
  },
  text: {
    fontFamily: typography.fonts.bodyBold,
    letterSpacing: 0.5,
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
