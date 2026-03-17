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

function ProgressRing({ size, progress, strokeWidth = 4 }: { size: number; progress: number; strokeWidth?: number }) {
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const filled = circumference * (progress / 100);
  return (
    <Svg width={size} height={size} style={{ position: 'absolute' }}>
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.journey.progressTrack} strokeWidth={strokeWidth} />
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={colors.journey.progressFill}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circumference - filled}`}
        rotation={-90}
        origin={`${cx}, ${cy}`}
      />
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

          {/* Hero: Visit the World — passport/travel-journal card */}
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
                colors={[colors.base.parchment, '#F5EDE0', colors.base.cream]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroGradient}
              >
                <FloatingParticles count={3} variant="mixed" opacity={0.12} speed="slow" />

                <View style={styles.heroTop}>
                  <View style={styles.heroTextCol}>
                    <Text style={styles.heroLabel}>Visit the World</Text>
                    <Caption style={styles.heroSubItalic}>Your journey around the world</Caption>
                    <Text style={styles.heroProgress}>
                      {visitedCountries.length > 0
                        ? `${visitedCountries.length}/${totalCountries} countries explored`
                        : 'Start your first adventure'}
                    </Text>
                  </View>

                  <View style={styles.heroGlobeWrap}>
                    <ProgressRing size={108} progress={progressPct} strokeWidth={4} />
                    <View style={styles.heroGlobeInner}>
                      <MiniGlobe size={100} visitedIds={visitedCountries} />
                    </View>
                  </View>
                </View>

                {visitedFlags.length > 0 && (
                  <View style={styles.heroFlagsRow}>
                    {visitedFlags.map((flag, i) => (
                      <View key={i} style={[styles.heroFlagCircle, i > 0 && { marginLeft: -6 }]}>
                        <Text style={styles.heroFlag}>{flag}</Text>
                      </View>
                    ))}
                    {visitedCountries.length > 8 && (
                      <View style={[styles.heroFlagCircle, { marginLeft: -6, backgroundColor: colors.primary.wisteriaFaded }]}>
                        <Text style={styles.heroFlagMore}>+{visitedCountries.length - 8}</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.heroArrowRow}>
                  <Text style={styles.heroArrowLabel}>See all countries</Text>
                  <Icon name="chevronRight" size={18} color={colors.journey.mapCompass} />
                </View>

                {/* Compass decoration bottom-left */}
                <View style={styles.heroCompassDecor} pointerEvents="none">
                  <Svg width={40} height={40}>
                    <Circle cx={20} cy={20} r={16} fill="none" stroke={colors.journey.mapCompass} strokeWidth={0.6} opacity={0.15} />
                    <Line x1={20} y1={5} x2={20} y2={35} stroke={colors.journey.mapCompass} strokeWidth={0.4} opacity={0.1} />
                    <Line x1={5} y1={20} x2={35} y2={20} stroke={colors.journey.mapCompass} strokeWidth={0.4} opacity={0.1} />
                    <Path d="M20,6 L21.5,17 L20,20 L18.5,17 Z" fill={colors.journey.mapCompass} opacity={0.18} />
                  </Svg>
                </View>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* Next destination — postcard style */}
          {nextCountry && (
            <Animated.View entering={FadeInRight.duration(400).delay(250)}>
              <AnimatedPressable
                style={styles.nextDestCard}
                onPress={() => navigation.navigate('CountryWorld')}
                scaleDown={0.97}
              >
                <LinearGradient
                  colors={[nextCountry.accentColor + '18', nextCountry.accentColor + '08', colors.surface.card]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.nextDestGradient}
                >
                  <View style={styles.nextDestLeft}>
                    <Text style={styles.nextDestFlag}>{nextCountry.flagEmoji}</Text>
                  </View>
                  <View style={styles.nextDestCenter}>
                    <Text style={styles.nextDestLabel}>Next Adventure</Text>
                    <Text style={styles.nextDestName}>{nextCountry.name}</Text>
                    <Caption style={styles.nextDestDesc} numberOfLines={2}>
                      {nextCountry.description}
                    </Caption>
                  </View>
                  <View style={styles.nextDestCTA}>
                    <LinearGradient
                      colors={[colors.primary.wisteria, colors.primary.wisteriaDark]}
                      style={styles.nextDestButton}
                    >
                      <Text style={styles.nextDestButtonText}>Start Exploring</Text>
                    </LinearGradient>
                  </View>
                </LinearGradient>
              </AnimatedPressable>
            </Animated.View>
          )}

          {/* Section divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Your tools</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Map cards row — equal width, side by side */}
          <Animated.View entering={FadeInDown.duration(400).delay(300)} style={styles.mapRow}>
            <AnimatedPressable
              style={styles.mapCard}
              onPress={() => navigation.navigate('WorldMap')}
              scaleDown={0.96}
              accessibilityRole="button"
              accessibilityLabel="World map"
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.surface.lavender]}
                style={styles.mapCardGradient}
              >
                <View style={[styles.mapCardIconWrap, { backgroundColor: colors.primary.wisteria + '25' }]}>
                  <Icon name="map" size={24} color={colors.primary.wisteriaDark} />
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
                colors={[colors.calm.skyLight, colors.calm.sky + '40']}
                style={styles.mapCardGradient}
              >
                <View style={[styles.mapCardIconWrap, { backgroundColor: colors.calm.ocean + '25' }]}>
                  <Icon name="compass" size={24} color={colors.calm.ocean} />
                </View>
                <Text style={styles.mapCardLabel}>Nearby</Text>
                <Caption style={styles.mapCardSub}>Explore your area</Caption>
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* Quick actions — full-width cards */}
          <Animated.View entering={FadeInDown.duration(400).delay(380)} style={styles.quickCol}>
            <AnimatedPressable
              style={styles.quickAction}
              onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('Learn')}
              scaleDown={0.96}
            >
              <LinearGradient
                colors={[colors.reward.peachLight + '80', colors.reward.peachLight + '30']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.quickActionGradient}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: colors.reward.peachLight }]}>
                  <Icon name="book" size={22} color={colors.reward.peachDark} />
                </View>
                <View style={styles.quickTextWrap}>
                  <Text style={styles.quickTitle}>Start Learning</Text>
                  <Caption style={styles.quickSub}>Lessons, quizzes & flashcards</Caption>
                </View>
                <Icon name="chevronRight" size={18} color={colors.text.muted} />
              </LinearGradient>
            </AnimatedPressable>

            <AnimatedPressable
              style={styles.quickAction}
              onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('AddBite')}
              scaleDown={0.96}
            >
              <LinearGradient
                colors={[colors.accent.blush + '80', colors.accent.blush + '30']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.quickActionGradient}
              >
                <View style={[styles.quickIconCircle, { backgroundColor: colors.accent.blush }]}>
                  <Icon name="bowl" size={22} color={colors.accent.coral} />
                </View>
                <View style={styles.quickTextWrap}>
                  <Text style={styles.quickTitle}>Discover a Dish</Text>
                  <Caption style={styles.quickSub}>Try world foods & earn aura</Caption>
                </View>
                <Icon name="chevronRight" size={18} color={colors.text.muted} />
              </LinearGradient>
            </AnimatedPressable>
          </Animated.View>

          {/* My houses — postcard-style chips */}
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
                        style={[styles.houseChip, { borderColor: c.accentColor + '55' }]}
                        onPress={() => navigation.navigate('CountryRoom', { countryId: house.countryId })}
                        scaleDown={0.96}
                      >
                        <Text style={styles.houseFlag}>{c.flagEmoji}</Text>
                        <View style={styles.houseTextWrap}>
                          <Text style={styles.houseName}>{house.houseName || c.name}</Text>
                          <Caption style={styles.houseCountry}>{c.name}</Caption>
                        </View>
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

const MAP_CARD_W = (SCREEN_WIDTH - spacing.screenPadding * 2 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl,
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

  // ─── Hero card (passport / travel-journal) ───
  heroCard: {
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  heroGradient: {
    padding: 20,
    paddingBottom: 18,
    borderRadius: 22,
    borderWidth: 1.2,
    borderColor: colors.journey.mapCompass + '30',
    overflow: 'hidden',
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: spacing.md,
    paddingTop: 4,
  },
  heroLabel: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 22,
    color: colors.text.primary,
  },
  heroSubItalic: {
    marginTop: 2,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.journey.mapCompass,
    lineHeight: 17,
  },
  heroProgress: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 10,
  },
  heroGlobeWrap: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroGlobeInner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFlagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  heroFlagCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.base.cream,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroFlag: {
    fontSize: 16,
  },
  heroFlagMore: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: colors.primary.wisteriaDark,
  },
  heroArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 10,
    gap: 4,
  },
  heroArrowLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.journey.mapCompass,
  },
  heroCompassDecor: {
    position: 'absolute',
    left: 10,
    bottom: 8,
    opacity: 0.7,
  },

  // ─── Next destination (postcard) ───
  nextDestCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  nextDestGradient: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  nextDestLeft: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
  nextDestFlag: {
    fontSize: 32,
  },
  nextDestCenter: {
    marginLeft: 48,
  },
  nextDestLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: colors.reward.amber,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  nextDestName: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 18,
    color: colors.text.primary,
    marginTop: 1,
  },
  nextDestDesc: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.text.secondary,
    marginTop: 2,
  },
  nextDestCTA: {
    marginTop: 12,
    marginLeft: 48,
    alignSelf: 'flex-start',
  },
  nextDestButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  nextDestButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.inverse,
  },

  // ─── Divider ───
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

  // ─── Map cards (equal width, side by side) ───
  mapRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  mapCard: {
    flex: 1,
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
    width: 46,
    height: 46,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  mapCardLabel: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 16,
    color: colors.text.primary,
  },
  mapCardSub: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },

  // ─── Quick actions (full-width cards) ───
  quickCol: {
    gap: 10,
    marginBottom: spacing.lg,
  },
  quickAction: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.journey.cardBorder,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextWrap: {
    flex: 1,
    marginLeft: 12,
  },
  quickTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  quickSub: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 1,
  },

  // ─── My houses (postcard chips) ───
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
    gap: 10,
  },
  houseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface.card,
    borderRadius: 16,
    borderWidth: 1.5,
    minWidth: 140,
  },
  houseFlag: {
    fontSize: 22,
  },
  houseTextWrap: {
    flexShrink: 1,
  },
  houseName: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.text.primary,
  },
  houseCountry: {
    fontSize: 10,
    color: colors.text.muted,
    marginTop: 1,
  },

  bottomSpacer: {
    height: spacing.lg,
  },
});

export default ExploreScreen;
