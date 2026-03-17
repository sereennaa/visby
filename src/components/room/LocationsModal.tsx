import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { CountryLocation } from '../../config/learningContent';

const CATEGORY_ICONS: Record<CountryLocation['category'], IconName> = {
  landmark: 'city',
  food: 'food',
  nature: 'nature',
  culture: 'culture',
  hidden_gem: 'compass',
};

interface LocationsModalProps {
  visible: boolean;
  onClose: () => void;
  locations: CountryLocation[];
  visitedLocations: Set<string>;
  onVisitLocation: (location: CountryLocation) => void;
}

export const LocationsModal = React.memo<LocationsModalProps>(({
  visible,
  onClose,
  locations,
  visitedLocations,
  onVisitLocation,
}) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Heading level={3}>Stops to Visit</Heading>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
            {locations.map((loc) => {
              const visited = visitedLocations.has(loc.id);
              const catIcon = CATEGORY_ICONS[loc.category];
              return (
                <TouchableOpacity
                  key={loc.id}
                  style={[styles.card, visited && styles.cardVisited]}
                  onPress={() => onVisitLocation(loc)}
                  activeOpacity={visited ? 1 : 0.8}
                >
                  <View style={styles.iconWrap}>
                    {loc.imageUrl ? (
                      <Image source={{ uri: loc.imageUrl }} style={styles.locThumb} resizeMode="cover" />
                    ) : (
                      <Icon name={catIcon} size={36} color={visited ? '#4CAF50' : colors.text.primary} />
                    )}
                  </View>
                  <View style={styles.info}>
                    <View style={styles.nameRow}>
                      <Text style={styles.name} numberOfLines={1}>{loc.name}</Text>
                      {visited && <Icon name="check" size={16} color="#4CAF50" />}
                    </View>
                    <Text style={styles.desc} numberOfLines={2}>{loc.description}</Text>
                    <View style={styles.meta}>
                      <View style={styles.categoryChip}>
                        <Icon name={catIcon} size={12} color={colors.text.secondary} />
                        <Text style={styles.categoryText}>{loc.category.replace('_', ' ')}</Text>
                      </View>
                      <View style={[styles.lpBadge, visited && styles.lpBadgeVisited]}>
                        <Text style={[styles.lpText, visited && styles.lpTextVisited]}>
                          {visited ? 'Visited' : `+${loc.learningPoints} LP`}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  panel: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '75%',
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md,
  },
  grid: { gap: spacing.sm, paddingBottom: spacing.lg },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.base.cream,
    borderRadius: 16,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
    gap: spacing.sm,
  },
  cardVisited: {
    backgroundColor: 'rgba(200, 230, 200, 0.3)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center',
    overflow: 'hidden',
  },
  locThumb: {
    width: 56, height: 56, borderRadius: 14,
  },
  info: { flex: 1, gap: 2 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  name: { fontFamily: 'Baloo2-SemiBold', fontSize: 14, color: colors.text.primary, flex: 1 },
  desc: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.secondary, lineHeight: 15 },
  meta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(184, 165, 224, 0.1)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  categoryText: { fontFamily: 'Nunito-SemiBold', fontSize: 10, color: colors.text.secondary, textTransform: 'capitalize' as any },
  lpBadge: { backgroundColor: 'rgba(255, 215, 0, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  lpBadgeVisited: { backgroundColor: 'rgba(76, 175, 80, 0.15)' },
  lpText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: '#D4760A' },
  lpTextVisited: { color: '#4CAF50' },
});
