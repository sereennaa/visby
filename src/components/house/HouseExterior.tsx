import React, { useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import Svg, {
  Rect, Polygon, Circle, Text as SvgText, G, Path, Ellipse, Line,
  Defs, LinearGradient as SvgLinearGradient, Stop,
} from 'react-native-svg';
import Animated, {
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
import { getShadowStyle } from '../../theme/shadows';
import { getTimePhase } from '../room/RoomAtmosphere';
import {
  COUNTRY_SIGNATURE_COMPLEXITY,
  COUNTRY_ARCHITECTURE,
  getCountryStyleProfile,
  type RoofStyle,
  type WallStyle,
  type DoorStyle,
  type DecoElement,
  type WindowStyle,
  type PathStyle,
  type SignatureLevel,
} from '../../config/countryArchitecture';
import {
  renderCountryBackdrop,
  renderCountryPath,
  renderCountrySignature,
  renderCountryWindows,
} from './countryHouseArt';

const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const AnimatedG = Animated.createAnimatedComponent(G);

type RGB = { r: number; g: number; b: number };

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mix(a: RGB, b: RGB, t: number): RGB {
  const v = clamp(t, 0, 1);
  return {
    r: a.r + (b.r - a.r) * v,
    g: a.g + (b.g - a.g) * v,
    b: a.b + (b.b - a.b) * v,
  };
}

function luminance({ r, g, b }: RGB): number {
  const toLinear = (n: number) => {
    const c = n / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

function saturation({ r, g, b }: RGB): number {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  if (max === min) return 0;
  const l = (max + min) / 2;
  return (max - min) / (1 - Math.abs(2 * l - 1));
}

function tuneWallColor(hex: string, range: [number, number]): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const currentLum = luminance(rgb);
  if (currentLum < range[0]) {
    const amt = clamp((range[0] - currentLum) * 1.2, 0.04, 0.28);
    return rgbToHex(mix(rgb, { r: 255, g: 255, b: 255 }, amt));
  }
  if (currentLum > range[1]) {
    const amt = clamp((currentLum - range[1]) * 1.2, 0.04, 0.24);
    return rgbToHex(mix(rgb, { r: 30, g: 30, b: 30 }, amt));
  }
  return hex;
}

function tuneRoofSaturation(hex: string, cap: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const sat = saturation(rgb);
  if (sat <= cap) return hex;
  const overshoot = sat - cap;
  const amt = clamp(overshoot * 0.9, 0.05, 0.24);
  const gray = (rgb.r + rgb.g + rgb.b) / 3;
  return rgbToHex(mix(rgb, { r: gray, g: gray, b: gray }, amt));
}

type RoomTheme = 'traditional' | 'modern' | 'nature' | 'city' | 'coastal' | 'mountain';

const THEME_COLORS: Record<RoomTheme, {
  wall: string; wallDark: string; roof: string; roofDark: string;
  door: string; accent: string; trim: string;
}> = {
  traditional: {
    wall: '#FAE8D0', wallDark: '#E8D4B8', roof: '#C0392B', roofDark: '#962D22',
    door: '#8B4513', accent: '#D4A020', trim: '#D4B896',
  },
  modern: {
    wall: '#ECF0F1', wallDark: '#D5DBDB', roof: '#2C3E50', roofDark: '#1A252F',
    door: '#34495E', accent: '#3498DB', trim: '#BDC3C7',
  },
  nature: {
    wall: '#E8F5E9', wallDark: '#C8E6C9', roof: '#4CAF50', roofDark: '#388E3C',
    door: '#795548', accent: '#8BC34A', trim: '#A5D6A7',
  },
  city: {
    wall: '#FFECD2', wallDark: '#FFD8A8', roof: '#E65100', roofDark: '#BF360C',
    door: '#BF360C', accent: '#FF9800', trim: '#FFB74D',
  },
  coastal: {
    wall: '#E3F2FD', wallDark: '#BBDEFB', roof: '#1565C0', roofDark: '#0D47A1',
    door: '#0D47A1', accent: '#42A5F5', trim: '#90CAF9',
  },
  mountain: {
    wall: '#EFEBE9', wallDark: '#D7CCC8', roof: '#5D4037', roofDark: '#3E2723',
    door: '#3E2723', accent: '#795548', trim: '#BCAAA4',
  },
};

type SeasonalDecoration = 'lanterns' | 'snowcaps' | 'leaves' | 'flowers' | 'lights' | 'flags';

interface HouseExteriorProps {
  theme: RoomTheme;
  countryId?: string;
  houseName?: string;
  flagEmoji?: string;
  furnitureCount?: number;
  size?: number;
  animated?: boolean;
  seasonalDecoration?: SeasonalDecoration;
}

// ─── SVG ELEMENT RENDERERS ───

function renderRoof(style: RoofStyle, w: number, roofH: number, baseY: number, rc: string, rcd: string) {
  switch (style) {
    case 'pagoda': {
      const mid = w * 0.5;
      const tipY = roofH * 0.08;
      const eaveY = baseY + 2;
      const curlW = w * 0.06;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d={`M ${w * 0.04} ${eaveY} Q ${w * 0.15} ${eaveY - roofH * 0.15} ${mid} ${tipY} Q ${w * 0.85} ${eaveY - roofH * 0.15} ${w * 0.96} ${eaveY}`}
            fill="url(#roofGrad)"
          />
          {/* Upturned edges */}
          <Path d={`M ${w * 0.02} ${eaveY + 1} Q ${w * 0.01} ${eaveY - 6} ${w * 0.04 - curlW} ${eaveY - 8}`} stroke={rcd} strokeWidth={2} fill="none" />
          <Path d={`M ${w * 0.98} ${eaveY + 1} Q ${w * 0.99} ${eaveY - 6} ${w * 0.96 + curlW} ${eaveY - 8}`} stroke={rcd} strokeWidth={2} fill="none" />
          <Line x1={w * 0.06} y1={eaveY + 1} x2={w * 0.94} y2={eaveY + 1} stroke={rcd} strokeWidth={1.5} />
        </G>
      );
    }
    case 'mansard': {
      const eaveY = baseY + 2;
      const topY = roofH * 0.2;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Path
            d={`M ${w * 0.08} ${eaveY} L ${w * 0.08} ${eaveY - roofH * 0.35} L ${w * 0.2} ${topY} L ${w * 0.8} ${topY} L ${w * 0.92} ${eaveY - roofH * 0.35} L ${w * 0.92} ${eaveY} Z`}
            fill="url(#roofGrad)"
          />
          {/* Dormer window */}
          <Rect x={w * 0.42} y={topY + 2} width={w * 0.16} height={roofH * 0.25} fill={rc} rx={1} />
          <Rect x={w * 0.44} y={topY + 3} width={w * 0.12} height={roofH * 0.18} fill="#B3E5FC" rx={1} />
          <Line x1={w * 0.5} y1={topY + 3} x2={w * 0.5} y2={topY + 3 + roofH * 0.18} stroke="white" strokeWidth={0.8} />
        </G>
      );
    }
    case 'flat': {
      return (
        <G>
          <Rect x={w * 0.1} y={baseY - 4} width={w * 0.8} height={6} fill={rc} rx={1} />
          <Rect x={w * 0.08} y={baseY - 6} width={w * 0.84} height={4} fill={rcd} rx={1} />
        </G>
      );
    }
    case 'flatDome': {
      return (
        <G>
          <Rect x={w * 0.1} y={baseY - 4} width={w * 0.8} height={6} fill="white" rx={1} />
          <Ellipse cx={w * 0.72} cy={baseY - 4} rx={w * 0.12} ry={roofH * 0.28} fill={rc} />
          <Ellipse cx={w * 0.72} cy={baseY - 4} rx={w * 0.09} ry={roofH * 0.22} fill={rc} opacity={0.6} />
          <Circle cx={w * 0.72} cy={baseY - 4 - roofH * 0.25} r={2} fill={rcd} />
        </G>
      );
    }
    case 'chalet': {
      const eaveY = baseY + 2;
      const tipY = roofH * 0.12;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Polygon
            points={`${w * 0.0},${eaveY + 4} ${w * 0.5},${tipY} ${w * 1.0},${eaveY + 4}`}
            fill="url(#roofGrad)"
          />
          {/* Wide eave overhang */}
          <Line x1={w * -0.02} y1={eaveY + 5} x2={w * 1.02} y2={eaveY + 5} stroke={rcd} strokeWidth={3} />
          {/* Decorative balcony rail under eave */}
          <Line x1={w * 0.15} y1={eaveY + 8} x2={w * 0.85} y2={eaveY + 8} stroke={rc} strokeWidth={1} opacity={0.5} />
        </G>
      );
    }
    case 'thatched': {
      const eaveY = baseY + 4;
      const tipY = roofH * 0.02;
      return (
        <G>
          <Path
            d={`M ${w * 0.02} ${eaveY} Q ${w * 0.15} ${eaveY - roofH * 0.1} ${w * 0.5} ${tipY} Q ${w * 0.85} ${eaveY - roofH * 0.1} ${w * 0.98} ${eaveY}`}
            fill={rc}
          />
          {/* Thatch texture lines */}
          {[0.25, 0.4, 0.55, 0.7].map((pct, i) => (
            <Line
              key={`thatch-${i}`}
              x1={w * (0.15 + i * 0.05)} y1={baseY * pct + roofH * 0.15}
              x2={w * (0.85 - i * 0.05)} y2={baseY * pct + roofH * 0.15}
              stroke={rcd} strokeWidth={0.8} opacity={0.4}
            />
          ))}
          <Circle cx={w * 0.5} cy={tipY} r={3} fill={rcd} />
        </G>
      );
    }
    case 'tiered': {
      const eaveY = baseY + 2;
      const tipY = roofH * 0.05;
      const midY = (tipY + eaveY) / 2;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          {/* Lower tier */}
          <Polygon
            points={`${w * 0.04},${eaveY} ${w * 0.5},${midY} ${w * 0.96},${eaveY}`}
            fill="url(#roofGrad)"
          />
          {/* Upper tier */}
          <Polygon
            points={`${w * 0.18},${midY} ${w * 0.5},${tipY} ${w * 0.82},${midY}`}
            fill={rc}
          />
          {/* Finial at peak */}
          <Line x1={w * 0.5} y1={tipY} x2={w * 0.5} y2={tipY - 6} stroke={rcd} strokeWidth={1.5} />
          <Circle cx={w * 0.5} cy={tipY - 7} r={2} fill={rc} />
        </G>
      );
    }
    case 'stave': {
      const eaveY = baseY + 2;
      const tipY = roofH * 0.02;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Polygon
            points={`${w * 0.02},${eaveY} ${w * 0.5},${tipY} ${w * 0.98},${eaveY}`}
            fill="url(#roofGrad)"
          />
          {/* Dragon/cross finial */}
          <Line x1={w * 0.5} y1={tipY} x2={w * 0.5} y2={tipY - 8} stroke={rcd} strokeWidth={1.5} />
          <Line x1={w * 0.47} y1={tipY - 4} x2={w * 0.53} y2={tipY - 4} stroke={rcd} strokeWidth={1.2} />
          {/* Turf / grass on roof */}
          <Path d={`M ${w * 0.25} ${eaveY - 2} Q ${w * 0.3} ${eaveY - 5} ${w * 0.35} ${eaveY - 2}`} fill="#558B2F" opacity={0.6} />
          <Path d={`M ${w * 0.6} ${eaveY - 3} Q ${w * 0.65} ${eaveY - 6} ${w * 0.7} ${eaveY - 3}`} fill="#689F38" opacity={0.5} />
        </G>
      );
    }
    case 'stepped': {
      const eaveY = baseY + 2;
      const stepH = roofH * 0.15;
      return (
        <G>
          {/* Stepped gable */}
          <Path
            d={`M ${w * 0.12} ${eaveY} L ${w * 0.12} ${eaveY - stepH} L ${w * 0.22} ${eaveY - stepH} L ${w * 0.22} ${eaveY - stepH * 2} L ${w * 0.32} ${eaveY - stepH * 2} L ${w * 0.32} ${eaveY - stepH * 3} L ${w * 0.42} ${eaveY - stepH * 3} L ${w * 0.42} ${roofH * 0.15} L ${w * 0.58} ${roofH * 0.15} L ${w * 0.58} ${eaveY - stepH * 3} L ${w * 0.68} ${eaveY - stepH * 3} L ${w * 0.68} ${eaveY - stepH * 2} L ${w * 0.78} ${eaveY - stepH * 2} L ${w * 0.78} ${eaveY - stepH} L ${w * 0.88} ${eaveY - stepH} L ${w * 0.88} ${eaveY} Z`}
            fill={rc}
          />
          <Path
            d={`M ${w * 0.12} ${eaveY} L ${w * 0.12} ${eaveY - stepH} L ${w * 0.22} ${eaveY - stepH} L ${w * 0.22} ${eaveY - stepH * 2} L ${w * 0.32} ${eaveY - stepH * 2} L ${w * 0.32} ${eaveY - stepH * 3} L ${w * 0.42} ${eaveY - stepH * 3} L ${w * 0.42} ${roofH * 0.15} L ${w * 0.58} ${roofH * 0.15} L ${w * 0.58} ${eaveY - stepH * 3} L ${w * 0.68} ${eaveY - stepH * 3} L ${w * 0.68} ${eaveY - stepH * 2} L ${w * 0.78} ${eaveY - stepH * 2} L ${w * 0.78} ${eaveY - stepH} L ${w * 0.88} ${eaveY - stepH} L ${w * 0.88} ${eaveY}`}
            fill="none" stroke={rcd} strokeWidth={1.5}
          />
        </G>
      );
    }
    case 'colonial': {
      const eaveY = baseY + 2;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Polygon
            points={`${w * 0.06},${eaveY} ${w * 0.5},${roofH * 0.18} ${w * 0.94},${eaveY}`}
            fill="url(#roofGrad)"
          />
          {/* Overhang line */}
          <Line x1={w * 0.04} y1={eaveY + 1} x2={w * 0.96} y2={eaveY + 1} stroke={rcd} strokeWidth={2} />
        </G>
      );
    }
    case 'hipped': {
      const eaveY = baseY + 2;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Polygon
            points={`${w * 0.05},${eaveY} ${w * 0.3},${roofH * 0.15} ${w * 0.7},${roofH * 0.15} ${w * 0.95},${eaveY}`}
            fill="url(#roofGrad)"
          />
          <Line x1={w * 0.05} y1={eaveY + 1} x2={w * 0.95} y2={eaveY + 1} stroke="rgba(0,0,0,0.1)" strokeWidth={1.5} />
        </G>
      );
    }
    default: {
      const eaveY = baseY + 2;
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={rc} />
              <Stop offset="100%" stopColor={rcd} />
            </SvgLinearGradient>
          </Defs>
          <Polygon points={`${w * 0.02},${eaveY} ${w * 0.5},${roofH * 0.1} ${w * 0.98},${eaveY}`} fill="url(#roofGrad)" />
        </G>
      );
    }
  }
}

