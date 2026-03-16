import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { getCountryOutlinePath } from '../../config/countryOutlines';

type CountryOutlineProps = {
  countryId: string;
  width: number;
  height: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
};

/** Renders a simplified country outline in 0–100 viewBox; pin positions use the same space. */
export const CountryOutline: React.FC<CountryOutlineProps> = ({
  countryId,
  width,
  height,
  fill = 'rgba(255,255,255,0.95)',
  stroke = 'rgba(184,165,224,0.4)',
  strokeWidth = 2,
}) => {
  const pathD = getCountryOutlinePath(countryId);
  if (!pathD) {
    return null;
  }
  return (
    <View style={[styles.wrap, { width, height }]}>
      <Svg width={width} height={height} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d={pathD} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
});

export default CountryOutline;
