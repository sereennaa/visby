/**
 * Home Room — full reconstruction for a Club Penguin / Sims style space.
 * Clear layers: window (with frame), wall (wainscoting + wallpaper), baseboard, wood floor + rug, Visby.
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { HouseRoom, RoomCustomization, PlacedFurniture } from '../../types';
import type { VisbyAppearance, VisbyGrowthStage } from '../../types';
import { FURNITURE_CATALOG } from '../../config/furniture';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Room proportions — feels like a real room
const ROOM_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 400);
const WINDOW_H = 88;
const WALL_H = 132;
const BASEBOARD_H = 14;
const FLOOR_H = 110;
const VISBY_SIZE = 88;

const WOOD_PLANK_COUNT = 6;
const WAINSCOT_RATIO = 0.38; // bottom 38% of wall is wainscoting

export interface HomeRoomProps {
  homeRoom: HouseRoom;
  roomCustomization?: RoomCustomization | null;
  homeCountryId: string | null;
  roomLabel: string;
  windowSky: readonly string[];
  effectiveWallColor: string;
  effectiveFloorColor: string;
  visby: { name?: string; equipped?: unknown; currentMood?: string } | null;
  defaultAppearance: VisbyAppearance;
  getGrowthStage: () => VisbyGrowthStage;
  currentMood: string;
  moodInfo: { label: string; icon: IconName };
  onTapVisby: () => void;
  onTapMood: () => void;
  canOpenMoodHint: boolean;
  onTapSubtitle: () => void;
}

export function HomeRoom({
  homeRoom,
  roomCustomization,
  homeCountryId,
  roomLabel,
  windowSky,
  effectiveWallColor,
  effectiveFloorColor,
  visby,
  defaultAppearance,
  getGrowthStage,
  currentMood,
  moodInfo,
  onTapVisby,
  onTapMood,
  canOpenMoodHint,
  onTapSubtitle,
}: HomeRoomProps) {
  const placedItems: PlacedFurniture[] = roomCustomization?.placedFurniture ?? [];
  const baseboardColor = '#8B7355';
  const wainscotColor = darkenHex(effectiveWallColor, 0.12);
  const plankColors = getWoodPlankColors(effectiveFloorColor);

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.wrap}>
      <View style={[styles.frame, { width: ROOM_WIDTH }]}>
        {/* ─── WINDOW: real frame + sky ─── */}
        <View style={styles.windowOuter}>
          <View style={styles.windowTrim}>
            <LinearGradient
              colors={[...windowSky]}
              style={styles.windowGlass}
              locations={[0, 0.5, 1]}
            />
            <View style={styles.windowSill} />
          </View>
        </View>

        {/* ─── WALL: wainscoting + wallpaper ─── */}
        <View style={[styles.wallWrap, { height: WALL_H }]}>
          <LinearGradient
            colors={[effectiveWallColor, effectiveWallColor, wainscotColor, wainscotColor]}
            locations={[0, 1 - WAINSCOT_RATIO, 1 - WAINSCOT_RATIO, 1]}
            style={StyleSheet.absoluteFill}
          />
          {/* Wallpaper stripe pattern (subtle) */}
          <View style={styles.wallPattern}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.wallStripe, { left: i * 25 + '%', backgroundColor: 'rgba(255,255,255,0.03)' }]} />
            ))}
          </View>
          <Caption style={styles.roomLabel}>{roomLabel}</Caption>
          {/* Picture frame */}
          <View style={styles.pictureFrame}>
            <View style={styles.pictureInner} />
          </View>
          {/* Default room objects as small furniture */}
          {(homeRoom.objects ?? []).map((obj) => (
            <View key={obj.id} style={[styles.objPos, { left: obj.x + '%', top: obj.y + '%' }]} pointerEvents="none">
              <RoomObjectVisual icon={obj.icon as IconName} />
            </View>
          ))}
          {placedItems.map((placed) => {
            const catalogItem = FURNITURE_CATALOG.find((f) => f.id === placed.furnitureId);
            if (!catalogItem) return null;
            return (
              <View key={placed.id} style={[styles.placedPos, { left: placed.x + '%', top: placed.y + '%' }]} pointerEvents="none">
                {catalogItem.interactionType ? (
                  <FurnitureVisual
                    interactionType={catalogItem.interactionType}
                    icon={catalogItem.icon as IconName}
                    size="small"
                  />
                ) : (
                  <RoomObjectVisual icon={catalogItem.icon as IconName} />
                )}
              </View>
            );
          })}
        </View>

        {/* ─── BASEBOARD ─── */}
        <View style={[styles.baseboard, { height: BASEBOARD_H, backgroundColor: baseboardColor }]} />

        {/* ─── FLOOR: wood planks + rug + Visby ─── */}
        <View style={[styles.floorWrap, { height: FLOOR_H }]}>
          {plankColors.map((color, i) => (
            <View key={i} style={[styles.plank, { backgroundColor: color, borderBottomColor: i < plankColors.length - 1 ? 'rgba(0,0,0,0.1)' : 'transparent' }]} />
          ))}
          <View style={styles.rug} />
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={onTapVisby}
            style={styles.visbyTouch}
            accessibilityRole="button"
            accessibilityLabel={`${visby?.name || 'Visby'}, ${moodInfo.label}. Tap to chat.`}
          >
            <View style={styles.visbyWrap}>
              <View style={styles.visbyShadow} />
              <VisbyCharacter
                appearance={defaultAppearance}
                equipped={visby?.equipped}
                mood={currentMood}
                size={VISBY_SIZE}
                animated
                stage={getGrowthStage()}
              />
              <TouchableOpacity
                style={[styles.moodBubble, { backgroundColor: colors.base.cream }]}
                onPress={onTapMood}
                activeOpacity={canOpenMoodHint ? 0.7 : 1}
                disabled={!canOpenMoodHint}
              >
                <Icon name={moodInfo.icon} size={14} color={colors.primary.wisteriaDark} />
                <Text style={styles.moodLabel}>{moodInfo.label}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.subtitle} onPress={onTapSubtitle} activeOpacity={0.8}>
        <Caption color={colors.text.muted}>{visby?.name || 'Your Visby'} · Tap to chat or customize</Caption>
      </TouchableOpacity>
    </Animated.View>
  );
}

