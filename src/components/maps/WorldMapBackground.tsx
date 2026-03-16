import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

/**
 * Simplified continent outlines in 0–100 viewBox (x ≈ longitude, y ≈ latitude).
 * Shapes suggest real geography so country dots sit on the right landmasses.
 */
const CONTINENT_PATHS: { d: string }[] = [
  // North America (Mexico ~22,37 – left side of continent)
  { d: 'M 6 12 L 18 8 L 28 10 L 36 16 L 38 28 L 36 40 L 30 46 L 20 44 L 12 36 L 8 22 Z' },
  // South America (Brazil 35,56 Peru 29,56 – bulge east, narrow west)
  { d: 'M 20 50 L 26 48 L 36 52 L 40 62 L 38 78 L 34 88 L 26 90 L 20 78 L 18 62 Z' },
  // Europe (UK 49,20 France 51,24 Italy 53,26 Norway 53,16 Greece 56,28)
  { d: 'M 42 12 L 50 10 L 58 14 L 60 22 L 58 32 L 56 38 L 50 40 L 44 36 L 42 24 Z' },
  // Africa (Morocco 48,32 Kenya 61,50 – triangular)
  { d: 'M 44 26 L 52 24 L 60 30 L 62 42 L 60 56 L 54 64 L 46 60 L 44 44 L 44 32 Z' },
  // Asia (Turkey 60,28 Thailand 78,42 Korea 86,30)
  { d: 'M 54 16 L 62 14 L 74 16 L 86 22 L 92 30 L 90 44 L 82 48 L 68 46 L 56 40 L 54 28 Z' },
  // Japan (88,30)
  { d: 'M 84 26 L 90 26 L 91 32 L 86 34 L 83 30 Z' },
  // India
  { d: 'M 64 36 L 72 34 L 74 42 L 70 46 L 65 44 Z' },
  // Australia
  { d: 'M 76 54 L 86 52 L 94 60 L 92 72 L 82 76 L 76 68 Z' },
  // UK & Ireland
  { d: 'M 46 17 L 50 16 L 51 20 L 48 22 L 46 19 Z' },
  // Greenland
  { d: 'M 22 2 L 30 0 L 34 8 L 32 14 L 26 12 Z' },
];

type WorldMapBackgroundProps = {
  width: number;
  height: number;
  oceanColor?: string;
  landColor?: string;
  landStroke?: string;
};

export const WorldMapBackground: React.FC<WorldMapBackgroundProps> = ({
  width,
  height,
  oceanColor = '#B8D4E8',
  landColor = '#E8DDD0',
  landStroke = 'rgba(180,160,140,0.4)',
}) => {
  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Ocean (full rect so gaps between continents are ocean) */}
        <Path d="M 0 0 L 100 0 L 100 100 L 0 100 Z" fill={oceanColor} />
        {/* Land: simplified continents */}
        {CONTINENT_PATHS.map((path, i) => (
          <Path
            key={i}
            d={path.d}
            fill={landColor}
            stroke={landStroke}
            strokeWidth={0.8}
          />
        ))}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, top: 0, overflow: 'hidden' },
});

export default WorldMapBackground;
