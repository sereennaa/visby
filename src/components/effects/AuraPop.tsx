import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const PARTICLE_COUNT = 8;
const DURATION = 600;

interface AuraPopProps {
  visible: boolean;
  onComplete?: () => void;
  color?: string;
}

export const AuraPop: React.FC<AuraPopProps> = ({
  visible,
  onComplete,
  color = colors.reward.gold,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!visible) return;
    scale.value = 0;
    opacity.value = 1;
    scale.value = withSequence(
      withTiming(1.2, { duration: DURATION * 0.4, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: DURATION * 0.2 })
    );
    opacity.value = withDelay(
      DURATION * 0.5,
      withTiming(0, { duration: DURATION * 0.5 }, (finished) => {
        if (finished && onComplete) runOnJS(onComplete)();
      })
    );
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (i / PARTICLE_COUNT) * 2 * Math.PI;
        return (
          <View
            key={i}
            style={[
              styles.particle,
              {
                backgroundColor: color,
                transform: [
                  { translateX: Math.cos(angle) * 24 },
                  { translateY: Math.sin(angle) * 24 },
                ],
              },
            ]}
          />
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
