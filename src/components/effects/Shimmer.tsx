import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Dimensions, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_W } = Dimensions.get('window');

interface ShimmerProps {
  width?: number;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  colors?: string[];
  duration?: number;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width = SCREEN_W,
  height = 200,
  borderRadius = 16,
  style,
  colors = ['transparent', 'rgba(255,255,255,0.15)', 'transparent'],
  duration = 2500,
}) => {
  const translateX = useSharedValue(-width);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(width, { duration, easing: Easing.bezier(0.42, 0, 0.58, 1) }),
      -1,
      false,
    );
  }, [width, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={[{ width, height, borderRadius, overflow: 'hidden' }, style]}>
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <LinearGradient
          colors={colors as [string, string, ...string[]]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ width: width * 0.6, height: '100%' }}
        />
      </Animated.View>
    </View>
  );
};

interface PulseGlowProps {
  children: React.ReactNode;
  color?: string;
  intensity?: number;
  speed?: number;
  style?: ViewStyle;
}

export const PulseGlow: React.FC<PulseGlowProps> = ({
  children,
  color = 'rgba(199, 184, 234, 0.5)',
  intensity = 20,
  speed = 2000,
  style,
}) => {
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withTiming(1, { duration: speed, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      -1,
      true,
    );
  }, [speed]);

  const animatedStyle = useAnimatedStyle(() => {
    const radius = interpolate(glow.value, [0, 1], [intensity * 0.5, intensity]);
    const opacity = interpolate(glow.value, [0, 1], [0.2, 0.7]);
    if (Platform.OS === 'web') {
      return {
        boxShadow: `0 0 ${radius}px rgba(199, 184, 234, ${opacity})`,
      } as any;
    }
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: interpolate(glow.value, [0, 1], [2, 8]),
    };
  });

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
};

interface MagicBorderProps {
  children: React.ReactNode;
  borderRadius?: number;
  borderWidth?: number;
  colors?: string[];
  style?: ViewStyle;
}

export const MagicBorder: React.FC<MagicBorderProps> = ({
  children,
  borderRadius = 24,
  borderWidth = 2,
  colors = ['#C7B8EA', '#FFD700', '#7FBDE8', '#FFB6C1', '#C7B8EA'],
  style,
}) => {
  return (
    <View style={[{ borderRadius, padding: borderWidth }, style]}>
      <LinearGradient
        colors={colors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          StyleSheet.absoluteFill,
          { borderRadius },
        ]}
      />
      <View style={{ borderRadius: borderRadius - borderWidth, overflow: 'hidden' }}>
        {children}
      </View>
    </View>
  );
};

export default Shimmer;
