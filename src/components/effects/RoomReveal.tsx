import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface RoomRevealProps {
  onComplete: () => void;
  wallColor?: string;
  roomName?: string;
  objectCount?: number;
}

const SPARKLE_COUNT = 8;

export const RoomReveal: React.FC<RoomRevealProps> = ({
  onComplete,
  wallColor = colors.room.wallDefault,
  roomName,
  objectCount = 5,
}) => {
  const darkness = useSharedValue(1);
  const warmGlow = useSharedValue(0);
  const objectRevealProgress = useSharedValue(0);
  const exitOpacity = useSharedValue(1);

  useEffect(() => {
    hapticService.tap();

    darkness.value = withDelay(200, withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    }));

    warmGlow.value = withDelay(300, withSequence(
      withTiming(0.6, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(0.15, { duration: 700, easing: Easing.inOut(Easing.cubic) }),
      withTiming(0, { duration: 400 }),
    ));

    objectRevealProgress.value = withDelay(600, withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    }));

    exitOpacity.value = withDelay(1800, withTiming(0, {
      duration: 400,
      easing: Easing.in(Easing.cubic),
    }));

    const timer = setTimeout(onComplete, 2200);
    return () => clearTimeout(timer);
  }, []);

  const darknessStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(15, 12, 25, ${darkness.value * 0.85})`,
    opacity: exitOpacity.value,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: warmGlow.value,
    transform: [{ scale: interpolate(warmGlow.value, [0, 0.6], [0.5, 1.5]) }],
  }));

  return (
    <Animated.View style={[styles.container, darknessStyle]} pointerEvents="none">
      <Animated.View style={[styles.warmGlow, glowStyle]} />
      {Array.from({ length: SPARKLE_COUNT }, (_, i) => (
        <RevealSparkle
          key={i}
          index={i}
          progress={objectRevealProgress}
          exitOpacity={exitOpacity}
        />
      ))}
    </Animated.View>
  );
};

const RevealSparkle: React.FC<{
  index: number;
  progress: { value: number };
  exitOpacity: { value: number };
}> = ({ index, progress, exitOpacity }) => {
  const angle = (index / SPARKLE_COUNT) * Math.PI * 2;
  const dist = useMemo(() => 80 + Math.random() * 60, []);
  const centerX = SCREEN_W / 2;
  const centerY = SCREEN_H * 0.4;
  const size = useMemo(() => 3 + Math.random() * 4, []);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    const threshold = index / SPARKLE_COUNT;
    const visible = p > threshold * 0.5;
    return {
      position: 'absolute' as const,
      left: centerX + Math.cos(angle) * dist * (visible ? p : 0),
      top: centerY + Math.sin(angle) * dist * (visible ? p : 0),
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: index % 2 === 0 ? colors.overlay.warmGlow : 'rgba(255, 215, 0, 0.6)',
      opacity: visible ? interpolate(p, [threshold * 0.5, threshold * 0.5 + 0.2, 0.8, 1], [0, 0.8, 0.6, 0]) * exitOpacity.value : 0,
    };
  });

  return <Animated.View style={style} />;
};

export function useRoomReveal() {
  const [showReveal, setShowReveal] = React.useState(false);
  const [revealedRooms, setRevealedRooms] = React.useState<Set<string>>(new Set());

  const triggerReveal = React.useCallback((roomKey: string) => {
    if (revealedRooms.has(roomKey)) return false;
    setShowReveal(true);
    return true;
  }, [revealedRooms]);

  const completeReveal = React.useCallback((roomKey: string) => {
    setShowReveal(false);
    setRevealedRooms((prev) => new Set([...prev, roomKey]));
  }, []);

  return { showReveal, triggerReveal, completeReveal };
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9998,
    justifyContent: 'center',
    alignItems: 'center',
  },
  warmGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: colors.overlay.warmGlow,
  },
});
