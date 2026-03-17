import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Path,
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
  Circle,
  Text as SvgText,
  G,
  Rect,
  Line,
  Polygon,
} from 'react-native-svg';
import { Text as RNText } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';

// Equirectangular projection: x = (lon+180)/360*100, y = (90-lat)/180*100
const CONTINENT_PATHS: { d: string; id: string }[] = [
  {
    id: 'north_america',
    d: 'M 4 12 Q 3 14 4 17 Q 8 20 12 23 Q 14 26 16 30 Q 18 34 20 37 Q 22 41 24 42 L 26 39 L 25 35 Q 27 36 28 34 Q 30 31 30 27 L 31 23 Q 32 19 33 17 Q 29 15 27 16 Q 26 14 25 11 Q 19 10 12 11 Q 7 11 4 12 Z',
  },
  {
    id: 'south_america',
    d: 'M 28 46 Q 31 44 35 45 Q 39 47 40 52 Q 40 58 38 64 Q 36 71 33 77 L 30 81 Q 29 78 28 72 Q 27 65 27 57 Q 27 51 28 46 Z',
  },
  {
    id: 'europe',
    d: 'M 48 14 Q 51 12 54 13 Q 56 14 57 17 Q 57 20 57 23 Q 57 26 57 29 L 55 30 Q 53 29 51 30 Q 49 29 48 27 Q 47 24 47 20 Q 47 17 48 14 Z',
  },
  {
    id: 'africa',
    d: 'M 47 31 Q 51 30 55 30 Q 58 31 60 34 Q 62 39 63 45 Q 63 51 61 57 Q 59 63 57 68 Q 55 70 53 68 Q 52 64 51 58 Q 49 52 48 47 Q 46 42 46 37 Q 46 33 47 31 Z',
  },
  {
    id: 'asia',
    d: 'M 59 27 Q 60 21 62 16 Q 65 12 70 10 Q 77 8 83 10 Q 89 13 92 17 Q 95 20 93 23 L 89 26 Q 87 28 85 31 Q 83 34 81 37 Q 79 41 78 45 Q 76 48 74 46 Q 71 42 68 37 Q 65 34 62 35 Q 60 33 59 27 Z',
  },
  {
    id: 'india',
    d: 'M 68 34 Q 71 33 74 35 Q 76 39 74 44 Q 72 47 70 46 Q 67 42 67 38 Q 67 36 68 34 Z',
  },
  {
    id: 'japan_isle',
    d: 'M 87 24 Q 89 23 90 26 Q 91 29 90 32 Q 88 34 87 31 Q 86 28 87 24 Z',
  },
  {
    id: 'australia',
    d: 'M 82 57 Q 86 55 90 57 Q 93 60 93 65 Q 92 70 89 72 Q 86 73 83 72 Q 81 69 80 65 Q 80 60 82 57 Z',
  },
  {
    id: 'uk_ireland',
    d: 'M 48 17 Q 49 16 50 17 Q 50 20 49 21 Q 48 21 47 20 Q 47 18 48 17 Z',
  },
  {
    id: 'greenland',
    d: 'M 37 14 Q 36 10 37 6 Q 39 3 42 4 Q 45 6 44 11 Q 43 14 40 15 Q 38 15 37 14 Z',
  },
];

const LANDMARK_ICONS: { x: number; y: number; icon: string; label: string }[] = [
  { x: 51, y: 23, icon: '🗼', label: 'Paris' },
  { x: 89, y: 30, icon: '⛩️', label: 'Tokyo' },
  { x: 59, y: 33, icon: '🏺', label: 'Cairo' },
  { x: 29, y: 27, icon: '🗽', label: 'NYC' },
  { x: 71, y: 35, icon: '🕌', label: 'Delhi' },
  { x: 38, y: 63, icon: '🎭', label: 'Rio' },
  { x: 91, y: 68, icon: '🦘', label: 'Sydney' },
  { x: 60, y: 51, icon: '🦁', label: 'Nairobi' },
  { x: 53, y: 17, icon: '🏔️', label: 'Oslo' },
  { x: 78, y: 42, icon: '🏯', label: 'Bangkok' },
];

const OCEAN_LABELS: { x: number; y: number; text: string; rotate: number }[] = [
  { x: 12, y: 55, text: 'Pacific Ocean', rotate: -12 },
  { x: 38, y: 36, text: 'Atlantic', rotate: -8 },
  { x: 70, y: 60, text: 'Indian Ocean', rotate: 5 },
  { x: 96, y: 40, text: 'Pacific', rotate: -5 },
];

