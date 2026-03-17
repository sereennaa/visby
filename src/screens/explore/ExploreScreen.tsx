import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import Svg, { Circle, Path, Ellipse, Line, G } from 'react-native-svg';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { ExploreStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { Tooltip } from '../../components/ui/Tooltip';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ExploreScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'ExploreHome'>;
};

function MiniGlobe({ size, visitedIds }: { size: number; visitedIds: string[] }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 4;
  return (
    <Svg width={size} height={size}>
      <Circle cx={cx} cy={cy} r={r} fill={colors.journey.mapOcean} opacity={0.35} />
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.journey.cardBorder} strokeWidth={1.5} />
      <Ellipse cx={cx} cy={cy} rx={r * 0.5} ry={r} fill="none" stroke={colors.journey.mapLand} strokeWidth={0.8} opacity={0.4} />
      <Line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke={colors.journey.mapLand} strokeWidth={0.6} opacity={0.3} />
      <Path
        d={`M${cx - r * 0.7},${cy - r * 0.35} Q${cx},${cy - r * 0.45} ${cx + r * 0.7},${cy - r * 0.3}`}
        fill={colors.journey.mapLand}
        opacity={0.5}
      />
      <Path
        d={`M${cx - r * 0.4},${cy + r * 0.1} Q${cx},${cy + r * 0.3} ${cx + r * 0.5},${cy + r * 0.15}`}
        fill={colors.journey.mapLand}
        opacity={0.4}
      />
      {visitedIds.length > 0 && (
        <G>
          {visitedIds.slice(0, 5).map((_, i) => {
            const angle = (i / 5) * Math.PI * 1.6 - Math.PI * 0.3;
            const px = cx + Math.cos(angle) * r * 0.55;
            const py = cy + Math.sin(angle) * r * 0.45;
            return <Circle key={i} cx={px} cy={py} r={2.5} fill={colors.journey.pinVisited} opacity={0.9} />;
          })}
        </G>
      )}
    </Svg>
  );
}

