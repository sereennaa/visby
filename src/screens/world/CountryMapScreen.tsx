import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle as SvgCircle, Path as SvgPath, Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { COUNTRIES } from '../../config/constants';
import { getCountryMapPins, getPinRegionHint, type CountryMapPin } from '../../config/countryMap';
import { getCountryLocations } from '../../config/learningContent';
import { getCountryLandmarks, getCountryFoodHighlights, getCountryHistory } from '../../config/countryKnowledge';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { CountryOutline } from '../../components/maps/CountryOutline';
import { CountryMapDecorations } from '../../components/maps/CountryMapDecorations';
import { AnimatedTrailPath } from '../../components/maps/AnimatedTrailPath';
import { MapPin, PinState } from '../../components/maps/MapPin';
import { PinPreviewTooltip } from '../../components/maps/PinPreviewTooltip';
import { MapFogOverlay } from '../../components/maps/MapFogOverlay';
import { ExploreStackParamList, JourneyTier } from '../../types';
import { FloatingParticles, getCountryParticleVariant } from '../../components/effects/FloatingParticles';
import { useStore } from '../../store/useStore';
import { getDishesByCountry } from '../../config/worldFoods';
import { getRoomsForCountry } from '../../config/treasureHunt';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_PADDING = 16;
const MAP_WIDTH = SCREEN_WIDTH - MAP_PADDING * 2;
const MAP_HEIGHT = Math.min(SCREEN_HEIGHT * 0.44, 340);
const PIN_SIZE = 52;

const LANDMARK_ICONS: Record<string, IconName> = {
  city: 'city',
  landmark: 'landmark',
  nature: 'nature',
  temple: 'sparkles',
  museum: 'book',
  food: 'food',
};

type CountryMapScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'CountryMap'>;
  route: { params: { countryId: string } };
};

// ── Animated Mastery Bar ──

const AnimatedMasterySegment: React.FC<{
  label: string;
  icon: IconName;
  done: number;
  total: number;
  color: string;
  delay: number;
}> = ({ label, icon, done, total, color, delay }) => {
  const fillPct = useSharedValue(0);
  const isDone = done >= total;
  const pct = total > 0 ? Math.min(done / total, 1) : 0;

  useEffect(() => {
    fillPct.value = withDelay(
      delay,
      withTiming(pct, { duration: 800, easing: Easing.out(Easing.ease) }),
    );
  }, [pct, delay]);

  const fillStyle = useAnimatedStyle(() => ({
    flex: fillPct.value,
  }));

  const emptyStyle = useAnimatedStyle(() => ({
    flex: Math.max(0.001, 1 - fillPct.value),
  }));

  return (
    <View style={masteryStyles.segment}>
      <View style={masteryStyles.segmentHeader}>
        <Icon name={icon} size={11} color={isDone ? color : colors.text.muted} />
        <Text style={[masteryStyles.segmentLabel, isDone && { color }]}>
          {done}/{total}
        </Text>
      </View>
      <View style={[masteryStyles.segmentTrack, { backgroundColor: color + '15' }]}>
        <Animated.View style={[masteryStyles.segmentFill, { backgroundColor: color }, fillStyle]} />
        <Animated.View style={emptyStyle} />
      </View>
    </View>
  );
};

const TIER_ICONS: Record<JourneyTier, IconName> = {
  newcomer: 'compass',
  explorer: 'map',
  adventurer: 'star',
  local: 'home',
  master: 'crown',
};
const TIER_COLORS: Record<JourneyTier, string> = {
  newcomer: colors.calm.ocean,
  explorer: colors.primary.wisteria,
  adventurer: colors.reward.amber,
  local: '#50C878',
  master: colors.reward.gold,
};

