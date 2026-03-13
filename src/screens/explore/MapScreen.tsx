import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
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
import { useStore } from '../../store/useStore';
import { locationService } from '../../services/location';
import { STAMP_TYPES_INFO } from '../../config/constants';
import { RootStackParamList, StampType } from '../../types';

type MapScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Map'>;
};

// Simple location card component since we're not using a map API
interface NearbyLocation {
  id: string;
  name: string;
  type: StampType;
  distance: string;
  description: string;
}

// Sample nearby locations (in production, these would come from a database)
const SAMPLE_LOCATIONS: NearbyLocation[] = [
  { id: '1', name: 'Central Park', type: 'park', distance: '0.5 km', description: 'Beautiful urban park with walking trails' },
  { id: '2', name: 'City Museum', type: 'museum', distance: '1.2 km', description: 'Local history and art museum' },
  { id: '3', name: 'Ocean Beach', type: 'beach', distance: '3.5 km', description: 'Sandy beach with great sunset views' },
  { id: '4', name: 'Old Town Square', type: 'landmark', distance: '0.8 km', description: 'Historic town center' },
  { id: '5', name: 'Mountain View Trail', type: 'mountain', distance: '15 km', description: 'Scenic hiking trail' },
  { id: '6', name: 'Local Market', type: 'market', distance: '0.3 km', description: 'Fresh produce and local goods' },
  { id: '7', name: 'Cozy Corner Café', type: 'cafe', distance: '0.2 km', description: 'Great coffee and pastries' },
  { id: '8', name: 'Hidden Garden', type: 'hidden_gem', distance: '1.5 km', description: 'Secret garden with rare flowers' },
];

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { currentLocation, setLocation, stamps } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<StampType | 'all'>('all');

  useEffect(() => {
    fetchLocation();
  }, []);

  const fetchLocation = async () => {
    setLoading(true);
    try {
      const location = await locationService.getCurrentLocation();
      if (location) {
        setLocation(location);
      }
    } catch (error) {
      console.error('Location error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTypes: (StampType | 'all')[] = [
    'all', 'park', 'beach', 'landmark', 'museum', 'cafe', 'restaurant', 'hiddenGem' as any
  ];

  const filteredLocations = selectedType === 'all'
    ? SAMPLE_LOCATIONS
    : SAMPLE_LOCATIONS.filter(loc => loc.type === selectedType);

  const isCollected = (locationId: string) => {
    return stamps.some(stamp => stamp.locationId === locationId);
  };

  const renderLocationCard = ({ item }: { item: NearbyLocation }) => {
    const typeInfo = STAMP_TYPES_INFO[item.type];
    const collected = isCollected(item.id);

    return (
      <Card
        style={styles.locationCard}
        onPress={() => navigation.navigate('LocationDetail', { locationId: item.id })}
      >
        <View style={styles.locationRow}>
          <View style={[styles.typeIcon, { backgroundColor: typeInfo.color + '30' }]}>
            <Icon name={typeInfo.icon} size={24} color={typeInfo.color} />
          </View>
          <View style={styles.locationInfo}>
            <View style={styles.locationHeader}>
              <Text variant="body" style={styles.locationName} numberOfLines={1}>
                {item.name}
              </Text>
              {collected && (
                <View style={styles.collectedBadge}>
                  <Icon name="check" size={12} color={colors.success.emerald} />
                </View>
              )}
            </View>
            <Caption numberOfLines={1}>{item.description}</Caption>
            <View style={styles.locationMeta}>
              <Text variant="caption" color={typeInfo.color}>
                {typeInfo.label}
              </Text>
              <Text variant="caption" color={colors.text.muted}>
                • {item.distance}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <LinearGradient
      colors={[colors.calm.skyLight, colors.base.cream]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Heading level={1}>Explore</Heading>
          <TouchableOpacity onPress={fetchLocation}>
            <Icon name="refresh" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Current Location */}
        <Card style={styles.currentLocationCard}>
          <View style={styles.currentLocationContent}>
            <Icon name="location" size={28} color={colors.primary.wisteriaDark} />
            <View style={styles.currentLocationInfo}>
              <Text variant="h3">
                {currentLocation?.city || 'Getting location...'}
              </Text>
              <Caption>
                {currentLocation?.country || 'Enable location services'}
              </Caption>
            </View>
          </View>
          {loading && (
            <Text variant="caption" color={colors.primary.wisteria}>
              Updating...
            </Text>
          )}
        </Card>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FlatList
            horizontal
            data={filterTypes}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const isSelected = selectedType === item;
              const typeInfo = item === 'all' 
                ? { icon: 'all' as IconName, label: 'All' }
                : STAMP_TYPES_INFO[item] || { icon: 'location' as IconName, label: item };
              
              return (
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipSelected,
                  ]}
                  onPress={() => setSelectedType(item)}
                >
                  <Icon 
                    name={typeInfo.icon} 
                    size={16} 
                    color={isSelected ? colors.text.inverse : colors.text.secondary} 
                  />
                  <Text
                    variant="caption"
                    color={isSelected ? colors.text.inverse : colors.text.secondary}
                  >
                    {typeInfo.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Nearby Locations List */}
        <View style={styles.listContainer}>
          <View style={styles.listHeader}>
            <Text variant="h3">Nearby Places</Text>
            <Caption>{filteredLocations.length} locations</Caption>
          </View>

          <FlatList
            data={filteredLocations}
            renderItem={renderLocationCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="search" size={48} color={colors.text.muted} />
                <Text variant="body" align="center" color={colors.text.secondary} style={styles.emptyText}>
                  No locations found for this filter
                </Text>
              </View>
            }
          />
        </View>

        {/* Quick Collect Button */}
        <View style={styles.floatingButton}>
          <Button
            title="Collect Stamp Here"
            onPress={() => navigation.navigate('CollectStamp', { locationId: 'current' })}
            variant="primary"
            size="lg"
            icon={<Icon name="stamp" size={20} color={colors.text.inverse} />}
          />
        </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  currentLocationCard: {
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  currentLocationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  currentLocationInfo: {
    flex: 1,
  },
  filterContainer: {
    marginBottom: spacing.md,
  },
  filterList: {
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
  listContainer: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  listContent: {
    paddingBottom: spacing.xxxl + 60,
  },
  locationCard: {
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: 50,
    height: 50,
    borderRadius: spacing.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationName: {
    fontFamily: 'Baloo2-Medium',
    flex: 1,
  },
  collectedBadge: {
    backgroundColor: colors.success.honeydew,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xxs,
    gap: spacing.xs,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    marginTop: spacing.md,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
  },
});

export default MapScreen;