const CONTINENT_LABELS: { x: number; y: number; text: string; fontSize: number }[] = [
  { x: 17, y: 28, text: 'North America', fontSize: 2.2 },
  { x: 33, y: 62, text: 'South America', fontSize: 2 },
  { x: 52, y: 21, text: 'Europe', fontSize: 1.8 },
  { x: 54, y: 48, text: 'Africa', fontSize: 2.2 },
  { x: 75, y: 24, text: 'Asia', fontSize: 2.5 },
  { x: 88, y: 66, text: 'Oceania', fontSize: 1.8 },
  { x: 50, y: 96, text: 'Antarctica', fontSize: 1.6 },
];

const SEA_CREATURES: { x: number; y: number; emoji: string; size: number }[] = [
  { x: 10, y: 70, emoji: '🐋', size: 3 },
  { x: 66, y: 75, emoji: '🐙', size: 2.5 },
  { x: 37, y: 34, emoji: '⛵', size: 2 },
  { x: 96, y: 50, emoji: '🐠', size: 2 },
];

type WorldMapBackgroundProps = {
  width: number;
  height: number;
  oceanColor?: string;
  landColor?: string;
  landStroke?: string;
};

const BobbingCreature = React.memo<{ x: number; y: number; emoji: string; fontSize: number; mapWidth: number; mapHeight: number; delay: number }>(
  ({ x, y, emoji, fontSize, mapWidth, mapHeight, delay }) => {
    const bob = useSharedValue(0);
    useEffect(() => {
      bob.value = withRepeat(
        withTiming(1, { duration: 2400 + delay * 800, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      );
    }, []);
    const style = useAnimatedStyle(() => ({
      transform: [{ translateY: interpolate(bob.value, [0, 1], [-2, 2]) }],
    }));
    return (
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: (x / 100) * mapWidth - fontSize * 2,
            top: (y / 100) * mapHeight - fontSize * 2,
          },
          style,
        ]}
        pointerEvents="none"
      >
        <RNText style={{ fontSize: fontSize * 4, opacity: 0.35 }}>{emoji}</RNText>
      </Animated.View>
    );
  },
);

const DriftingCloud = React.memo<{ startX: number; y: number; size: number; delay: number; mapWidth: number }>(
  ({ startX, y, size, delay, mapWidth }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withRepeat(
        withTiming(1, { duration: 30000 + delay * 10000, easing: Easing.linear }),
        -1,
        false,
      );
    }, []);

    const style = useAnimatedStyle(() => ({
      transform: [{ translateX: interpolate(progress.value, [0, 1], [-20, mapWidth + 20]) }],
      opacity: interpolate(progress.value, [0, 0.1, 0.9, 1], [0, 0.25, 0.25, 0]),
    }));

    return (
      <Animated.View style={[{ position: 'absolute', top: y, left: startX }, style]}>
        <View style={{
          width: size,
          height: size * 0.4,
          borderRadius: size * 0.2,
          backgroundColor: 'rgba(255,255,255,0.35)',
        }} />
      </Animated.View>
    );
  },
);