const AnimatedPercentage: React.FC<{ value: number; mastered: boolean; tier: JourneyTier }> = ({ value, mastered, tier }) => {
  const displayVal = useSharedValue(0);
  const shimmer = useSharedValue(0);

  useEffect(() => {
    displayVal.value = withTiming(value, { duration: 1200, easing: Easing.out(Easing.ease) });
    if (mastered) {
      shimmer.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      );
    }
    return () => {
      cancelAnimation(displayVal);
      cancelAnimation(shimmer);
    };
  }, [value, mastered]);

  const textStyle = useAnimatedStyle(() => ({
    opacity: mastered ? interpolate(shimmer.value, [0, 1], [0.85, 1]) : 1,
  }));

  const tierColor = TIER_COLORS[tier];
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);

  return (
    <Animated.View style={[masteryStyles.percentWrap, textStyle]}>
      <Icon name={TIER_ICONS[tier]} size={16} color={tierColor} />
      <Text style={[masteryStyles.percentText, { color: tierColor }]}>
        {mastered ? 'Master!' : `${tierLabel} · ${value}%`}
      </Text>
    </Animated.View>
  );
};

// ── Compass Rose ──

const CompassRose: React.FC = () => {
  const rotate = useSharedValue(0);

  useEffect(() => {
    rotate.value = withRepeat(
      withSequence(
        withTiming(8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );
    return () => cancelAnimation(rotate);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View style={[compassStyles.wrap, style]}>
      <Svg width={28} height={28} viewBox="0 0 28 28">
        <SvgCircle cx="14" cy="14" r="12" fill={colors.base.cream} fillOpacity={0.85} stroke={colors.journey.mapCompass} strokeWidth="1" />
        <SvgPath d="M 14 4 L 15.5 12 L 14 13 L 12.5 12 Z" fill={colors.status.error} fillOpacity={0.7} />
        <SvgPath d="M 14 24 L 15.5 16 L 14 15 L 12.5 16 Z" fill={colors.text.muted} fillOpacity={0.5} />
        <SvgPath d="M 4 14 L 12 12.5 L 13 14 L 12 15.5 Z" fill={colors.text.muted} fillOpacity={0.3} />
        <SvgPath d="M 24 14 L 16 12.5 L 15 14 L 16 15.5 Z" fill={colors.text.muted} fillOpacity={0.3} />
        <SvgCircle cx="14" cy="14" r="2" fill={colors.journey.mapCompass} />
      </Svg>
    </Animated.View>
  );
};

// ── Main Screen ──

export const CountryMapScreen: React.FC<CountryMapScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const pins = getCountryMapPins(countryId);
  const getCountryProgress = useStore((s) => s.getCountryProgress);
  const countryProgress = getCountryProgress(countryId);
  const visitedPins = useStore((s) => s.visitedPins);
  const visitedStops = useStore((s) => s.visitedStops);

  // Pin preview tooltip
  const [previewPin, setPreviewPin] = useState<CountryMapPin | null>(null);

  // Get first stop image for each pin (for list cards and tooltip)
  const pinImages = useMemo(() => {
    const locs = getCountryLocations(countryId);
    const map: Record<string, string | null> = {};
    for (const pin of pins) {
      const firstLocId = pin.locationIds[0];
      const loc = locs.find((l) => l.id === firstLocId);
      map[pin.id] = loc?.imageUrl ?? null;
    }
    return map;
  }, [countryId, pins]);

  const pinKnowledgeHints = useMemo(() => {
    const landmarks = getCountryLandmarks(countryId);
    const foods = getCountryFoodHighlights(countryId);
    const history = getCountryHistory(countryId);
    const map: Record<string, string> = {};
    for (const pin of pins) {
      const lower = pin.name.toLowerCase();
      const landmarkHit = landmarks.find((item) => lower.includes(item.name.toLowerCase().split(' ')[0]));
      if (landmarkHit) {
        map[pin.id] = landmarkHit.funFact;
        continue;
      }
      if (pin.type === 'city' && foods.length > 0) {
        map[pin.id] = `Food spotlight: ${foods[0].name}. ${foods[0].funFact}`;
        continue;
      }
      if (history.length > 0) {
        map[pin.id] = `${history[0].title}: ${history[0].description}`;
      }
    }
    return map;
  }, [countryId, pins]);

  // Pin visited states based on per-pin and per-stop tracking
  const pinStates = useMemo((): Record<string, PinState> => {
    const completedPins = visitedPins[countryId] ?? [];
    const completedStops = visitedStops[countryId] ?? [];
    const result: Record<string, PinState> = {};
    for (const pin of pins) {
      if (completedPins.includes(pin.id)) {
        result[pin.id] = 'mastered';
      } else if (pin.locationIds.some((id) => completedStops.includes(id))) {
        result[pin.id] = 'visited';
      } else {
        result[pin.id] = 'unvisited';
      }
    }
    return result;
  }, [pins, visitedPins, visitedStops, countryId]);

  const completedPinCount = (visitedPins[countryId] ?? []).length;
  const getCountryJourneyProgress = useStore((s) => s.getCountryJourneyProgress);
  const bites = useStore((s) => s.bites);
  const treasureHuntProgress = useStore((s) => s.treasureHuntProgress);
  const journeyProgress = useMemo(() => getCountryJourneyProgress(countryId), [countryId, getCountryJourneyProgress, countryProgress, visitedPins, visitedStops, bites, treasureHuntProgress]);

  const dishCount = useMemo(() => {
    const dishes = getDishesByCountry(countryId);
    const discoveredIds = bites.filter((b) => b.worldDishId && dishes.some((d) => d.id === b.worldDishId)).length;
    return { done: discoveredIds, total: dishes.length };
  }, [countryId, bites]);

  const treasureCount = useMemo(() => {
    const rooms = getRoomsForCountry(countryId);
    const thp = treasureHuntProgress[countryId] ?? { completedRoomIds: [] };
    return { done: (thp.completedRoomIds ?? []).length, total: rooms.length };
  }, [countryId, treasureHuntProgress]);

  const masteryItems = useMemo(() => {
    if (!country) return [];
    return [
      { label: 'Facts', done: countryProgress.factsReadCount ?? 0, total: country.facts.length, icon: 'book' as IconName, color: colors.calm.ocean },
      { label: 'Quiz', done: countryProgress.quizCompleted ? 1 : 0, total: 1, icon: 'quiz' as IconName, color: colors.primary.wisteriaDark },
      { label: 'Games', done: Math.min(countryProgress.gamesPlayedCount ?? 0, 1), total: 1, icon: 'game' as IconName, color: colors.reward.amber },
      { label: 'Places', done: completedPinCount, total: pins.length, icon: 'compass' as IconName, color: colors.success.emerald },
      ...(dishCount.total > 0 ? [{ label: 'Dishes', done: dishCount.done, total: dishCount.total, icon: 'food' as IconName, color: colors.reward.peach }] : []),
      ...(treasureCount.total > 0 ? [{ label: 'Treasure', done: treasureCount.done, total: treasureCount.total, icon: 'sparkles' as IconName, color: colors.reward.gold }] : []),
    ];
  }, [country, countryProgress, pins.length, completedPinCount, dishCount, treasureCount]);

  const totalDone = masteryItems.reduce((s, m) => s + Math.min(m.done, m.total), 0);
  const totalTotal = masteryItems.reduce((s, m) => s + m.total, 0);
  const masteryPct = totalTotal > 0 ? Math.round((totalDone / totalTotal) * 100) : 0;
  const particle = getCountryParticleVariant(countryId);

  // ── Map Gestures (pinch-to-zoom + pan) ──
  const mapScale = useSharedValue(1);
  const mapTranslateX = useSharedValue(0);
  const mapTranslateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = Math.min(Math.max(savedScale.value * e.scale, 1), 2.5);
      mapScale.value = newScale;
    })
    .onEnd(() => {
      if (mapScale.value < 1.05) {
        mapScale.value = withSpring(1, { damping: 15 });
        mapTranslateX.value = withSpring(0, { damping: 15 });
        mapTranslateY.value = withSpring(0, { damping: 15 });
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        savedScale.value = mapScale.value;
      }
    });

  const pan = Gesture.Pan()
    .minPointers(1)
    .maxPointers(2)
    .onUpdate((e) => {
      if (mapScale.value > 1.05) {
        const maxTx = (MAP_WIDTH * (mapScale.value - 1)) / 2;
        const maxTy = (MAP_HEIGHT * (mapScale.value - 1)) / 2;
        mapTranslateX.value = Math.max(-maxTx, Math.min(maxTx, savedTranslateX.value + e.translationX));
        mapTranslateY.value = Math.max(-maxTy, Math.min(maxTy, savedTranslateY.value + e.translationY));
      }
    })
    .onEnd(() => {
      savedTranslateX.value = mapTranslateX.value;
      savedTranslateY.value = mapTranslateY.value;
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (mapScale.value > 1.5) {
        mapScale.value = withSpring(1, { damping: 14, stiffness: 120 });
        mapTranslateX.value = withSpring(0, { damping: 14 });
        mapTranslateY.value = withSpring(0, { damping: 14 });
        savedScale.value = 1;
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        mapScale.value = withSpring(2, { damping: 14, stiffness: 120 });
        savedScale.value = 2;
      }
    });

  const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

  const mapAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: mapScale.value },
      { translateX: mapTranslateX.value },
      { translateY: mapTranslateY.value },
    ],
  }));

  // ── Parallax for list scroll ──
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const parallaxStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [0, 100], [0, -3], 'clamp') },
    ],
  }));

  // ── Background gradient cycling ──
  const bgCycle = useSharedValue(0);
  useEffect(() => {
    bgCycle.value = withRepeat(
      withTiming(1, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
    return () => cancelAnimation(bgCycle);
  }, []);

  const handlePinPress = useCallback((pin: CountryMapPin) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPreviewPin(pin);
  }, []);

  const handleGoToStreet = useCallback(() => {
    if (!previewPin) return;
    setPreviewPin(null);
    navigation.navigate('PlaceStreet', { countryId, pinId: previewPin.id });
  }, [previewPin, countryId, navigation]);

  if (!country) return null;

  const accentColor = country.accentColor;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, accentColor + '14', colors.base.parchment, colors.primary.wisteriaFaded]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.2, 0.55, 1]}
      />
      <FloatingParticles count={6} variant={particle.variant} opacity={particle.opacity * 0.7} speed={particle.speed} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={3} style={styles.headerTitle}>
              {country.flagEmoji} Map of {country.name}
            </Heading>
          </View>
          <View style={styles.headerSpacer} />
        </Animated.View>

        {/* Animated Mastery Bar */}
        <Animated.View entering={FadeInDown.delay(100).duration(300)} style={masteryStyles.bar}>
          <AnimatedPercentage value={masteryPct} mastered={masteryPct >= 100} tier={journeyProgress.tier} />
          <View style={masteryStyles.segments}>
            {masteryItems.map((item, i) => (
              <AnimatedMasterySegment
                key={item.label}
                label={item.label}
                icon={item.icon}
                done={item.done}
                total={item.total}
                color={item.color}
                delay={200 + i * 100}
              />
            ))}
          </View>
          {masteryPct >= 100 && <View style={masteryStyles.goldBorder} />}
        </Animated.View>

        {/* Map Canvas with gestures */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.mapWrap, parallaxStyle]}>
          <View style={[styles.mapCanvas, masteryPct >= 100 && styles.mapCanvasMastered]}>
            <GestureDetector gesture={composed}>
              <Animated.View style={[{ width: MAP_WIDTH, height: MAP_HEIGHT }, mapAnimStyle]}>
                {/* Ocean + country outline */}
                {getCountryOutlinePath(countryId) ? (
                  <View style={styles.mapOutlineWrap}>
                    <CountryOutline
                      countryId={countryId}
                      width={MAP_WIDTH}
                      height={MAP_HEIGHT}
                      accentColor={accentColor}
                      showOcean
                      showGrid
                      showGlow
                    />
                  </View>
                ) : (
                  <LinearGradient
                    colors={[accentColor + '20', colors.calm.skyLight + 'cc']}
                    style={StyleSheet.absoluteFill}
                  />
                )}

                {/* Country-specific decorations */}
                <CountryMapDecorations countryId={countryId} width={MAP_WIDTH} height={MAP_HEIGHT} />

                {/* Animated trail paths */}
                <AnimatedTrailPath
                  pins={pins}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  pinSize={PIN_SIZE}
                  accentColor={accentColor}
                />

                {/* Fog of war */}
                <MapFogOverlay
                  pins={pins.map((p) => ({
                    xPercent: p.xPercent,
                    yPercent: p.yPercent,
                    visited: pinStates[p.id] === 'visited' || pinStates[p.id] === 'mastered',
                  }))}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  pinSize={PIN_SIZE}
                  fogOpacity={0.3}
                  clearRadius={22}
                />

                {/* Map Pins */}
                {pins.map((pin, idx) => {
                  const x = (pin.xPercent / 100) * (MAP_WIDTH - PIN_SIZE) - 8;
                  const y = (pin.yPercent / 100) * (MAP_HEIGHT - PIN_SIZE) - 8;
                  const iconName = LANDMARK_ICONS[pin.type] || 'landmark';
                  return (
                    <View key={pin.id} style={[styles.pinWrap, { left: x, top: y }]}>
                      <MapPin
                        name={pin.name}
                        type={pin.type}
                        iconName={iconName}
                        stopCount={pin.locationIds.length}
                        state={pinStates[pin.id] || 'unvisited'}
                        size={PIN_SIZE}
                        delay={300 + idx * 120}
                        onPress={() => handlePinPress(pin)}
                      />
                    </View>
                  );
                })}

                {/* Compass rose */}
                <View style={styles.compassWrap}>
                  <CompassRose />
                </View>
              </Animated.View>
            </GestureDetector>
          </View>
        </Animated.View>

        {/* Pin List */}
        <Animated.ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {pins.map((pin, idx) => {
            const regionHint = [getPinRegionHint(pin.id), pinKnowledgeHints[pin.id]].filter(Boolean).join(' ');
            const pinColor = pin.type === 'city' ? colors.primary.wisteria : colors.reward.peach;
            const iconName = LANDMARK_ICONS[pin.type] || 'landmark';
            const imageUrl = pinImages[pin.id];
            const stopsTotal = pin.locationIds.length;
            const visited = pinStates[pin.id] === 'visited' || pinStates[pin.id] === 'mastered';
            const isMastered = pinStates[pin.id] === 'mastered';

            return (
              <Animated.View key={pin.id} entering={FadeInDown.delay(400 + idx * 80).duration(350)}>
                <TouchableOpacity
                  style={styles.listCard}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    navigation.navigate('PlaceStreet', { countryId, pinId: pin.id });
                  }}
                  activeOpacity={0.85}
                >
                  {/* Gradient accent bar */}
                  <LinearGradient
                    colors={isMastered ? [colors.reward.gold, colors.reward.amber] : [pinColor, pinColor + '80']}
                    style={styles.listAccent}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                  />

                  {/* Thumbnail or icon */}
                  {imageUrl ? (
                    <View style={styles.listThumbWrap}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.listThumb}
                        contentFit="cover"
                        transition={200}
                        placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                      />
                    </View>
                  ) : (
                    <View style={[styles.listIconWrap, { backgroundColor: pinColor + '15' }]}>
                      <Icon name={iconName} size={24} color={pinColor} />
                    </View>
                  )}

                  {/* Content */}
                  <View style={styles.listTextWrap}>
                    <Text style={styles.listTitle}>{pin.name}</Text>
                    <View style={styles.listMetaRow}>
                      <View style={[styles.listTypeBadge, { backgroundColor: pinColor + '15' }]}>
                        <Text style={[styles.listTypeText, { color: pinColor }]}>
                          {pin.type === 'city' ? 'City' : 'Landmark'}
                        </Text>
                      </View>
                      <Caption>{stopsTotal} stop{stopsTotal !== 1 ? 's' : ''}</Caption>
                    </View>
                    {regionHint ? <Caption style={styles.listHint}>{regionHint}</Caption> : null}
                  </View>

                  {/* Progress indicator */}
                  <View style={styles.listProgressWrap}>
                    <Svg width={32} height={32} viewBox="0 0 32 32">
                      <Defs>
                        <RadialGradient id={`lpg_${pin.id}`} cx="50%" cy="50%" r="50%">
                          <Stop offset="0%" stopColor={pinColor} stopOpacity="0.1" />
                          <Stop offset="100%" stopColor={pinColor} stopOpacity="0" />
                        </RadialGradient>
                      </Defs>
                      <SvgCircle cx="16" cy="16" r="14" fill={`url(#lpg_${pin.id})`} />
                      <SvgCircle cx="16" cy="16" r="12" fill="none" stroke={pinColor + '20'} strokeWidth="2.5" />
                      {visited && (
                        <SvgCircle
                          cx="16"
                          cy="16"
                          r="12"
                          fill="none"
                          stroke={isMastered ? colors.reward.gold : pinColor}
                          strokeWidth="2.5"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * 0.25}`}
                          strokeLinecap="round"
                          transform="rotate(-90 16 16)"
                        />
                      )}
                    </Svg>
                    <Icon name="chevronRight" size={16} color={colors.text.muted} style={{ marginTop: 2 }} />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
          <View style={styles.listBottom} />
        </Animated.ScrollView>
      </SafeAreaView>

      {/* Pin Preview Tooltip */}
      {previewPin && (
        <PinPreviewTooltip
          name={previewPin.name}
          type={previewPin.type}
          stopCount={previewPin.locationIds.length}
          regionHint={[getPinRegionHint(previewPin.id), pinKnowledgeHints[previewPin.id]].filter(Boolean).join(' ')}
          imageUrl={pinImages[previewPin.id]}
          iconName={LANDMARK_ICONS[previewPin.type] || 'landmark'}
          onGo={handleGoToStreet}
          onDismiss={() => setPreviewPin(null)}
        />
      )}
    </View>
  );
};

// ── Styles ──

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { textAlign: 'center' },
  headerSpacer: { width: 40 },

  mapWrap: {
    paddingHorizontal: MAP_PADDING,
    marginBottom: spacing.md,
  },
  mapCanvas: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.journey.cardBorder,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.calm.skyLight + '40',
  },
  mapCanvasMastered: {
    borderColor: colors.journey.pinMastered,
    borderWidth: 2.5,
    ...Platform.select({
      web: { boxShadow: '0 0 24px rgba(255,215,0,0.25)' },
      default: {
        shadowColor: colors.journey.pinMastered,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },
  mapOutlineWrap: {
    ...StyleSheet.absoluteFillObject,
  },

  pinWrap: {
    position: 'absolute',
    zIndex: 10,
  },
  compassWrap: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    zIndex: 5,
  },

  listScroll: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.xs,
  },
  listBottom: { height: spacing.xxl * 3 },

  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  listAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  listThumbWrap: {
    width: 56,
    height: 56,
    margin: spacing.sm,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listThumb: {
    width: '100%',
    height: '100%',
  },
  listIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: spacing.sm,
  },
  listTextWrap: {
    flex: 1,
    paddingVertical: spacing.sm,
  },
  listTitle: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 16,
    color: colors.text.primary,
  },
  listMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  listTypeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  listTypeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  listHint: {
    marginTop: 2,
    fontStyle: 'italic',
    color: colors.text.muted,
  },
  listProgressWrap: {
    alignItems: 'center',
    paddingRight: spacing.sm,
    gap: 2,
  },
});

const masteryStyles = StyleSheet.create({
  bar: {
    marginHorizontal: MAP_PADDING,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },
  goldBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radii.lg,
    borderWidth: 2,
    borderColor: colors.reward.gold + '50',
  },
  percentWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  percentText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  segments: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
  },
  segmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 3,
  },
  segmentLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: colors.text.muted,
  },
  segmentTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 2,
  },
});

const compassStyles = StyleSheet.create({
  wrap: {
    opacity: 0.7,
  },
});

export default CountryMapScreen;
