import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Text } from './Text';
import { Icon, IconName } from './Icon';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: IconName;
  rightIcon?: IconName;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(colors.base.parchment);
  const shadowOpacity = useSharedValue(0);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.primary.wisteria, { duration: 200 });
    shadowOpacity.value = withTiming(0.3, { duration: 200 });
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(
      error ? colors.status.error : colors.base.parchment,
      { duration: 200 }
    );
    shadowOpacity.value = withTiming(0, { duration: 200 });
    onBlur?.(e);
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}
      
      <Animated.View
        style={[
          styles.container,
          animatedContainerStyle,
          error && styles.errorContainer,
        ]}
      >
        {leftIcon && (
          <View style={styles.leftIcon}>
            <Icon name={leftIcon} size={20} color={colors.text.muted} />
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            rightIcon && styles.inputWithRightIcon,
            // Fix iOS autofill yellow background
            { backgroundColor: 'transparent' },
            style,
          ]}
          placeholderTextColor={colors.text.muted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          // Disable iOS strong password autofill that causes yellow background
          textContentType={props.textContentType || 'none'}
          autoComplete={props.autoComplete || 'off'}
          spellCheck={props.spellCheck ?? false}
          autoCorrect={props.autoCorrect ?? false}
          {...props}
        />
        
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIcon}
            disabled={!onRightIconPress}
          >
            <Icon name={rightIcon} size={20} color={colors.text.muted} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {(error || hint) && (
        <Text
          variant="caption"
          style={[styles.helperText, error && styles.errorText] as any}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.lg,
    borderWidth: 2,
    borderColor: colors.base.parchment,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 0,
  },
  errorContainer: {
    borderColor: colors.status.error,
  },
  input: {
    flex: 1,
    height: spacing.button.md,
    paddingHorizontal: spacing.md,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body.md,
    color: colors.text.primary,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: spacing.xs,
  },
  leftIcon: {
    marginLeft: spacing.md,
  },
  rightIcon: {
    marginRight: spacing.md,
    padding: spacing.xs,
  },
  helperText: {
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorText: {
    color: colors.status.error,
  },
});

export default Input;
