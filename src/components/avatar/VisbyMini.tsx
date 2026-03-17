import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Ellipse, Path, G, Defs, RadialGradient, Stop } from 'react-native-svg';

interface VisbyMiniProps {
  size?: number;
}

/**
 * Compact head-only version of the Visby mascot for inline use
 * (footpath markers, flying animations, etc.)
 */
export const VisbyMini: React.FC<VisbyMiniProps> = ({ size = 28 }) => {
  const skin = '#FFAD6B';
  const skinL = '#FFC48C';
  const hair = '#B8875A';
  const hairL = '#D4A876';
  const eye = '#2A1A0A';

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 60 60">
        <Defs>
          <RadialGradient id="vmBg" cx="40%" cy="35%" r="62%">
            <Stop offset="0%" stopColor={skinL} />
            <Stop offset="100%" stopColor={skin} />
          </RadialGradient>
          <RadialGradient id="vmBl" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor="#FF8899" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#FF8899" stopOpacity={0} />
          </RadialGradient>
        </Defs>

        {/* Head */}
        <Ellipse cx={30} cy={32} rx={24} ry={22} fill={skin} />
        <Ellipse cx={30} cy={32} rx={24} ry={22} fill="url(#vmBg)" />

        {/* Ears */}
        <Circle cx={8} cy={26} r={5} fill={skin} />
        <Circle cx={8} cy={26} r={3} fill={skinL} />
        <Circle cx={52} cy={26} r={5} fill={skin} />
        <Circle cx={52} cy={26} r={3} fill={skinL} />

        {/* Hair tufts */}
        <Path d="M 10 22 Q 16 28 14 33" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path d="M 10 22 Q 15 26 14 30" stroke={hairL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Path d="M 50 22 Q 44 28 46 33" stroke={hair} strokeWidth={5} fill="none" strokeLinecap="round" />
        <Path d="M 50 22 Q 45 26 46 30" stroke={hairL} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <Path d="M 20 18 Q 19 23 20 27" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />
        <Path d="M 40 18 Q 41 23 40 27" stroke={hair} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Blush */}
        <Circle cx={14} cy={36} r={6} fill="url(#vmBl)" />
        <Circle cx={46} cy={36} r={6} fill="url(#vmBl)" />

        {/* Eyes */}
        <G>
          <Circle cx={21} cy={30} r={5} fill="#FFFFFF" />
          <Circle cx={21} cy={31} r={3.2} fill={eye} />
          <Circle cx={19.5} cy={28.5} r={1.8} fill="#FFFFFF" />
          <Circle cx={39} cy={30} r={5} fill="#FFFFFF" />
          <Circle cx={39} cy={31} r={3.2} fill={eye} />
          <Circle cx={37.5} cy={28.5} r={1.8} fill="#FFFFFF" />
        </G>

        {/* Mouth */}
        <Path d="M 25 39 Q 30 44 35 39" stroke="#C06050" strokeWidth={1.8} fill="none" strokeLinecap="round" />
      </Svg>
    </View>
  );
};

export default VisbyMini;
