import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { BiteCard, BiteGridItem } from '../../components/collectibles/BiteCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { EmptyState } from '../../components/ui/EmptyState';
import { copy } from '../../config/copy';
import { useStore } from '../../store/useStore';
import { RootStackParamList, Bite } from '../../types';
import { getCountriesWithDishes, getDishCountryId, getDishById } from '../../config/worldFoods';

type BitesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Bites'>;
};

export const BitesScreen: React.FC<BitesScreenProps> = ({ navigation }) => {
  const bites = useStore(s => s.bites);
  const isLoading = useStore(s => s.isLoading);
  const [selectedCountry, setSelectedCountry] = useState<string | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');
  const countries = useMemo(() => getCountriesWithDishes(), []);

  const discoveryBites = useMemo(
    () => bites.filter((bite) => Boolean(bite.worldDishId)),
    [bites]
  );

  const countryProgress = useMemo(() => {
    return countries.map((country) => {
      const discoveredCount = discoveryBites.filter((bite) => {
        if (!bite.worldDishId) return false;
        return getDishCountryId(bite.worldDishId) === country.id;
      }).length;

      return {
        ...country,
        discoveredCount,
      };
    });
  }, [discoveryBites, countries]);

  const filteredBites = useMemo(
    () => {
      if (selectedCountry === 'all') return bites;
      const selectedCountryMeta = countries.find((country) => country.id === selectedCountry);
      return bites.filter((bite) => {
        if (bite.worldDishId) {
          return getDishCountryId(bite.worldDishId) === selectedCountry;
        }
        return bite.country === selectedCountryMeta?.name || bite.cuisine === selectedCountryMeta?.name;
      });
    },
    [bites, countries, selectedCountry]
  );

  const sortedBites = useMemo(
    () => [...filteredBites].sort(
      (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
    ),
    [filteredBites]
  );

  const { discoveredCount, countriesTasted, recipesUnlocked } = useMemo(() => {
    return {
      discoveredCount: discoveryBites.length,
      countriesTasted: countryProgress.filter((country) => country.discoveredCount > 0).length,
      recipesUnlocked: discoveryBites.filter((bite) => bite.recipeUnlocked || bite.recipe).length,
    };
  }, [countryProgress, discoveryBites]);

  const renderBiteCard = ({ item }: { item: Bite }) => (
    <BiteCard
      bite={item}
      variant={viewMode === 'cards' ? 'default' : 'compact'}
      onPress={() => navigation.navigate('BiteDetail', { biteId: item.id })}
    />
  );

  const renderGridItem = ({ item }: { item: Bite }) => (
    <BiteGridItem
      bite={item}
      onPress={() => navigation.navigate('BiteDetail', { biteId: item.id })}
    />
  );

  return (
    <LinearGradient
      colors={[colors.reward.peachLight, colors.base.cream]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <Animated.View entering={FadeInDown.duration(400).delay(50)} style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Heading level={1}>Taste Atlas</Heading>
            <Caption>{discoveredCount} dishes discovered</Caption>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'cards' ? 'grid' : 'cards')}
              style={styles.viewToggle}
              accessibilityRole="button"
              accessibilityLabel={viewMode === 'cards' ? 'Switch to grid view' : 'Switch to list view'}
            >
              <Icon
                name={viewMode === 'cards' ? 'grid' : 'list'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddBite')}
              style={styles.addButton}
              accessibilityRole="button"
              accessibilityLabel="Add bite"
            >
              <Icon name="add" size={20} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={styles.contentWrap}>
        {bites.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="food" size={24} color={colors.reward.peachDark} />
                <Text variant="h2">{discoveredCount}</Text>
                <Caption>Dishes</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="globe" size={24} color={colors.primary.wisteriaDark} />
                <Text variant="h2">{countriesTasted}</Text>
                <Caption>Countries</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="recipe" size={24} color={colors.calm.ocean} />
                <Text variant="h2">{recipesUnlocked}</Text>
                <Caption>Recipes</Caption>
              </View>
            </View>
          </Card>
        )}

        {bites.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterList} contentContainerStyle={styles.filterContent}>
            <TouchableOpacity
              style={[styles.filterChip, selectedCountry === 'all' && styles.filterChipSelected]}
              onPress={() => setSelectedCountry('all')}
              accessibilityRole="tab"
              accessibilityLabel="All countries"
              accessibilityState={{ selected: selectedCountry === 'all' }}
            >
              <Icon
                name={'globe' as IconName}
                size={16}
                color={selectedCountry === 'all' ? colors.text.inverse : colors.text.secondary}
              />
              <Text variant="caption" color={selectedCountry === 'all' ? colors.text.inverse : colors.text.secondary}>
                All
              </Text>
            </TouchableOpacity>
            {countryProgress.map((country) => {
              const isSelected = selectedCountry === country.id;
              return (
                <TouchableOpacity
                  key={country.id}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                  onPress={() => setSelectedCountry(country.id)}
                  accessibilityRole="tab"
                  accessibilityLabel={`${country.name}, ${country.discoveredCount} of ${country.dishCount} dishes`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text variant="caption" color={isSelected ? colors.text.inverse : colors.text.secondary}>
                    {country.flag}
                  </Text>
                  <Text variant="caption" color={isSelected ? colors.text.inverse : colors.text.secondary}>
                    {country.name}
                  </Text>
                  <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                    <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                      {country.discoveredCount}/{country.dishCount}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {bites.length > 0 && (
          <FlatList
            data={countryProgress.filter((country) => country.discoveredCount > 0)}
            horizontal
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            style={styles.progressList}
            contentContainerStyle={styles.filterContent}
            renderItem={({ item }) => (
              <Card style={styles.progressCard}>
                <Text variant="bodySmall" style={styles.progressCountry}>{item.flag} {item.name}</Text>
                <Text variant="h3">{item.discoveredCount}/{item.dishCount}</Text>
                <Caption>discovered</Caption>
              </Card>
            )}
          />
        )}

        {isLoading ? (
          <View style={styles.skeletonGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} width={160} height={180} />
            ))}
          </View>
        ) : sortedBites.length > 0 ? (
          <FlatList
            data={sortedBites}
            renderItem={viewMode === 'cards' ? renderBiteCard : renderGridItem}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            key={viewMode}
            contentContainerStyle={styles.bitesContent}
            columnWrapperStyle={viewMode === 'grid' ? styles.gridRow : undefined}
            showsVerticalScrollIndicator={false}
            initialNumToRender={8}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={true}
          />
        ) : (
          <EmptyState
            icon="food"
            title={copy.empty.noBites.title}
            subtitle={copy.empty.noBites.subtitle}
            actionLabel={copy.actions.addFirstBite}
            onAction={() => navigation.navigate('AddBite')}
            style={styles.emptyState}
          />
        )}
        </Animated.View>
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
  contentWrap: {
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
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewToggle: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.md,
  },
  addButton: {
    padding: spacing.sm,
    backgroundColor: colors.reward.peachDark,
    borderRadius: spacing.radius.md,
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
    marginBottom: spacing.sm,
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
    backgroundColor: colors.reward.peachDark,
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
  progressList: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  progressCard: {
    minWidth: 120,
  },
  progressCountry: {
    marginBottom: spacing.xxs,
  },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  bitesContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  gridRow: {
    justifyContent: 'space-between',
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
    marginBottom: spacing.sm,
  },
});

export default BitesScreen;
