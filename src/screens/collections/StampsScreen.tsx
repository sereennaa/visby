import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextStyle,
  Dimensions,
  ScrollView,
} from 'react-native';
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { whimsicalGradients } from '../../theme/whimsical';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { StampCard, StampMini } from '../../components/collectibles/StampCard';
import { Button } from '../../components/ui/Button';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { copy } from '../../config/copy';
import { useStore } from '../../store/useStore';
import { STAMP_TYPES_INFO, COUNTRIES } from '../../config/constants';
import { getStampProgressByCountry } from '../../config/collectionGoals';
import { RootStackParamList, Stamp, StampType } from '../../types';
import { StampBook } from '../../components/effects/StampBook';
import { hapticService } from '../../services/haptics';

const { width: PASSPORT_WIDTH } = Dimensions.get('window');

const PassportPage: React.FC<{
  countryName: string;
  flagEmoji: string;
  stamps: Stamp[];
  pageIndex: number;
  onStampPress: (stampId: string) => void;
}> = ({ countryName, flagEmoji, stamps, pageIndex, onStampPress }) => {
  const rotations = [-4, 3, -2, 5, -3, 2, -5, 4];
  return (
    <Animated.View entering={FadeInDown.delay(pageIndex * 80).duration(400)} style={passportStyles.page}>
      <LinearGradient
        colors={['#FFF8F0', '#F5EDE3', '#FFFAF5']}
        style={passportStyles.pageGradient}
      >
        <View style={passportStyles.pageWatermark}>
          <Text style={passportStyles.watermarkFlag}>{flagEmoji}</Text>
        </View>
        <View style={passportStyles.pageHeader}>
          <Text style={passportStyles.pageCountry}>{countryName}</Text>
          <Text style={passportStyles.pageStampCount}>{stamps.length} stamp{stamps.length !== 1 ? 's' : ''}</Text>
        </View>
        <View style={passportStyles.stampGrid}>
          {stamps.map((stamp, i) => (
            <TouchableOpacity
              key={stamp.id}
              style={[
                passportStyles.stampSlot,
                { transform: [{ rotate: `${rotations[i % rotations.length]}deg` }] },
              ]}
              onPress={() => onStampPress(stamp.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${stamp.city}, ${stamp.country}`}
            >
              <Animated.View entering={ZoomIn.delay(100 + i * 60).duration(300)}>
                <View style={passportStyles.stampInner}>
                  <View style={passportStyles.stampBorder}>
                    <Icon name={(STAMP_TYPES_INFO[stamp.type]?.icon || 'location') as IconName} size={20} color="#8B4513" />
                  </View>
                  <Text style={passportStyles.stampCity} numberOfLines={1}>{stamp.city}</Text>
                  <Text style={passportStyles.stampDate}>
                    {new Date(stamp.collectedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={passportStyles.pageDivider} />
      </LinearGradient>
    </Animated.View>
  );
};

const passportStyles = StyleSheet.create({
  page: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139,69,19,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  pageGradient: {
    padding: spacing.lg,
    minHeight: 200,
  },
  pageWatermark: {
    position: 'absolute',
    right: 20,
    top: 20,
    opacity: 0.08,
  },
  watermarkFlag: {
    fontSize: 80,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139,69,19,0.1)',
  },
  pageCountry: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#5D3A1A',
    letterSpacing: 1,
  },
  pageStampCount: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#8B7355',
  },
  stampGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  stampSlot: {
    alignItems: 'center',
  },
  stampInner: {
    alignItems: 'center',
    width: 72,
  },
  stampBorder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#8B4513',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139,69,19,0.05)',
    marginBottom: 4,
  },
  stampCity: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: '#5D3A1A',
    textAlign: 'center',
  },
  stampDate: {
    fontFamily: 'Nunito-Medium',
    fontSize: 9,
    color: '#8B7355',
  },
  pageDivider: {
    height: 1,
    backgroundColor: 'rgba(139,69,19,0.08)',
    marginTop: spacing.md,
  },
});

type StampsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Stamps'>;
};

export const StampsScreen: React.FC<StampsScreenProps> = ({ navigation }) => {
  const stamps = useStore(s => s.stamps);
  const isLoading = useStore(s => s.isLoading);
  const [selectedType, setSelectedType] = useState<StampType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'passport' | 'stampbook' | 'grid' | 'list'>('passport');

  const stampsByCountry = useMemo(() => {
    const map: Record<string, { country: typeof COUNTRIES[0]; stamps: Stamp[] }> = {};
    stamps.forEach((stamp) => {
      const c = COUNTRIES.find((co) => co.name === stamp.country);
      if (!c) return;
      if (!map[c.id]) map[c.id] = { country: c, stamps: [] };
      map[c.id].stamps.push(stamp);
    });
    return Object.values(map).sort((a, b) => b.stamps.length - a.stamps.length);
  }, [stamps]);

  // Count stamps by type
  const stampCounts = useMemo(() => {
    const counts: Record<string, number> = { all: stamps.length };
    stamps.forEach(stamp => {
      counts[stamp.type] = (counts[stamp.type] || 0) + 1;
    });
    return counts;
  }, [stamps]);

  // Get unique types from user's stamps
  const userTypes = ['all', ...Object.keys(STAMP_TYPES_INFO)];

  const filteredStamps = useMemo(
    () => selectedType === 'all'
      ? stamps
      : stamps.filter(s => s.type === selectedType),
    [stamps, selectedType]
  );

  const sortedStamps = useMemo(
    () => [...filteredStamps].sort(
      (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
    ),
    [filteredStamps]
  );

  const collectionProgress = useMemo(() => getStampProgressByCountry(stamps), [stamps]);

  const statsCounts = useMemo(() => ({
    countries: new Set(stamps.map(s => s.country)).size,
    cities: new Set(stamps.map(s => s.city)).size,
    fastTravel: stamps.filter(s => s.isFastTravel).length,
  }), [stamps]);
  const { width: screenWidth } = Dimensions.get('window');
  const cardWidth = (screenWidth - spacing.screenPadding * 2 - 10) / 2;

  const renderStampItem = ({ item, index }: { item: Stamp; index: number }) => (
    <Animated.View entering={FadeIn.duration(380).delay(Math.min(index * 48, 240))}>
      <StampCard
        stamp={item}
        onPress={() => navigation.navigate('StampDetail', { stampId: item.id })}
        size={viewMode === 'grid' ? 'md' : 'lg'}
      />
    </Animated.View>
  );

  return (
    <LinearGradient
      colors={[...whimsicalGradients.hero]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerTextWrap}>
            <Heading level={1} style={styles.headerTitle}>My Passport</Heading>
            <Caption style={styles.headerDefinition}>{copy.stamps.definition}</Caption>
            <Caption style={styles.headerCount}>{stamps.length} places collected</Caption>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => {
                hapticService.selection();
                const modes: ('passport' | 'stampbook' | 'grid' | 'list')[] = ['passport', 'stampbook', 'grid', 'list'];
                const nextIdx = (modes.indexOf(viewMode) + 1) % modes.length;
                setViewMode(modes[nextIdx]);
              }}
              style={styles.viewToggle}
              accessibilityRole="button"
              accessibilityLabel={`Switch view mode`}
            >
              <Icon
                name={viewMode === 'passport' ? 'book' : viewMode === 'stampbook' ? 'grid' : viewMode === 'grid' ? 'list' : 'grid'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Collection goals */}
        {!isLoading && collectionProgress.length > 0 && (
          <Card style={styles.goalsCard}>
            <Text variant="body" style={styles.goalsTitle}>Dream destinations</Text>
            {collectionProgress.slice(0, 6).map((p) => {
              const country = COUNTRIES.find((c) => c.id === p.countryId);
              const accent = country?.accentColor ?? colors.primary.wisteria;
              return (
                <TouchableOpacity
                  key={p.countryId}
                  style={[styles.goalRow, { borderLeftColor: accent }]}
                  onPress={() => navigation.navigate('Explore', { screen: 'CountryRoom', params: { countryId: p.countryId } })}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel={`${p.countryName}, ${p.current} of ${p.target} stamps`}
                >
                  <View style={styles.goalRowLeft}>
                    <Text variant="body" style={styles.goalCountry}>{p.countryName}</Text>
                    <Caption style={styles.goalCount}>{p.current}/{p.target} stamps</Caption>
                  </View>
                  {p.completed ? (
                    <View style={[styles.goalBadge, { backgroundColor: colors.success.emerald + '30' }]}>
                      <Icon name="checkCircle" size={14} color={colors.success.emerald} />
                      <Text variant="caption" style={styles.goalBadgeText}>Complete</Text>
                    </View>
                  ) : (
                    <Caption style={styles.goalRemaining}>{p.remaining} to go</Caption>
                  )}
                </TouchableOpacity>
              );
            })}
          </Card>
        )}

        {/* Stats Overview */}
        {!isLoading && stamps.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="globe" size={24} color={colors.calm.ocean} />
                <Text variant="h2">{statsCounts.countries}</Text>
                <Caption>Countries</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="city" size={24} color={colors.primary.wisteriaDark} />
                <Text variant="h2">{statsCounts.cities}</Text>
                <Caption>Cities</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="airplane" size={24} color={colors.reward.peachDark} />
                <Text variant="h2">{statsCounts.fastTravel}</Text>
                <Caption>Fast Travel</Caption>
              </View>
            </View>
          </Card>
        )}

        {/* Type Filter */}
        <FlatList
          horizontal
          data={userTypes}
          showsHorizontalScrollIndicator={false}
          style={styles.filterList}
          contentContainerStyle={styles.filterContent}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const isSelected = selectedType === item;
            const typeInfo = item === 'all'
              ? { icon: 'all' as IconName, label: 'All' }
              : STAMP_TYPES_INFO[item];
            const count = stampCounts[item] || 0;

            return (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipSelected,
                ]}
                onPress={() => setSelectedType(item as StampType | 'all')}
                accessibilityRole="tab"
                accessibilityLabel={`${typeInfo?.label || item}, ${count} stamps`}
                accessibilityState={{ selected: isSelected }}
              >
                <Icon
                  name={typeInfo?.icon || 'location'}
                  size={16}
                  color={isSelected ? colors.text.inverse : colors.text.secondary}
                />
                <Text
                  variant="caption"
                  color={isSelected ? colors.text.inverse : colors.text.secondary}
                >
                  {typeInfo?.label || item}
                </Text>
                <View
                  style={[
                    styles.countBadge,
                    isSelected && styles.countBadgeSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.countText,
                      isSelected && styles.countTextSelected,
                    ]}
                  >
                    {count}
                  </Text>
                </View>
                </TouchableOpacity>
            );
          }}
          initialNumToRender={5}
          maxToRenderPerBatch={4}
          windowSize={3}
        />

        {/* Stamps Views */}
        {viewMode === 'stampbook' && !isLoading && stamps.length > 0 ? (
          <StampBook
            stamps={stamps.map((s) => {
              const country = COUNTRIES.find((c) => c.id === s.countryCode);
              return {
                id: s.id,
                name: s.city || s.locationName || s.countryCode,
                country: country?.name ?? s.country,
                countryEmoji: country?.flagEmoji ?? '',
                type: s.type,
                collectedAt: new Date(s.collectedAt),
              };
            })}
          />
        ) : viewMode === 'passport' && !isLoading && stamps.length > 0 ? (
          <ScrollView style={styles.passportScroll} contentContainerStyle={styles.passportContent} showsVerticalScrollIndicator={false}>
            <View style={styles.passportCover}>
              <LinearGradient colors={['#2D1B4E', '#1A0F3C']} style={styles.passportCoverGradient}>
                <Text style={styles.passportTitle}>WORLD PASSPORT</Text>
                <View style={styles.passportEmblem}>
                  <Icon name="globe" size={40} color="#FFD700" />
                </View>
                <Text style={styles.passportSubtitle}>{stamps.length} stamps collected</Text>
                <Text style={styles.passportCountries}>{stampsByCountry.length} countries stamped</Text>
              </LinearGradient>
            </View>
            {stampsByCountry.map((group, i) => (
              <PassportPage
                key={group.country.id}
                countryName={group.country.name}
                flagEmoji={group.country.flagEmoji}
                stamps={group.stamps}
                pageIndex={i}
                onStampPress={(stampId) => navigation.navigate('StampDetail', { stampId })}
              />
            ))}
          </ScrollView>
        ) : isLoading ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} width={cardWidth} height={200} />
            ))}
          </View>
        ) : sortedStamps.length > 0 ? (
          <FlatList
            data={sortedStamps}
            renderItem={renderStampItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode}
            contentContainerStyle={[
              styles.stampsContent,
              viewMode === 'grid' && styles.stampsGrid,
            ]}
            showsVerticalScrollIndicator={false}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            initialNumToRender={8}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={true}
          />
        ) : (
          <EmptyState
            icon="stamp"
            title={copy.empty.noStamps.title}
            subtitle={copy.empty.noStamps.subtitle}
            actionLabel={copy.actions.startLearning}
            onAction={() => navigation.navigate('Learn')}
            secondaryLabel={copy.actions.exploreMap}
            onSecondary={() => navigation.navigate('Map')}
            style={styles.emptyState}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  backButton: {
    padding: spacing.xs,
    marginLeft: -spacing.xs,
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: colors.text.primary,
  },
  headerDefinition: {
    marginTop: 2,
    color: colors.text.secondary,
    fontStyle: 'italic',
  },
  headerCount: {
    marginTop: 2,
    color: colors.text.muted,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  viewToggle: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.md,
  },
  goalsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  goalsTitle: {
    fontFamily: 'Nunito-SemiBold',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderLeftWidth: 4,
    marginBottom: spacing.xs,
    backgroundColor: colors.base.cream,
    borderRadius: 8,
  },
  goalRowLeft: { flex: 1 },
  goalCountry: { fontFamily: 'Nunito-SemiBold', color: colors.text.primary },
  goalCount: { marginTop: 2, color: colors.text.muted },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  goalBadgeText: { color: colors.success.emerald, fontFamily: 'Nunito-SemiBold' },
  goalRemaining: { color: colors.text.muted },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  statsCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: spacing.xxs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.base.parchment,
  },
  filterList: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  filterContent: {
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
    gap: spacing.xs,
  },
  filterChipSelected: {
    backgroundColor: colors.primary.wisteria,
  },
  countBadge: {
    backgroundColor: colors.base.parchment,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: spacing.radius.sm,
    minWidth: 20,
    alignItems: 'center',
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  countText: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: colors.text.muted,
  },
  countTextSelected: {
    color: colors.text.inverse,
  },
  stampsContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  stampsGrid: {
    alignItems: 'flex-start',
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIconWrap: {
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  emptyText: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  emptyPrimaryBtn: {
    marginBottom: spacing.md,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.round,
  },
  passportScroll: { flex: 1 },
  passportContent: { paddingBottom: spacing.xxxl },
  passportCover: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
  },
  passportCoverGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  passportTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 22,
    color: '#FFD700',
    letterSpacing: 4,
  },
  passportEmblem: {
    marginVertical: spacing.lg,
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passportSubtitle: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  passportCountries: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: 'rgba(255,215,0,0.5)',
    marginTop: 4,
  },
});

export default StampsScreen;
