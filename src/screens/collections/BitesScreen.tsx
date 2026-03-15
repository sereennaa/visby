import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { BiteCard, BiteGridItem } from '../../components/collectibles/BiteCard';
import { SkeletonCard } from '../../components/ui/SkeletonCard';
import { useStore } from '../../store/useStore';
import { BITE_CATEGORIES_INFO } from '../../config/constants';
import { RootStackParamList, Bite, BiteCategory } from '../../types';

type BitesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Bites'>;
};

export const BitesScreen: React.FC<BitesScreenProps> = ({ navigation }) => {
  const { bites, isLoading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<BiteCategory | 'all'>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards');

  // Count bites by category
  const biteCounts: Record<string, number> = { all: bites.length };
  bites.forEach(bite => {
    biteCounts[bite.category] = (biteCounts[bite.category] || 0) + 1;
  });

  const categories: (BiteCategory | 'all')[] = ['all', ...Object.keys(BITE_CATEGORIES_INFO) as BiteCategory[]];

  const filteredBites = selectedCategory === 'all'
    ? bites
    : bites.filter(b => b.category === selectedCategory);

  const sortedBites = [...filteredBites].sort(
    (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
  );

  const totalRatings = bites.reduce((sum, b) => sum + b.rating, 0);
  const avgRating = bites.length > 0 ? (totalRatings / bites.length).toFixed(1) : '0';
  const recipesCount = bites.filter(b => b.recipe).length;
  const homemadeCount = bites.filter(b => b.isMadeAtHome).length;

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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Heading level={1}>My Bites</Heading>
            <Caption>{bites.length} food memories</Caption>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'cards' ? 'grid' : 'cards')}
              style={styles.viewToggle}
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
            >
              <Icon name="add" size={20} color={colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        {bites.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="star" size={24} color={colors.reward.gold} />
                <Text variant="h2">{avgRating}</Text>
                <Caption>Avg Rating</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="recipe" size={24} color={colors.calm.ocean} />
                <Text variant="h2">{recipesCount}</Text>
                <Caption>Recipes</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="homemade" size={24} color={colors.success.emerald} />
                <Text variant="h2">{homemadeCount}</Text>
                <Caption>Homemade</Caption>
              </View>
            </View>
          </Card>
        )}

        {/* Category Filter */}
        {bites.length > 0 && (
          <FlatList
            horizontal
            data={categories}
            showsHorizontalScrollIndicator={false}
            style={styles.filterList}
            contentContainerStyle={styles.filterContent}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item;
              const categoryInfo = item === 'all'
                ? { icon: 'all' as IconName, label: 'All' }
                : BITE_CATEGORIES_INFO[item];
              const count = biteCounts[item] || 0;

              return (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Icon
                    name={categoryInfo?.icon || 'food'}
                    size={16}
                    color={isSelected ? colors.text.inverse : colors.text.secondary}
                  />
                  <Text
                    variant="caption"
                    color={isSelected ? colors.text.inverse : colors.text.secondary}
                  >
                    {categoryInfo?.label || item}
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
          />
        )}

        {/* Bites List/Grid */}
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
          />
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Icon name="food" size={64} color={colors.reward.peachDark} />
            </View>
            <Text
              variant="h3"
              align="center"
              color={colors.text.primary}
              style={styles.emptyTitle}
            >
              No bites yet!
            </Text>
            <Text
              variant="body"
              align="center"
              color={colors.text.muted}
              style={styles.emptyText}
            >
              Log what you eat and feed your Visby. Add a bite from a restaurant, a recipe you made, or a snack — and earn Aura!
            </Text>
            <Button
              title="Add your first bite"
              onPress={() => navigation.navigate('AddBite')}
              variant="primary"
              size="md"
              style={styles.emptyPrimaryBtn}
              icon={<Icon name="add" size={20} color={colors.text.inverse} />}
            />
          </View>
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
