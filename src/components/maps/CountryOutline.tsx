import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  Defs,
  Path,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Pattern,
  Line,
  ClipPath,
  G,
} from 'react-native-svg';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { colors } from '../../theme/colors';

type CountryOutlineProps = {
  countryId: string;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  accentColor?: string;
  showOcean?: boolean;
  showGrid?: boolean;
  showGlow?: boolean;
};

export const CountryOutline: React.FC<CountryOutlineProps> = ({
  countryId,
  width,
  height,
  fill,
  stroke,
  strokeWidth = 2,
  accentColor = colors.primary.wisteria,
  showOcean = true,
  showGrid = true,
  showGlow = true,
}) => {
  const pathD = getCountryOutlinePath(countryId);
  if (!pathD) return null;

  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Defs>
          {/* Ocean gradient background */}
          <RadialGradient id="oceanGrad" cx="50%" cy="50%" rx="60%" ry="60%">
            <Stop offset="0%" stopColor={colors.calm.skyLight} stopOpacity="0.6" />
            <Stop offset="70%" stopColor={colors.calm.sky} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={colors.journey.mapOcean} stopOpacity="0.15" />
          </RadialGradient>

          {/* Land gradient fill (top-to-bottom warmth) */}
          <SvgLinearGradient id="landGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
            <Stop offset="50%" stopColor={accentColor} stopOpacity="0.4" />
            <Stop offset="100%" stopColor={accentColor} stopOpacity="0.55" />
          </SvgLinearGradient>

          {/* Inner glow for the land */}
          <RadialGradient id="landGlow" cx="50%" cy="45%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <Stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.05" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </RadialGradient>

          {/* Grid pattern for texture */}
          <Pattern id="gridPattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
            <Line x1="0" y1="4" x2="8" y2="4" stroke={accentColor} strokeWidth="0.15" strokeOpacity="0.2" />
            <Line x1="4" y1="0" x2="4" y2="8" stroke={accentColor} strokeWidth="0.15" strokeOpacity="0.12" />
          </Pattern>

          {/* Clip path for inner effects */}
          <ClipPath id="countryClip">
            <Path d={pathD} />
          </ClipPath>

          {/* Stroke gradient for the outline */}
          <SvgLinearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor={accentColor} stopOpacity="0.8" />
            <Stop offset="50%" stopColor={accentColor} stopOpacity="0.5" />
            <Stop offset="100%" stopColor={accentColor} stopOpacity="0.7" />
          </SvgLinearGradient>
        </Defs>

        {/* Ocean background */}
        {showOcean && (
          <Rect x="0" y="0" width="100" height="100" fill="url(#oceanGrad)" />
        )}

        {/* Main land fill with gradient */}
        <Path
          d={pathD}
          fill={fill || 'url(#landGrad)'}
          stroke="url(#strokeGrad)"
          strokeWidth={strokeWidth}
          strokeLinejoin="round"
        />

        {/* Grid texture clipped to country shape */}
        {showGrid && (
          <G clipPath="url(#countryClip)">
            <Rect x="0" y="0" width="100" height="100" fill="url(#gridPattern)" />
          </G>
        )}

        {/* Inner glow clipped to country shape */}
        {showGlow && (
          <G clipPath="url(#countryClip)">
            <Rect x="0" y="0" width="100" height="100" fill="url(#landGlow)" />
          </G>
        )}

        {/* Soft outer shadow via a slightly larger, blurred duplicate */}
        <Path
          d={pathD}
          fill="none"
          stroke={accentColor}
          strokeWidth={4}
          strokeOpacity={0.08}
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});

export default CountryOutline;
