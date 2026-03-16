// Platform-safe shadow styles. On web, shadow* props are deprecated — use boxShadow.

import { Platform } from 'react-native';
import { ViewStyle } from 'react-native';

type ShadowStyle = {
  shadowColor?: string;
  shadowOffset?: { width: number; height: number };
  shadowOpacity?: number;
  shadowRadius?: number;
  elevation?: number;
};

/**
 * Returns shadow styles that work on both native (shadow* + elevation) and web (boxShadow).
 * Use this instead of spreading theme.shadows.* or raw shadow* in StyleSheet when targeting web.
 */
export function getShadowStyle(style: ShadowStyle): ViewStyle {
  if (Platform.OS !== 'web') {
    return style;
  }
  const { shadowColor = 'rgba(0,0,0,0.25)', shadowOffset, shadowOpacity = 1, shadowRadius = 0 } = style;
  const w = shadowOffset?.width ?? 0;
  const h = shadowOffset?.height ?? 0;
  const r = shadowRadius ?? 0;
  const color = shadowColor.startsWith('rgba') ? shadowColor : `rgba(0,0,0,${shadowOpacity})`;
  return {
    boxShadow: `${w}px ${h}px ${r}px 0 ${color}`,
  };
}
