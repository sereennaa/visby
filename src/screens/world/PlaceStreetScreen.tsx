import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Line, Defs, RadialGradient as SvgRadialGradient, Stop as SvgStop } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyMini } from '../../components/avatar/VisbyMini';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import { COUNTRIES } from '../../config/constants';
import { getMapPin, getPlaceLocationFact } from '../../config/countryMap';
import { getCountryLocations, CountryLocation } from '../../config/learningContent';
import { MiniCountryMap } from '../../components/maps/MiniCountryMap';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { PinCompleteCelebration } from '../../components/effects/PinCompleteCelebration';
import { ExploreStackParamList } from '../../types';
import { useStore } from '../../store/useStore';
import { hapticService } from '../../services/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;
const IMAGE_HEIGHT = 180;
const FOOTPATH_HEIGHT = 80;
const DOT_SPACING = 14;
const VISBY_SIZE = 44;

const CATEGORY_ICONS: Record<CountryLocation['category'], IconName> = {
  landmark: 'landmark',
  food: 'food',
  nature: 'nature',
  culture: 'culture',
  hidden_gem: 'sparkles',
};

const CATEGORY_GRADIENTS: Record<CountryLocation['category'], [string, string]> = {
  landmark: [colors.primary.wisteria, colors.primary.wisteriaDark],
  food: [colors.reward.peach, colors.reward.peachDark],
  nature: ['#6B9B6B', '#4A7A4A'],
  culture: [colors.calm.ocean, colors.calm.skyDark],
  hidden_gem: [colors.reward.gold, colors.reward.amber],
};

type PlaceStreetScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'PlaceStreet'>;
  route: { params: { countryId: string; pinId: string } };
};

// ── Progress Dots (horizontal stop indicators below header) ──

