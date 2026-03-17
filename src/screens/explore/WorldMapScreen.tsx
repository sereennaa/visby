import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Pressable, Platform } from 'react-native';
import Svg, { Circle, Line, Defs, RadialGradient as SvgRadialGradient, Stop } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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
import { EmptyState } from '../../components/ui/EmptyState';
import { hapticService } from '../../services/haptics';
import { ExploreStackParamList, Country } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_VIEW_PADDING = spacing.screenPadding * 2;
const MAP_VIEW_WIDTH = SCREEN_WIDTH - MAP_VIEW_PADDING;
const MAP_ZOOM_SCALE = 1.6;
const MAP_CANVAS_WIDTH = MAP_VIEW_WIDTH * MAP_ZOOM_SCALE;
const MAP_CANVAS_HEIGHT = Math.round(MAP_CANVAS_WIDTH * 0.55);
const MAP_VIEW_HEIGHT = Math.min(MAP_CANVAS_HEIGHT, 400);
const WORLD_DOT_SIZE = 40;
const RING_RADIUS = 17;
const RING_STROKE = 2.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const RING_COLORS = ['#FF9F43', '#4CAF50', '#42A5F5', '#AB47BC'];

const AnimatedLine = Animated.createAnimatedComponent(Line);

const MarchingTrailLine: React.FC<{ trail: { x1: number; y1: number; x2: number; y2: number }; index: number }> = ({ trail, index }) => {
  const offset = useSharedValue(0);
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-20, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);
  const animProps = useAnimatedProps(() => ({
    strokeDashoffset: offset.value,
  }));
  return (
    <AnimatedLine
      x1={trail.x1}
      y1={trail.y1}
      x2={trail.x2}
      y2={trail.y2}
      stroke={colors.journey.trailDash}
      strokeWidth={2}
      strokeDasharray="6,4"
      strokeLinecap="round"
      animatedProps={animProps}
    />
  );
};

