import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { Text, Heading } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface CountryArrivalCinematicProps {
  countryName: string;
  countryEmoji: string;
  accentColor: string;
  onComplete: () => void;
  isFirstVisit?: boolean;
}

const TRAIL_DOTS = 16;

export const CountryArrivalCinematic: React.FC<CountryArrivalCinematicProps> = ({
  countryName,
  countryEmoji,
  accentColor,
  onComplete,
  isFirstVisit = true,
}) => {
  const bgOpacity = useSharedValue(0);
  const trailProgress = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const nameOpacity = useSharedValue(0);
  const nameSlide = useSharedValue(40);
  const subtitleOpacity = useSharedValue(0);
  const brushStroke = useSharedValue(0);
  const exitProgress = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const planeProgress = useSharedValue(0);

  useEffect(() => {
    hapticService.press();

    bgOpacity.value = withTiming(1, { duration: 300 });

    planeProgress.value = withDelay(100, withTiming(1, {
      duration: 1400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }));

    trailProgress.value = withDelay(100, withTiming(1, {
      duration: 1200,
      easing: Easing.out(Easing.cubic),
    }));

    emojiScale.value = withDelay(1000, withSpring(1, {
      damping: 6,
      stiffness: 120,
    }));

    brushStroke.value = withDelay(1100, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    }));

    nameOpacity.value = withDelay(1200, withTiming(1, { duration: 400 }));
    nameSlide.value = withDelay(1200, withSpring(0, { damping: 12 }));

    subtitleOpacity.value = withDelay(1500, withTiming(1, { duration: 300 }));

    sparkleOpacity.value = withDelay(1000, withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.6, { duration: 400 }),
      withTiming(0.8, { duration: 300 }),
    ));

    exitProgress.value = withDelay(3000, withTiming(1, {
      duration: 500,
      easing: Easing.in(Easing.cubic),
    }));

    const timer = setTimeout(() => onComplete(), 3500);
    return () => clearTimeout(timer);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(exitProgress.value, [0, 1], [bgOpacity.value, 0]),
    transform: [{ scale: interpolate(exitProgress.value, [0, 1], [1, 1.1]) }],
  }));

  const trailStyle = useAnimatedStyle(() => ({
    opacity: interpolate(trailProgress.value, [0, 0.1, 1], [0, 1, 1]),
  }));

  const planeStyle = useAnimatedStyle(() => {
    const x = interpolate(planeProgress.value, [0, 1], [SCREEN_W * 0.15, SCREEN_W * 0.5]);
    const y = interpolate(planeProgress.value,
      [0, 0.3, 0.6, 1],
      [SCREEN_H * 0.45, SCREEN_H * 0.33, SCREEN_H * 0.36, SCREEN_H * 0.4],
    );
    const rotate = interpolate(planeProgress.value,
      [0, 0.3, 0.6, 1],
      [-20, -10, 5, 0],
    );
    return {
      position: 'absolute' as const,
      left: x - 15,
      top: y - 15,
      opacity: interpolate(planeProgress.value, [0, 0.1, 0.8, 1], [0, 1, 1, 0]),
      transform: [{ rotate: `${rotate}deg` }, { scale: 1.2 }],
    };
  });

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const nameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameSlide.value }],
  }));

  const brushStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: brushStroke.value }],
    opacity: brushStroke.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={['rgba(25, 20, 40, 0.96)', accentColor + 'DD', 'rgba(20, 15, 35, 0.97)']}
        style={styles.gradient}
      >
        {/* Trail dots */}
        <Animated.View style={[styles.trailContainer, trailStyle]}>
          {Array.from({ length: TRAIL_DOTS }, (_, i) => (
            <TrailDot key={i} index={i} progress={trailProgress} accentColor={accentColor} />
          ))}
        </Animated.View>

        {/* Plane */}
        <Animated.View style={planeStyle}>
          <Text style={{ fontSize: 28 }}>✈️</Text>
        </Animated.View>

        {/* Sparkles around arrival */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ArrivalSparkle key={`sparkle_${i}`} index={i} trigger={sparkleOpacity} accentColor={accentColor} />
        ))}

        {/* Country emoji */}
        <Animated.View style={[styles.emojiWrap, emojiStyle]}>
          <Text style={styles.emoji}>{countryEmoji}</Text>
        </Animated.View>

        {/* Brush stroke underline */}
        <Animated.View style={[styles.brushStroke, { backgroundColor: accentColor }, brushStyle]} />

        {/* Country name */}
        <Animated.View style={nameStyle}>
          <Heading level={1} style={styles.countryName}>{countryName}</Heading>
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleStyle}>
          <Text variant="body" style={styles.subtitle}>
            {isFirstVisit ? 'A new adventure begins!' : `Welcome back to ${countryName}!`}
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
};

const TrailDot: React.FC<{
  index: number;
  progress: { value: number };
  accentColor: string;
}> = ({ index, progress, accentColor }) => {
  const threshold = index / TRAIL_DOTS;
  const x = interpolateTrailX(index);
  const y = interpolateTrailY(index);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const visible = p > threshold;
    return {
      position: 'absolute' as const,
      left: x,
      top: y,
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: accentColor,
      opacity: visible ? interpolate(p, [threshold, Math.min(threshold + 0.1, 1)], [0, 0.6]) : 0,
      transform: [{ scale: visible ? 1 : 0 }],
    };
  });

  return <Animated.View style={style} />;
};

function interpolateTrailX(index: number): number {
  const t = index / TRAIL_DOTS;
  return SCREEN_W * 0.15 + t * SCREEN_W * 0.55 + Math.sin(t * Math.PI * 2) * 20;
}

function interpolateTrailY(index: number): number {
  const t = index / TRAIL_DOTS;
  const base = SCREEN_H * 0.45;
  return base - Math.sin(t * Math.PI) * SCREEN_H * 0.08 + Math.cos(t * Math.PI * 3) * 8;
}

const ArrivalSparkle: React.FC<{
  index: number;
  trigger: { value: number };
  accentColor: string;
}> = ({ index, trigger, accentColor }) => {
  const angle = (index / 6) * Math.PI * 2;
  const dist = useMemo(() => 60 + Math.random() * 30, []);
  const centerX = SCREEN_W / 2;
  const centerY = SCREEN_H * 0.42;

  const style = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: centerX + Math.cos(angle) * dist * trigger.value,
    top: centerY + Math.sin(angle) * dist * trigger.value,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: index % 2 === 0 ? '#FFD700' : accentColor,
    opacity: trigger.value * 0.7,
    transform: [{ scale: interpolate(trigger.value, [0, 0.5, 1], [0, 1.3, 0.8]) }],
  }));

  return <Animated.View style={style} />;
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
  },
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  trailContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  emojiWrap: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emoji: { fontSize: 50 },
  brushStroke: {
    width: 120,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  countryName: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});
