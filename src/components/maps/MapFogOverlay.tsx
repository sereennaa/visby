import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, Mask, Rect, Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Pin = {
  xPercent: number;
  yPercent: number;
  visited: boolean;
};

type MapFogOverlayProps = {
  pins: Pin[];
  width: number;
  height: number;
  pinSize: number;
  fogColor?: string;
  fogOpacity?: number;
  clearRadius?: number;
};

/**
 * Fog of war overlay: a semi-transparent layer with circular cutouts around visited pins.
 * Unvisited areas stay dimmed. Cutouts animate in when pins are visited.
 */
export const MapFogOverlay: React.FC<MapFogOverlayProps> = ({
  pins,
  width,
  height,
  pinSize,
  fogColor = colors.base.parchment,
  fogOpacity = 0.45,
  clearRadius = 18,
}) => {
  if (pins.length === 0) return null;

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      <Defs>
        <Mask id="fogMask">
          {/* White = visible fog, black = cleared area */}
          <Rect x="0" y="0" width={width} height={height} fill="white" />
          {pins.map((pin, i) => (
            <FogCutout
              key={i}
              cx={(pin.xPercent / 100) * (width - pinSize) + pinSize / 2}
              cy={(pin.yPercent / 100) * (height - pinSize) + pinSize / 2}
              visited={pin.visited}
              radius={clearRadius}
              delay={i * 100}
            />
          ))}
        </Mask>
      </Defs>

      <Rect
        x="0"
        y="0"
        width={width}
        height={height}
        fill={fogColor}
        opacity={fogOpacity}
        mask="url(#fogMask)"
      />
    </Svg>
  );
};

const FogCutout: React.FC<{
  cx: number;
  cy: number;
  visited: boolean;
  radius: number;
  delay: number;
}> = ({ cx, cy, visited, radius, delay }) => {
  const r = useSharedValue(visited ? radius : radius * 0.4);

  useEffect(() => {
    const targetR = visited ? radius : radius * 0.4;
    r.value = withDelay(
      delay,
      withTiming(targetR, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
  }, [visited, radius, delay]);

  const props = useAnimatedProps(() => ({
    r: r.value,
  }));

  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      fill="black"
      animatedProps={props}
    />
  );
};

export default MapFogOverlay;