const BreathingDot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1.08, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

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
  const userAura = user?.aura ?? 0;
  const userHouses = useStore(s => s.userHouses);
  const countryProgress = useStore(s => s.countryProgress);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const visitedCountries = user?.visitedCountries ?? [];
  const hasHouse = (countryId: string) => userHouses.some((h) => h.countryId === countryId);

  const progressPct = COUNTRIES.length > 0 ? Math.round((visitedCountries.length / COUNTRIES.length) * 100) : 0;

  const handleDotPress = useCallback((country: Country) => {
    setSelectedCountry((prev) => (prev?.id === country.id ? null : country));
  }, []);

  const dismissTooltip = useCallback(() => setSelectedCountry(null), []);

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
          x1: (pos1.xPercent / 100) * MAP_CANVAS_WIDTH,
          y1: (pos1.yPercent / 100) * MAP_CANVAS_HEIGHT,
          x2: (pos2.xPercent / 100) * MAP_CANVAS_WIDTH,
          y2: (pos2.yPercent / 100) * MAP_CANVAS_HEIGHT,
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

        {visitedCountries.length === 0 && (
          <EmptyState
            emoji="🌍"
            title="Your first adventure awaits!"
            message="Tap any country on the map to begin your journey around the world."
            style={{ paddingVertical: spacing.lg }}
          />
        )}

        {/* Map / List segmented control */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
            onPress={() => { hapticService.selection(); setViewMode('map'); }}
          >
            <Icon name="map" size={16} color={viewMode === 'map' ? colors.text.inverse : colors.text.secondary} />
            <Text style={[styles.toggleLabel, viewMode === 'map' && styles.toggleLabelActive]}>Map</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
            onPress={() => { hapticService.selection(); setViewMode('list'); }}
          >
            <Icon name="list" size={16} color={viewMode === 'list' ? colors.text.inverse : colors.text.secondary} />
            <Text style={[styles.toggleLabel, viewMode === 'list' && styles.toggleLabelActive]}>List</Text>
          </TouchableOpacity>
        </View>

        {viewMode === 'map' ? (
          <Animated.View key="map" entering={FadeIn.duration(300)} style={{ flex: 1 }}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.mapScrollContent}>
            <Caption style={styles.zoomHint}>Scroll to explore the map</Caption>

            <View style={styles.mapViewWrap}>
              <View style={styles.mapViewCanvas}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  maximumZoomScale={Platform.OS === 'ios' ? 2.5 : 1}
                  minimumZoomScale={1}
                  bouncesZoom
                  contentContainerStyle={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}
                >
                  <Pressable onPress={dismissTooltip} style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}>
                    <WorldMapBackground
                      width={MAP_CANVAS_WIDTH}
                      height={MAP_CANVAS_HEIGHT}
                      oceanColor={colors.journey.mapOcean}
                      landColor={colors.journey.mapLand}
                      landStroke="rgba(160,140,120,0.35)"
                    />

                    {journeyTrails.length > 0 && (
                      <Svg width={MAP_CANVAS_WIDTH} height={MAP_CANVAS_HEIGHT} style={StyleSheet.absoluteFill}>
                        {journeyTrails.map((trail, i) => (
                          <MarchingTrailLine key={i} trail={trail} index={i} />
                        ))}
                      </Svg>
                    )}

                    {COUNTRIES.map((country, dotIndex) => {
                      const pos = getWorldMapPosition(country.id);
                      if (!pos) return null;
                      const visited = visitedCountries.includes(country.id);
                      const owned = hasHouse(country.id);
                      const left = (pos.xPercent / 100) * MAP_CANVAS_WIDTH - WORLD_DOT_SIZE / 2;
                      const top = (pos.yPercent / 100) * MAP_CANVAS_HEIGHT - WORLD_DOT_SIZE / 2;
                      const clampedLeft = Math.max(2, Math.min(MAP_CANVAS_WIDTH - WORLD_DOT_SIZE - 2, left));
                      const clampedTop = Math.max(2, Math.min(MAP_CANVAS_HEIGHT - WORLD_DOT_SIZE - 2, top));
                      const ringProgress = getCountryRingProgress(country.id);
                      const isMastered = ringProgress.every((p) => p >= 1);
                      const isSelected = selectedCountry?.id === country.id;
                      const affordable = !visited && userAura >= country.visitCostAura;

                      const borderColor = owned
                        ? colors.success.emerald
                        : isMastered
                          ? colors.reward.gold
                          : visited
                            ? colors.primary.wisteria
                            : (country.accentColor + '40');

                      const glowColor = owned
                        ? colors.success.emerald
                        : isMastered
                          ? colors.reward.gold
                          : colors.primary.wisteria;

                      const dotContent = (
                        <TouchableOpacity
                          style={[styles.worldDotWrap, isSelected && styles.worldDotWrapSelected]}
                          onPress={() => handleDotPress(country)}
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
                                  backgroundColor: visited ? colors.surface.card : colors.journey.pinNew,
                                  borderColor,
                                  borderWidth: (owned || isMastered) ? 2.5 : visited ? 2 : 1.5,
                                },
                                (isMastered || owned) && {
                                  shadowColor: glowColor,
                                  shadowOffset: { width: 0, height: 0 },
                                  shadowOpacity: 0.6,
                                  shadowRadius: 8,
                                  elevation: 4,
                                },
                              ]}
                            >
                              <Text style={styles.flagDot}>{country.flagEmoji}</Text>
                            </View>
                          </View>
                          <Text style={styles.worldDotLabel} numberOfLines={1}>{getWorldMapLabel(country.id, country.name)}</Text>
                        </TouchableOpacity>
                      );

                      return (
                        <Animated.View
                          key={country.id}
                          entering={FadeIn.delay(dotIndex * 40).duration(350)}
                          style={{ position: 'absolute', left: clampedLeft, top: clampedTop }}
                        >
                          {affordable ? <BreathingDot>{dotContent}</BreathingDot> : dotContent}
                        </Animated.View>
                      );
                    })}
                  </Pressable>
                </ScrollView>
              </View>
            </View>

            {/* Country tooltip card */}
            {selectedCountry && (() => {
              const sc = selectedCountry;
              const scVisited = visitedCountries.includes(sc.id);
              const scOwned = hasHouse(sc.id);
              const cp = countryProgress[sc.id];
              const totalFacts = sc.facts?.length || 5;
              const totalLocations = getCountryLocations(sc.id).length || 1;
              const accent = sc.accentColor || colors.primary.wisteria;

              return (
                <Animated.View entering={ZoomIn.duration(200).springify()} exiting={FadeOut.duration(150)} style={styles.tooltipWrap}>
                  <LinearGradient
                    colors={[accent + '18', accent + '08', colors.surface.card]}
                    style={styles.tooltipCard}
                  >
                    <View style={styles.tooltipHeader}>
                      <Text style={styles.tooltipFlag}>{sc.flagEmoji}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.tooltipName}>{sc.name}</Text>
                        <Caption style={styles.tooltipContinent}>{sc.continent ?? 'World'}</Caption>
                      </View>
                      <TouchableOpacity onPress={dismissTooltip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Icon name="close" size={18} color={colors.text.muted} />
                      </TouchableOpacity>
                    </View>

                    {sc.facts.length > 0 && (
                      <Text style={styles.tooltipDesc} numberOfLines={2}>
                        {sc.facts[0].content}
                      </Text>
                    )}

                    {scVisited && cp && (
                      <View style={styles.tooltipStats}>
                        <View style={styles.tooltipStat}>
                          <Icon name="sparkles" size={13} color={colors.reward.gold} />
                          <Text style={styles.tooltipStatText}>
                            {cp.factsReadCount || 0}/{totalFacts} facts
                          </Text>
                        </View>
                        <View style={styles.tooltipStatDivider} />
                        <View style={styles.tooltipStat}>
                          <Icon name="map" size={13} color={colors.primary.wisteria} />
                          <Text style={styles.tooltipStatText}>
                            {Math.min(cp.factsReadCount || 0, totalLocations)}/{totalLocations} rooms
                          </Text>
                        </View>
                      </View>
                    )}

                    <View style={styles.tooltipActions}>
                      {(scOwned || scVisited) ? (
                        <TouchableOpacity
                          style={[styles.tooltipVisitBtn, { backgroundColor: accent }]}
                          onPress={() => {
                            dismissTooltip();
                            navigation.navigate('CountryRoom', { countryId: sc.id });
                          }}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.tooltipVisitBtnText}>
                            {scOwned ? 'Enter House' : 'Explore'}
                          </Text>
                          <Icon name="chevronRight" size={16} color={colors.text.inverse} />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.tooltipVisitBtn, { backgroundColor: accent }]}
                          onPress={() => {
                            dismissTooltip();
                            navigation.navigate('CountryWorld');
                          }}
                          activeOpacity={0.85}
                        >
                          <Text style={styles.tooltipVisitBtnText}>
                            Visit · {sc.visitCostAura} Aura
                          </Text>
                          <Icon name="chevronRight" size={16} color={colors.text.inverse} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </LinearGradient>
                </Animated.View>
              );
            })()}

            {/* Legend */}
            <View style={styles.legendCard}>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.journey.pinNew }]} />
                <Text style={styles.legendText}>New</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary.wisteria }]} />
                <Text style={styles.legendText}>Visited</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.reward.gold }]} />
                <Text style={styles.legendText}>Mastered</Text>
              </View>
              <View style={styles.legendRow}>
                <View style={[styles.legendDot, { backgroundColor: colors.success.emerald }]} />
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
          </Animated.View>
        ) : (
          <Animated.View key="list" entering={FadeIn.duration(300)} style={{ flex: 1 }}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.grid}>
              {COUNTRIES.map((country) => {
                const visited = visitedCountries.includes(country.id);
                const owned = hasHouse(country.id);
                const accent = country.accentColor || colors.primary.wisteria;
                const avgProgress = visited
                  ? getCountryRingProgress(country.id).reduce((s, v) => s + v, 0) / 4
                  : 0;

                return (
                  <TouchableOpacity
                    key={country.id}
                    style={styles.countryCard}
                    onPress={() => (hasHouse(country.id) ? navigation.navigate('CountryRoom', { countryId: country.id }) : navigation.navigate('CountryWorld'))}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={[accent + '20', accent + '0A', colors.surface.card]}
                      style={styles.countryGradient}
                    >
                      <Text style={styles.postcardFlag}>{country.flagEmoji}</Text>
                      <Text style={styles.countryName} numberOfLines={1}>
                        {country.name}
                      </Text>
                      {country.facts?.[0] && (
                        <Text style={styles.countryDesc} numberOfLines={1}>
                          {country.facts[0].content}
                        </Text>
                      )}
                      {visited && (
                        <View style={styles.postcardProgressWrap}>
                          <View style={styles.postcardProgressTrack}>
                            <View
                              style={[
                                styles.postcardProgressFill,
                                { width: `${Math.max(Math.round(avgProgress * 100), 3)}%`, backgroundColor: accent },
                              ]}
                            />
                          </View>
                        </View>
                      )}
                      {owned && (
                        <View style={styles.homeBadge}>
                          <Icon name="home" size={12} color={colors.success.emerald} />
                        </View>
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
          </Animated.View>
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

  // Segmented toggle
  toggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.round,
    padding: 3,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: spacing.radius.round,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary.wisteria,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLabel: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.secondary,
  },
  toggleLabelActive: {
    color: colors.text.inverse,
    fontFamily: 'Nunito-Bold',
  },

  mapScrollContent: {
    paddingBottom: spacing.xxxl,
  },
  zoomHint: {
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: colors.text.muted,
    fontSize: 11,
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

  // Map dots
  worldDotWrap: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minWidth: 52,
  },
  worldDotWrapSelected: {
    zIndex: 100,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  flagDot: {
    fontSize: 20,
  },
  worldDotLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: colors.text.primary,
    marginTop: 2,
    textAlign: 'center',
    maxWidth: 56,
  },

  // Legend
  legendCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontFamily: 'Nunito-Medium',
    color: colors.text.muted,
    fontSize: 10,
  },

  // Tooltip
  tooltipWrap: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  tooltipCard: {
    borderRadius: 18,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  tooltipFlag: {
    fontSize: 24,
  },
  tooltipName: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 16,
    color: colors.text.primary,
  },
  tooltipContinent: {
    fontSize: 11,
    marginTop: -2,
  },
  tooltipDesc: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: colors.text.secondary,
    lineHeight: 17,
    marginBottom: spacing.sm,
  },
  tooltipStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingVertical: 6,
    paddingHorizontal: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
  },
  tooltipStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tooltipStatDivider: {
    width: 1,
    height: 14,
    backgroundColor: colors.text.light,
  },
  tooltipStatText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.secondary,
  },
  tooltipActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  tooltipVisitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: spacing.radius.round,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipVisitBtnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.inverse,
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

  // List view
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  countryCard: {
    width: 160,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  countryGradient: {
    padding: spacing.md,
    paddingTop: spacing.lg,
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  postcardFlag: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  countryName: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 15,
    textAlign: 'center',
    color: colors.text.primary,
  },
  countryDesc: {
    fontFamily: 'Nunito-Medium',
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 15,
  },
  postcardProgressWrap: {
    width: '100%',
    marginTop: spacing.sm,
  },
  postcardProgressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.06)',
    overflow: 'hidden',
  },
  postcardProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  homeBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
});

export default WorldMapScreen;
