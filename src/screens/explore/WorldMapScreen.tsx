import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient as SvgRadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { getWorldMapPosition, getWorldMapLabel } from '../../config/worldMapPositions';
import { getCountryLocations } from '../../config/learningContent';
import { WorldMapBackground } from '../../components/maps/WorldMapBackground';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { ExploreStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_VIEW_PADDING = spacing.screenPadding * 2;
const MAP_VIEW_WIDTH = SCREEN_WIDTH - MAP_VIEW_PADDING;
const MAP_VIEW_HEIGHT = 270;
const WORLD_DOT_SIZE = 30;
const RING_RADIUS = 13;
const RING_STROKE = 2.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const RING_COLORS = ['#FF9F43', '#4CAF50', '#42A5F5', '#AB47BC'];

const ProgressRing: React.FC<{ progress: number[]; size: number }> = ({ progress, size }) => {
  const total = progress.reduce((s, v) => s + v, 0) / progress.length;
  if (total === 0) return null;

  return (
    <Svg width={size} height={size} style={{ position: 'absolute', left: 0, top: 0 }}>
      {progress.map((p, i) => {
        const segmentLen = RING_CIRCUMFERENCE / progress.length;
        const dashLen = segmentLen * Math.min(p, 1);
        const gapLen = RING_CIRCUMFERENCE - dashLen;
        const offset = -(i * segmentLen) + RING_CIRCUMFERENCE * 0.25;
        return (
          <Circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={RING_RADIUS}
            fill="none"
            stroke={RING_COLORS[i % RING_COLORS.length]}
            strokeWidth={RING_STROKE}
            strokeDasharray={`${dashLen} ${gapLen}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            opacity={0.85}
          />
        );
      })}
    </Svg>
  );
};

const DotGlow: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <Svg width={size + 12} height={size + 12} style={{ position: 'absolute', left: -6, top: -6 }}>
    <Defs>
      <SvgRadialGradient id="glow" cx="50%" cy="50%" r="50%">
        <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <Stop offset="100%" stopColor={color} stopOpacity="0" />
      </SvgRadialGradient>
    </Defs>
    <Circle cx={(size + 12) / 2} cy={(size + 12) / 2} r={(size + 12) / 2} fill="url(#glow)" />
  </Svg>
);

type WorldMapScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'WorldMap'>;
};

type ViewMode = 'list' | 'map';

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const userHouses = useStore(s => s.userHouses);
  const countryProgress = useStore(s => s.countryProgress);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const visitedCountries = user?.visitedCountries ?? [];
  const hasHouse = (countryId: string) => userHouses.some((h) => h.countryId === countryId);

  const progressPct = COUNTRIES.length > 0 ? Math.round((visitedCountries.length / COUNTRIES.length) * 100) : 0;

  const getCountryRingProgress = (countryId: string): number[] => {
    const cp = countryProgress[countryId];
    if (!cp) return [0, 0, 0, 0];
    const country = COUNTRIES.find((c) => c.id === countryId);
    const totalFacts = country?.facts?.length || 5;
    const totalLocations = getCountryLocations(countryId).length || 1;
    return [
      Math.min((cp.factsReadCount || 0) / totalFacts, 1),
      cp.quizCompleted ? 1 : 0,
      Math.min((cp.gamesPlayedCount || 0) / 3, 1),
      Math.min((cp.factsReadCount || 0) / totalLocations, 1),
    ];
  };

  const journeyTrails = useMemo(() => {
    if (visitedCountries.length < 2) return [];
    const trails: { x1: number; y1: number; x2: number; y2: number }[] = [];
    for (let i = 0; i < visitedCountries.length - 1; i++) {
      const pos1 = getWorldMapPosition(visitedCountries[i]);
      const pos2 = getWorldMapPosition(visitedCountries[i + 1]);
      if (pos1 && pos2) {
        trails.push({
          x1: (pos1.xPercent / 100) * MAP_VIEW_WIDTH,
          y1: (pos1.yPercent / 100) * MAP_VIEW_HEIGHT,
          x2: (pos2.xPercent / 100) * MAP_VIEW_WIDTH,
          y2: (pos2.yPercent / 100) * MAP_VIEW_HEIGHT,
        });
      }
    }
    return trails;
  }, [visitedCountries]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.calm.skyLight, colors.primary.wisteriaFaded]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles count={4} variant="mixed" opacity={0.15} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <NavBreadcrumb
              items={[
                { label: 'Explore', onPress: () => navigation.navigate('ExploreHome') },
                { label: 'World map' },
              ]}
            />
            <Heading level={1}>World Map</Heading>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Progress summary strip */}
        <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <View style={styles.progressStrip}>
            <Icon name="globe" size={18} color={colors.primary.wisteriaDark} />
            <Text style={styles.progressLabel}>
              {visitedCountries.length} of {COUNTRIES.length} explored
            </Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.max(progressPct, 3)}%` }]} />
            </View>
            <Text style={styles.progressPct}>{progressPct}%</Text>
          </View>
        </Animated.View>

        {/* Map / List toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => setViewMode('map')}
          >
            <Icon name="map" size={18} color={viewMode === 'map' ? colors.text.inverse : colors.text.secondary} />
            <Text variant="caption" style={[styles.toggleLabel, viewMode === 'map' && styles.toggleLabelActive]}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => setViewMode('list')}
          >
            <Icon name="list" size={18} color={viewMode === 'list' ? colors.text.inverse : colors.text.secondary} />
            <Text variant="caption" style={[styles.toggleLabel, viewMode === 'list' && styles.toggleLabelActive]}>List</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'map' ? (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mapScrollContent}>
            <View style={styles.mapViewWrap}>
              <View style={styles.mapViewCanvas}>
                <WorldMapBackground
                  width={MAP_VIEW_WIDTH}
                  height={MAP_VIEW_HEIGHT}
                  oceanColor={colors.journey.mapOcean}
                  landColor={colors.journey.mapLand}
                  landStroke="rgba(160,140,120,0.35)"
                />

                {/* Journey trail lines between visited countries */}
                {journeyTrails.length > 0 && (
                  <Svg width={MAP_VIEW_WIDTH} height={MAP_VIEW_HEIGHT} style={StyleSheet.absoluteFill}>
                    {journeyTrails.map((trail, i) => (
                      <Line
                        key={i}
                        x1={trail.x1}
                        y1={trail.y1}
                        x2={trail.x2}
                        y2={trail.y2}
                        stroke={colors.journey.trailDash}
                        strokeWidth={2}
                        strokeDasharray="6,4"
                        strokeLinecap="round"
                      />
                    ))}
                  </Svg>
                )}

                {COUNTRIES.map((country) => {
                  const pos = getWorldMapPosition(country.id);
                  if (!pos) return null;
                  const visited = visitedCountries.includes(country.id);
                  const owned = hasHouse(country.id);
                  const left = (pos.xPercent / 100) * MAP_VIEW_WIDTH - WORLD_DOT_SIZE / 2;
                  const top = (pos.yPercent / 100) * MAP_VIEW_HEIGHT - WORLD_DOT_SIZE / 2;
                  const clampedLeft = Math.max(2, Math.min(MAP_VIEW_WIDTH - WORLD_DOT_SIZE - 2, left));
                  const clampedTop = Math.max(2, Math.min(MAP_VIEW_HEIGHT - WORLD_DOT_SIZE - 2, top));
                  const ringProgress = getCountryRingProgress(country.id);
                  const isMastered = ringProgress.every((p) => p >= 1);
                  const glowColor = isMastered ? colors.journey.pinMastered : colors.journey.pinVisited;
                  return (
                    <TouchableOpacity
                      key={country.id}
                      style={[styles.worldDotWrap, { left: clampedLeft, top: clampedTop }]}
                      onPress={() => (hasHouse(country.id) ? navigation.navigate('CountryRoom', { countryId: country.id }) : navigation.navigate('CountryWorld'))}
                      activeOpacity={0.85}
                      accessibilityLabel={`${country.name} on world map`}
                    >
                      <View style={styles.worldDotRingContainer}>
                        {visited && <DotGlow size={WORLD_DOT_SIZE} color={glowColor} />}
                        <ProgressRing progress={ringProgress} size={WORLD_DOT_SIZE} />
                        <View
                          style={[
                            styles.worldDot,
                            {
                              backgroundColor: isMastered ? colors.journey.pinMastered : (visited ? colors.journey.pinVisited : colors.journey.pinNew),
                              borderColor: owned ? colors.success.emerald : (visited ? colors.primary.wisteriaLight : colors.base.warmWhite),
                            },
                            isMastered && styles.worldDotMastered,
                          ]}
                        >
                          {isMastered ? (
                            <Icon name="trophy" size={11} color="#7A5A00" />
                          ) : owned ? (
                            <Icon name="home" size={11} color={colors.success.emerald} />
                          ) : (
                            <Text style={styles.flagDot}>{country.flagEmoji}</Text>
                          )}
                        </View>
                      </View>
                      <Text style={styles.worldDotLabel} numberOfLines={1}>{getWorldMapLabel(country.id, country.name)}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Legend card */}
            <View style={styles.legendCard}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.journey.pinNew, borderColor: colors.base.warmWhite }]} />
                <Text style={styles.legendText}>New</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.journey.pinVisited, borderColor: colors.primary.wisteriaLight }]} />
                <Text style={styles.legendText}>Visited</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, styles.legendDotMastered]}>
                  <Icon name="trophy" size={7} color="#7A5A00" />
                </View>
                <Text style={styles.legendText}>Mastered</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { borderWidth: 2, borderColor: colors.success.emerald }]}>
                  <Icon name="home" size={7} color={colors.success.emerald} />
                </View>
                <Text style={styles.legendText}>Home</Text>
              </View>
            </View>

            <AnimatedPressable
              style={styles.visitWorldBtn}
              onPress={() => navigation.navigate('CountryWorld')}
              scaleDown={0.97}
            >
              <Text style={styles.visitWorldText}>Visit the World</Text>
              <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
            </AnimatedPressable>
          </ScrollView>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {COUNTRIES.map((country) => {
                const visited = visitedCountries.includes(country.id);
                const owned = hasHouse(country.id);
                return (
                  <TouchableOpacity
                    key={country.id}
                    style={[styles.countryCard, visited && styles.countryCardVisited]}
                    onPress={() => (hasHouse(country.id) ? navigation.navigate('CountryRoom', { countryId: country.id }) : navigation.navigate('CountryWorld'))}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={visited ? [colors.primary.wisteriaFaded, colors.calm.skyLight] : [colors.base.parchment, colors.base.warmWhite]}
                      style={styles.countryGradient}
                    >
                      <View style={styles.countryIconWrap}>
                        <Icon name="globe" size={24} color={visited ? colors.primary.wisteriaDark : colors.text.light} />
                      </View>
                      <Text variant="body" style={[styles.countryName, !visited && styles.countryNameLocked]} numberOfLines={1}>
                        {country.name}
                      </Text>
                      {owned && (
                        <View style={styles.homeBadge}>
                          <Icon name="home" size={12} color={colors.success.emerald} />
                        </View>
                      )}
                      {visited && !owned && (
                        <Caption style={styles.visitedLabel}>Visited</Caption>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>
            <AnimatedPressable
              style={styles.visitWorldBtn}
              onPress={() => navigation.navigate('CountryWorld')}
              scaleDown={0.97}
            >
              <Text style={styles.visitWorldText}>Visit the World</Text>
              <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
            </AnimatedPressable>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  backBtn: { padding: spacing.xs, marginLeft: -spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerSpacer: { width: 40 },

  // Progress summary strip
  progressStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  progressLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.text.primary,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.journey.progressTrack,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.journey.progressFill,
  },
  progressPct: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.primary.wisteriaDark,
    minWidth: 30,
    textAlign: 'right',
  },

  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.round,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary.wisteria,
  },
  toggleLabel: {
    color: colors.text.secondary,
  },
  toggleLabelActive: {
    color: colors.text.inverse,
    fontFamily: 'Nunito-SemiBold',
  },

  mapScrollContent: {
    paddingBottom: spacing.xxxl,
  },
  mapViewWrap: {
    paddingHorizontal: MAP_VIEW_PADDING / 2,
    marginBottom: spacing.md,
  },
  mapViewCanvas: {
    width: MAP_VIEW_WIDTH,
    height: MAP_VIEW_HEIGHT,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.journey.cardBorder,
    overflow: 'hidden',
    position: 'relative',
  },
  worldDotWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 48,
  },
  worldDotRingContainer: {
    width: WORLD_DOT_SIZE,
    height: WORLD_DOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldDot: {
    width: WORLD_DOT_SIZE - RING_STROKE * 2 - 2,
    height: WORLD_DOT_SIZE - RING_STROKE * 2 - 2,
    borderRadius: (WORLD_DOT_SIZE - RING_STROKE * 2 - 2) / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  worldDotMastered: {
    shadowColor: colors.journey.pinMastered,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 4,
  },
  flagDot: {
    fontSize: 11,
  },
  worldDotLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: colors.text.primary,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 56,
  },

  // Legend card
  legendCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: colors.base.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendDotMastered: {
    backgroundColor: colors.journey.pinMastered,
    borderColor: colors.journey.pinMastered,
  },
  legendText: {
    fontFamily: 'Nunito-Medium',
    color: colors.text.secondary,
    fontSize: 11,
  },

  visitWorldBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    gap: 4,
    paddingVertical: 12,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.round,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  visitWorldText: {
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  countryCard: {
    width: '30%',
    minWidth: 100,
    maxWidth: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  countryCardVisited: {
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight,
  },
  countryGradient: {
    padding: spacing.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  countryIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  countryName: {
    fontFamily: 'Nunito-SemiBold',
    textAlign: 'center',
  },
  countryNameLocked: {
    color: colors.text.muted,
  },
  homeBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  visitedLabel: {
    marginTop: 2,
    color: colors.primary.wisteriaDark,
  },
});

export default WorldMapScreen;