function darkenHex(hex: string, amount: number): string {
  const match = hex.replace('#', '').match(/.{2}/g);
  if (!match) return hex;
  const r = Math.max(0, parseInt(match[0], 16) * (1 - amount));
  const g = Math.max(0, parseInt(match[1], 16) * (1 - amount));
  const b = Math.max(0, parseInt(match[2], 16) * (1 - amount));
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function getWoodPlankColors(floorColor: string): string[] {
  const base = floorColor;
  const darker = darkenHex(floorColor, 0.06);
  const lighter = lightenHex(floorColor, 0.04);
  return Array.from({ length: WOOD_PLANK_COUNT }, (_, i) => (i % 3 === 0 ? lighter : i % 3 === 1 ? base : darker));
}

function lightenHex(hex: string, amount: number): string {
  const match = hex.replace('#', '').match(/.{2}/g);
  if (!match) return hex;
  const r = Math.min(255, parseInt(match[0], 16) + 255 * amount);
  const g = Math.min(255, parseInt(match[1], 16) + 255 * amount);
  const b = Math.min(255, parseInt(match[2], 16) + 255 * amount);
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function RoomObjectVisual({ icon }: { icon: IconName }) {
  if (icon === 'book') {
    return <FurnitureVisual interactionType="bookshelf" icon="book" size="small" showHint={false} />;
  }
  if (icon === 'star') {
    return (
      <View style={styles.lamp}>
        <View style={styles.lampShade} />
        <View style={styles.lampBase} />
      </View>
    );
  }
  if (icon === 'culture' || icon === 'nature') {
    return (
      <View style={styles.plant}>
        <View style={styles.plantPot} />
        <View style={styles.plantLeaves} />
      </View>
    );
  }
  if (icon === 'edit') {
    return (
      <View style={styles.miniFrame}>
        <View style={styles.miniFrameInner} />
      </View>
    );
  }
  return (
    <View style={styles.objFallback}>
      <Icon name={icon} size={20} color={colors.text.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  frame: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: colors.base.cream,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.25)',
  },
  windowOuter: {
    width: '100%',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: 'rgba(255,250,242,0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(180,160,140,0.3)',
  },
  windowTrim: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(220,210,195,0.9)',
    backgroundColor: 'rgba(240,235,228,0.5)',
  },
  windowGlass: {
    width: '100%',
    height: WINDOW_H - 16,
    borderRadius: 9,
  },
  windowSill: {
    height: 6,
    width: '100%',
    backgroundColor: 'rgba(200,190,178,0.8)',
  },
  wallWrap: {
    width: '100%',
    position: 'relative',
  },
  wallPattern: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    pointerEvents: 'none',
  },
  wallStripe: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '20%',
  },
  roomLabel: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  pictureFrame: {
    position: 'absolute',
    left: '50%',
    top: 24,
    marginLeft: -26,
    width: 52,
    height: 40,
    borderRadius: 6,
    backgroundColor: 'rgba(180,165,150,0.9)',
    borderWidth: 3,
    borderColor: 'rgba(100,85,70,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pictureInner: {
    width: 38,
    height: 28,
    borderRadius: 2,
    backgroundColor: 'rgba(220,210,200,0.9)',
  },
  objPos: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -21 }, { translateY: -18 }],
  },
  placedPos: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -22 }, { translateY: -16 }],
  },
  lamp: {
    width: 28,
    height: 36,
    alignItems: 'center',
  },
  lampShade: {
    width: 24,
    height: 14,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'rgba(255,248,240,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  lampBase: {
    width: 12,
    height: 14,
    borderRadius: 2,
    backgroundColor: 'rgba(180,170,160,0.9)',
    marginTop: 2,
  },
  plant: {
    width: 32,
    height: 36,
    alignItems: 'center',
  },
  plantPot: {
    width: 22,
    height: 14,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: 'rgba(180,140,100,0.9)',
  },
  plantLeaves: {
    position: 'absolute',
    top: 0,
    width: 28,
    height: 22,
    borderRadius: 14,
    backgroundColor: 'rgba(80,120,80,0.85)',
  },
  miniFrame: {
    width: 36,
    height: 28,
    borderRadius: 4,
    backgroundColor: 'rgba(160,150,140,0.9)',
    borderWidth: 2,
    borderColor: 'rgba(90,80,70,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniFrameInner: {
    width: 26,
    height: 18,
    borderRadius: 2,
    backgroundColor: 'rgba(220,210,200,0.9)',
  },
  objFallback: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,252,248,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  baseboard: {
    width: '100%',
  },
  floorWrap: {
    width: '100%',
    position: 'relative',
    flexDirection: 'column',
  },
  plank: {
    flex: 1,
    width: '100%',
    borderBottomWidth: 1,
  },
  rug: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -FLOOR_H * 0.35,
    width: 130,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(120,80,60,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(80,60,40,0.25)',
  },
  visbyTouch: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visbyWrap: {
    alignItems: 'center',
    width: VISBY_SIZE,
    height: VISBY_SIZE + 28,
  },
  visbyShadow: {
    position: 'absolute',
    bottom: 2,
    width: VISBY_SIZE * 0.5,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  moodBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.3)',
  },
  moodLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.primary.wisteriaDark,
  },
  subtitle: {
    marginTop: spacing.sm,
  },
});

export default HomeRoom;