function renderWalls(style: WallStyle, w: number, wallH: number, baseY: number, wc: string, wcd: string, trim: string) {
  const wallX = w * 0.12;
  const wallW = w * 0.76;

  switch (style) {
    case 'timber':
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={wc} />
              <Stop offset="100%" stopColor={wcd} />
            </SvgLinearGradient>
          </Defs>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill="url(#wallGrad)" rx={2} />
          {/* Half-timber beams */}
          <Line x1={wallX} y1={baseY + wallH * 0.5} x2={wallX + wallW} y2={baseY + wallH * 0.5} stroke="#5D4037" strokeWidth={2} />
          <Line x1={wallX + wallW * 0.33} y1={baseY} x2={wallX + wallW * 0.33} y2={baseY + wallH} stroke="#5D4037" strokeWidth={1.5} />
          <Line x1={wallX + wallW * 0.66} y1={baseY} x2={wallX + wallW * 0.66} y2={baseY + wallH} stroke="#5D4037" strokeWidth={1.5} />
          <Line x1={wallX} y1={baseY} x2={wallX + wallW * 0.33} y2={baseY + wallH * 0.5} stroke="#5D4037" strokeWidth={1} opacity={0.6} />
          <Line x1={wallX + wallW * 0.33} y1={baseY} x2={wallX} y2={baseY + wallH * 0.5} stroke="#5D4037" strokeWidth={1} opacity={0.6} />
        </G>
      );
    case 'stone':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          {/* Stone block lines */}
          {[0.2, 0.4, 0.6, 0.8].map((pct, i) => (
            <Line key={`sh-${i}`} x1={wallX + 2} y1={baseY + wallH * pct} x2={wallX + wallW - 2} y2={baseY + wallH * pct} stroke={wcd} strokeWidth={0.8} opacity={0.5} />
          ))}
          {[0.25, 0.5, 0.75].map((pct, i) => (
            <Line key={`sv-${i}`} x1={wallX + wallW * pct} y1={baseY + wallH * (i % 2 === 0 ? 0.2 : 0.0)} x2={wallX + wallW * pct} y2={baseY + wallH * (i % 2 === 0 ? 0.4 : 0.2)} stroke={wcd} strokeWidth={0.8} opacity={0.4} />
          ))}
        </G>
      );
    case 'whitewash':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          <Rect x={wallX} y={baseY + wallH - 3} width={wallW} height={3} fill={trim} rx={1} opacity={0.3} />
        </G>
      );
    case 'colorStripe':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          <Rect x={wallX} y={baseY + wallH * 0.85} width={wallW} height={wallH * 0.15} fill={wcd} rx={1} />
          <Line x1={wallX} y1={baseY + wallH * 0.65} x2={wallX + wallW} y2={baseY + wallH * 0.65} stroke={trim} strokeWidth={1.5} opacity={0.5} />
        </G>
      );
    case 'brick':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          {[0.15, 0.3, 0.45, 0.6, 0.75, 0.9].map((pct, i) => (
            <G key={`br-${i}`}>
              <Line x1={wallX + 2} y1={baseY + wallH * pct} x2={wallX + wallW - 2} y2={baseY + wallH * pct} stroke={wcd} strokeWidth={0.6} opacity={0.4} />
              <Line x1={wallX + wallW * (i % 2 === 0 ? 0.5 : 0.25)} y1={baseY + wallH * pct} x2={wallX + wallW * (i % 2 === 0 ? 0.5 : 0.25)} y2={baseY + wallH * Math.min(pct + 0.15, 1)} stroke={wcd} strokeWidth={0.4} opacity={0.3} />
            </G>
          ))}
        </G>
      );
    case 'log':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          {[0.12, 0.27, 0.42, 0.57, 0.72, 0.87].map((pct, i) => (
            <G key={`log-${i}`}>
              <Line x1={wallX} y1={baseY + wallH * pct} x2={wallX + wallW} y2={baseY + wallH * pct} stroke={wcd} strokeWidth={1.2} opacity={0.5} />
              <Circle cx={wallX - 1} cy={baseY + wallH * pct} r={2} fill={wcd} opacity={0.4} />
              <Circle cx={wallX + wallW + 1} cy={baseY + wallH * pct} r={2} fill={wcd} opacity={0.4} />
            </G>
          ))}
        </G>
      );
    case 'adobe':
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={wc} />
              <Stop offset="100%" stopColor={wcd} />
            </SvgLinearGradient>
          </Defs>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill="url(#wallGrad)" rx={3} />
          <Rect x={wallX + 1} y={baseY + 1} width={wallW - 2} height={wallH - 2} fill="none" stroke={wcd} strokeWidth={1} rx={3} opacity={0.2} />
        </G>
      );
    case 'round':
      return (
        <G>
          <Ellipse cx={w * 0.5} cy={baseY + wallH * 0.5} rx={wallW * 0.5} ry={wallH * 0.5} fill={wc} />
          <Ellipse cx={w * 0.5} cy={baseY + wallH * 0.5} rx={wallW * 0.5} ry={wallH * 0.5} fill="none" stroke={wcd} strokeWidth={1.5} opacity={0.4} />
        </G>
      );
    case 'ndebele':
      return (
        <G>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill={wc} rx={2} />
          <Rect x={wallX + 2} y={baseY + 2} width={wallW - 4} height={wallH - 4} fill="none" stroke="#212121" strokeWidth={1} />
          <Path d={`M ${wallX + 2} ${baseY + wallH * 0.4} L ${wallX + wallW - 2} ${baseY + wallH * 0.4}`} stroke="#D32F2F" strokeWidth={2} />
          <Path d={`M ${wallX + wallW * 0.25} ${baseY + 2} L ${wallX + wallW * 0.25} ${baseY + wallH - 2}`} stroke="#1E88E5" strokeWidth={2} />
          <Path d={`M ${wallX + wallW * 0.75} ${baseY + 2} L ${wallX + wallW * 0.75} ${baseY + wallH - 2}`} stroke="#FBC02D" strokeWidth={2} />
        </G>
      );
    default:
      return (
        <G>
          <Defs>
            <SvgLinearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={wc} />
              <Stop offset="100%" stopColor={wcd} />
            </SvgLinearGradient>
          </Defs>
          <Rect x={wallX} y={baseY} width={wallW} height={wallH} fill="url(#wallGrad)" rx={2} />
          <Line x1={wallX} y1={baseY + wallH * 0.65} x2={wallX + wallW} y2={baseY + wallH * 0.65} stroke={trim} strokeWidth={1.5} opacity={0.4} />
        </G>
      );
  }
}

