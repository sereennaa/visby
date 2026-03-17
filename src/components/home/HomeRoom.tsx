/**
 * Home Room — Club Penguin / Sims style room with layered depth.
 * Window with light spill, textured wall with wainscoting and wallpaper motif,
 * staggered wood plank floor with knot marks, decorative rug with fringe,
 * corner shadow vignettes, furniture, and Visby.
 */

import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Text, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { DynamicWindow, RoomTintOverlay, ParallaxLayer, useRoomParallax, getTimePhase } from '../room/RoomAtmosphere';
import type { RoomCustomization, PlacedFurniture, VisbyAppearance, VisbyGrowthStage, EquippedCosmetics, VisbyMood } from '../../types';
import type { HouseRoom } from '../../config/countryRooms';
import { FURNITURE_CATALOG } from '../../config/furniture';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROOM_WIDTH = Math.min(SCREEN_WIDTH - spacing.lg * 2, 420);
const WINDOW_H = 100;
const WALL_H = 170;
const BASEBOARD_H = 10;
const FLOOR_H = 150;
const VISBY_SIZE = 92;
const WOOD_PLANK_COUNT = 8;
const WAINSCOT_RATIO = 0.36;
const TEXTURE_DOT_COUNT = 24;
const FRINGE_COUNT = 18;

export interface HomeRoomProps {
  homeRoom: HouseRoom;
  roomCustomization?: RoomCustomization | null;
  homeCountryId: string | null;
  roomLabel: string;
  windowSky: readonly (string | undefined)[];
  effectiveWallColor: string;
  effectiveFloorColor: string;
  visby: { name?: string; equipped?: EquippedCosmetics; currentMood?: string } | null;
  defaultAppearance: VisbyAppearance;
  getGrowthStage: () => VisbyGrowthStage;
  currentMood: VisbyMood;
  moodInfo: { label: string; icon: IconName };
  onTapVisby: () => void;
  onTapMood: () => void;
  canOpenMoodHint: boolean;
  onTapSubtitle: () => void;
}

const FURNITURE_MAP = new Map(FURNITURE_CATALOG.map(f => [f.id, f]));

