import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { useSharedValue, withSpring, cancelAnimation } from 'react-native-reanimated';

let Gyroscope: any = null;
try {
  Gyroscope = require('expo-sensors').Gyroscope;
} catch {}

const SPRING_CONFIG = { damping: 20, stiffness: 60, mass: 0.5 };
const SENSITIVITY = 8;
const MAX_TILT = 12;

export function useDeviceParallax(enabled = true) {
  const tiltX = useSharedValue(0);
  const tiltY = useSharedValue(0);
  const subRef = useRef<any>(null);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web' || !Gyroscope) return;

    let accX = 0;
    let accY = 0;

    Gyroscope.setUpdateInterval(50);

    subRef.current = Gyroscope.addListener(({ x, y }: { x: number; y: number; z: number }) => {
      accX = Math.max(-MAX_TILT, Math.min(MAX_TILT, accX + y * SENSITIVITY));
      accY = Math.max(-MAX_TILT, Math.min(MAX_TILT, accY + x * SENSITIVITY));

      tiltX.value = withSpring(accX, SPRING_CONFIG);
      tiltY.value = withSpring(accY, SPRING_CONFIG);
    });

    return () => {
      subRef.current?.remove();
      cancelAnimation(tiltX);
      cancelAnimation(tiltY);
    };
  }, [enabled]);

  return { tiltX, tiltY };
}

export function useParallaxStyle(
  tiltX: { value: number },
  tiltY: { value: number },
  depth: number,
) {
  const { useAnimatedStyle, interpolate } = require('react-native-reanimated');

  return useAnimatedStyle(() => ({
    transform: [
      { translateX: tiltX.value * depth },
      { translateY: tiltY.value * depth },
    ],
  }));
}
