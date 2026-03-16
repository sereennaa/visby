import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon } from '../../components/ui/Icon';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { getWorldMapPosition } from '../../config/worldMapPositions';
import { ExploreStackParamList } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAP_VIEW_PADDING = spacing.screenPadding * 2;
const MAP_VIEW_WIDTH = SCREEN_WIDTH - MAP_VIEW_PADDING;
const MAP_VIEW_HEIGHT = 220;
const WORLD_DOT_SIZE = 28;

type WorldMapScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'WorldMap'>;
};

type ViewMode = 'list' | 'map';

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({ navigation }) => {
  const { user, userHouses } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const visitedCountries = user?.visitedCountries ?? [];
  const hasHouse = (countryId: string) => userHouses.some((h) => h.countryId === countryId);

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
                { label: 'Explore', onPress: () => navigation.navigate('Explore') },
                { label: 'World map' },
              ]}
            />
            <Heading level={1}>World map</Heading>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* List / Map toggle */}
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
          <>
            <Caption style={styles.subtitle}>Find countries on the map. Tap a country to see where it is and visit.</Caption>
            <View style={styles.mapViewWrap}>
              <LinearGradient
                colors={[colors.calm.skyLight + 'ee', colors.calm.sky + 'aa', colors.calm.ocean + '88']}
                style={styles.mapViewCanvas}
              >
                {COUNTRIES.map((country) => {
                  const pos = getWorldMapPosition(country.id);
                  if (!pos) return null;
                  const visited = visitedCountries.includes(country.id);
                  const owned = hasHouse(country.id);
                  const left = (pos.xPercent / 100) * MAP_VIEW_WIDTH - WORLD_DOT_SIZE / 2;
                  const top = (pos.yPercent / 100) * MAP_VIEW_HEIGHT - WORLD_DOT_SIZE / 2;
                  return (
                    <TouchableOpacity
                      key={country.id}
                      style={[
                        styles.worldDot,
                        {
                          left: Math.max(2, Math.min(MAP_VIEW_WIDTH - WORLD_DOT_SIZE - 2, left)),
                          top: Math.max(2, Math.min(MAP_VIEW_HEIGHT - WORLD_DOT_SIZE - 2, top)),
                          backgroundColor: visited ? colors.primary.wisteria : colors.base.parchment,
                          borderColor: owned ? colors.success.emerald : (visited ? colors.primary.wisteriaLight : colors.base.warmWhite),
                        },
                      ]}
                      onPress={() => (hasHouse(country.id) ? navigation.navigate('CountryRoom', { countryId: country.id }) : navigation.navigate('CountryWorld'))}
                      activeOpacity={0.85}
                      accessibilityLabel={`${country.name} on world map`}
                    >
                      {owned ? <Icon name="home" size={14} color={colors.success.emerald} /> : <Icon name="globe" size={14} color={visited ? colors.primary.wisteriaDark : colors.text.muted} />}
                    </TouchableOpacity>
                  );
                })}
              </LinearGradient>
            </View>
            <TouchableOpacity
              style={styles.visitWorldBtn}
              onPress={() => navigation.navigate('CountryWorld')}
            >
              <Text variant="body" style={styles.visitWorldText}>Visit the World →</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Caption style={styles.subtitle}>Countries you&apos;ve visited light up. Tap to go there.</Caption>
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
              <TouchableOpacity
                style={styles.visitWorldBtn}
                onPress={() => navigation.navigate('CountryWorld')}
              >
                <Text variant="body" style={styles.visitWorldText}>Visit the World →</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
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
  subtitle: {
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  mapViewWrap: {
    paddingHorizontal: MAP_VIEW_PADDING / 2,
    marginBottom: spacing.lg,
  },
  mapViewCanvas: {
    width: MAP_VIEW_WIDTH,
    height: MAP_VIEW_HEIGHT,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight + '50',
    overflow: 'hidden',
    position: 'relative',
  },
  worldDot: {
    position: 'absolute',
    width: WORLD_DOT_SIZE,
    height: WORLD_DOT_SIZE,
    borderRadius: WORLD_DOT_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
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
  visitWorldBtn: {
    marginTop: spacing.xl,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  visitWorldText: {
    color: colors.primary.wisteriaDark,
    fontFamily: 'Nunito-Bold',
  },
});

export default WorldMapScreen;
