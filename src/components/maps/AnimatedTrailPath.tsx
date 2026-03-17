import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Pin = {
  xPercent: number;
  yPercent: number;
};

type AnimatedTrailPathProps = {
  pins: Pin[];
  width: number;
  height: number;
  pinSize: number;
  accentColor?: string;
};

function getBezierMidpoint(x1: number, y1: number, x2: number, y2: number): { cx: number; cy: number } {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offset = dist * 0.15;
  return { cx: mx - dy / dist * offset, cy: my + dx / dist * offset };
}

function pinToCoord(pin: Pin, w: number, h: number, pinSize: number): { x: number; y: number } {
  return {
    x: (pin.xPercent / 100) * (w - pinSize) + pinSize / 2,
    y: (pin.yPercent / 100) * (h - pinSize) + pinSize / 2,
  };
}

/**
 * Animated trail paths between map pins.
 * Draws bezier curves that animate on mount, with a walking dot that traverses the path.
 */
export const AnimatedTrailPath: React.FC<AnimatedTrailPathProps> = ({
  pins,
  width,
  height,
  pinSize,
  accentColor = colors.primary.wisteria,
}) => {
  const segments = useMemo(() => {
    if (pins.length < 2) return [];
    return pins.slice(0, -1).map((pin, i) => {
      const p1 = pinToCoord(pin, width, height, pinSize);
      const p2 = pinToCoord(pins[i + 1], width, height, pinSize);
      const mid = getBezierMidpoint(p1.x, p1.y, p2.x, p2.y);
      const d = `M ${p1.x} ${p1.y} Q ${mid.cx} ${mid.cy} ${p2.x} ${p2.y}`;
      const approxLen = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2) * 1.15;
      return { d, len: approxLen, p1, p2, mid };
    });
  }, [pins, width, height, pinSize]);

  if (segments.length === 0) return null;

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      <Defs>
        <LinearGradient id="trailGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor={accentColor} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={accentColor} stopOpacity="0.2" />
        </LinearGradient>
      </Defs>

      {segments.map((seg, i) => (
        <TrailSegment
          key={i}
          d={seg.d}
          length={seg.len}
          delay={i * 400}
          accentColor={accentColor}
          p1={seg.p1}
          p2={seg.p2}
          mid={seg.mid}
        />
      ))}

      {/* Walking dot that traverses the full path */}
      {segments.length > 0 && (
        <WalkingDot
          segments={segments}
          totalDelay={segments.length * 400 + 800}
          color={accentColor}
        />
      )}

      {/* Footstep dots at intervals along each segment */}
      {segments.map((seg, i) => (
        <FootstepDots key={`feet-${i}`} p1={seg.p1} p2={seg.p2} mid={seg.mid} color={accentColor} />
      ))}
    </Svg>
  );
};

const TrailSegment: React.FC<{
  d: string;
  length: number;
  delay: number;
  accentColor: string;
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  mid: { cx: number; cy: number };
}> = ({ d, length, delay, accentColor }) => {
  const drawProgress = useSharedValue(0);

  useEffect(() => {
    drawProgress.value = withDelay(
      delay,
      withTiming(1, { duration: 800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
    );
    return () => cancelAnimation(drawProgress);
  }, [delay]);

  const pathProps = useAnimatedProps(() => ({
    strokeDashoffset: length * (1 - drawProgress.value),
  }));

  return (
    <>
      {/* Background soft trail */}
      <Path
        d={d}
        stroke={accentColor}
        strokeWidth={6}
        strokeOpacity={0.06}
        fill="none"
        strokeLinecap="round"
      />
      {/* Main animated trail */}
      <AnimatedPath
        d={d}
        stroke={accentColor}
        strokeWidth={2.5}
        strokeOpacity={0.35}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${length}`}
        animatedProps={pathProps}
      />
      {/* Dotted overlay */}
      <Path
        d={d}
        stroke={accentColor}
        strokeWidth={1}
        strokeOpacity={0.2}
        fill="none"
        strokeLinecap="round"
        strokeDasharray="4,8"
      />
    </>
  );
};

const FootstepDots: React.FC<{
  p1: { x: number; y: number };
  p2: { x: number; y: number };
  mid: { cx: number; cy: number };
  color: string;
}> = ({ p1, p2, mid, color }) => {
  const dots = useMemo(() => {
    const count = 5;
    return Array.from({ length: count }, (_, i) => {
      const t = (i + 1) / (count + 1);
      const x = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * mid.cx + t * t * p2.x;
      const y = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * mid.cy + t * t * p2.y;
      return { x, y, r: i % 2 === 0 ? 1.8 : 1.4 };
    });
  }, [p1, p2, mid]);

  return (
    <>
      {dots.map((dot, i) => (
        <Circle
          key={i}
          cx={dot.x}
          cy={dot.y}
          r={dot.r}
          fill={color}
          opacity={0.15}
        />
      ))}
    </>
  );
};

const WalkingDot: React.FC<{
  segments: { p1: { x: number; y: number }; p2: { x: number; y: number }; mid: { cx: number; cy: number } }[];
  totalDelay: number;
  color: string;
}> = ({ segments, totalDelay, color }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      totalDelay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 4000 * segments.length, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400 }),
        ),
        -1,
        false,
      ),
    );
    return () => cancelAnimation(progress);
  }, [totalDelay, segments.length]);

  const dotProps = useAnimatedProps(() => {
    const totalSegs = segments.length;
    const segIdx = Math.min(Math.floor(progress.value * totalSegs), totalSegs - 1);
    const seg = segments[segIdx];
    const localT = (progress.value * totalSegs) - segIdx;
    const t = Math.max(0, Math.min(1, localT));

    const x = (1 - t) * (1 - t) * seg.p1.x + 2 * (1 - t) * t * seg.mid.cx + t * t * seg.p2.x;
    const y = (1 - t) * (1 - t) * seg.p1.y + 2 * (1 - t) * t * seg.mid.cy + t * t * seg.p2.y;

    return { cx: x, cy: y };
  });

  const glowProps = useAnimatedProps(() => {
    const totalSegs = segments.length;
    const segIdx = Math.min(Math.floor(progress.value * totalSegs), totalSegs - 1);
    const seg = segments[segIdx];
    const localT = (progress.value * totalSegs) - segIdx;
    const t = Math.max(0, Math.min(1, localT));

    const x = (1 - t) * (1 - t) * seg.p1.x + 2 * (1 - t) * t * seg.mid.cx + t * t * seg.p2.x;
    const y = (1 - t) * (1 - t) * seg.p1.y + 2 * (1 - t) * t * seg.mid.cy + t * t * seg.p2.y;

    return { cx: x, cy: y };
  });

  return (
    <>
      <AnimatedCircle
        r={6}
        fill={color}
        opacity={0.12}
        animatedProps={glowProps}
      />
      <AnimatedCircle
        r={3}
        fill={color}
        opacity={0.5}
        animatedProps={dotProps}
      />
      <AnimatedCircle
        r={1.5}
        fill="#FFFFFF"
        opacity={0.8}
        animatedProps={dotProps}
      />
    </>
  );
};

export default AnimatedTrailPath;
