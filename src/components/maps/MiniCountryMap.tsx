import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { getCountryOutlinePath } from '../../config/countryOutlines';

type MiniCountryMapProps = {
  countryId: string;
  /** Pin position in 0-100 percent (same as country map) */
  pinXPercent: number;
  pinYPercent: number;
  size?: number;
  accentColor?: string;
};

/** Small country outline with a single dot for "Where is this?" context. */
export const MiniCountryMap: React.FC<MiniCountryMapProps> = ({
  countryId,
  pinXPercent,
  pinYPercent,
  size = 140,
  accentColor = 'rgba(184,165,224,0.4)',
}) => {
  const pathD = getCountryOutlinePath(countryId);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.5, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    position: 'absolute' as const,
    left: (pinXPercent / 100) * size - 8 * pulse.value,
    top: (pinYPercent / 100) * size - 8 * pulse.value,
    width: 16 * pulse.value,
    height: 16 * pulse.value,
    borderRadius: 8 * pulse.value,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  }));

  if (!pathD) {
    return null;
  }
  const dotR = 5;
  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox="0 0 100 100" preserveAspectRatio="none">
        <Path d={pathD} fill={accentColor} stroke="rgba(184,165,224,0.6)" strokeWidth={1.5} />
        <Circle cx={pinXPercent} cy={pinYPercent} r={dotR} fill="#8B5CF6" stroke="#FFF" strokeWidth={2} />
      </Svg>
      <Animated.View style={pulseStyle} pointerEvents="none" />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', borderRadius: 12, position: 'relative' },
});

export default MiniCountryMap;
