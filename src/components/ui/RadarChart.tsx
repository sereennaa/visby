import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';

const MIN_RADIUS_RATIO = 0.08; // When value is 0, show a small hexagon so the chart isn't a dot

interface RadarChartProps {
  data: { label: string; value: number; icon?: string }[];
  size?: number;
  color?: string;
  fillColor?: string;
  /** Animate entrance (scale + opacity) over 600ms */
  animated?: boolean;
  /** Animate data shape scaling in over 800ms */
  animateFill?: boolean;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 200,
  color = colors.primary.wisteriaDark,
  fillColor = colors.primary.wisteriaFaded,
  animated = true,
  animateFill = true,
}) => {
  const scale = useSharedValue(animated ? 0.8 : 1);
  const opacity = useSharedValue(animated ? 0 : 1);
  const dataScale = useSharedValue(animateFill ? 0 : 1);

  useEffect(() => {
    if (animated) {
      scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
      opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    }
  }, [animated]);

  useEffect(() => {
    if (animateFill) {
      dataScale.value = 0;
      dataScale.value = withDelay(400, withTiming(1, { duration: 800, easing: Easing.out(Easing.cubic) }));
    }
  }, [animateFill, data]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const dataLayerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dataScale.value }],
  }));

  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const n = data.length;

  const getPoint = (i: number, r: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const dataRadius = (v: number) => Math.max(MIN_RADIUS_RATIO, v / 100) * radius;

  const gridLevels = [0.33, 0.66, 1.0];
  const gridPolygons = gridLevels.map((level) =>
    Array.from({ length: n }, (_, i) => {
      const p = getPoint(i, radius * level);
      return `${p.x},${p.y}`;
    }).join(' ')
  );

  const dataPoints = data.map((d, i) => {
    const p = getPoint(i, dataRadius(d.value));
    return `${p.x},${p.y}`;
  }).join(' ');

  const axes = Array.from({ length: n }, (_, i) => ({
    from: { x: center, y: center },
    to: getPoint(i, radius),
  }));

  const labels = data.map((d, i) => {
    const p = getPoint(i, radius + 18);
    return { ...d, ...p };
  });

  return (
    <Animated.View style={[styles.container, { width: size, height: size }, animatedStyle]}>
      {/* Background: grid, axes, labels, soft glow */}
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Defs>
          <RadialGradient id="radarFill" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <Stop offset="0%" stopColor={colors.primary.wisteriaLight} stopOpacity="0.45" />
            <Stop offset="70%" stopColor={fillColor} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={fillColor} stopOpacity="0.08" />
          </RadialGradient>
        </Defs>
        <Polygon points={dataPoints} fill="url(#radarFill)" />
        {gridPolygons.map((points, idx) => (
          <Polygon
            key={`grid-${idx}`}
            points={points}
            fill="none"
            stroke={colors.primary.wisteriaLight}
            strokeWidth={1}
            strokeDasharray="4,4"
          />
        ))}
        {axes.map((axis, idx) => (
          <Line
            key={`axis-${idx}`}
            x1={axis.from.x}
            y1={axis.from.y}
            x2={axis.to.x}
            y2={axis.to.y}
            stroke={colors.primary.wisteriaFaded}
            strokeWidth={1}
          />
        ))}
        {labels.map((l, idx) => (
          <SvgText
            key={`label-${idx}`}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={11}
            fontFamily="Nunito-SemiBold"
            fill={colors.text.secondary}
          >
            {l.label}
          </SvgText>
        ))}
      </Svg>
      {/* Data layer: polygon + points, scales in */}
      <Animated.View style={[StyleSheet.absoluteFill, styles.dataLayer, dataLayerStyle, { pointerEvents: 'none' }]}>
        <Svg width={size} height={size}>
          <Polygon
            points={dataPoints}
            fill={fillColor}
            fillOpacity={0.5}
            stroke={color}
            strokeWidth={2}
          />
          {data.map((d, i) => {
            const p = getPoint(i, dataRadius(d.value));
            return (
              <Circle
                key={`point-${i}`}
                cx={p.x}
                cy={p.y}
                r={4}
                fill={color}
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            );
          })}
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dataLayer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
