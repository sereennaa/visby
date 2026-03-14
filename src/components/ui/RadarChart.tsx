import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { colors } from '../../theme/colors';

interface RadarChartProps {
  data: { label: string; value: number; icon?: string }[];
  size?: number;
  color?: string;
  fillColor?: string;
}

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  size = 200,
  color = colors.primary.wisteriaDark,
  fillColor = colors.primary.wisteriaFaded,
}) => {
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

  const gridLevels = [0.33, 0.66, 1.0];
  const gridPolygons = gridLevels.map((level) =>
    Array.from({ length: n }, (_, i) => {
      const p = getPoint(i, radius * level);
      return `${p.x},${p.y}`;
    }).join(' ')
  );

  const dataPoints = data.map((d, i) => {
    const p = getPoint(i, radius * (d.value / 100));
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
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {gridPolygons.map((points, idx) => (
          <Polygon
            key={`grid-${idx}`}
            points={points}
            fill="none"
            stroke={colors.text.light}
            strokeWidth={0.5}
            strokeDasharray="3,3"
          />
        ))}

        {axes.map((axis, idx) => (
          <Line
            key={`axis-${idx}`}
            x1={axis.from.x}
            y1={axis.from.y}
            x2={axis.to.x}
            y2={axis.to.y}
            stroke={colors.text.light}
            strokeWidth={0.5}
          />
        ))}

        <Polygon
          points={dataPoints}
          fill={fillColor}
          fillOpacity={0.4}
          stroke={color}
          strokeWidth={2}
        />

        {data.map((d, i) => {
          const p = getPoint(i, radius * (d.value / 100));
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

        {labels.map((l, idx) => (
          <SvgText
            key={`label-${idx}`}
            x={l.x}
            y={l.y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            fontFamily="Nunito-SemiBold"
            fill={colors.text.secondary}
          >
            {l.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
