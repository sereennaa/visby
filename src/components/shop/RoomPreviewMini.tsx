import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, Line } from 'react-native-svg';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { FurnitureItem } from '../../types';

interface RoomPreviewMiniProps {
  width?: number;
  height?: number;
  wallColor?: string;
  floorColor?: string;
  furnitureItem?: FurnitureItem;
}

export const RoomPreviewMini: React.FC<RoomPreviewMiniProps> = ({
  width = 200,
  height = 150,
  wallColor = '#FAF0E6',
  floorColor = '#D4C5A0',
  furnitureItem,
}) => {
  const wallH = height * 0.6;
  const floorH = height * 0.4;
  const baseboard = 3;

  return (
    <View style={[styles.container, { width, height }]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Rect x={0} y={0} width={width} height={wallH} fill={wallColor} />
        <Polygon
          points={`0,${wallH} ${width},${wallH} ${width},${height} 0,${height}`}
          fill={floorColor}
        />
        <Line x1={0} y1={wallH} x2={width} y2={wallH} stroke="#C0B090" strokeWidth={baseboard} />
        <Line x1={0} y1={wallH - 20} x2={width} y2={wallH - 20} stroke={`${wallColor}BB`} strokeWidth={0.5} />
      </Svg>
      {furnitureItem && (
        <View style={[styles.furnitureContainer, { bottom: floorH * 0.2, left: (width - 64) / 2 }]}>
          <FurnitureVisual
            item={furnitureItem}
            size={64}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  furnitureContainer: {
    position: 'absolute',
  },
});
