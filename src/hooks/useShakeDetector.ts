import { useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

let Accelerometer: any = null;
try {
  Accelerometer = require('expo-sensors').Accelerometer;
} catch {}

const SHAKE_THRESHOLD = 2.5;
const SHAKE_TIMEOUT = 1000;
const COOLDOWN = 3000;

export function useShakeDetector(onShake: () => void, enabled = true) {
  const lastShakeRef = useRef(0);
  const subRef = useRef<any>(null);

  const handleShake = useCallback(() => {
    const now = Date.now();
    if (now - lastShakeRef.current < COOLDOWN) return;
    lastShakeRef.current = now;
    onShake();
  }, [onShake]);

  useEffect(() => {
    if (!enabled || Platform.OS === 'web' || !Accelerometer) return;

    Accelerometer.setUpdateInterval(100);

    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;
    let lastTime = Date.now();

    subRef.current = Accelerometer.addListener(
      ({ x, y, z }: { x: number; y: number; z: number }) => {
        const now = Date.now();
        const dt = now - lastTime;
        if (dt < 80) return;
        lastTime = now;

        const dx = Math.abs(x - lastX);
        const dy = Math.abs(y - lastY);
        const dz = Math.abs(z - lastZ);
        const total = dx + dy + dz;

        lastX = x;
        lastY = y;
        lastZ = z;

        if (total > SHAKE_THRESHOLD) {
          handleShake();
        }
      },
    );

    return () => {
      subRef.current?.remove();
    };
  }, [enabled, handleShake]);
}
