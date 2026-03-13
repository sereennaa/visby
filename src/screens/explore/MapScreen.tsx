import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
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

interface NearbyLocation {
  id: string;
  name: string;
  type: StampType;
  distanceKm: number;
  description: string;
}

const SAMPLE_LOCATIONS: NearbyLocation[] = [
  { id: '1',  name: 'Parc de la Ciutadella',    type: 'park',       distanceKm: 0.4,  description: 'Lush city park with a grand fountain and rowboats' },
  { id: '2',  name: 'Museu Picasso',             type: 'museum',     distanceKm: 0.7,  description: 'World-class collection of early Picasso works' },
  { id: '3',  name: 'Barceloneta Beach',         type: 'beach',      distanceKm: 1.1,  description: 'Golden sand beach along the Mediterranean' },
  { id: '4',  name: 'Gothic Quarter',            type: 'landmark',   distanceKm: 0.3,  description: 'Medieval streets and hidden plazas' },
  { id: '5',  name: 'Montserrat Trail',          type: 'mountain',   distanceKm: 42,   description: 'Dramatic serrated peaks with monastery views' },
  { id: '6',  name: 'Mercat de la Boqueria',     type: 'market',     distanceKm: 0.5,  description: 'Vibrant market overflowing with fresh produce' },
  { id: '7',  name: 'Café de l\'Acadèmia',       type: 'cafe',       distanceKm: 0.2,  description: 'Charming courtyard café with homemade cakes' },
  { id: '8',  name: 'Bunkers del Carmel',         type: 'hidden_gem', distanceKm: 3.8,  description: 'Secret hilltop lookout with 360° city views' },
  { id: '9',  name: 'Sagrada Família',            type: 'landmark',   distanceKm: 1.6,  description: "Gaudí's iconic basilica, still under construction" },
  { id: '10', name: 'El Nacional',                type: 'restaurant', distanceKm: 0.6,  description: 'Multi-space restaurant in a restored warehouse' },
  { id: '11', name: 'Jardins de Mossèn Costa',   type: 'park',       distanceKm: 2.5,  description: 'Hillside gardens with tulips and aquatic plants' },
  { id: '12', name: 'Platja de la Nova Icària',   type: 'beach',      distanceKm: 1.8,  description: 'Calm family-friendly beach near the marina' },
  { id: '13', name: 'Can Culleretes',             type: 'restaurant', distanceKm: 0.4,  description: "Barcelona's oldest restaurant, since 1786" },
  { id: '14', name: 'MACBA',                      type: 'museum',     distanceKm: 0.9,  description: 'Contemporary art museum with a lively plaza' },
  { id: '15', name: 'Santa Caterina Market',      type: 'market',     distanceKm: 0.6,  description: 'Colorful wavy-roofed market with local bites' },
  { id: '16', name: 'Antiga Forn del Passeig',    type: 'cafe',       distanceKm: 1.0,  description: 'Century-old bakery with flaky ensaïmadas' },
  { id: '17', name: 'Palau de la Música',         type: 'landmark',   distanceKm: 0.5,  description: 'Ornate Art Nouveau concert hall' },
  { id: '18', name: 'El Jardí Secret',            type: 'hidden_gem', distanceKm: 1.3,  description: 'Walled garden tucked behind an old chapel' },
  { id: '19', name: 'Tibidabo',                   type: 'mountain',   distanceKm: 8.5,  description: 'Hilltop amusement park with panoramic views' },
  { id: '20', name: 'Fundació Joan Miró',         type: 'museum',     distanceKm: 2.2,  description: "Bright spaces showcasing Miró's playful art" },
  { id: '21', name: 'La Paradeta',                type: 'restaurant', distanceKm: 0.8,  description: 'Pick-your-own seafood cooked to order' },
  { id: '22', name: 'Parc del Laberint d\'Horta', type: 'park',       distanceKm: 6.0,  description: 'Oldest garden in the city with a hedge maze' },
  { id: '23', name: 'Passatge de les Manufactures', type: 'hidden_gem', distanceKm: 0.9, description: 'Tiny alley of street art and vintage shops' },
  { id: '24', name: 'Sant Pau Art Nouveau Site',  type: 'landmark',   distanceKm: 1.9,  description: 'UNESCO World Heritage hospital complex' },
];

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const { currentLocation, setLocation, stamps } = useStore();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<StampType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

  const formatDistance = (km: number): string => {
    if (km < 1) return `${Math.round(km * 1000)} m`;
    return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
  };

  const sortedLocations = useMemo(
    () => [...SAMPLE_LOCATIONS].sort((a, b) => a.distanceKm - b.distanceKm),
    [],
  );

  const nearbyLocations = useMemo(() => sortedLocations.slice(0, 3), [sortedLocations]);

  const filterTypes: (StampType | 'all')[] = [
    'all', 'park', 'beach', 'landmark', 'museum', 'cafe', 'restaurant', 'market', 'mountain', 'hidden_gem',
  ];

  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { all: SAMPLE_LOCATIONS.length };
    for (const loc of SAMPLE_LOCATIONS) {
      counts[loc.type] = (counts[loc.type] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredLocations = useMemo(() => {
    let results = sortedLocations;
    if (selectedType !== 'all') {
      results = results.filter(loc => loc.type === selectedType);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        loc => loc.name.toLowerCase().includes(q) || loc.description.toLowerCase().includes(q),
      );
    }
    return results;
  }, [selectedType, searchQuery, sortedLocations]);

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
                • {formatDistance(item.distanceKm)}
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

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={18} color={colors.text.muted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search places..."
            placeholderTextColor={colors.text.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close" size={18} color={colors.text.muted} />
            </TouchableOpacity>
          )}
        </View>

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
                    {typeInfo.label} ({typeCounts[item] || 0})
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Nearby Locations List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredLocations}
            renderItem={renderLocationCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                {/* Nearby Highlight (only when showing all, no search) */}
                {selectedType === 'all' && !searchQuery.trim() && (
                  <View style={styles.nearbySection}>
                    <View style={styles.nearbySectionHeader}>
                      <Text variant="h3">Closest to You</Text>
                      <View style={styles.nearbyBadge}>
                        <Icon name="location" size={12} color={colors.primary.wisteriaDark} />
                        <Text variant="caption" color={colors.primary.wisteriaDark}>Nearby</Text>
                      </View>
                    </View>
                    {nearbyLocations.map((loc) => {
                      const info = STAMP_TYPES_INFO[loc.type];
                      return (
                        <TouchableOpacity
                          key={loc.id}
                          style={styles.nearbyCard}
                          activeOpacity={0.7}
                          onPress={() => navigation.navigate('LocationDetail', { locationId: loc.id })}
                        >
                          <View style={[styles.nearbyIcon, { backgroundColor: info.color + '25' }]}>
                            <Icon name={info.icon} size={20} color={info.color} />
                          </View>
                          <View style={styles.nearbyInfo}>
                            <Text variant="body" numberOfLines={1} style={styles.locationName}>{loc.name}</Text>
                            <Caption numberOfLines={1}>{loc.description}</Caption>
                          </View>
                          <View style={styles.nearbyDistance}>
                            <Text variant="caption" color={colors.primary.wisteriaDark} style={styles.nearbyDistanceText}>
                              {formatDistance(loc.distanceKm)}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}

                {/* All Places header */}
                <View style={styles.listHeader}>
                  <Text variant="h3">
                    {selectedType === 'all' ? 'All Places' : (STAMP_TYPES_INFO[selectedType]?.label ?? selectedType)}
                  </Text>
                  <Caption>{filteredLocations.length} locations</Caption>
                </View>
              </>
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Icon name="search" size={48} color={colors.text.light} />
                <Text variant="h3" align="center" color={colors.text.secondary} style={styles.emptyTitle}>
                  No places found
                </Text>
                <Text variant="body" align="center" color={colors.text.muted} style={styles.emptyText}>
                  {searchQuery.trim()
                    ? `Nothing matches "${searchQuery}". Try a different search or clear your filters.`
                    : 'Try selecting a different category above.'}
                </Text>
                {(searchQuery.trim() || selectedType !== 'all') && (
                  <TouchableOpacity
                    style={styles.emptyResetButton}
                    onPress={() => { setSearchQuery(''); setSelectedType('all'); }}
                  >
                    <Text variant="body" color={colors.primary.wisteriaDark}>
                      Reset filters
                    </Text>
                  </TouchableOpacity>
                )}
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.round,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    paddingVertical: 0,
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
  nearbySection: {
    marginBottom: spacing.xl,
  },
  nearbySectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  nearbyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.round,
  },
  nearbyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary.wisteria,
  },
  nearbyIcon: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nearbyInfo: {
    flex: 1,
  },
  nearbyDistance: {
    marginLeft: spacing.sm,
  },
  nearbyDistanceText: {
    fontFamily: 'Baloo2-Medium',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    marginTop: spacing.lg,
  },
  emptyText: {
    marginTop: spacing.sm,
  },
  emptyResetButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.round,
  },
  floatingButton: {
    position: 'absolute',
    bottom: spacing.xl,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
  },
});

export default MapScreen;
