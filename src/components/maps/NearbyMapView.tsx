import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { STAMP_TYPES_INFO } from '../../config/constants';
import type { SampleLocation } from '../../config/locations';
import type { StampType } from '../../types';

const MAP_HEIGHT = 160;
const YOU_DOT_SIZE = 36;
const PLACE_DOT_SIZE = 24;
const MAX_DISTANCE_KM = 5;

/** Position a place on the map: angle from index, radius from distance (closer = nearer center). */
function getPlacePosition(index: number, distanceKm: number): { xPercent: number; yPercent: number } {
  const angle = (index / 6) * 2 * Math.PI - Math.PI / 2;
  const radiusPercent = 15 + Math.min((distanceKm / MAX_DISTANCE_KM) * 30, 30);
  const x = 50 + radiusPercent * Math.cos(angle);
  const y = 50 + radiusPercent * Math.sin(angle);
  return { xPercent: x, yPercent: y };
}

type NearbyMapViewProps = {
  locations: SampleLocation[];
  onPlacePress?: (locationId: string) => void;
};

/** Illustrated "nearby" map: You in the center, places as dots by distance. */
export const NearbyMapView: React.FC<NearbyMapViewProps> = ({ locations, onPlacePress }) => {
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const mapWidth = SCREEN_WIDTH - spacing.screenPadding * 2;
  const places = locations.slice(0, 8);

  return (
    <View style={styles.wrap}>
      <Text variant="caption" style={styles.caption}>
        See where places are around you.
      </Text>
      <View style={[styles.canvas, { width: mapWidth, height: MAP_HEIGHT }]}>
        <LinearGradient
          colors={[colors.base.cream + 'ee', colors.calm.skyLight + 'cc', colors.primary.wisteriaFaded + '66']}
          style={StyleSheet.absoluteFill}
        />
        {/* You are here */}
        <Text variant="caption" style={[styles.youLabel, { left: mapWidth / 2 - 20, top: MAP_HEIGHT / 2 - YOU_DOT_SIZE / 2 - 16 }]} numberOfLines={1}>
          You
        </Text>
        <View
          style={[
            styles.youDot,
            {
              left: mapWidth / 2 - YOU_DOT_SIZE / 2,
              top: MAP_HEIGHT / 2 - YOU_DOT_SIZE / 2,
            },
          ]}
        >
          <Icon name="location" size={20} color={colors.primary.wisteriaDark} />
        </View>
        {/* Place dots */}
        {places.map((loc, index) => {
          const { xPercent, yPercent } = getPlacePosition(index, loc.distanceKm);
          const left = (xPercent / 100) * mapWidth - PLACE_DOT_SIZE / 2;
          const top = (yPercent / 100) * MAP_HEIGHT - PLACE_DOT_SIZE / 2;
          const typeInfo = STAMP_TYPES_INFO[loc.type as StampType] || STAMP_TYPES_INFO.landmark;
          const content = (
            <View style={[styles.placeDot, { backgroundColor: typeInfo.color + 'ee', borderColor: typeInfo.color }]}>
              <Icon name={typeInfo.icon} size={12} color={typeInfo.color} />
            </View>
          );
          return (
            <TouchableOpacity
              key={loc.id}
              style={[styles.placeDotWrap, { left: Math.max(4, Math.min(mapWidth - PLACE_DOT_SIZE - 4, left)), top: Math.max(4, Math.min(MAP_HEIGHT - PLACE_DOT_SIZE - 4, top)) }]}
              onPress={() => onPlacePress?.(loc.id)}
              activeOpacity={0.8}
              accessibilityLabel={`${loc.name}, ${loc.distanceKm < 1 ? `${Math.round(loc.distanceKm * 1000)} m` : `${loc.distanceKm.toFixed(1)} km`} away`}
            >
              {content}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  caption: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  canvas: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight + '50',
    overflow: 'hidden',
    position: 'relative',
  },
  youDot: {
    position: 'absolute',
    width: YOU_DOT_SIZE,
    height: YOU_DOT_SIZE,
    borderRadius: YOU_DOT_SIZE / 2,
    backgroundColor: colors.primary.wisteriaFaded,
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
  },
  youLabel: {
    position: 'absolute',
    width: 40,
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: colors.primary.wisteriaDark,
  },
  placeDotWrap: {
    position: 'absolute',
    width: PLACE_DOT_SIZE,
    height: PLACE_DOT_SIZE,
  },
  placeDot: {
    width: PLACE_DOT_SIZE,
    height: PLACE_DOT_SIZE,
    borderRadius: PLACE_DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NearbyMapView;
