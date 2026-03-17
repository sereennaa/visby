import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Svg, { Line, Circle as SvgCircle } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { COUNTRIES } from '../../config/constants';
import { getCountryMapPins, getPinRegionHint, type CountryMapPin } from '../../config/countryMap';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { CountryOutline } from '../../components/maps/CountryOutline';
import { ExploreStackParamList } from '../../types';
import { FloatingParticles, getCountryParticleVariant } from '../../components/effects/FloatingParticles';
import { useStore } from '../../store/useStore';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_PADDING = 20;
const MAP_WIDTH = SCREEN_WIDTH - MAP_PADDING * 2;
const MAP_HEIGHT = Math.min(SCREEN_HEIGHT * 0.48, 360);
const PIN_SIZE = 48;

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

const TrailPaths: React.FC<{ pins: CountryMapPin[]; width: number; height: number }> = ({ pins, width, height }) => {
  if (pins.length < 2) return null;
  const lines: React.ReactElement[] = [];
  for (let i = 0; i < pins.length - 1; i++) {
    const x1 = (pins[i].xPercent / 100) * (width - PIN_SIZE) + PIN_SIZE / 2;
    const y1 = (pins[i].yPercent / 100) * (height - PIN_SIZE) + PIN_SIZE / 2;
    const x2 = (pins[i + 1].xPercent / 100) * (width - PIN_SIZE) + PIN_SIZE / 2;
    const y2 = (pins[i + 1].yPercent / 100) * (height - PIN_SIZE) + PIN_SIZE / 2;
    lines.push(
      <Line
        key={`trail-${i}`}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={colors.primary.wisteriaLight + '50'}
        strokeWidth={2}
        strokeDasharray="8,6"
      />,
    );
    const dots = 5;
    for (let d = 1; d < dots; d++) {
      const t = d / dots;
      lines.push(
        <SvgCircle
          key={`dot-${i}-${d}`}
          cx={x1 + (x2 - x1) * t}
          cy={y1 + (y2 - y1) * t}
          r={2}
          fill={colors.primary.wisteriaLight + '40'}
        />,
      );
    }
  }
  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
      {lines}
    </Svg>
  );
};

