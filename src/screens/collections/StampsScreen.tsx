import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon, IconName } from '../../components/ui/Icon';
import { StampCard, StampMini } from '../../components/collectibles/StampCard';
import { useStore } from '../../store/useStore';
import { STAMP_TYPES_INFO } from '../../config/constants';
import { RootStackParamList, Stamp, StampType } from '../../types';

type StampsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Stamps'>;
};

export const StampsScreen: React.FC<StampsScreenProps> = ({ navigation }) => {
  const { stamps } = useStore();
  const [selectedType, setSelectedType] = useState<StampType | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Count stamps by type
  const stampCounts: Record<string, number> = { all: stamps.length };
  stamps.forEach(stamp => {
    stampCounts[stamp.type] = (stampCounts[stamp.type] || 0) + 1;
  });

  // Get unique types from user's stamps
  const userTypes = ['all', ...Object.keys(STAMP_TYPES_INFO)];

  const filteredStamps = selectedType === 'all'
    ? stamps
    : stamps.filter(s => s.type === selectedType);

  const sortedStamps = [...filteredStamps].sort(
    (a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime()
  );

  const renderStampItem = ({ item }: { item: Stamp }) => (
    <StampCard
      stamp={item}
      onPress={() => navigation.navigate('StampDetail', { stampId: item.id })}
      size={viewMode === 'grid' ? 'md' : 'lg'}
    />
  );

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Heading level={1}>My Stamps</Heading>
            <Caption>{stamps.length} collected</Caption>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              style={styles.viewToggle}
            >
              <Icon
                name={viewMode === 'grid' ? 'list' : 'grid'}
                size={20}
                color={colors.text.secondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Overview */}
        {stamps.length > 0 && (
          <Card style={styles.statsCard}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Icon name="globe" size={24} color={colors.calm.ocean} />
                <Text variant="h2">
                  {new Set(stamps.map(s => s.country)).size}
                </Text>
                <Caption>Countries</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="city" size={24} color={colors.primary.wisteriaDark} />
                <Text variant="h2">
                  {new Set(stamps.map(s => s.city)).size}
                </Text>
                <Caption>Cities</Caption>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Icon name="airplane" size={24} color={colors.reward.peachDark} />
                <Text variant="h2">
                  {stamps.filter(s => s.isFastTravel).length}
                </Text>
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
        />

        {/* Stamps Grid/List */}
        {sortedStamps.length > 0 ? (
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
          />
        ) : (
          <View style={styles.emptyState}>
            <Icon name="stamp" size={64} color={colors.text.muted} />
            <Text
              variant="h3"
              align="center"
              color={colors.text.secondary}
              style={styles.emptyTitle}
            >
              No stamps yet!
            </Text>
            <Text
              variant="body"
              align="center"
              color={colors.text.muted}
              style={styles.emptyText}
            >
              Start exploring to collect your first stamp
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate('Map')}
            >
              <Icon name="map" size={20} color={colors.primary.wisteriaDark} />
              <Text variant="body" color={colors.primary.wisteriaDark}>
                Explore Nearby
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
  emptyTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    marginBottom: spacing.xl,
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
});

export default StampsScreen;
