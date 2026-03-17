import React, { useMemo, useRef, useState, useCallback } from 'react';
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
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Circle, Line } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import { COUNTRIES } from '../../config/constants';
import { getMapPin, getPlaceLocationFact } from '../../config/countryMap';
import { getCountryLocations, CountryLocation } from '../../config/learningContent';
import { MiniCountryMap } from '../../components/maps/MiniCountryMap';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { ExploreStackParamList } from '../../types';
import { useStore } from '../../store/useStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 40;
const CARD_MARGIN = 12;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN;
const IMAGE_HEIGHT = 200;
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

type PlaceStreetScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'PlaceStreet'>;
  route: { params: { countryId: string; pinId: string } };
};

const FootpathDots: React.FC<{ width: number; stopCount: number }> = ({ width, stopCount }) => {
  const dots: React.ReactElement[] = [];
  const count = Math.floor(width / DOT_SPACING);
  for (let i = 0; i < count; i++) {
    dots.push(
      <Circle
        key={i}
        cx={i * DOT_SPACING + DOT_SPACING / 2}
        cy={FOOTPATH_HEIGHT / 2}
        r={2.5}
        fill={colors.primary.wisteriaLight + '60'}
      />,
    );
  }
  const stopMarkers: React.ReactElement[] = [];
  for (let s = 0; s < stopCount; s++) {
    const x = (s / Math.max(stopCount - 1, 1)) * (width - 40) + 20;
    stopMarkers.push(
      <Circle key={`stop-${s}`} cx={x} cy={FOOTPATH_HEIGHT / 2} r={8} fill={colors.primary.wisteria + '40'} />,
    );
    stopMarkers.push(
      <Circle key={`stop-inner-${s}`} cx={x} cy={FOOTPATH_HEIGHT / 2} r={4} fill={colors.primary.wisteria} />,
    );
  }
  return (
    <Svg width={width} height={FOOTPATH_HEIGHT}>
      <Line x1={20} y1={FOOTPATH_HEIGHT / 2} x2={width - 20} y2={FOOTPATH_HEIGHT / 2} stroke={colors.primary.wisteriaLight + '30'} strokeWidth={2} strokeDasharray="6,6" />
      {dots}
      {stopMarkers}
    </Svg>
  );
};

export const PlaceStreetScreen: React.FC<PlaceStreetScreenProps> = ({ navigation, route }) => {
  const { countryId, pinId } = route.params;
  const addAura = useStore((s) => s.addAura);
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const visbyX = useSharedValue(20);

  const country = COUNTRIES.find((c) => c.id === countryId);
  const pin = getMapPin(countryId, pinId);

  const stops = useMemo(() => {
    if (!pin) return [];
    return pin.locationIds
      .map((id) => getCountryLocations(countryId).find((loc) => loc.id === id))
      .filter((loc): loc is CountryLocation => !!loc);
  }, [countryId, pin]);

  const totalPathWidth = SCREEN_WIDTH - 40;

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

  if (!country || !pin) return null;

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.base.cream, country.accentColor + '12', colors.base.parchment]} style={StyleSheet.absoluteFill} locations={[0, 0.35, 1]} />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
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
              {country.flagEmoji} {country.name} · {stops.length} stop{stops.length !== 1 ? 's' : ''}
            </Caption>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Where is this? */}
        {getCountryOutlinePath(countryId) && (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.whereSection}>
            <View style={styles.whereMapRow}>
              <MiniCountryMap
                countryId={countryId}
                pinXPercent={pin.xPercent}
                pinYPercent={pin.yPercent}
                size={90}
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
          {stops.map((loc, index) => (
            <Animated.View
              key={loc.id}
              entering={FadeInDown.delay(index * 80).duration(350)}
              style={styles.card}
            >
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
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Icon name={CATEGORY_ICONS[loc.category]} size={48} color={colors.primary.wisteriaLight} />
                  </View>
                )}
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.7)']} style={styles.imageOverlay} />
                <View style={styles.imageCaption}>
                  <View style={styles.stopBadge}>
                    <Text style={styles.stopBadgeNum}>{index + 1}</Text>
                    <Icon name={CATEGORY_ICONS[loc.category]} size={14} color="#FFF" />
                    <Text style={styles.stopBadgeText}>{loc.category.replace('_', ' ')}</Text>
                  </View>
                  <Heading level={2} style={styles.stopName}>{loc.name}</Heading>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text variant="body" style={styles.stopDescription}>{loc.description}</Text>
                <View style={styles.pointsRow}>
                  <Icon name="sparkles" size={16} color={colors.reward.gold} />
                  <Text style={styles.pointsText}>+{loc.learningPoints} Aura</Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Footpath with walking Visby */}
        <View style={styles.footpathSection}>
          <FootpathDots width={totalPathWidth} stopCount={stops.length} />
          <Animated.View style={[styles.visbyWalker, visbyAnimStyle]}>
            <View style={styles.visbyBubble}>
              <Text style={styles.visbyEmoji}>🦊</Text>
            </View>
            <View style={styles.visbyLabel}>
              <Caption style={styles.visbyLabelText}>
                Stop {activeIndex + 1}/{stops.length}
              </Caption>
            </View>
          </Animated.View>
        </View>

        {/* Stop navigation dots */}
        <View style={styles.dotsRow}>
          {stops.map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
              onPress={() => scrollToStop(i)}
              accessibilityLabel={`Go to stop ${i + 1}`}
            />
          ))}
        </View>
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
    backgroundColor: colors.base.cream + 'ee',
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
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
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
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  pointsText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.reward.amber,
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
  visbyEmoji: { fontSize: 22 },
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
});

export default PlaceStreetScreen;