function renderRoofTexture(style: RoofStyle, w: number, roofH: number, baseY: number, rc: string, rcd: string) {
  const eaveY = baseY + 2;
  switch (style) {
    case 'thatched':
      return <G>{[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((p, i) => <Line key={i} x1={w * (0.16 - i * 0.004)} y1={roofH * (0.2 + p * 0.15)} x2={w * (0.84 + i * 0.004)} y2={roofH * (0.2 + p * 0.15)} stroke={rcd} strokeWidth={0.7} opacity={0.35} />)}</G>;
    case 'chalet':
    case 'stave':
      return <G>{[0.2, 0.35, 0.5, 0.65, 0.8].map((p, i) => <Line key={i} x1={w * 0.12} y1={roofH * p} x2={w * 0.88} y2={roofH * (p + 0.02)} stroke={style === 'stave' ? '#4E342E' : '#6D4C41'} strokeWidth={0.8} opacity={0.35} />)}</G>;
    case 'hipped':
    case 'colonial':
    case 'mansard':
    case 'stepped':
      return <G>{[0.22, 0.32, 0.42, 0.52, 0.62].map((p, i) => <Line key={i} x1={w * 0.12} y1={roofH * p} x2={w * 0.88} y2={roofH * p} stroke={rcd} strokeWidth={0.8} opacity={0.3} />)}</G>;
    case 'pagoda':
    case 'tiered':
      return <G>{[0.24, 0.34, 0.44].map((p, i) => <Line key={i} x1={w * 0.1} y1={roofH * p} x2={w * 0.9} y2={roofH * p} stroke={rcd} strokeWidth={1} opacity={0.25} />)}</G>;
    case 'flat':
    case 'flatDome':
      return <Rect x={w * 0.1} y={baseY - 3} width={w * 0.8} height={1} fill={rcd} opacity={0.35} />;
    case 'gabled':
    default:
      return <Line x1={w * 0.14} y1={eaveY - 1} x2={w * 0.86} y2={eaveY - 1} stroke={rcd} strokeWidth={1} opacity={0.3} />;
  }
}

function renderWallTexture(style: WallStyle, w: number, wallH: number, baseY: number, wcd: string) {
  const wallX = w * 0.12;
  const wallW = w * 0.76;
  if (style === 'round') {
    return (
      <G>
        <Ellipse cx={w * 0.5} cy={baseY + wallH * 0.62} rx={wallW * 0.45} ry={wallH * 0.12} fill={wcd} opacity={0.12} />
      </G>
    );
  }
  return (
    <G>
      {[0.18, 0.36, 0.54, 0.72].map((pct, i) => (
        <Line
          key={`wall-tex-${i}`}
          x1={wallX + 2}
          y1={baseY + wallH * pct}
          x2={wallX + wallW - 2}
          y2={baseY + wallH * pct}
          stroke={wcd}
          strokeWidth={0.6}
          opacity={0.16}
        />
      ))}
    </G>
  );
}

function renderDoor(style: DoorStyle, w: number, wallH: number, baseY: number, dc: string, accent: string, trim: string) {
  const doorX = w * 0.4;
  const doorW = w * 0.2;
  const doorY = baseY + wallH * 0.3;
  const doorH = wallH * 0.7;

  switch (style) {
    case 'arched':
      return (
        <G>
          <Path
            d={`M ${doorX} ${doorY + doorH} L ${doorX} ${doorY + doorH * 0.3} A ${doorW / 2} ${doorH * 0.3} 0 0 1 ${doorX + doorW} ${doorY + doorH * 0.3} L ${doorX + doorW} ${doorY + doorH} Z`}
            fill={dc}
          />
          <Path
            d={`M ${doorX} ${doorY + doorH} L ${doorX} ${doorY + doorH * 0.3} A ${doorW / 2} ${doorH * 0.3} 0 0 1 ${doorX + doorW} ${doorY + doorH * 0.3} L ${doorX + doorW} ${doorY + doorH}`}
            fill="none" stroke={trim} strokeWidth={1.2}
          />
          <Circle cx={doorX + doorW * 0.72} cy={doorY + doorH * 0.55} r={2} fill={accent} />
        </G>
      );
    case 'sliding':
      return (
        <G>
          <Rect x={doorX - 2} y={doorY - 2} width={doorW + 4} height={doorH + 2} fill={trim} rx={1} />
          <Rect x={doorX} y={doorY} width={doorW * 0.48} height={doorH} fill={dc} rx={1} />
          <Rect x={doorX + doorW * 0.52} y={doorY} width={doorW * 0.48} height={doorH} fill={dc} rx={1} opacity={0.85} />
          {/* Shoji grid */}
          <Line x1={doorX + doorW * 0.24} y1={doorY} x2={doorX + doorW * 0.24} y2={doorY + doorH} stroke="white" strokeWidth={0.5} opacity={0.4} />
          <Line x1={doorX + doorW * 0.76} y1={doorY} x2={doorX + doorW * 0.76} y2={doorY + doorH} stroke="white" strokeWidth={0.5} opacity={0.4} />
          <Line x1={doorX} y1={doorY + doorH * 0.33} x2={doorX + doorW} y2={doorY + doorH * 0.33} stroke="white" strokeWidth={0.5} opacity={0.4} />
          <Line x1={doorX} y1={doorY + doorH * 0.66} x2={doorX + doorW} y2={doorY + doorH * 0.66} stroke="white" strokeWidth={0.5} opacity={0.4} />
        </G>
      );
    case 'horseshoe':
      return (
        <G>
          <Path
            d={`M ${doorX} ${doorY + doorH} L ${doorX} ${doorY + doorH * 0.25} A ${doorW / 2} ${doorH * 0.35} 0 0 1 ${doorX + doorW} ${doorY + doorH * 0.25} L ${doorX + doorW} ${doorY + doorH} Z`}
            fill={dc}
          />
          <Path
            d={`M ${doorX + 2} ${doorY + doorH * 0.28} A ${doorW / 2 - 2} ${doorH * 0.32} 0 0 1 ${doorX + doorW - 2} ${doorY + doorH * 0.28}`}
            fill="none" stroke={accent} strokeWidth={2} opacity={0.7}
          />
          <Circle cx={doorX + doorW * 0.72} cy={doorY + doorH * 0.55} r={2} fill={accent} />
        </G>
      );
    case 'dutch':
      return (
        <G>
          <Rect x={doorX} y={doorY} width={doorW} height={doorH * 0.48} fill={dc} rx={2} ry={2} />
          <Rect x={doorX} y={doorY + doorH * 0.52} width={doorW} height={doorH * 0.48} fill={dc} rx={0} />
          <Line x1={doorX} y1={doorY + doorH * 0.5} x2={doorX + doorW} y2={doorY + doorH * 0.5} stroke={trim} strokeWidth={2} />
          <Circle cx={doorX + doorW * 0.72} cy={doorY + doorH * 0.35} r={2} fill={accent} />
          <Circle cx={doorX + doorW * 0.72} cy={doorY + doorH * 0.65} r={2} fill={accent} />
        </G>
      );
    case 'ornate':
      return (
        <G>
          <Rect x={doorX - 2} y={doorY - 2} width={doorW + 4} height={doorH + 2} fill={trim} rx={3} />
          <Rect x={doorX} y={doorY} width={doorW} height={doorH} fill={dc} rx={w * 0.08} ry={w * 0.08} />
          {/* Decorative panel lines */}
          <Rect x={doorX + 3} y={doorY + 4} width={doorW - 6} height={doorH * 0.35} fill="none" stroke={accent} strokeWidth={0.8} rx={2} opacity={0.5} />
          <Rect x={doorX + 3} y={doorY + doorH * 0.45} width={doorW - 6} height={doorH * 0.35} fill="none" stroke={accent} strokeWidth={0.8} rx={2} opacity={0.5} />
          <Circle cx={doorX + doorW * 0.72} cy={doorY + doorH * 0.55} r={2.5} fill={accent} />
          <Circle cx={doorX + doorW * 0.717} cy={doorY + doorH * 0.545} r={1} fill="#FFF" opacity={0.4} />
        </G>
      );
    case 'wooden':
      return (
        <G>
          <Rect x={doorX} y={doorY} width={doorW} height={doorH} fill={dc} rx={2} />
          {/* Wood plank lines */}
          <Line x1={doorX + doorW * 0.33} y1={doorY + 2} x2={doorX + doorW * 0.33} y2={doorY + doorH - 1} stroke="rgba(0,0,0,0.15)" strokeWidth={0.8} />
          <Line x1={doorX + doorW * 0.66} y1={doorY + 2} x2={doorX + doorW * 0.66} y2={doorY + doorH - 1} stroke="rgba(0,0,0,0.15)" strokeWidth={0.8} />
          <Circle cx={doorX + doorW * 0.78} cy={doorY + doorH * 0.55} r={2} fill={accent} />
        </G>
      );
    default:
      return (
        <G>
          <Rect x={doorX} y={doorY} width={doorW} height={doorH} fill={dc} rx={w * 0.1} ry={w * 0.1} />
          <Rect x={doorX - 1} y={doorY - 1} width={doorW + 2} height={doorH + 1} fill="none" stroke={trim} strokeWidth={1.5} rx={w * 0.1 + 1} ry={w * 0.1 + 1} />
          <Circle cx={doorX + doorW * 0.8} cy={doorY + doorH * 0.55} r={2.5} fill={accent} />
        </G>
      );
  }
}

function renderDecoration(deco: DecoElement, w: number, wallH: number, baseY: number) {
  const groundY = baseY + wallH;

  switch (deco) {
    case 'cherry_blossom':
      return (
        <G>
          <Line x1={w * 0.05} y1={groundY} x2={w * 0.08} y2={groundY - 16} stroke="#8D6E63" strokeWidth={2} />
          <Path d={`M ${w * 0.08} ${groundY - 16} Q ${w * 0.16} ${groundY - 22} ${w * 0.2} ${groundY - 14}`} stroke="#8D6E63" strokeWidth={1.2} fill="none" />
          {[0, 4, 8, 12].map((off, i) => (
            <Circle key={`cb-${i}`} cx={w * 0.1 + off} cy={groundY - 16 - (i % 2) * 4} r={2.5} fill={i % 2 === 0 ? '#FFB6C1' : '#FFC0CB'} opacity={0.85} />
          ))}
        </G>
      );
    case 'bamboo':
      return (
        <G>
          {[w * 0.88, w * 0.93].map((x, i) => (
            <G key={`bam-${i}`}>
              <Line x1={x} y1={groundY} x2={x} y2={groundY - 18} stroke="#228B22" strokeWidth={2} />
              <Ellipse cx={x + 3} cy={groundY - 14} rx={5} ry={2.5} fill="#66BB6A" opacity={0.8} />
              <Ellipse cx={x - 2} cy={groundY - 10} rx={4} ry={2} fill="#4CAF50" opacity={0.6} />
            </G>
          ))}
        </G>
      );
    case 'lantern':
      return (
        <G>
          <Line x1={w * 0.05} y1={baseY + 2} x2={w * 0.05} y2={baseY + 12} stroke="#333" strokeWidth={0.5} />
          <Ellipse cx={w * 0.05} cy={baseY + 15} rx={3.5} ry={4.5} fill="#FF6B6B" opacity={0.85} />
          <Ellipse cx={w * 0.05} cy={baseY + 15} rx={2} ry={3} fill="#FFF" opacity={0.25} />
        </G>
      );
    case 'lavender':
      return (
        <G>
          {[w * 0.04, w * 0.09, w * 0.14, w * 0.86, w * 0.91].map((x, i) => (
            <G key={`lav-${i}`}>
              <Line x1={x} y1={groundY} x2={x} y2={groundY - 10} stroke="#228B22" strokeWidth={0.8} />
              <Ellipse cx={x} cy={groundY - 12} rx={2} ry={4} fill="#9370DB" opacity={0.7} />
            </G>
          ))}
        </G>
      );
    case 'cactus':
      return (
        <G>
          <Rect x={w * 0.88} y={groundY - 16} width={4} height={16} fill="#2E7D32" rx={2} />
          <Path d={`M ${w * 0.88} ${groundY - 10} Q ${w * 0.84} ${groundY - 10} ${w * 0.84} ${groundY - 14}`} stroke="#2E7D32" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d={`M ${w * 0.92} ${groundY - 8} Q ${w * 0.96} ${groundY - 8} ${w * 0.96} ${groundY - 13}`} stroke="#2E7D32" strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      );
    case 'olive':
      return (
        <G>
          <Line x1={w * 0.9} y1={groundY} x2={w * 0.9} y2={groundY - 14} stroke="#5D4037" strokeWidth={2} />
          <Ellipse cx={w * 0.9} cy={groundY - 18} rx={8} ry={7} fill="#558B2F" opacity={0.75} />
          <Ellipse cx={w * 0.88} cy={groundY - 16} rx={5} ry={4} fill="#689F38" opacity={0.5} />
        </G>
      );
    case 'palm':
      return (
        <G>
          <Line x1={w * 0.9} y1={groundY} x2={w * 0.92} y2={groundY - 22} stroke="#8D6E63" strokeWidth={2.5} />
          <Path d={`M ${w * 0.92} ${groundY - 22} Q ${w * 1.02} ${groundY - 26} ${w * 1.06} ${groundY - 18}`} stroke="#4CAF50" strokeWidth={2} fill="none" />
          <Path d={`M ${w * 0.92} ${groundY - 22} Q ${w * 0.82} ${groundY - 28} ${w * 0.78} ${groundY - 20}`} stroke="#4CAF50" strokeWidth={2} fill="none" />
          <Path d={`M ${w * 0.92} ${groundY - 22} Q ${w * 0.98} ${groundY - 30} ${w * 1.0} ${groundY - 24}`} stroke="#66BB6A" strokeWidth={1.5} fill="none" />
        </G>
      );
    case 'tulips':
      return (
        <G>
          {[w * 0.04, w * 0.1, w * 0.16, w * 0.86, w * 0.92].map((x, i) => (
            <G key={`tul-${i}`}>
              <Line x1={x} y1={groundY} x2={x} y2={groundY - 9} stroke="#228B22" strokeWidth={1} />
              <Path d={`M ${x - 2.5} ${groundY - 9} Q ${x} ${groundY - 15} ${x + 2.5} ${groundY - 9}`} fill={['#FF6B6B', '#FFD700', '#FF69B4', '#9370DB', '#FF6347'][i % 5]} />
            </G>
          ))}
        </G>
      );
    case 'acacia':
      return (
        <G>
          <Line x1={w * 0.88} y1={groundY} x2={w * 0.9} y2={groundY - 20} stroke="#5D4037" strokeWidth={2} />
          <Ellipse cx={w * 0.9} cy={groundY - 22} rx={12} ry={4} fill="#558B2F" opacity={0.8} />
          <Ellipse cx={w * 0.87} cy={groundY - 21} rx={8} ry={3} fill="#689F38" opacity={0.5} />
        </G>
      );
    case 'pine':
      return (
        <G>
          {[w * 0.9].map((x, i) => (
            <G key={`pn-${i}`}>
              <Polygon points={`${x},${groundY - 20} ${x - 7},${groundY - 2} ${x + 7},${groundY - 2}`} fill="#2E7D32" />
              <Polygon points={`${x},${groundY - 16} ${x - 5},${groundY - 6} ${x + 5},${groundY - 6}`} fill="#388E3C" />
              <Rect x={x - 1.5} y={groundY - 3} width={3} height={4} fill="#5D4037" />
            </G>
          ))}
        </G>
      );
    case 'maple':
      return (
        <G>
          <Line x1={w * 0.06} y1={groundY} x2={w * 0.06} y2={groundY - 16} stroke="#5D4037" strokeWidth={2} />
          <Ellipse cx={w * 0.06} cy={groundY - 20} rx={9} ry={7} fill="#E53935" opacity={0.8} />
          <Ellipse cx={w * 0.04} cy={groundY - 18} rx={5} ry={4} fill="#FF7043" opacity={0.6} />
        </G>
      );
    case 'cedar':
      return (
        <G>
          <Line x1={w * 0.9} y1={groundY} x2={w * 0.9} y2={groundY - 20} stroke="#5D4037" strokeWidth={2} />
          <Polygon points={`${w * 0.9},${groundY - 26} ${w * 0.83},${groundY - 4} ${w * 0.97},${groundY - 4}`} fill="#1B5E20" />
          <Polygon points={`${w * 0.9},${groundY - 22} ${w * 0.85},${groundY - 8} ${w * 0.95},${groundY - 8}`} fill="#2E7D32" opacity={0.7} />
        </G>
      );
    case 'sunflower':
      return (
        <G>
          {[w * 0.06, w * 0.13, w * 0.9].map((x, i) => (
            <G key={`sf-${i}`}>
              <Line x1={x} y1={groundY} x2={x} y2={groundY - 14} stroke="#228B22" strokeWidth={1.5} />
              <Circle cx={x} cy={groundY - 16} r={4} fill="#FFD700" />
              <Circle cx={x} cy={groundY - 16} r={2} fill="#795548" />
            </G>
          ))}
        </G>
      );
    case 'bougainvillea':
      return (
        <G>
          <Path d={`M ${w * 0.88} ${baseY + 4} Q ${w * 0.92} ${baseY + wallH * 0.3} ${w * 0.88} ${baseY + wallH * 0.5}`} stroke="#228B22" strokeWidth={1.5} fill="none" />
          {[0.08, 0.2, 0.32, 0.42].map((pct, i) => (
            <Circle key={`bougan-${i}`} cx={w * 0.88 + (i % 2 ? 3 : -2)} cy={baseY + wallH * pct + 6} r={3} fill={i % 2 === 0 ? '#E91E63' : '#FF4081'} opacity={0.75} />
          ))}
        </G>
      );
    case 'vine':
      return (
        <G>
          <Path d={`M ${w * 0.88} ${baseY + 2} Q ${w * 0.92} ${baseY + wallH * 0.4} ${w * 0.88} ${baseY + wallH * 0.7}`} stroke="#228B22" strokeWidth={1.5} fill="none" />
          {[0.1, 0.25, 0.4, 0.55].map((pct, i) => (
            <Ellipse key={`vine-${i}`} cx={w * 0.89 + (i % 2 ? 2 : -1)} cy={baseY + wallH * pct + 4} rx={3} ry={2} fill="#4CAF50" opacity={0.6} />
          ))}
        </G>
      );
    case 'hedge':
      return (
        <G>
          <Ellipse cx={w * 0.08} cy={groundY - 2} rx={10} ry={7} fill="#27AE60" opacity={0.8} />
          <Ellipse cx={w * 0.12} cy={groundY - 3} rx={6} ry={5} fill="#2ECC71" opacity={0.5} />
          <Ellipse cx={w * 0.92} cy={groundY - 2} rx={10} ry={7} fill="#27AE60" opacity={0.8} />
        </G>
      );
    case 'fern':
      return (
        <G>
          {[w * 0.05, w * 0.12, w * 0.88, w * 0.95].map((x, i) => (
            <G key={`fern-${i}`}>
              <Path d={`M ${x} ${groundY} Q ${x + (i % 2 ? 4 : -4)} ${groundY - 8} ${x + (i % 2 ? 2 : -2)} ${groundY - 14}`} stroke="#2E7D32" strokeWidth={1.5} fill="none" />
              <Ellipse cx={x + (i % 2 ? 3 : -3)} cy={groundY - 10} rx={4} ry={2} fill="#4CAF50" opacity={0.5} />
            </G>
          ))}
        </G>
      );
    case 'lotus':
      return (
        <G>
          {[w * 0.06, w * 0.92].map((x, i) => (
            <G key={`lot-${i}`}>
              <Ellipse cx={x} cy={groundY - 2} rx={6} ry={3} fill="#81C784" opacity={0.6} />
              <Path d={`M ${x - 3} ${groundY - 4} Q ${x} ${groundY - 10} ${x + 3} ${groundY - 4}`} fill="#F48FB1" opacity={0.75} />
              <Path d={`M ${x - 1.5} ${groundY - 5} Q ${x} ${groundY - 9} ${x + 1.5} ${groundY - 5}`} fill="#FF80AB" opacity={0.6} />
            </G>
          ))}
        </G>
      );
    case 'potted_orange':
      return (
        <G>
          <Rect x={w * 0.88} y={groundY - 6} width={8} height={6} fill="#8D6E63" rx={1} />
          <Line x1={w * 0.92} y1={groundY - 6} x2={w * 0.92} y2={groundY - 14} stroke="#228B22" strokeWidth={1.5} />
          <Ellipse cx={w * 0.92} cy={groundY - 16} rx={6} ry={5} fill="#2E7D32" opacity={0.7} />
          <Circle cx={w * 0.9} cy={groundY - 14} r={2.5} fill="#FF9800" />
          <Circle cx={w * 0.94} cy={groundY - 16} r={2} fill="#FFA726" />
        </G>
      );
    case 'cypress':
      return (
        <G>
          <Ellipse cx={w * 0.92} cy={groundY - 10} rx={4} ry={14} fill="#1B5E20" opacity={0.85} />
          <Ellipse cx={w * 0.92} cy={groundY - 8} rx={3} ry={10} fill="#2E7D32" opacity={0.5} />
          <Rect x={w * 0.915} y={groundY - 2} width={2} height={4} fill="#5D4037" />
        </G>
      );
    case 'rose':
      return (
        <G>
          {[w * 0.06, w * 0.12, w * 0.9, w * 0.96].map((x, i) => (
            <G key={`rose-${i}`}>
              <Line x1={x} y1={groundY} x2={x} y2={groundY - 10} stroke="#228B22" strokeWidth={1} />
              <Circle cx={x} cy={groundY - 12} r={3} fill={i % 2 === 0 ? '#E91E63' : '#F48FB1'} opacity={0.8} />
              <Circle cx={x} cy={groundY - 12} r={1.5} fill="#C2185B" opacity={0.4} />
            </G>
          ))}
        </G>
      );
    default:
      return null;
  }
}

// ─── CHIMNEY ───

function renderChimney(roofStyle: RoofStyle, w: number, roofH: number, rc: string, rcd: string) {
  if (roofStyle === 'flat' || roofStyle === 'flatDome' || roofStyle === 'thatched' || roofStyle === 'tiered') return null;
  return (
    <G>
      <Rect x={w * 0.7} y={roofH * 0.15} width={w * 0.09} height={roofH * 0.65} fill={rcd} rx={1} />
      <Rect x={w * 0.69} y={roofH * 0.15} width={w * 0.11} height={3} fill={rc} rx={1} />
    </G>
  );
}

// ─── MAIN COMPONENT ───

export const HouseExterior: React.FC<HouseExteriorProps> = React.memo(({
  theme,
  countryId,
  houseName,
  flagEmoji,
  furnitureCount = 0,
  size = 160,
  animated = true,
  seasonalDecoration,
}) => {
  const arch = countryId ? COUNTRY_ARCHITECTURE[countryId] : undefined;
  const themeC = THEME_COLORS[theme] || THEME_COLORS.traditional;
  const styleProfile = getCountryStyleProfile(countryId);

  const rc = arch?.roofColor ?? themeC.roof;
  const rcd = arch?.roofDark ?? themeC.roofDark;
  const wc = arch?.wallColor ?? themeC.wall;
  const wcd = arch?.wallDark ?? themeC.wallDark;
  const dc = arch?.doorColor ?? themeC.door;
  const accent = arch?.accent ?? themeC.accent;
  const trim = arch?.trim ?? themeC.trim;

  const roofStyle: RoofStyle = arch?.roof ?? 'gabled';
  const wallStyle: WallStyle = arch?.wall ?? 'plain';
  const doorStyle: DoorStyle = arch?.door ?? 'rounded';
  const windowStyle: WindowStyle = arch?.windowStyle ?? 'square';
  const pathStyle: PathStyle = arch?.pathStyle ?? 'plain';
  const decorations: DecoElement[] = arch?.decorations ?? [];
  const signature = arch?.signature;
  const signatureLevel: SignatureLevel = arch?.signatureLevel ?? COUNTRY_SIGNATURE_COMPLEXITY[countryId ?? ''] ?? 2;

  const roofColor = tuneRoofSaturation(rc, styleProfile.roofSaturationCap);
  const roofDarkColor = tuneRoofSaturation(rcd, styleProfile.roofSaturationCap);
  const wallColor = tuneWallColor(wc, styleProfile.wallLuminanceRange);
  const wallDarkColor = tuneWallColor(wcd, styleProfile.wallLuminanceRange);

  const w = size;
  const h = size * 0.92;
  const roofH = h * 0.35;
  const wallH = h * 0.45;
  const baseY = roofH;
  const isNight = getTimePhase() === 'night' || getTimePhase() === 'evening';
  const detailTier = size >= 170 ? 3 : size >= 140 ? 2 : 1;
  const enableMicroAnimations = animated && size >= 140;
  const blinkBias = ((countryId?.charCodeAt(0) ?? 7) + (countryId?.charCodeAt(1) ?? 11)) % 5;

  const smokeDrift = useSharedValue(0);
  const signatureSway = useSharedValue(0);
  const windowGlow = useSharedValue(0);
  const tapPulse = useSharedValue(0);

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
          withTiming(1, { duration: 1700 + blinkBias * 180, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(0.55 + blinkBias * 0.04, { duration: 1500 + blinkBias * 200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1, true,
      );
    }

    if (enableMicroAnimations) {
      signatureSway.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
          withTiming(-1, { duration: 2200, easing: Easing.bezier(0.37, 0, 0.63, 1) }),
        ),
        -1,
        true,
      );
    }

    return () => {
      cancelAnimation(smokeDrift);
      cancelAnimation(windowGlow);
      cancelAnimation(signatureSway);
      cancelAnimation(tapPulse);
    };
  }, [animated, isNight, enableMicroAnimations, signatureSway, smokeDrift, tapPulse, windowGlow, blinkBias]);

  const smokeProps = useAnimatedProps(() => ({
    opacity: interpolate(smokeDrift.value, [0, 1], [0.15, 0.35]),
    cy: interpolate(smokeDrift.value, [0, 1], [roofH * 0.1, roofH * 0.02]),
  }));

  const smoke2Props = useAnimatedProps(() => ({
    opacity: interpolate(smokeDrift.value, [0, 1], [0.1, 0.25]),
    cx: w * 0.74 + interpolate(smokeDrift.value, [0, 1], [0, 4]),
    cy: interpolate(smokeDrift.value, [0, 1], [roofH * 0.05, -roofH * 0.03]),
  }));

  const windowGlowProps = useAnimatedProps(() => ({
    opacity: isNight ? interpolate(windowGlow.value, [0.6, 1], [0.4, 0.7]) : 0,
  }));

  const signatureMotionProps = useAnimatedProps(() => ({
    transform: `translate(${interpolate(signatureSway.value, [-1, 1], [-0.7, 0.7])} ${interpolate(signatureSway.value, [-1, 1], [0.2, -0.2])})`,
    opacity: 1,
  }));

  const tapPulseProps = useAnimatedProps(() => ({
    rx: interpolate(tapPulse.value, [0, 1], [2, w * 0.12]),
    ry: interpolate(tapPulse.value, [0, 1], [1.5, w * 0.08]),
    opacity: interpolate(tapPulse.value, [0, 1], [0.5, 0]),
  }));

  return (
    <View
      style={[styles.container, { width: w }]}
      onTouchStart={() => {
        if (!enableMicroAnimations) return;
        tapPulse.value = withSequence(withTiming(1, { duration: 280 }), withTiming(0, { duration: 220 }));
      }}
    >
      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Backdrop layer */}
        {renderCountryBackdrop(countryId, w, h, baseY, wallH, accent)}

        {/* Ground shadow */}
        <Ellipse cx={w * 0.5} cy={baseY + wallH + 6} rx={w * 0.5} ry={10} fill="rgba(0,0,0,0.08)" />

        {/* Walkway */}
        {renderCountryPath(pathStyle, w, h, baseY, wallH, trim)}

        {/* Landscape decorations (behind house) */}
        {decorations.slice(0, Math.max(1, Math.ceil(decorations.length / 2))).map((d) => (
          <G key={d}>{renderDecoration(d, w, wallH, baseY)}</G>
        ))}

        {/* Walls */}
        {renderWalls(wallStyle, w, wallH, baseY, wallColor, wallDarkColor, trim)}
        {renderWallTexture(wallStyle, w, wallH, baseY, wallDarkColor)}
        <Rect x={w * 0.12} y={baseY + 2} width={w * 0.76} height={wallH * 0.16} fill="#FFFFFF" opacity={0.06 + detailTier * 0.01} rx={2} />

        {/* Roof */}
        {renderRoof(roofStyle, w, roofH, baseY, roofColor, roofDarkColor)}
        {renderRoofTexture(roofStyle, w, roofH, baseY, roofColor, roofDarkColor)}
        <Path d={`M ${w * 0.08} ${baseY + 1} Q ${w * 0.5} ${roofH * 0.14} ${w * 0.92} ${baseY + 1}`} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />

        {/* Chimney */}
        {renderChimney(roofStyle, w, roofH, roofColor, roofDarkColor)}

        {/* Chimney smoke (night) */}
        {isNight && enableMicroAnimations && roofStyle !== 'flat' && roofStyle !== 'flatDome' && roofStyle !== 'thatched' && roofStyle !== 'tiered' && (
          <G>
            <AnimatedEllipse cx={w * 0.745} rx={4} ry={4} fill="rgba(200,200,200,0.5)" animatedProps={smokeProps} />
            <AnimatedEllipse rx={3} ry={3} fill="rgba(200,200,200,0.4)" animatedProps={smoke2Props} />
          </G>
        )}

        {/* Door */}
        {renderDoor(doorStyle, w, wallH, baseY, dc, accent, trim)}
        <Rect x={w * 0.44} y={baseY + wallH * 0.97} width={w * 0.12} height={3} fill="#A1887F" rx={1} opacity={0.75} />
        <Rect x={w * 0.415} y={baseY + wallH + 1} width={w * 0.17} height={4} fill={accent} rx={1} opacity={0.45} />
        <AnimatedEllipse cx={w * 0.5} cy={baseY + wallH + 2} fill={accent} animatedProps={tapPulseProps} />

        {/* Windows */}
        {wallStyle !== 'round' && renderCountryWindows(windowStyle, w, wallH, baseY, isNight, trim, accent, windowGlowProps)}

        {/* Country signature details */}
        <AnimatedG animatedProps={signatureMotionProps}>
          {renderCountrySignature(countryId, signature, signatureLevel, w, baseY, wallH, accent, trim)}
        </AnimatedG>

        {/* Front foliage/details layer */}
        {decorations.slice(Math.max(1, Math.ceil(decorations.length / 2))).map((d, i) => (
          <G key={`${d}-front-${i}`} opacity={0.92}>{renderDecoration(d, w, wallH, baseY)}</G>
        ))}

        {/* Regional material cue */}
        <Rect
          x={w * 0.14}
          y={baseY + wallH - 4}
          width={w * 0.72}
          height={2}
          fill={styleProfile.region === 'mediterranean' ? '#E3F2FD' : styleProfile.region === 'africa' ? '#E6C28B' : trim}
          opacity={0.4}
        />

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
