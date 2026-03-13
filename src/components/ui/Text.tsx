import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography, textStyles } from '../../theme/typography';

interface TextProps {
  children: React.ReactNode;
  variant?:
    | 'heroTitle'
    | 'displayTitle'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'bodyLarge'
    | 'body'
    | 'bodySmall'
    | 'label'
    | 'caption';
  color?: string;
  align?: 'left' | 'center' | 'right';
  style?: TextStyle;
  numberOfLines?: number;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  color,
  align = 'left',
  style,
  numberOfLines,
}) => {
  const getVariantStyle = (): TextStyle => {
    const variantStyles = textStyles[variant];
    return variantStyles as TextStyle;
  };

  const getDefaultColor = () => {
    if (color) return color;
    switch (variant) {
      case 'heroTitle':
      case 'displayTitle':
      case 'h1':
        return colors.text.primary;
      case 'h2':
      case 'h3':
        return colors.text.primary;
      case 'label':
        return colors.text.secondary;
      case 'caption':
        return colors.text.muted;
      default:
        return colors.text.primary;
    }
  };

  return (
    <RNText
      style={[
        getVariantStyle(),
        { color: getDefaultColor(), textAlign: align },
        style,
      ]}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};

// Specific text components for convenience
export const Heading: React.FC<Omit<TextProps, 'variant'> & { level?: 1 | 2 | 3 }> = ({
  level = 1,
  ...props
}) => {
  const variant = `h${level}` as 'h1' | 'h2' | 'h3';
  return <Text variant={variant} {...props} />;
};

export const DisplayText: React.FC<Omit<TextProps, 'variant'> & { hero?: boolean }> = ({
  hero = false,
  ...props
}) => {
  return <Text variant={hero ? 'heroTitle' : 'displayTitle'} {...props} />;
};

export const Label: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  return <Text variant="label" {...props} />;
};

export const Caption: React.FC<Omit<TextProps, 'variant'>> = (props) => {
  return <Text variant="caption" {...props} />;
};

export default Text;