export const WorldMapBackground: React.FC<WorldMapBackgroundProps> = ({
  width,
  height,
  oceanColor = '#C8D9E6',
  landColor = '#E8DCC8',
  landStroke = 'rgba(160,140,110,0.5)',
}) => {
  const clouds = useMemo(() => [
    { startX: -40, y: height * 0.12, size: 60, delay: 0 },
    { startX: -80, y: height * 0.35, size: 45, delay: 1.2 },
    { startX: -60, y: height * 0.65, size: 55, delay: 0.6 },
    { startX: -100, y: height * 0.85, size: 50, delay: 1.8 },
  ], [height]);

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          <SvgLinearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#B5CBE0" />
            <Stop offset="0.5" stopColor={oceanColor} />
            <Stop offset="1" stopColor="#A8C4D8" />
          </SvgLinearGradient>
          <SvgLinearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#F0E6D4" />
            <Stop offset="0.5" stopColor={landColor} />
            <Stop offset="1" stopColor="#DDD0BC" />
          </SvgLinearGradient>
          <RadialGradient id="parchmentGlow" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor="rgba(255,248,230,0.15)" />
            <Stop offset="1" stopColor="rgba(0,0,0,0)" />
          </RadialGradient>
        </Defs>

        {/* Ocean with parchment gradient */}
        <Rect x="0" y="0" width="100" height="100" fill="url(#oceanGrad)" />
        <Rect x="0" y="0" width="100" height="100" fill="url(#parchmentGlow)" />

        {/* Subtle wave pattern lines */}
        {[20, 40, 60, 80].map((y) => (
          <Path
            key={`wave_${y}`}
            d={`M 0 ${y} Q 12 ${y - 1.5} 25 ${y} Q 38 ${y + 1.5} 50 ${y} Q 62 ${y - 1.5} 75 ${y} Q 88 ${y + 1.5} 100 ${y}`}
            stroke="rgba(130,160,190,0.12)"
            strokeWidth={0.3}
            fill="none"
          />
        ))}

        {/* Land: organic continent shapes with gradient fill */}
        {CONTINENT_PATHS.map((path) => (
          <Path
            key={path.id}
            d={path.d}
            fill="url(#landGrad)"
            stroke={landStroke}
            strokeWidth={0.6}
            strokeLinejoin="round"
          />
        ))}

        {/* Equator line */}
        <Line x1="0" y1="50" x2="100" y2="50" stroke="rgba(180,100,80,0.15)" strokeWidth={0.25} strokeDasharray="2,1.5" />
        <SvgText x="96" y="49" textAnchor="end" fontSize="1.3" fill="rgba(180,100,80,0.25)">Equator</SvgText>

        {/* Continent labels */}
        {CONTINENT_LABELS.map((label) => (
          <SvgText
            key={label.text}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            fontSize={label.fontSize}
            fill="rgba(120,100,70,0.3)"
            fontWeight="bold"
            letterSpacing={0.5}
          >
            {label.text}
          </SvgText>
        ))}

        {/* Compass rose (bottom-left corner, absolute coords to avoid G transform NaN on web) */}
        <Circle cx={8} cy={88} r={5} fill="rgba(180,160,130,0.2)" stroke="rgba(160,140,110,0.4)" strokeWidth={0.3} />
        <Polygon points="8,83.5 8.8,88 8,89 7.2,88" fill="#B8956A" />
        <Polygon points="8,92.5 8.8,88 8,87 7.2,88" fill="#D4B896" />
        <Polygon points="3.5,88 8,88.8 9,88 8,87.2" fill="#D4B896" />
        <Polygon points="12.5,88 8,88.8 7,88 8,87.2" fill="#B8956A" />
        <SvgText x={8} y={82.2} textAnchor="middle" fontSize="2" fill="#8B7355" fontWeight="bold">N</SvgText>
        <SvgText x={8} y={95.2} textAnchor="middle" fontSize="1.5" fill="#8B7355">S</SvgText>
        <SvgText x={2} y={88.5} textAnchor="middle" fontSize="1.5" fill="#8B7355">W</SvgText>
        <SvgText x={14} y={88.5} textAnchor="middle" fontSize="1.5" fill="#8B7355">E</SvgText>

        {/* Ocean labels in italic style */}
        {OCEAN_LABELS.map((label) => (
          <SvgText
            key={label.text}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            fontSize="2.2"
            fill="rgba(80,110,140,0.3)"
            fontStyle="italic"
            rotation={label.rotate}
            origin={`${label.x}, ${label.y}`}
          >
            {label.text}
          </SvgText>
        ))}

        {/* Sea creatures rendered as bobbing overlay outside SVG */}

        {/* Landmark icons on countries */}
        {LANDMARK_ICONS.map((lm, i) => (
          <G key={`lm_${i}`}>
            <SvgText x={lm.x} y={lm.y} fontSize="3.5" textAnchor="middle" opacity={0.5}>
              {lm.icon}
            </SvgText>
          </G>
        ))}

        {/* Dotted ship routes between some countries */}
        <Line x1="34" y1="32" x2="46" y2="31" stroke="rgba(160,140,110,0.2)" strokeWidth={0.3} strokeDasharray="1,1" />
        <Line x1="50" y1="30" x2="58" y2="33" stroke="rgba(160,140,110,0.2)" strokeWidth={0.3} strokeDasharray="1,1" />
        <Line x1="64" y1="48" x2="78" y2="50" stroke="rgba(160,140,110,0.2)" strokeWidth={0.3} strokeDasharray="1,1" />

        {/* Parchment border vignette */}
        <Rect
          x="0" y="0" width="100" height="100"
          fill="none"
          stroke="rgba(140,120,90,0.15)"
          strokeWidth={2}
        />
      </Svg>

      {/* Drifting cloud overlays */}
      {clouds.map((c, i) => (
        <DriftingCloud key={i} {...c} mapWidth={width} />
      ))}

      {/* Bobbing sea creatures */}
      {SEA_CREATURES.map((c, i) => (
        <BobbingCreature key={`bob_${i}`} x={c.x} y={c.y} emoji={c.emoji} fontSize={c.size} mapWidth={width} mapHeight={height} delay={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});

export default WorldMapBackground;