function darkenHex(hex: string, amount: number): string {
  const match = hex.replace('#', '').match(/.{2}/g);
  if (!match) return hex;
  const r = Math.max(0, parseInt(match[0], 16) * (1 - amount));
  const g = Math.max(0, parseInt(match[1], 16) * (1 - amount));
  const b = Math.max(0, parseInt(match[2], 16) * (1 - amount));
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function lightenHex(hex: string, amount: number): string {
  const match = hex.replace('#', '').match(/.{2}/g);
  if (!match) return hex;
  const r = Math.min(255, parseInt(match[0], 16) + 255 * amount);
  const g = Math.min(255, parseInt(match[1], 16) + 255 * amount);
  const b = Math.min(255, parseInt(match[2], 16) + 255 * amount);
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
}

function getWoodPlankColors(floorColor: string): string[] {
  const darker = darkenHex(floorColor, 0.06);
  const lighter = lightenHex(floorColor, 0.04);
  const darkest = darkenHex(floorColor, 0.1);
  return Array.from({ length: WOOD_PLANK_COUNT }, (_, i) => {
    if (i % 4 === 0) return lighter;
    if (i % 4 === 1) return floorColor;
    if (i % 4 === 2) return darker;
    return darkest;
  });
}

const KNOT_POSITIONS = [
  { plank: 1, left: '25%', top: '40%' },
  { plank: 3, left: '60%', top: '55%' },
  { plank: 5, left: '35%', top: '30%' },
  { plank: 7, left: '70%', top: '50%' },
];

const TEXTURE_DOTS = Array.from({ length: TEXTURE_DOT_COUNT }, (_, i) => ({
  left: `${8 + ((i * 37) % 84)}%`,
  top: `${12 + ((i * 53) % 76)}%`,
  size: 2 + (i % 3),
}));

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
  const wainscotColor = darkenHex(effectiveWallColor, 0.1);
  const moldingColor = darkenHex(effectiveFloorColor, 0.15);
  const plankColors = getWoodPlankColors(effectiveFloorColor);
  const sway = useRoomParallax();
  const phase = getTimePhase();
  const isWarm = phase === 'evening' || phase === 'night';

  const hasLamp = placedItems.some((p) => {
    const item = FURNITURE_MAP.get(p.furnitureId);
    return item?.interactionType === 'lamp' || item?.icon === 'star';
  });
  const lampItem = placedItems.find((p) => {
    const item = FURNITURE_MAP.get(p.furnitureId);
    return item?.interactionType === 'lamp' || item?.icon === 'star';
  });

  return (
    <Animated.View entering={FadeInDown.duration(500).delay(200)} style={styles.wrap}>
      <View style={[styles.frame, { width: ROOM_WIDTH }]}>
        {/* WINDOW with frame, sky, curtains, and light spill */}
        <View style={styles.windowOuter}>
          <View style={styles.windowFrame}>
            <View style={styles.curtainLeft}>
              <View style={styles.curtainFold} />
              <View style={[styles.curtainFold, { marginLeft: 4 }]} />
            </View>
            <View style={styles.windowGlass}>
              <DynamicWindow width={ROOM_WIDTH - 80} height={WINDOW_H} overrideSky={windowSky} />
              {/* Glass reflection highlight */}
              <View style={styles.glassReflection} />
            </View>
            <View style={styles.mullionH} />
            <View style={styles.mullionV} />
            <View style={styles.curtainRight}>
              <View style={styles.curtainFold} />
              <View style={[styles.curtainFold, { marginLeft: 4 }]} />
            </View>
          </View>
          <View style={styles.windowSill}>
            <View style={styles.sillShadow} />
          </View>
        </View>

        {/* Light spill from window onto wall */}
        <View style={[styles.lightSpill, { pointerEvents: 'none' }]}>
          <LinearGradient
            colors={[colors.room.lightSpill, 'transparent']}
            style={StyleSheet.absoluteFill}
            locations={[0, 1]}
          />
        </View>

        {/* WALL with wainscoting and wallpaper texture */}
        <View style={[styles.wallWrap, { height: WALL_H }]}>
          <LinearGradient
            colors={[lightenHex(effectiveWallColor, 0.03), effectiveWallColor]}
            style={[StyleSheet.absoluteFill, { bottom: WALL_H * WAINSCOT_RATIO }]}
          />

          {/* Wallpaper texture: subtle dot motif */}
          <View style={[styles.wallpaperTexture, { pointerEvents: 'none' }]}>
            {TEXTURE_DOTS.map((dot, i) => (
              <View
                key={i}
                style={[
                  styles.textureDot,
                  { left: dot.left as any, top: dot.top as any, width: dot.size, height: dot.size, borderRadius: dot.size / 2 },
                ]}
              />
            ))}
          </View>

          {/* Corner shadow vignettes */}
          <View style={[styles.cornerShadowLeft, { pointerEvents: 'none' }]}>
            <LinearGradient
              colors={[colors.room.cornerShadow, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>
          <View style={[styles.cornerShadowRight, { pointerEvents: 'none' }]}>
            <LinearGradient
              colors={[colors.room.cornerShadow, 'transparent']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </View>

          {/* Wainscoting */}
          <View style={[styles.wainscoting, { height: WALL_H * WAINSCOT_RATIO, backgroundColor: wainscotColor }]}>
            <View style={styles.wainscotPanels}>
              {[0, 1, 2, 3, 4].map(i => (
                <View key={i} style={styles.wainscotPanel}>
                  <View style={styles.wainscotPanelInner} />
                </View>
              ))}
            </View>
            <View style={[styles.chairRail, { backgroundColor: darkenHex(wainscotColor, 0.08) }]} />
          </View>

          <Caption style={styles.roomLabel}>{roomLabel}</Caption>

          {/* Picture frames with parallax */}
          <ParallaxLayer depth={-0.5} sway={sway}>
            <View style={styles.pictureGroup}>
              <View style={styles.pictureFrame}>
                <LinearGradient colors={['#B8D4E3', '#8FB8D0', '#A0C4D8']} style={styles.painting} />
              </View>
              <View style={[styles.pictureFrameSmall, { marginLeft: 12 }]}>
                <LinearGradient colors={['#E8C8A0', '#D4B088', '#C8A070']} style={styles.paintingSmall} />
              </View>
            </View>
          </ParallaxLayer>

          {/* Default room objects */}
          {(homeRoom.objects ?? []).map((obj: any) => (
            <View key={obj.id} style={[styles.objPos, { left: `${obj.x}%` as any, top: `${obj.y}%` as any, pointerEvents: 'none' }]}>
              <RoomObjectVisual icon={obj.icon as IconName} />
            </View>
          ))}
          {/* Placed furniture */}
          {placedItems.map((placed) => {
            const catalogItem = FURNITURE_MAP.get(placed.furnitureId);
            if (!catalogItem) return null;
            return (
              <View key={placed.id} style={[styles.placedPos, { left: `${placed.x}%` as any, top: `${placed.y}%` as any, pointerEvents: 'none' }]}>
                {catalogItem.interactionType ? (
                  <FurnitureVisual interactionType={catalogItem.interactionType} icon={catalogItem.icon as IconName} size="small" />
                ) : (
                  <RoomObjectVisual icon={catalogItem.icon as IconName} />
                )}
              </View>
            );
          })}
        </View>

        {/* BASEBOARD MOLDING */}
        <View style={styles.moldingWrap}>
          <View style={[styles.moldingTop, { backgroundColor: moldingColor }]} />
          <View style={[styles.moldingBottom, { backgroundColor: darkenHex(moldingColor, 0.06) }]} />
          <View style={styles.moldingShadow} />
        </View>

        {/* FLOOR with staggered planks, knot marks, and decorative rug */}
        <View style={[styles.floorWrap, { height: FLOOR_H }]}>
          {plankColors.map((color, i) => {
            const isStaggered = i % 2 === 1;
            const hasKnot = KNOT_POSITIONS.find(k => k.plank === i);
            return (
              <View key={i} style={styles.plankRow}>
                <View style={[styles.plank, { backgroundColor: color }]}>
                  {/* Staggered offset effect */}
                  {isStaggered && <View style={styles.plankStagger} />}
                  {/* Grain lines */}
                  <View style={[styles.grainLine, { top: '28%', opacity: 0.05 }]} />
                  <View style={[styles.grainLine, { top: '62%', opacity: 0.04 }]} />
                  {/* Knot marks */}
                  {hasKnot && (
                    <View style={[styles.knotMark, { left: hasKnot.left as any, top: hasKnot.top as any }]} />
                  )}
                </View>
                {i < plankColors.length - 1 && <View style={styles.plankGap} />}
              </View>
            );
          })}

          {/* Decorative rug with fringe */}
          <View style={styles.rug}>
            {/* Fringe left */}
            <View style={styles.fringeLeft}>
              {Array.from({ length: FRINGE_COUNT }).map((_, i) => (
                <View key={i} style={[styles.fringeLine, { height: 5 + (i % 3) }]} />
              ))}
            </View>
            <View style={styles.rugBody}>
              <View style={styles.rugBorder} />
              <View style={styles.rugInnerBorder} />
              <View style={styles.rugCenter}>
                <View style={styles.rugDiamond} />
              </View>
            </View>
            {/* Fringe right */}
            <View style={styles.fringeRight}>
              {Array.from({ length: FRINGE_COUNT }).map((_, i) => (
                <View key={i} style={[styles.fringeLine, { height: 5 + (i % 3) }]} />
              ))}
            </View>
          </View>

          {/* Ambient warmth overlay for evening/night */}
          {isWarm && (
            <View style={[styles.ambientWarm, { pointerEvents: 'none' }]}>
              <LinearGradient
                colors={['transparent', colors.room.ambientWarm]}
                style={StyleSheet.absoluteFill}
              />
            </View>
          )}

          <RoomTintOverlay hasLamp={hasLamp} lampX={lampItem?.x} lampY={lampItem?.y} />

          {/* Visby character */}
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
                style={styles.moodBubble}
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

function RoomObjectVisual({ icon }: { icon: IconName }) {
  if (icon === 'book') return <FurnitureVisual interactionType="bookshelf" icon="book" size="small" showHint={false} />;
  if (icon === 'star') {
    return (
      <View style={styles.lamp}>
        <View style={styles.lampShade} />
        <View style={styles.lampNeck} />
        <View style={styles.lampBase} />
      </View>
    );
  }
  if (icon === 'culture' || icon === 'nature') {
    return (
      <View style={styles.plant}>
        <View style={styles.plantLeaves} />
        <View style={styles.plantPot} />
      </View>
    );
  }
  if (icon === 'edit') {
    return (
      <View style={styles.miniFrame}>
        <LinearGradient colors={['#D4B088', '#C8A070', '#B89060']} style={styles.miniFrameInner} />
      </View>
    );
  }
  return (
    <View style={styles.objFallback}>
      <Icon name={icon} size={22} color={colors.text.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: spacing.lg, alignItems: 'center' },
  frame: {
    borderRadius: 24, overflow: 'hidden', backgroundColor: colors.base.cream,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.25)',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 16px rgba(0,0,0,0.12)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 6 }),
  },

  // Window
  windowOuter: {
    width: '100%', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 0,
    backgroundColor: 'rgba(255,250,242,0.98)',
  },
  windowFrame: {
    borderRadius: 14, overflow: 'hidden', borderWidth: 4,
    borderColor: colors.room.windowFrame, backgroundColor: colors.room.windowGlass,
    flexDirection: 'row', height: WINDOW_H,
  },
  windowGlass: { flex: 1, position: 'relative' },
  glassReflection: {
    position: 'absolute', top: 8, left: '15%', right: '50%', height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: 1,
    transform: [{ rotate: '-8deg' }],
  },
  mullionH: {
    position: 'absolute', left: 0, right: 0, top: '50%', height: 3,
    backgroundColor: 'rgba(200,190,175,0.7)',
  },
  mullionV: {
    position: 'absolute', top: 0, bottom: 0, left: '50%', width: 3,
    backgroundColor: 'rgba(200,190,175,0.7)',
  },
  curtainLeft: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 22,
    backgroundColor: colors.room.curtain, flexDirection: 'row', zIndex: 2,
  },
  curtainRight: {
    position: 'absolute', right: 0, top: 0, bottom: 0, width: 22,
    backgroundColor: colors.room.curtain, flexDirection: 'row', zIndex: 2,
  },
  curtainFold: {
    width: 6, height: '100%', backgroundColor: colors.room.curtainFold,
    borderRadius: 2,
  },
  windowSill: {
    height: 10, width: '100%', marginTop: -1,
    backgroundColor: colors.room.sill, borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },
  sillShadow: {
    height: 3, width: '100%', backgroundColor: colors.room.cornerShadow,
    borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },

  // Light spill below window
  lightSpill: {
    position: 'absolute', top: WINDOW_H + 28, left: '20%', right: '20%', height: 40,
    borderRadius: 20, opacity: 0.7,
  },

  // Wall
  wallWrap: { width: '100%', position: 'relative' },
  wallpaperTexture: {
    ...StyleSheet.absoluteFillObject, zIndex: 1,
  },
  textureDot: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
  cornerShadowLeft: {
    position: 'absolute', top: 0, left: 0, width: 50, height: 60, zIndex: 1,
  },
  cornerShadowRight: {
    position: 'absolute', top: 0, right: 0, width: 50, height: 60, zIndex: 1,
  },
  wainscoting: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },
  wainscotPanels: {
    flex: 1, flexDirection: 'row', paddingHorizontal: 10, paddingTop: 6, gap: 6,
  },
  wainscotPanel: {
    flex: 1, borderRadius: 3, borderWidth: 1, borderColor: colors.room.wainscot,
    backgroundColor: 'rgba(255,255,255,0.08)', padding: 3,
  },
  wainscotPanelInner: {
    flex: 1, borderRadius: 2, borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chairRail: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 4, borderRadius: 1,
  },
  roomLabel: {
    position: 'absolute', left: 0, right: 0, top: 8, textAlign: 'center',
    fontSize: 13, fontWeight: '600', color: colors.text.secondary, zIndex: 2,
  },
  pictureGroup: {
    position: 'absolute', flexDirection: 'row', left: '50%', top: 28,
    transform: [{ translateX: -52 }],
  },
  pictureFrame: {
    width: 56, height: 44, borderRadius: 4,
    backgroundColor: 'rgba(100,85,70,0.7)', borderWidth: 3, borderColor: 'rgba(80,65,50,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 3,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.15)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 3 }),
  },
  painting: { width: '100%', height: '100%', borderRadius: 2 },
  pictureFrameSmall: {
    width: 36, height: 36, borderRadius: 4,
    backgroundColor: 'rgba(100,85,70,0.7)', borderWidth: 2.5, borderColor: 'rgba(80,65,50,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 2,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 3px rgba(0,0,0,0.12)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.12, shadowRadius: 3, elevation: 2 }),
  },
  paintingSmall: { width: '100%', height: '100%', borderRadius: 2 },
  objPos: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
    transform: [{ translateX: -24 }, { translateY: -20 }],
  },
  placedPos: {
    position: 'absolute', alignItems: 'center', justifyContent: 'center',
    transform: [{ translateX: -28 }, { translateY: -24 }],
  },

  // Baseboard molding
  moldingWrap: { width: '100%' },
  moldingTop: { height: 5, width: '100%' },
  moldingBottom: { height: 4, width: '100%' },
  moldingShadow: { height: 3, width: '100%', backgroundColor: colors.room.cornerShadow },

  // Floor
  floorWrap: { width: '100%', position: 'relative', flexDirection: 'column' },
  plankRow: { flex: 1 },
  plank: { flex: 1, width: '100%', position: 'relative', overflow: 'hidden' },
  plankStagger: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.015)',
    borderRightWidth: 1, borderRightColor: colors.room.plankGap,
  },
  plankGap: { height: 1, width: '100%', backgroundColor: colors.room.plankGap },
  grainLine: {
    position: 'absolute', left: '10%', right: '10%', height: 1,
    backgroundColor: colors.room.grainLine, borderRadius: 1,
  },
  knotMark: {
    position: 'absolute', width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    borderWidth: 0.5, borderColor: 'rgba(0, 0, 0, 0.04)',
  },

  // Rug with fringe
  rug: {
    position: 'absolute', alignSelf: 'center', top: '30%',
    flexDirection: 'row', alignItems: 'center',
  },
  fringeLeft: {
    flexDirection: 'column', gap: 1, marginRight: -1,
  },
  fringeRight: {
    flexDirection: 'column', gap: 1, marginLeft: -1,
  },
  fringeLine: {
    width: 6, backgroundColor: 'rgba(140, 95, 65, 0.25)', borderRadius: 1,
  },
  rugBody: {
    width: 140, height: 64, borderRadius: 4,
    backgroundColor: colors.room.rugPrimary, position: 'relative',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 4px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }),
  },
  rugBorder: {
    ...StyleSheet.absoluteFillObject, borderRadius: 4,
    borderWidth: 3, borderColor: colors.room.rugBorder,
  },
  rugInnerBorder: {
    position: 'absolute', top: 7, left: 7, right: 7, bottom: 7,
    borderRadius: 2, borderWidth: 1, borderColor: 'rgba(160, 120, 80, 0.15)',
  },
  rugCenter: {
    position: 'absolute', alignSelf: 'center', top: 14,
    width: 100, height: 36, borderRadius: 2,
    backgroundColor: colors.room.rugCenter, alignItems: 'center', justifyContent: 'center',
  },
  rugDiamond: {
    width: 16, height: 16, borderRadius: 2,
    backgroundColor: colors.room.rugPattern,
    transform: [{ rotate: '45deg' }],
  },

  // Ambient warm overlay
  ambientWarm: {
    ...StyleSheet.absoluteFillObject,
  },

  // Room objects
  lamp: { width: 30, height: 42, alignItems: 'center' },
  lampShade: {
    width: 26, height: 16, borderTopLeftRadius: 13, borderTopRightRadius: 13,
    backgroundColor: 'rgba(255,248,235,0.95)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.08)',
  },
  lampNeck: { width: 4, height: 8, backgroundColor: 'rgba(180,170,160,0.9)' },
  lampBase: {
    width: 16, height: 6, borderRadius: 3, backgroundColor: 'rgba(170,160,150,0.9)',
    marginTop: 1,
  },
  plant: { width: 36, height: 42, alignItems: 'center' },
  plantLeaves: {
    width: 30, height: 24, borderRadius: 15,
    backgroundColor: 'rgba(75,120,75,0.85)',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 2px rgba(0,0,0,0.1)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }),
  },
  plantPot: {
    width: 20, height: 16, marginTop: -4,
    borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
    backgroundColor: 'rgba(180,140,100,0.9)', borderWidth: 1, borderColor: 'rgba(150,110,75,0.5)',
  },
  miniFrame: {
    width: 40, height: 32, borderRadius: 4,
    backgroundColor: 'rgba(100,85,70,0.8)', borderWidth: 2.5, borderColor: 'rgba(80,65,50,0.6)',
    alignItems: 'center', justifyContent: 'center', padding: 3,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 2px rgba(0,0,0,0.1)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }),
  },
  miniFrameInner: { width: '100%', height: '100%', borderRadius: 2 },
  objFallback: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: 'rgba(255,252,248,0.95)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.overlay.softBlack,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }),
  },

  // Visby
  visbyTouch: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  visbyWrap: { alignItems: 'center', width: VISBY_SIZE, height: VISBY_SIZE + 30 },
  visbyShadow: {
    position: 'absolute', bottom: 4, width: VISBY_SIZE * 0.6, height: 14,
    borderRadius: 7, backgroundColor: 'rgba(0,0,0,0.1)',
  },
  moodBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginTop: 6, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 14,
    backgroundColor: colors.base.cream,
    borderWidth: 1, borderColor: colors.journey.cardBorder,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 2px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2 }),
  },
  moodLabel: { fontFamily: 'Nunito-Bold', fontSize: 12, color: colors.primary.wisteriaDark },
  subtitle: { marginTop: spacing.sm },
});

export default HomeRoom;