function CompassWatermark() {
  return (
    <View style={[styles.compassWrap, { pointerEvents: 'none' }]}>
      <Svg width={64} height={64}>
        <Circle cx={32} cy={32} r={28} fill="none" stroke={colors.journey.mapCompass} strokeWidth={0.7} opacity={0.12} />
        <Circle cx={32} cy={32} r={22} fill="none" stroke={colors.journey.mapCompass} strokeWidth={0.4} opacity={0.08} />
        <Line x1={32} y1={6} x2={32} y2={58} stroke={colors.journey.mapCompass} strokeWidth={0.5} opacity={0.1} />
        <Line x1={6} y1={32} x2={58} y2={32} stroke={colors.journey.mapCompass} strokeWidth={0.5} opacity={0.1} />
        <Path d="M32,8 L34,28 L32,32 L30,28 Z" fill={colors.journey.mapCompass} opacity={0.15} />
      </Svg>
    </View>
  );
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const userHouses = useStore(s => s.userHouses);
  const visitedCountries = useMemo(() => user?.visitedCountries ?? [], [user?.visitedCountries]);
  const totalCountries = COUNTRIES.length;
  const progressPct = totalCountries > 0 ? Math.round((visitedCountries.length / totalCountries) * 100) : 0;

  const visitedFlags = useMemo(() => {
    return visitedCountries.slice(0, 8).map(id => {
      const c = COUNTRIES.find(co => co.id === id);
      return c?.flagEmoji ?? '🏳️';
    });
  }, [visitedCountries]);

  const nextCountry = useMemo(() => {
    return COUNTRIES.find(c => !visitedCountries.includes(c.id));
  }, [visitedCountries]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.base.parchment, colors.journey.heroBg, colors.calm.skyLight, colors.base.cream]}
        locations={[0, 0.2, 0.45, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles count={5} variant="mixed" opacity={0.2} speed="slow" />
      <CompassWatermark />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(80)} style={styles.header}>
            <Heading level={1}>Explore</Heading>
            <Caption style={styles.subtitle}>
              Discover new countries, collect stamps, and learn about the world.
            </Caption>
          </Animated.View>

          {/* Hero: Visit the World */}
          <Animated.View entering={FadeInDown.duration(500).delay(150)} style={{ position: 'relative' as const }}>
            {visitedCountries.length === 0 && (
              <Tooltip
                id="explore_first_country"
                text="Tap a country to start exploring!"
              />
            )}
            <AnimatedPressable
              style={styles.heroCard}
              onPress={() => navigation.navigate('CountryWorld')}
              scaleDown={0.97}
              accessibilityRole="button"
              accessibilityLabel="Visit the World"
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.surface.lavender, colors.calm.skyLight]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <View style={styles.heroTop}>
                  <View style={styles.heroTextCol}>
                    <Text style={styles.heroLabel}>Visit the World</Text>
                    <Caption style={styles.heroSub}>
                      {visitedCountries.length > 0
                        ? `${visitedCountries.length} of ${totalCountries} countries explored`
                        : 'Start your first adventure'}
                    </Caption>
                    {visitedCountries.length > 0 && (
                      <View style={styles.heroProgressWrap}>
                        <View style={styles.heroProgressTrack}>
                          <View style={[styles.heroProgressFill, { width: `${Math.max(progressPct, 4)}%` }]} />
                        </View>
                        <Text style={styles.heroProgressPct}>{progressPct}%</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.heroGlobeWrap}>
                    <MiniGlobe size={72} visitedIds={visitedCountries} />
                  </View>
                </View>

                {visitedFlags.length > 0 && (
                  <View style={styles.heroFlagsRow}>
                    {visitedFlags.map((flag, i) => (
                      <Text key={i} style={styles.heroFlag}>{flag}</Text>
                    ))}
                    {visitedCountries.length > 8 && (
                      <Text style={styles.heroFlagMore}>+{visitedCountries.length - 8}</Text>
                    )}
                  </View>
                )}

                <View style={styles.heroArrowRow}>
                  <Text style={styles.heroArrowLabel}>See all countries</Text>
                  <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* Next destination suggestion */}
          {nextCountry && (
            <Animated.View entering={FadeInRight.duration(400).delay(250)}>
              <AnimatedPressable
                style={styles.nextDestCard}
                onPress={() => navigation.navigate('CountryWorld')}
                scaleDown={0.97}
              >
                <View style={styles.nextDestIcon}>
                  <Text style={styles.nextDestFlag}>{nextCountry.flagEmoji}</Text>
                </View>
                <View style={styles.nextDestText}>
                  <Caption style={styles.nextDestLabel}>Next destination</Caption>
                  <Text style={styles.nextDestName}>{nextCountry.name}</Text>
                </View>
                <Icon name="chevronRight" size={18} color={colors.text.muted} />
              </AnimatedPressable>
            </Animated.View>
          )}

          {/* Section divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Your tools</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Map cards row */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.mapRow}>
            <AnimatedPressable
              style={styles.mapCard}
              onPress={() => navigation.navigate('WorldMap')}
              scaleDown={0.96}
              accessibilityRole="button"
              accessibilityLabel="World map"
            >
              <LinearGradient
                colors={[colors.calm.skyLight, colors.calm.sky]}
                style={styles.mapCardGradient}
              >
                <View style={[styles.mapCardIconWrap, { backgroundColor: colors.calm.ocean + '20' }]}>
                  <Icon name="map" size={24} color={colors.calm.ocean} />
                </View>
                <Text style={styles.mapCardLabel}>World Map</Text>
                <Caption style={styles.mapCardSub}>Where you've been</Caption>
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable
              style={styles.mapCard}
              onPress={() => navigation.navigate('Map')}
              scaleDown={0.96}
              accessibilityRole="button"
              accessibilityLabel="Nearby Map"
            >
              <LinearGradient
                colors={[colors.base.parchment, colors.calm.skyLight]}
                style={styles.mapCardGradient}
              >
                <View style={[styles.mapCardIconWrap, { backgroundColor: colors.primary.wisteria + '20' }]}>
                  <Icon name="compass" size={24} color={colors.primary.wisteriaDark} />
                </View>
                <Text style={styles.mapCardLabel}>Nearby</Text>
                <Caption style={styles.mapCardSub}>Explore your area</Caption>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* Quick actions */}
          <Animated.View entering={FadeInDown.duration(400).delay(380)} style={styles.quickRow}>
            <AnimatedPressable
              style={styles.quickAction}
              onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('Learn')}
              scaleDown={0.96}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: colors.reward.peachLight }]}>
                <Icon name="book" size={20} color={colors.reward.peachDark} />
              </View>
              <Text style={styles.quickLabel}>Start learning</Text>
            </AnimatedPressable>

            <AnimatedPressable
              style={styles.quickAction}
              onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('AddBite')}
              scaleDown={0.96}
            >
              <View style={[styles.quickIconWrap, { backgroundColor: colors.accent.blush }]}>
                <Icon name="bowl" size={20} color={colors.accent.coral} />
              </View>
              <Text style={styles.quickLabel}>Discover a Dish</Text>
            </AnimatedPressable>
          </Animated.View>

          {/* My houses */}
          {userHouses.length > 0 && (
            <Animated.View entering={FadeInDown.duration(400).delay(440)}>
              <View style={styles.housesSection}>
                <Text style={styles.sectionLabel}>My houses</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.housesScroll}>
                  {userHouses.map(house => {
                    const c = COUNTRIES.find(co => co.id === house.countryId);
                    if (!c) return null;
                    return (
                      <AnimatedPressable
                        key={house.countryId}
                        style={styles.houseChip}
                        onPress={() => navigation.navigate('CountryRoom', { countryId: house.countryId })}
                        scaleDown={0.96}
                      >
                        <Text style={styles.houseFlag}>{c.flagEmoji}</Text>
                        <Text style={styles.houseName}>{c.name}</Text>
                      </AnimatedPressable>
                    );
                  })}
                </ScrollView>
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const HERO_INNER_PAD = 18;
const MAP_CARD_W = (SCREEN_WIDTH - spacing.screenPadding * 2 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },

  compassWrap: {
    position: 'absolute',
    right: 24,
    top: 100,
    opacity: 0.6,
  },

  // Hero card
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  heroGradient: {
    padding: HERO_INNER_PAD,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: spacing.md,
  },
  heroLabel: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 20,
    color: colors.text.primary,
  },
  heroSub: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 17,
  },
  heroProgressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  heroProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.journey.progressTrack,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.journey.progressFill,
  },
  heroProgressPct: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.primary.wisteriaDark,
    minWidth: 32,
    textAlign: 'right',
  },
  heroGlobeWrap: {
    width: 76,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFlagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  heroFlag: {
    fontSize: 18,
  },
  heroFlagMore: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.text.muted,
    marginLeft: 2,
  },
  heroArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 4,
  },
  heroArrowLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.primary.wisteriaDark,
  },

  // Next destination
  nextDestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.cardWarm,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    marginBottom: spacing.lg,
  },
  nextDestIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  nextDestFlag: {
    fontSize: 20,
  },
  nextDestText: { flex: 1 },
  nextDestLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: colors.text.muted,
  },
  nextDestName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.text.primary,
  },

  // Divider
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.journey.cardBorder,
  },
  dividerLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Map cards
  mapRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  mapCard: {
    width: MAP_CARD_W,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapCardGradient: {
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
    minHeight: 130,
  },
  mapCardIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  mapCardLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: colors.text.primary,
  },
  mapCardSub: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },

  // Quick actions
  quickRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.lg,
  },
  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  quickIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.text.primary,
    flex: 1,
  },

  // My houses
  housesSection: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 11,
    marginBottom: spacing.sm,
  },
  housesScroll: {
    gap: spacing.sm,
  },
  houseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  houseFlag: {
    fontSize: 18,
  },
  houseName: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.primary.wisteriaDark,
  },

  bottomSpacer: {
    height: spacing.lg,
  },
});

export default ExploreScreen;