export const CountryMapScreen: React.FC<CountryMapScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const pins = getCountryMapPins(countryId);
  const getCountryProgress = useStore((s) => s.getCountryProgress);
  const countryProgress = getCountryProgress(countryId);

  const masteryItems = useMemo(() => {
    if (!country) return [];
    return [
      { label: 'Facts', done: countryProgress.factsReadCount, total: country.facts.length, icon: 'book' as IconName, color: colors.calm.ocean },
      { label: 'Quiz', done: countryProgress.quizCompleted ? 1 : 0, total: 1, icon: 'quiz' as IconName, color: colors.primary.wisteriaDark },
      { label: 'Games', done: countryProgress.gamesPlayed, total: 1, icon: 'game' as IconName, color: colors.reward.amber },
      { label: 'Places', done: countryProgress.locationsVisited, total: pins.length, icon: 'compass' as IconName, color: colors.success.emerald },
    ];
  }, [country, countryProgress, pins.length]);

  const totalDone = masteryItems.reduce((s, m) => s + Math.min(m.done, m.total), 0);
  const totalTotal = masteryItems.reduce((s, m) => s + m.total, 0);
  const masteryPct = totalTotal > 0 ? Math.round((totalDone / totalTotal) * 100) : 0;
  const particle = getCountryParticleVariant(countryId);

  if (!country) return null;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, country.accentColor + '18', colors.base.parchment, colors.primary.wisteriaFaded]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.25, 0.6, 1]}
      />
      <FloatingParticles count={4} variant={particle.variant} opacity={particle.opacity * 0.4} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={3} style={styles.headerTitle}>
              {country.flagEmoji} Map of {country.name}
            </Heading>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Mastery counter */}
        <Animated.View entering={FadeInDown.duration(300)} style={styles.masteryBar}>
          <View style={styles.masteryLeft}>
            <Icon name="trophy" size={16} color={masteryPct >= 100 ? colors.journey.pinMastered : colors.text.muted} />
            <Text style={styles.masteryLabel}>
              {masteryPct >= 100 ? 'Mastered!' : `${masteryPct}% Explored`}
            </Text>
          </View>
          <View style={styles.masteryItems}>
            {masteryItems.map((item) => {
              const isDone = item.done >= item.total;
              return (
                <View key={item.label} style={[styles.masteryItem, isDone && { backgroundColor: item.color + '20' }]}>
                  <Icon name={item.icon} size={12} color={isDone ? item.color : colors.text.muted} />
                  <Text style={[styles.masteryItemText, isDone && { color: item.color }]}>
                    {item.done}/{item.total}
                  </Text>
                </View>
              );
            })}
          </View>
        </Animated.View>

        {/* Map canvas with filled outline, trail paths, and illustrated pins */}
        <View style={styles.mapWrap}>
          <View style={[styles.mapCanvas, masteryPct >= 100 && styles.mapCanvasMastered]}>
            {getCountryOutlinePath(countryId) ? (
              <View style={styles.mapOutlineWrap}>
                <CountryOutline
                  countryId={countryId}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  fill={country.accentColor + '45'}
                  stroke={country.accentColor + '90'}
                  strokeWidth={2.5}
                />
              </View>
            ) : (
              <LinearGradient
                colors={[country.accentColor + '20', colors.base.skyLight + 'cc']}
                style={StyleSheet.absoluteFill}
              />
            )}

            <TrailPaths pins={pins} width={MAP_WIDTH} height={MAP_HEIGHT} />

            {pins.map((pin, idx) => {
              const x = (pin.xPercent / 100) * (MAP_WIDTH - PIN_SIZE);
              const y = (pin.yPercent / 100) * (MAP_HEIGHT - PIN_SIZE);
              const iconName = LANDMARK_ICONS[pin.type] || 'landmark';
              const pinColor = pin.type === 'city' ? colors.primary.wisteria : colors.reward.peach;
              return (
                <Animated.View
                  key={pin.id}
                  entering={ZoomIn.delay(idx * 100).duration(300).springify()}
                  style={[styles.pinWrap, { left: x, top: y }]}
                >
                  <TouchableOpacity
                    style={[styles.pin, { backgroundColor: pinColor }]}
                    onPress={() => navigation.navigate('PlaceStreet', { countryId, pinId: pin.id })}
                    activeOpacity={0.85}
                  >
                    <View style={styles.pinIconRing}>
                      <Icon name={iconName} size={20} color="#FFF" />
                    </View>
                    <Text style={styles.pinLabel} numberOfLines={1}>{pin.name}</Text>
                    <View style={styles.pinStopCount}>
                      <Text style={styles.pinStopText}>{pin.locationIds.length}</Text>
                    </View>
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </View>
        </View>

        {/* List of pins */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {pins.map((pin, idx) => {
            const regionHint = getPinRegionHint(pin.id);
            const pinColor = pin.type === 'city' ? colors.primary.wisteria : colors.reward.peach;
            return (
              <Animated.View key={pin.id} entering={FadeInDown.delay(idx * 60).duration(300)}>
                <TouchableOpacity
                  style={[styles.listRow, { borderLeftColor: pinColor }]}
                  onPress={() => navigation.navigate('PlaceStreet', { countryId, pinId: pin.id })}
                  activeOpacity={0.8}
                >
                  <View style={[styles.listIconWrap, { backgroundColor: pinColor + '20' }]}>
                    <Icon
                      name={LANDMARK_ICONS[pin.type] || 'landmark'}
                      size={24}
                      color={pinColor}
                    />
                  </View>
                  <View style={styles.listTextWrap}>
                    <Text style={styles.listTitle}>{pin.name}</Text>
                    <Caption style={styles.listMeta}>
                      {pin.type === 'city' ? 'City' : 'Landmark'} · {pin.locationIds.length} stop{pin.locationIds.length !== 1 ? 's' : ''}
                    </Caption>
                    {regionHint ? <Caption style={styles.listHint}>{regionHint}</Caption> : null}
                  </View>
                  <Icon name="chevronRight" size={20} color={colors.text.muted} />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
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
  headerSpacer: { width: 40 },

  masteryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: MAP_PADDING,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.base.cream + 'ee',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight + '30',
  },
  masteryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  masteryLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.primary,
  },
  masteryItems: {
    flexDirection: 'row',
    gap: 6,
  },
  masteryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  masteryItemText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.muted,
  },

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
    backgroundColor: colors.base.cream + '40',
  },
  mapCanvasMastered: {
    borderColor: colors.journey.pinMastered,
    borderWidth: 3,
    ...Platform.select({
      web: { boxShadow: '0 0 20px rgba(255,215,0,0.3)' },
      default: {
        shadowColor: colors.journey.pinMastered,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
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
  pin: {
    width: PIN_SIZE,
    minHeight: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.18)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
        elevation: 5,
      },
    }),
  },
  pinIconRing: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 8,
    color: '#FFF',
    marginTop: 1,
    textAlign: 'center',
  },
  pinStopCount: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.reward.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  pinStopText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: '#FFF',
  },

  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 2 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream + 'ee',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  listIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listTextWrap: { flex: 1 },
  listTitle: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.text.primary },
  listMeta: { marginTop: 2 },
  listHint: { marginTop: 2, fontStyle: 'italic', color: colors.text.muted },
});

export default CountryMapScreen;
