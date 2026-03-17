import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { colors } from '../../theme/colors';

type TimePhase = 'morning' | 'afternoon' | 'evening' | 'night';

interface SkyConfig {
  gradient: [string, string, string];
  showSun: boolean;
  showMoon: boolean;
  showStars: boolean;
  showClouds: boolean;
  sunY: number;
  tintColor: string;
  tintOpacity: number;
}

const SKY_CONFIGS: Record<TimePhase, SkyConfig> = {
  morning: {
    gradient: ['#FFE4B5', '#87CEEB', '#B0D4F1'],
    showSun: true, showMoon: false, showStars: false, showClouds: true,
    sunY: 20,
    tintColor: 'rgb(255, 200, 100)',
    tintOpacity: 0.03,
  },
  afternoon: {
    gradient: ['#87CEEB', '#B0D4F1', '#E0ECFF'],
    showSun: true, showMoon: false, showStars: false, showClouds: true,
    sunY: 12,
    tintColor: 'rgb(255, 255, 240)',
    tintOpacity: 0.02,
  },
  evening: {
    gradient: ['#FF8C42', '#FF6B6B', '#4A3080'],
    showSun: true, showMoon: false, showStars: true, showClouds: false,
    sunY: 70,
    tintColor: 'rgb(255, 140, 80)',
    tintOpacity: 0.04,
  },
  night: {
    gradient: ['#1A1A3E', '#2D2B55', '#0D0D2B'],
    showSun: false, showMoon: true, showStars: true, showClouds: false,
    sunY: 0,
    tintColor: 'rgb(100, 120, 200)',
    tintOpacity: 0.05,
  },
};

export function getTimePhase(): TimePhase {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 20) return 'evening';
  return 'night';
}

export function getTimeSkyColors(): [string, string, string] {
  return SKY_CONFIGS[getTimePhase()].gradient;
}

export function getTimeTint(): { color: string; opacity: number } {
  const config = SKY_CONFIGS[getTimePhase()];
  return { color: config.tintColor, opacity: config.tintOpacity };
}

interface DynamicWindowProps {
  width: number;
  height: number;
  overrideSky?: readonly (string | undefined)[];
}

export const DynamicWindow: React.FC<DynamicWindowProps> = ({ width, height, overrideSky }) => {
  const phase = getTimePhase();
  const config = SKY_CONFIGS[phase];
  const sky = overrideSky
    ? [overrideSky[0] || config.gradient[0], overrideSky[1] || config.gradient[1], overrideSky[2] || config.gradient[2]]
    : config.gradient;

  const cloudDrift = useSharedValue(0);
  const starTwinkle = useSharedValue(0);

  useEffect(() => {
    if (config.showClouds) {
      cloudDrift.value = withRepeat(
        withTiming(1, { duration: 20000, easing: Easing.linear }),
        -1, false,
      );
    }
    if (config.showStars) {
      starTwinkle.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0.3, { duration: 1500, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1, true,
      );
    }
    return () => {
      cancelAnimation(cloudDrift);
      cancelAnimation(starTwinkle);
    };
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(cloudDrift.value, [0, 1], [-20, 20]) }],
  }));

  const starStyle = useAnimatedStyle(() => ({
    opacity: interpolate(starTwinkle.value, [0.3, 1], [0.3, 1]),
  }));

  return (
    <View style={{ width, height, overflow: 'hidden' }}>
      <LinearGradient
        colors={sky as [string, string, ...string[]]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
      />

      {config.showSun && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Circle cx={width * 0.7} cy={config.sunY} r={12} fill="#FFD700" opacity={0.8} />
          <Circle cx={width * 0.7} cy={config.sunY} r={8} fill="#FFF4B0" opacity={0.6} />
        </Svg>
      )}

      {config.showMoon && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          <Circle cx={width * 0.3} cy={20} r={10} fill="#F5F0E8" />
          <Circle cx={width * 0.3 + 4} cy={18} r={8} fill={sky[0]} />
        </Svg>
      )}

      {config.showStars && (
        <Animated.View style={[StyleSheet.absoluteFill, starStyle]}>
          <Svg width={width} height={height}>
            {[
              { x: 0.15, y: 0.2, r: 1.5 }, { x: 0.35, y: 0.15, r: 1 },
              { x: 0.55, y: 0.3, r: 1.2 }, { x: 0.75, y: 0.1, r: 1.5 },
              { x: 0.85, y: 0.35, r: 1 }, { x: 0.25, y: 0.45, r: 0.8 },
              { x: 0.65, y: 0.5, r: 1 },
            ].map((s, i) => (
              <Circle key={i} cx={width * s.x} cy={height * s.y} r={s.r} fill="#FFFFFF" opacity={0.8} />
            ))}
          </Svg>
        </Animated.View>
      )}

      {config.showClouds && (
        <Animated.View style={[StyleSheet.absoluteFill, cloudStyle]}>
          <Svg width={width} height={height}>
            <Ellipse cx={width * 0.3} cy={height * 0.3} rx={20} ry={8} fill="#FFFFFF" opacity={0.5} />
            <Ellipse cx={width * 0.3 + 10} cy={height * 0.3 - 4} rx={14} ry={6} fill="#FFFFFF" opacity={0.4} />
            <Ellipse cx={width * 0.7} cy={height * 0.5} rx={18} ry={7} fill="#FFFFFF" opacity={0.4} />
            <Ellipse cx={width * 0.7 + 8} cy={height * 0.5 - 3} rx={12} ry={5} fill="#FFFFFF" opacity={0.3} />
          </Svg>
        </Animated.View>
      )}
    </View>
  );
};

interface RoomTintOverlayProps {
  hasLamp?: boolean;
  lampX?: number;
  lampY?: number;
}

export const RoomTintOverlay: React.FC<RoomTintOverlayProps> = ({ hasLamp, lampX = 50, lampY = 50 }) => {
  const tint = getTimeTint();
  const phase = getTimePhase();

  const lampPulse = useSharedValue(0);

  useEffect(() => {
    if (hasLamp && (phase === 'evening' || phase === 'night')) {
      lampPulse.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0.6, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1, true,
      );
    }
    return () => cancelAnimation(lampPulse);
  }, [hasLamp, phase]);

  const lampStyle = useAnimatedStyle(() => ({
    opacity: interpolate(lampPulse.value, [0.6, 1], [0.15, 0.3]),
  }));

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint.color, opacity: tint.opacity }]} />
      {hasLamp && (phase === 'evening' || phase === 'night') && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              left: `${lampX - 15}%` as any,
              top: `${lampY - 10}%` as any,
              width: '30%',
              height: '20%',
              borderRadius: 999,
              backgroundColor: colors.overlay.warmGlow,
            },
            lampStyle,
          ]}
        />
      )}
    </View>
  );
};

interface ParallaxLayerProps {
  children: React.ReactNode;
  depth: number;
  sway: Animated.SharedValue<number>;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({ children, depth, sway }) => {
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: sway.value * depth }],
  }));

  return (
    <Animated.View style={style}>
      {children}
    </Animated.View>
  );
};

export function useRoomParallax() {
  const sway = useSharedValue(0);

  useEffect(() => {
    sway.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(-1, { duration: 4000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );
    return () => cancelAnimation(sway);
  }, []);

  return sway;
}
