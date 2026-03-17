import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, {
  Rect, Polygon, Circle, Text as SvgText, G, Path, Ellipse, Line,
  Defs, LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  cancelAnimation,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { Text } from '../ui/Text';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { getTimePhase } from '../room/RoomAtmosphere';

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedG = Animated.createAnimatedComponent(G);

type RoomTheme = 'traditional' | 'modern' | 'nature' | 'city' | 'coastal' | 'mountain';

const THEME_COLORS: Record<RoomTheme, {
  wall: string; wallDark: string; roof: string; roofDark: string;
  door: string; accent: string; trim: string;
  landscapeColor: string; landscapeType: 'flowers' | 'bushes' | 'bamboo' | 'vines' | 'palm' | 'pines';
}> = {
  traditional: {
    wall: '#FAE8D0', wallDark: '#E8D4B8', roof: '#C0392B', roofDark: '#962D22',
    door: '#8B4513', accent: '#D4A020', trim: '#D4B896',
    landscapeColor: '#FF6B6B', landscapeType: 'flowers',
  },
  modern: {
    wall: '#ECF0F1', wallDark: '#D5DBDB', roof: '#2C3E50', roofDark: '#1A252F',
    door: '#34495E', accent: '#3498DB', trim: '#BDC3C7',
    landscapeColor: '#27AE60', landscapeType: 'bushes',
  },
  nature: {
    wall: '#E8F5E9', wallDark: '#C8E6C9', roof: '#4CAF50', roofDark: '#388E3C',
    door: '#795548', accent: '#8BC34A', trim: '#A5D6A7',
    landscapeColor: '#66BB6A', landscapeType: 'vines',
  },
  city: {
    wall: '#FFECD2', wallDark: '#FFD8A8', roof: '#E65100', roofDark: '#BF360C',
    door: '#BF360C', accent: '#FF9800', trim: '#FFB74D',
    landscapeColor: '#FF7043', landscapeType: 'flowers',
  },
  coastal: {
    wall: '#E3F2FD', wallDark: '#BBDEFB', roof: '#1565C0', roofDark: '#0D47A1',
    door: '#0D47A1', accent: '#42A5F5', trim: '#90CAF9',
    landscapeColor: '#26A69A', landscapeType: 'palm',
  },
  mountain: {
    wall: '#EFEBE9', wallDark: '#D7CCC8', roof: '#5D4037', roofDark: '#3E2723',
    door: '#3E2723', accent: '#795548', trim: '#BCAAA4',
    landscapeColor: '#4CAF50', landscapeType: 'pines',
  },
};

type SeasonalDecoration = 'lanterns' | 'snowcaps' | 'leaves' | 'flowers' | 'lights' | 'flags';

interface HouseExteriorProps {
  theme: RoomTheme;
  houseName?: string;
  flagEmoji?: string;
  furnitureCount?: number;
  size?: number;
  animated?: boolean;
  seasonalDecoration?: SeasonalDecoration;
}

export const HouseExterior: React.FC<HouseExteriorProps> = React.memo(({
  theme,
  houseName,
  flagEmoji,
  furnitureCount = 0,
  size = 160,
  animated = true,
  seasonalDecoration,
}) => {
  const c = THEME_COLORS[theme] || THEME_COLORS.traditional;
  const w = size;
  const h = size * 0.92;
  const roofH = h * 0.35;
  const wallH = h * 0.45;
  const baseY = roofH;
  const isNight = getTimePhase() === 'night' || getTimePhase() === 'evening';

  const smokeDrift = useSharedValue(0);
  const flagWave = useSharedValue(0);
  const windowGlow = useSharedValue(0);
  const doorAngle = useSharedValue(0);

  useEffect(() => {
    if (!animated) return;

    if (isNight) {
      smokeDrift.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 3000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0, { duration: 3000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1, true,
      );
      windowGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0.6, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1, true,
      );
    }

    flagWave.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        withTiming(-1, { duration: 1200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
      ),
      -1, true,
    );

    return () => {
      cancelAnimation(smokeDrift);
      cancelAnimation(windowGlow);
      cancelAnimation(flagWave);
    };
  }, [animated, isNight]);

  const smokeProps = useAnimatedProps(() => ({
    opacity: interpolate(smokeDrift.value, [0, 1], [0.15, 0.35]),
    cy: interpolate(smokeDrift.value, [0, 1], [roofH * 0.1, roofH * 0.02]),
  }));

  const smoke2Props = useAnimatedProps(() => ({
    opacity: interpolate(smokeDrift.value, [0, 1], [0.1, 0.25]),
    cx: w * 0.74 + interpolate(smokeDrift.value, [0, 1], [0, 4]),
    cy: interpolate(smokeDrift.value, [0, 1], [roofH * 0.05, -roofH * 0.03]),
  }));

  const flagProps = useAnimatedProps(() => ({
    rotation: interpolate(flagWave.value, [-1, 1], [-5, 5]),
  }));

  const windowGlowProps = useAnimatedProps(() => ({
    opacity: isNight ? interpolate(windowGlow.value, [0.6, 1], [0.4, 0.7]) : 0,
  }));

  const renderLandscape = () => {
    const lx1 = w * 0.05;
    const lx2 = w * 0.85;
    const ly = baseY + wallH;

    switch (c.landscapeType) {
      case 'flowers':
        return (
          <G>
            {[lx1, lx1 + 8, lx1 + 16, lx2, lx2 + 8, lx2 + 16].map((x, i) => (
              <G key={i}>
                <Line x1={x + 4} y1={ly} x2={x + 4} y2={ly - 8} stroke="#228B22" strokeWidth={1} />
                <Circle cx={x + 4} cy={ly - 10} r={3} fill={i % 2 === 0 ? c.landscapeColor : '#FFB6C1'} />
              </G>
            ))}
          </G>
        );
      case 'bushes':
        return (
          <G>
            <Ellipse cx={lx1 + 10} cy={ly - 2} rx={12} ry={8} fill="#27AE60" opacity={0.8} />
            <Ellipse cx={lx1 + 14} cy={ly - 4} rx={8} ry={6} fill="#2ECC71" opacity={0.6} />
            <Ellipse cx={lx2 + 10} cy={ly - 2} rx={12} ry={8} fill="#27AE60" opacity={0.8} />
          </G>
        );
      case 'bamboo':
        return (
          <G>
            {[lx1 + 4, lx1 + 10, lx2 + 4, lx2 + 10].map((x, i) => (
              <G key={i}>
                <Line x1={x} y1={ly} x2={x} y2={ly - 18} stroke="#228B22" strokeWidth={2} />
                <Ellipse cx={x + 3} cy={ly - 14} rx={6} ry={3} fill="#66BB6A" />
              </G>
            ))}
          </G>
        );
      case 'pines':
        return (
          <G>
            {[lx1 + 6, lx2 + 8].map((x, i) => (
              <G key={i}>
                <Polygon points={`${x},${ly - 18} ${x - 7},${ly} ${x + 7},${ly}`} fill="#2E7D32" />
                <Polygon points={`${x},${ly - 14} ${x - 5},${ly - 4} ${x + 5},${ly - 4}`} fill="#388E3C" />
                <Rect x={x - 1.5} y={ly - 2} width={3} height={4} fill="#5D4037" />
              </G>
            ))}
          </G>
        );
      case 'palm':
        return (
          <G>
            <Line x1={lx2 + 8} y1={ly} x2={lx2 + 10} y2={ly - 22} stroke="#8D6E63" strokeWidth={2.5} />
            <Path d={`M ${lx2 + 10} ${ly - 22} Q ${lx2 + 20} ${ly - 26} ${lx2 + 24} ${ly - 18}`} stroke="#4CAF50" strokeWidth={2} fill="none" />
            <Path d={`M ${lx2 + 10} ${ly - 22} Q ${lx2} ${ly - 28} ${lx2 - 4} ${ly - 20}`} stroke="#4CAF50" strokeWidth={2} fill="none" />
            <Path d={`M ${lx2 + 10} ${ly - 22} Q ${lx2 + 16} ${ly - 30} ${lx2 + 18} ${ly - 24}`} stroke="#66BB6A" strokeWidth={1.5} fill="none" />
          </G>
        );
      default:
        return (
          <G>
            <Ellipse cx={lx1 + 10} cy={ly - 2} rx={12} ry={8} fill="#66BB6A" opacity={0.7} />
            <Path d={`M ${lx2 + 2} ${ly} Q ${lx2 + 4} ${ly - 12} ${lx2 + 8} ${ly - 16} Q ${lx2 + 10} ${ly - 10} ${lx2 + 14} ${ly}`} fill="#66BB6A" opacity={0.6} />
          </G>
        );
    }
  };

  return (
    <View style={[styles.container, { width: w }]}>
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={c.roof} />
            <Stop offset="100%" stopColor={c.roofDark} />
          </SvgLinearGradient>
          <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={c.wall} />
            <Stop offset="100%" stopColor={c.wallDark} />
          </SvgLinearGradient>
        </Defs>

        {/* Ground shadow */}
        <Ellipse cx={w * 0.5} cy={baseY + wallH + 6} rx={w * 0.5} ry={10} fill="rgba(0,0,0,0.08)" />

        {/* Walkway/path */}
        <Path
          d={`M ${w * 0.42} ${baseY + wallH} Q ${w * 0.45} ${baseY + wallH + 8} ${w * 0.4} ${h} L ${w * 0.6} ${h} Q ${w * 0.55} ${baseY + wallH + 8} ${w * 0.58} ${baseY + wallH}`}
          fill={c.trim}
          opacity={0.5}
        />

        {/* Landscaping */}
        {renderLandscape()}

        {/* Wall with gradient */}
        <Rect x={w * 0.12} y={baseY} width={w * 0.76} height={wallH} fill="url(#wallGrad)" rx={2} />
        {/* Wall trim line */}
        <Line x1={w * 0.12} y1={baseY + wallH * 0.65} x2={w * 0.88} y2={baseY + wallH * 0.65} stroke={c.trim} strokeWidth={1.5} opacity={0.5} />

        {/* Roof with gradient */}
        <Polygon points={`${w * 0.02},${baseY + 2} ${w * 0.5},${roofH * 0.1} ${w * 0.98},${baseY + 2}`} fill="url(#roofGrad)" />
        {/* Roof highlight */}
        <Polygon points={`${w * 0.18},${baseY} ${w * 0.5},${roofH * 0.2} ${w * 0.82},${baseY}`} fill={c.roof} opacity={0.3} />
        {/* Roof edge shadow */}
        <Line x1={w * 0.05} y1={baseY + 2} x2={w * 0.95} y2={baseY + 2} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />

        {/* Chimney */}
        <Rect x={w * 0.7} y={roofH * 0.15} width={w * 0.09} height={roofH * 0.65} fill={c.roofDark} rx={1} />
        <Rect x={w * 0.69} y={roofH * 0.15} width={w * 0.11} height={3} fill={c.roof} rx={1} />

        {/* Chimney smoke (night only) */}
        {isNight && animated && (
          <G>
            <AnimatedEllipse cx={w * 0.745} r={4} fill="rgba(200,200,200,0.5)" animatedProps={smokeProps} />
            <AnimatedEllipse r={3} fill="rgba(200,200,200,0.4)" animatedProps={smoke2Props} />
          </G>
        )}

        {/* Door */}
        <Rect
          x={w * 0.4} y={baseY + wallH * 0.3}
          width={w * 0.2} height={wallH * 0.7}
          fill={c.door} rx={w * 0.1} ry={w * 0.1}
        />
        {/* Door frame */}
        <Rect
          x={w * 0.39} y={baseY + wallH * 0.28}
          width={w * 0.22} height={wallH * 0.72}
          fill="none" stroke={c.trim} strokeWidth={1.5}
          rx={w * 0.1 + 1} ry={w * 0.1 + 1}
        />
        {/* Doorknob */}
        <Circle cx={w * 0.56} cy={baseY + wallH * 0.66} r={2.5} fill={c.accent} />
        <Circle cx={w * 0.557} cy={baseY + wallH * 0.655} r={1} fill="#FFFFFF" opacity={0.5} />

        {/* Windows */}
        {[{ x: 0.17, y: 0.18 }, { x: 0.67, y: 0.18 }].map((win, i) => {
          const wx = w * win.x;
          const wy = baseY + wallH * win.y;
          const ww = w * 0.15;
          const wh = w * 0.13;
          return (
            <G key={i}>
              {/* Window frame */}
              <Rect x={wx - 1} y={wy - 1} width={ww + 2} height={wh + 2} fill={c.trim} rx={2} />
              {/* Glass */}
              <Rect x={wx} y={wy} width={ww} height={wh} fill={isNight ? '#2C3E6B' : '#B3E5FC'} rx={1.5} />
              {/* Night warm glow */}
              {isNight && (
                <AnimatedRect x={wx} y={wy} width={ww} height={wh} fill="#FFD700" rx={1.5} animatedProps={windowGlowProps} />
              )}
              {/* Mullions */}
              <Line x1={wx + ww / 2} y1={wy} x2={wx + ww / 2} y2={wy + wh} stroke="white" strokeWidth={1.2} />
              <Line x1={wx} y1={wy + wh / 2} x2={wx + ww} y2={wy + wh / 2} stroke="white" strokeWidth={1.2} />
              {/* Reflection */}
              <Path
                d={`M ${wx + 2} ${wy + 2} L ${wx + ww * 0.3} ${wy + 2} L ${wx + 2} ${wy + wh * 0.4} Z`}
                fill="#FFFFFF" opacity={0.2}
              />
              {/* Window sill */}
              <Rect x={wx - 2} y={wy + wh} width={ww + 4} height={2.5} fill={c.trim} rx={1} />
            </G>
          );
        })}

        {/* Flag */}
        {flagEmoji && (
          <G>
            <Line x1={w * 0.5} y1={roofH * 0.1} x2={w * 0.5} y2={roofH * 0.1 - 14} stroke="#8B6F4E" strokeWidth={1.5} />
            <SvgText x={w * 0.5} y={roofH * 0.1 - 14} fontSize={12} textAnchor="middle">{flagEmoji}</SvgText>
          </G>
        )}

        {/* Seasonal decorations */}
        {seasonalDecoration === 'snowcaps' && (
          <G>
            <Path d={`M ${w * 0.1} ${roofH} Q ${w * 0.25} ${roofH - 6} ${w * 0.5} ${roofH * 0.06} Q ${w * 0.75} ${roofH - 6} ${w * 0.9} ${roofH}`} fill="#FFFFFF" opacity={0.85} />
            <Ellipse cx={w * 0.2} cy={h * 0.92} rx={w * 0.08} ry={3} fill="#E3F2FD" opacity={0.5} />
            <Ellipse cx={w * 0.8} cy={h * 0.92} rx={w * 0.06} ry={2.5} fill="#E3F2FD" opacity={0.5} />
          </G>
        )}
        {seasonalDecoration === 'lanterns' && (
          <G>
            {[0.2, 0.4, 0.6, 0.8].map((xPct, i) => (
              <G key={`lantern-${i}`}>
                <Line x1={w * xPct} y1={roofH + 2} x2={w * xPct} y2={roofH + 8} stroke="#333" strokeWidth={0.5} />
                <Circle cx={w * xPct} cy={roofH + 12} r={3.5} fill={i % 2 === 0 ? '#FF6B6B' : '#FFD700'} opacity={0.85} />
                <Circle cx={w * xPct} cy={roofH + 12} r={2} fill="#FFF" opacity={0.3} />
              </G>
            ))}
          </G>
        )}
        {seasonalDecoration === 'lights' && (
          <G>
            {[0.15, 0.3, 0.45, 0.6, 0.75, 0.85].map((xPct, i) => (
              <Circle
                key={`light-${i}`}
                cx={w * xPct}
                cy={roofH + 4 + Math.sin(i * 1.2) * 3}
                r={2}
                fill={['#FF6B6B', '#FFD700', '#4FC3F7', '#AB47BC', '#66BB6A', '#FF7043'][i]}
                opacity={0.9}
              />
            ))}
          </G>
        )}
        {seasonalDecoration === 'leaves' && (
          <G>
            {[0.15, 0.35, 0.65, 0.85].map((xPct, i) => (
              <Path
                key={`leaf-${i}`}
                d={`M ${w * xPct} ${roofH + 3} Q ${w * xPct + 4} ${roofH - 2} ${w * xPct + 8} ${roofH + 5} Q ${w * xPct + 4} ${roofH + 6} ${w * xPct} ${roofH + 3}`}
                fill={['#D2691E', '#CD853F', '#DEB887', '#F4A460'][i]}
                opacity={0.7}
                transform={`rotate(${i * 30}, ${w * xPct + 4}, ${roofH + 3})`}
              />
            ))}
          </G>
        )}
        {seasonalDecoration === 'flowers' && (
          <G>
            {[0.18, 0.42, 0.62, 0.82].map((xPct, i) => (
              <G key={`flower-${i}`}>
                <Circle cx={w * xPct} cy={h * 0.88} r={3} fill={['#FF69B4', '#FF6347', '#FFD700', '#9370DB'][i]} opacity={0.8} />
                <Circle cx={w * xPct} cy={h * 0.88} r={1.5} fill="#FFE082" opacity={0.9} />
                <Line x1={w * xPct} y1={h * 0.88 + 3} x2={w * xPct} y2={h * 0.92} stroke="#66BB6A" strokeWidth={1} />
              </G>
            ))}
          </G>
        )}
        {seasonalDecoration === 'flags' && (
          <G>
            {[0.2, 0.5, 0.8].map((xPct, i) => (
              <G key={`sflag-${i}`}>
                <Line x1={w * xPct} y1={roofH - 2} x2={w * xPct} y2={roofH + 6} stroke="#8B6F4E" strokeWidth={0.8} />
                <Polygon
                  points={`${w * xPct},${roofH - 2} ${w * xPct + 7},${roofH} ${w * xPct},${roofH + 2}`}
                  fill={['#FF6B6B', '#4FC3F7', '#FFD700'][i]}
                  opacity={0.8}
                />
              </G>
            ))}
          </G>
        )}
      </Svg>

      {houseName && (
        <View style={styles.nameplate}>
          <Text variant="caption" numberOfLines={1} style={styles.nameplateText}>{houseName}</Text>
        </View>
      )}
    </View>
  );
}) as React.FC<HouseExteriorProps>;

const nameplateShadow = getShadowStyle({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 3,
});
const nameplateElevation = Platform.OS !== 'web' ? { elevation: 2 } : {};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  nameplate: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginTop: -6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    ...nameplateShadow,
    ...nameplateElevation,
  },
  nameplateText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});
