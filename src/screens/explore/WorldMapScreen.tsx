import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { getWorldMapPosition } from '../../config/worldMapPositions';
import { WorldMapBackground } from '../../components/maps/WorldMapBackground';
import { AnimatedPressable } from '../../components/ui/AnimatedPressable';
import { hapticService } from '../../services/haptics';
import { ExploreStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_VIEW_PADDING = spacing.screenPadding * 2;
const MAP_VIEW_WIDTH = SCREEN_WIDTH - MAP_VIEW_PADDING;
const MAP_ZOOM_SCALE = 2.5;
const MAP_CANVAS_WIDTH = MAP_VIEW_WIDTH * MAP_ZOOM_SCALE;
const MAP_CANVAS_HEIGHT = Math.round(MAP_CANVAS_WIDTH * 0.5);
const MAP_VIEW_HEIGHT = Math.min(MAP_CANVAS_HEIGHT, 500);
const PIN_SIZE = 28;

type WorldMapScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'WorldMap'>;
};

type ViewMode = 'list' | 'map';

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const userHouses = useStore(s => s.userHouses);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const visitedCountries = user?.visitedCountries ?? [];
  const hasHouse = (countryId: string) => userHouses.some((h) => h.countryId === countryId);

  const progressPct = COUNTRIES.length > 0 ? Math.round((visitedCountries.length / COUNTRIES.length) * 100) : 0;

  const handlePinPress = useCallback((countryId: string) => {
    hapticService.selection();
    const visited = visitedCountries.includes(countryId);
    const owned = hasHouse(countryId);
    if (visited || owned) {
      navigation.navigate('CountryRoom', { countryId });
    } else {
      navigation.navigate('CountryWorld', { countryId });
    }
  }, [visitedCountries, userHouses, navigation]);

  const getBorderColor = (countryId: string) => {
    const owned = hasHouse(countryId);
    const visited = visitedCountries.includes(countryId);
    if (owned) return colors.success.emerald;
    if (visited) return colors.primary.wisteria;
    return 'rgba(0,0,0,0.15)';
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.calm.skyLight, colors.primary.wisteriaFaded]}
        style={StyleSheet.absoluteFill}
      />

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
                    <View style={{ width: MAP_CANVAS_WIDTH, height: MAP_CANVAS_HEIGHT }}>
                      <WorldMapBackground width={MAP_CANVAS_WIDTH} height={MAP_CANVAS_HEIGHT} />

                      {COUNTRIES.map((country) => {
                        const pos = getWorldMapPosition(country.id);
                        if (!pos) return null;
                        const left = Math.max(2, Math.min(MAP_CANVAS_WIDTH - PIN_SIZE - 2,
                          (pos.xPercent / 100) * MAP_CANVAS_WIDTH - PIN_SIZE / 2));
                        const top = Math.max(2, Math.min(MAP_CANVAS_HEIGHT - PIN_SIZE - 2,
                          (pos.yPercent / 100) * MAP_CANVAS_HEIGHT - PIN_SIZE / 2));

                        return (
                          <TouchableOpacity
                            key={country.id}
                            style={[styles.pin, { left, top, borderColor: getBorderColor(country.id) }]}
                            onPress={() => handlePinPress(country.id)}
                            activeOpacity={0.7}
                            accessibilityLabel={`${country.name}`}
                          >
                            <Text style={styles.pinFlag}>{country.flagEmoji}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </ScrollView>
                </View>
              </View>
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

                  return (
                    <TouchableOpacity
                      key={country.id}
                      style={styles.countryCard}
                      onPress={() => (owned || visited) ? navigation.navigate('CountryRoom', { countryId: country.id }) : navigation.navigate('CountryWorld', { countryId: country.id })}
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
                        {owned && (
                          <View style={styles.homeBadge}>
                            <Icon name="home" size={12} color={colors.success.emerald} />
                          </View>
                        )}
                        {visited && !owned && (
                          <View style={styles.visitedBadge}>
                            <View style={styles.visitedDot} />
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
    backgroundColor: '#DCEAF7',
  },

  pin: {
    position: 'absolute',
    width: PIN_SIZE,
    height: PIN_SIZE,
    borderRadius: PIN_SIZE / 2,
    backgroundColor: '#fff',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  pinFlag: {
    fontSize: 14,
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
  homeBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  visitedBadge: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  visitedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary.wisteria,
  },
});

export default WorldMapScreen;