const StopProgressDots: React.FC<{
  stops: CountryLocation[];
  activeIndex: number;
  exploredIds: Set<string>;
  onTap: (index: number) => void;
}> = ({ stops, activeIndex, exploredIds, onTap }) => {
  return (
    <View style={progressStyles.row}>
      {stops.map((stop, i) => {
        const isExplored = exploredIds.has(stop.id);
        const isCurrent = i === activeIndex;
        return (
          <TouchableOpacity
            key={stop.id}
            onPress={() => onTap(i)}
            activeOpacity={0.7}
            style={[
              progressStyles.dot,
              isExplored && progressStyles.dotExplored,
              isCurrent && !isExplored && progressStyles.dotCurrent,
              !isExplored && !isCurrent && progressStyles.dotPending,
            ]}
            accessibilityLabel={`Stop ${i + 1}: ${stop.name}${isExplored ? ' (explored)' : ''}`}
          >
            {isExplored && <Icon name="check" size={10} color="#FFF" />}
            {isCurrent && !isExplored && <View style={progressStyles.dotCurrentInner} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ── Footpath with completion states ──

const FootpathDots: React.FC<{
  width: number;
  stops: CountryLocation[];
  activeIndex: number;
  exploredIds: Set<string>;
}> = ({ width, stops, activeIndex, exploredIds }) => {
  const count = Math.floor(width / DOT_SPACING);

  return (
    <Svg width={width} height={FOOTPATH_HEIGHT}>
      <Defs>
        <SvgRadialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
          <SvgStop offset="0%" stopColor={colors.primary.wisteria} stopOpacity="0.4" />
          <SvgStop offset="100%" stopColor={colors.primary.wisteria} stopOpacity="0" />
        </SvgRadialGradient>
      </Defs>

      {/* Base path line */}
      <Line
        x1={20}
        y1={FOOTPATH_HEIGHT / 2}
        x2={width - 20}
        y2={FOOTPATH_HEIGHT / 2}
        stroke={colors.primary.wisteriaLight + '30'}
        strokeWidth={2}
        strokeDasharray="6,6"
      />

      {/* Tiny background dots */}
      {Array.from({ length: count }, (_, i) => (
        <Circle
          key={`bg-${i}`}
          cx={i * DOT_SPACING + DOT_SPACING / 2}
          cy={FOOTPATH_HEIGHT / 2}
          r={1.5}
          fill={colors.primary.wisteriaLight + '30'}
        />
      ))}

      {/* Stop markers with states */}
      {stops.map((stop, s) => {
        const x = (s / Math.max(stops.length - 1, 1)) * (width - 40) + 20;
        const isExplored = exploredIds.has(stop.id);
        const isCurrent = s === activeIndex;

        return (
          <React.Fragment key={stop.id}>
            {/* Current stop glow */}
            {isCurrent && !isExplored && (
              <Circle cx={x} cy={FOOTPATH_HEIGHT / 2} r={14} fill="url(#pulseGlow)" />
            )}
            {/* Outer ring */}
            <Circle
              cx={x}
              cy={FOOTPATH_HEIGHT / 2}
              r={isExplored ? 8 : isCurrent ? 9 : 7}
              fill={isExplored ? colors.primary.wisteria : isCurrent ? colors.primary.wisteria + '30' : colors.primary.wisteriaLight + '20'}
              stroke={isExplored ? colors.primary.wisteriaDark : isCurrent ? colors.primary.wisteria : colors.primary.wisteriaLight + '40'}
              strokeWidth={isCurrent && !isExplored ? 2 : 1}
            />
            {/* Inner fill */}
            {isExplored ? (
              <Circle cx={x} cy={FOOTPATH_HEIGHT / 2} r={4} fill="#FFF" />
            ) : (
              <Circle
                cx={x}
                cy={FOOTPATH_HEIGHT / 2}
                r={isCurrent ? 4 : 3}
                fill={isCurrent ? colors.primary.wisteria : colors.primary.wisteriaLight + '60'}
              />
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

// ── Explore Button ──

const ExploreButton: React.FC<{
  explored: boolean;
  aura: number;
  category: CountryLocation['category'];
  onPress: () => void;
}> = ({ explored, aura, category, onPress }) => {
  const checkScale = useSharedValue(explored ? 1 : 0);
  const sparkle = useSharedValue(0);

  useEffect(() => {
    if (explored) {
      checkScale.value = withSpring(1, { damping: 8, stiffness: 200 });
      sparkle.value = withSequence(
        withTiming(1, { duration: 400 }),
        withTiming(0, { duration: 600 }),
      );
    }
  }, [explored]);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  const sparkleStyle = useAnimatedStyle(() => ({
    opacity: sparkle.value,
    transform: [{ scale: interpolate(sparkle.value, [0, 1], [0.8, 1.3]) }],
  }));

  const grad = CATEGORY_GRADIENTS[category];

  if (explored) {
    return (
      <View style={exploreStyles.exploredWrap}>
        <Animated.View style={[exploreStyles.sparkleOverlay, sparkleStyle]}>
          <Icon name="sparkles" size={20} color={colors.reward.gold} />
        </Animated.View>
        <Animated.View style={[exploreStyles.exploredRow, checkStyle]}>
          <View style={exploreStyles.checkCircle}>
            <Icon name="check" size={14} color="#FFF" />
          </View>
          <Text style={exploreStyles.exploredText}>Explored! +{aura} Aura earned</Text>
        </Animated.View>
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={exploreStyles.btnWrap}>
      <LinearGradient
        colors={grad}
        style={exploreStyles.btn}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Icon name="compass" size={18} color="#FFF" />
        <Text style={exploreStyles.btnText}>Mark Explored</Text>
        <View style={exploreStyles.auraBadge}>
          <Icon name="sparkles" size={12} color={colors.reward.gold} />
          <Text style={exploreStyles.auraText}>+{aura}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

// ── Image Fallback (postcard style) ──

const ImageFallback: React.FC<{
  category: CountryLocation['category'];
  name: string;
  accentColor: string;
}> = ({ category, name, accentColor }) => {
  const grad = CATEGORY_GRADIENTS[category];
  return (
    <LinearGradient colors={[accentColor + '40', grad[0] + '60', grad[1] + '30']} style={styles.imagePlaceholder}>
      <View style={styles.placeholderStamp}>
        <Icon name={CATEGORY_ICONS[category]} size={40} color="#FFF" />
      </View>
      <View style={styles.placeholderLabel}>
        <Text style={styles.placeholderText}>{category.replace('_', ' ')}</Text>
      </View>
      {/* Corner decorations */}
      <View style={[styles.cornerDeco, { top: 8, left: 8 }]} />
      <View style={[styles.cornerDeco, { top: 8, right: 8 }]} />
      <View style={[styles.cornerDeco, { bottom: 8, left: 8 }]} />
      <View style={[styles.cornerDeco, { bottom: 8, right: 8 }]} />
    </LinearGradient>
  );
};

// ── Main Screen ──

export const PlaceStreetScreen: React.FC<PlaceStreetScreenProps> = ({ navigation, route }) => {
  const { countryId, pinId } = route.params;
  const markStopExplored = useStore((s) => s.markStopExplored);
  const isStopExplored = useStore((s) => s.isStopExplored);
  const addDiscovery = useStore((s) => s.addDiscovery);
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [exploredThisSession, setExploredThisSession] = useState<Set<string>>(new Set());
  const visbyX = useSharedValue(20);

  const country = COUNTRIES.find((c) => c.id === countryId);
  const pin = getMapPin(countryId, pinId);

  const stops = useMemo(() => {
    if (!pin) return [];
    return pin.locationIds
      .map((id) => getCountryLocations(countryId).find((loc) => loc.id === id))
      .filter((loc): loc is CountryLocation => !!loc);
  }, [countryId, pin]);

  // Build explored set from store + session
  const exploredIds = useMemo(() => {
    const set = new Set<string>();
    for (const stop of stops) {
      if (isStopExplored(countryId, stop.id) || exploredThisSession.has(stop.id)) {
        set.add(stop.id);
      }
    }
    return set;
  }, [stops, countryId, isStopExplored, exploredThisSession]);

  const totalPathWidth = SCREEN_WIDTH - 40;
  const exploredCount = exploredIds.size;
  const totalAuraEarned = stops.filter((s) => exploredIds.has(s.id)).reduce((sum, s) => sum + s.learningPoints, 0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / SNAP_INTERVAL);
      const clamped = Math.max(0, Math.min(idx, stops.length - 1));
      if (clamped !== activeIndex) setActiveIndex(clamped);
      const progress = clamped / Math.max(stops.length - 1, 1);
      visbyX.value = withSpring(20 + progress * (totalPathWidth - 40), { damping: 14, stiffness: 120 });
    },
    [stops.length, activeIndex, totalPathWidth, visbyX],
  );

  const visbyAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: visbyX.value - VISBY_SIZE / 2 }],
  }));

  const scrollToStop = useCallback(
    (idx: number) => {
      scrollRef.current?.scrollTo({ x: idx * SNAP_INTERVAL, animated: true });
    },
    [],
  );

  const handleExploreStop = useCallback(
    (stop: CountryLocation) => {
      if (exploredIds.has(stop.id)) return;

      hapticService.press();

      const pinCompleted = markStopExplored(countryId, pinId, stop.id, stop.learningPoints, pin?.locationIds ?? []);
      addDiscovery(`Explored: ${stop.name}`, countryId, 'stop');

      setExploredThisSession((prev) => new Set(prev).add(stop.id));

      if (pinCompleted) {
        setTimeout(() => setShowCelebration(true), 600);
      } else {
        // Auto-scroll to next unexplored stop
        const nextIdx = stops.findIndex((s, i) => i > stops.indexOf(stop) && !exploredIds.has(s.id) && s.id !== stop.id);
        if (nextIdx >= 0) {
          setTimeout(() => scrollToStop(nextIdx), 600);
        }
      }
    },
    [exploredIds, countryId, pinId, pin, stops, markStopExplored, scrollToStop],
  );

  const handleCelebrationDismiss = useCallback(() => {
    setShowCelebration(false);
    navigation.goBack();
  }, [navigation]);

  if (!country || !pin) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.base.cream, country.accentColor + '12', colors.base.parchment]} style={StyleSheet.absoluteFill} locations={[0, 0.35, 1]} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <NavBreadcrumb
              items={[
                { label: 'World', onPress: () => navigation.navigate('CountryWorld') },
                { label: country.name, onPress: () => navigation.navigate('CountryRoom', { countryId }) },
                { label: pin.name },
              ]}
            />
            <Heading level={3} style={styles.headerTitle}>{pin.name}</Heading>
            <Caption style={styles.headerSub}>
              {country.flagEmoji} {country.name} · {exploredCount}/{stops.length} explored
            </Caption>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Stop progress dots */}
        <StopProgressDots
          stops={stops}
          activeIndex={activeIndex}
          exploredIds={exploredIds}
          onTap={scrollToStop}
        />

        {/* Where is this? */}
        {getCountryOutlinePath(countryId) && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.whereSection}>
            <View style={styles.whereMapRow}>
              <MiniCountryMap
                countryId={countryId}
                pinXPercent={pin.xPercent}
                pinYPercent={pin.yPercent}
                size={80}
                accentColor={country.accentColor + '40'}
              />
              <View style={styles.whereFactWrap}>
                <Text variant="bodySmall" style={styles.whereFact}>
                  {getPlaceLocationFact(pin.name, country.name, pin.id)}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Horizontal card carousel */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled={false}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.carouselContent}
          style={styles.carousel}
        >
          {stops.map((loc, index) => {
            const isExplored = exploredIds.has(loc.id);
            return (
              <Animated.View
                key={loc.id}
                entering={FadeInDown.delay(index * 80).duration(350)}
                style={[styles.card, isExplored && styles.cardExplored]}
              >
                {/* Image or fallback */}
                <View style={styles.imageWrap}>
                  {loc.imageUrl ? (
                    <Image
                      source={{ uri: loc.imageUrl }}
                      style={styles.image}
                      contentFit="cover"
                      transition={200}
                      placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                    />
                  ) : (
                    <ImageFallback
                      category={loc.category}
                      name={loc.name}
                      accentColor={country.accentColor}
                    />
                  )}
                  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay} />
                  <View style={styles.imageCaption}>
                    <View style={styles.stopBadge}>
                      <Text style={styles.stopBadgeNum}>{index + 1}</Text>
                      <Icon name={CATEGORY_ICONS[loc.category]} size={14} color="#FFF" />
                      <Text style={styles.stopBadgeText}>{loc.category.replace('_', ' ')}</Text>
                      {isExplored && (
                        <View style={styles.stopBadgeCheck}>
                          <Icon name="check" size={10} color="#FFF" />
                        </View>
                      )}
                    </View>
                    <Heading level={2} style={styles.stopName}>{loc.name}</Heading>
                  </View>
                </View>

                {/* Body */}
                <View style={styles.cardBody}>
                  <Text variant="body" style={styles.stopDescription}>{loc.description}</Text>

                  {/* Explore button */}
                  <ExploreButton
                    explored={isExplored}
                    aura={loc.learningPoints}
                    category={loc.category}
                    onPress={() => handleExploreStop(loc)}
                  />

                  {/* Dish discovery prompt for food stops */}
                  {isExplored && loc.category === 'food' && (
                    <TouchableOpacity
                      style={styles.dishPrompt}
                      onPress={() => (navigation as any).getParent()?.navigate('AddBite', { countryId })}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[colors.reward.peachLight, colors.reward.peach + '40']}
                        style={styles.dishPromptInner}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        <Icon name="food" size={18} color={colors.reward.amber} />
                        <View style={styles.dishPromptText}>
                          <Text style={styles.dishPromptTitle}>Discover a local dish</Text>
                          <Caption style={styles.dishPromptSub}>Learn, taste, and add to your Bite collection</Caption>
                        </View>
                        <Icon name="chevronRight" size={16} color={colors.text.muted} />
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>

        {/* Footpath with walking Visby */}
        <View style={styles.footpathSection}>
          <FootpathDots
            width={totalPathWidth}
            stops={stops}
            activeIndex={activeIndex}
            exploredIds={exploredIds}
          />
          <Animated.View style={[styles.visbyWalker, visbyAnimStyle]}>
            <View style={styles.visbyBubble}>
              <VisbyMini size={28} />
            </View>
            <View style={styles.visbyLabel}>
              <Caption style={styles.visbyLabelText}>
                {exploredCount === stops.length ? 'All done!' : `Stop ${activeIndex + 1}/${stops.length}`}
              </Caption>
            </View>
          </Animated.View>
        </View>

        {/* Bottom navigation dots */}
        <View style={styles.dotsRow}>
          {stops.map((stop, i) => (
            <TouchableOpacity
              key={i}
              style={[
                styles.dot,
                i === activeIndex && styles.dotActive,
                exploredIds.has(stop.id) && styles.dotExplored,
              ]}
              onPress={() => scrollToStop(i)}
              accessibilityLabel={`Go to stop ${i + 1}`}
            />
          ))}
        </View>
      </SafeAreaView>

      {/* Pin Complete Celebration */}
      {showCelebration && (
        <PinCompleteCelebration
          pinName={pin.name}
          totalAura={totalAuraEarned}
          stopCount={stops.length}
          onDismiss={handleCelebrationDismiss}
        />
      )}
    </View>
  );
};

// ── Styles ──

const progressStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: spacing.screenPadding,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotExplored: {
    backgroundColor: colors.primary.wisteria,
  },
  dotCurrent: {
    backgroundColor: colors.primary.wisteriaFaded,
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
  },
  dotCurrentInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteria,
  },
  dotPending: {
    backgroundColor: colors.primary.wisteriaLight + '30',
    borderWidth: 1.5,
    borderColor: colors.primary.wisteriaLight + '50',
  },
});

const exploreStyles = StyleSheet.create({
  btnWrap: {
    marginTop: spacing.sm,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  btnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: '#FFF',
    flex: 1,
  },
  auraBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  auraText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.reward.gold,
  },
  exploredWrap: {
    marginTop: spacing.sm,
    position: 'relative',
  },
  exploredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: colors.success.honeydew,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.success.honeydewDark + '40',
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success.emerald,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploredText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: colors.success.emerald,
  },
  sparkleOverlay: {
    position: 'absolute',
    top: -8,
    right: 20,
    zIndex: 5,
  },
});

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
  headerSub: { marginTop: 2 },
  headerSpacer: { width: 40 },

  whereSection: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface.card,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  whereMapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  whereFactWrap: { flex: 1 },
  whereFact: {
    color: colors.text.secondary,
    lineHeight: 20,
  },

  carousel: { flex: 1 },
  carouselContent: {
    paddingHorizontal: 20,
    gap: CARD_MARGIN,
    paddingBottom: spacing.sm,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },
  cardExplored: {
    borderColor: colors.success.honeydewDark + '50',
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  placeholderStamp: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderStyle: 'dashed',
  },
  placeholderLabel: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  placeholderText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cornerDeco: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1.5,
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
  },
  imageCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
  },
  stopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  stopBadgeNum: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.reward.gold,
    marginRight: 2,
  },
  stopBadgeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.inverse,
    textTransform: 'capitalize',
  },
  stopBadgeCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success.emerald,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  stopName: Platform.select({
    web: { color: colors.text.inverse, textShadow: '0 1px 4px rgba(0,0,0,0.5)' },
    default: {
      color: colors.text.inverse,
      textShadowColor: 'rgba(0,0,0,0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 4,
    },
  }),
  cardBody: {
    padding: spacing.md,
  },
  stopDescription: {
    color: colors.text.primary,
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  dishPrompt: {
    marginTop: spacing.sm,
  },
  dishPromptInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.reward.peach + '60',
  },
  dishPromptText: { flex: 1 },
  dishPromptTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.primary,
  },
  dishPromptSub: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 1,
  },

  footpathSection: {
    height: FOOTPATH_HEIGHT,
    marginHorizontal: 20,
    position: 'relative',
  },
  visbyWalker: {
    position: 'absolute',
    top: FOOTPATH_HEIGHT / 2 - VISBY_SIZE - 4,
    alignItems: 'center',
  },
  visbyBubble: {
    width: VISBY_SIZE,
    height: VISBY_SIZE,
    borderRadius: VISBY_SIZE / 2,
    backgroundColor: colors.base.cream,
    borderWidth: 2,
    borderColor: colors.primary.wisteria,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  visbyLabel: {
    marginTop: 2,
    backgroundColor: colors.primary.wisteria,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  visbyLabelText: {
    color: colors.text.inverse,
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: spacing.md,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.wisteriaLight + '40',
  },
  dotActive: {
    backgroundColor: colors.primary.wisteria,
    width: 24,
    borderRadius: 4,
  },
  dotExplored: {
    backgroundColor: colors.success.emerald,
  },
});

export default PlaceStreetScreen;
