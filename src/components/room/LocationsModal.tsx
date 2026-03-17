import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const CATEGORY_GRADIENTS: Record<CountryLocation['category'], [string, string]> = {
  landmark: ['rgba(184,165,224,0.85)', 'rgba(139,111,192,0.9)'],
  food: ['rgba(255,191,0,0.8)', 'rgba(255,180,70,0.85)'],
  nature: ['rgba(72,176,72,0.8)', 'rgba(96,200,96,0.85)'],
  culture: ['rgba(255,144,128,0.8)', 'rgba(212,118,106,0.85)'],
  hidden_gem: ['rgba(107,176,224,0.8)', 'rgba(90,150,200,0.85)'],
};

const PLACEHOLDER_COLORS: Record<CountryLocation['category'], [string, string]> = {
  landmark: [colors.primary.wisteriaFaded, colors.primary.wisteriaLight],
  food: [colors.reward.peachLight, colors.reward.peach],
  nature: [colors.success.honeydew, colors.success.mint],
  culture: [colors.accent.blush, colors.accent.coral],
  hidden_gem: [colors.calm.skyLight, colors.calm.sky],
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
  const visitedCount = locations.filter(l => visitedLocations.has(l.id)).length;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[colors.base.ivory, colors.base.parchment]}
            style={styles.panelGradient}
          >
            {/* Handle bar */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={styles.compassWrap}>
                  <Icon name="compass" size={22} color={colors.primary.wisteriaDark} />
                </View>
                <View>
                  <Heading level={3} style={styles.headerTitle}>Places to Visit</Heading>
                  <Text style={styles.headerSubtitle}>
                    {visitedCount} of {locations.length} discovered
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
                <Icon name="close" size={18} color={colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Progress bar */}
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  { width: locations.length > 0 ? `${(visitedCount / locations.length) * 100}%` : '0%' },
                ]}
              />
            </View>

            {/* Location cards */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.grid}
            >
              {locations.map((loc) => {
                const visited = visitedLocations.has(loc.id);
                const catIcon = CATEGORY_ICONS[loc.category];
                const placeholderColors = PLACEHOLDER_COLORS[loc.category];
                const catGradient = CATEGORY_GRADIENTS[loc.category];

                return (
                  <TouchableOpacity
                    key={loc.id}
                    style={[styles.card, visited && styles.cardVisited]}
                    onPress={() => onVisitLocation(loc)}
                    activeOpacity={visited ? 0.9 : 0.75}
                  >
                    {/* Image area */}
                    <View style={styles.imageContainer}>
                      {loc.imageUrl ? (
                        <Image
                          source={{ uri: loc.imageUrl }}
                          style={styles.locImage}
                          resizeMode="cover"
                        />
                      ) : (
                        <LinearGradient
                          colors={placeholderColors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.locImage}
                        >
                          <Icon
                            name={catIcon}
                            size={40}
                            color={colors.primary.wisteriaDark}
                          />
                        </LinearGradient>
                      )}

                      {/* Category badge (glass-morphic) */}
                      <View style={styles.categoryOverlay}>
                        <LinearGradient
                          colors={catGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.categoryBadge}
                        >
                          <Icon name={catIcon} size={12} color="#FFFFFF" />
                          <Text style={styles.categoryText}>
                            {loc.category.replace('_', ' ')}
                          </Text>
                        </LinearGradient>
                      </View>

                      {/* LP badge */}
                      <View style={styles.lpOverlay}>
                        <LinearGradient
                          colors={
                            visited
                              ? [colors.success.emerald, colors.success.honeydewDark]
                              : [colors.reward.gold, colors.reward.amber]
                          }
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.lpBadge}
                        >
                          <Text style={styles.lpText}>
                            {visited ? '✓' : `+${loc.learningPoints}`}
                          </Text>
                          {!visited && <Text style={styles.lpLabel}>LP</Text>}
                        </LinearGradient>
                      </View>

                      {/* Visited stamp overlay */}
                      {visited && (
                        <View style={styles.visitedStampWrap}>
                          <View style={styles.visitedStamp}>
                            <Text style={styles.visitedStampText}>VISITED</Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Text content */}
                    <View style={styles.cardBody}>
                      <Text style={styles.locName} numberOfLines={1}>{loc.name}</Text>
                      <Text style={styles.locDesc} numberOfLines={3}>{loc.description}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </LinearGradient>
        </Pressable>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  panel: {
    maxHeight: '85%',
    borderTopLeftRadius: spacing.radius.xxl,
    borderTopRightRadius: spacing.radius.xxl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
      },
      android: { elevation: 12 },
    }),
  },
  panelGradient: {
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.light,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  compassWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary.wisteriaFaded,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 22,
    color: colors.text.primary,
  },
  headerSubtitle: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.muted,
    marginTop: -2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.base.parchment,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    height: 4,
    backgroundColor: colors.journey.progressTrack,
    borderRadius: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.wisteria,
    borderRadius: 2,
  },
  grid: {
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.12)',
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow.colored,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: { elevation: 3 },
    }),
  },
  cardVisited: {
    borderColor: 'rgba(72, 176, 72, 0.25)',
  },
  imageContainer: {
    height: 100,
    width: '100%',
    position: 'relative',
    backgroundColor: colors.base.parchment,
  },
  locImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.radius.round,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  categoryText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 11,
    color: '#FFFFFF',
    textTransform: 'capitalize' as any,
  },
  lpOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  },
  lpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: spacing.radius.round,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.25)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 3,
      },
      android: { elevation: 2 },
    }),
  },
  lpText: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  lpLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 10,
    color: 'rgba(255,255,255,0.85)',
  },
  visitedStampWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  visitedStamp: {
    borderWidth: 3,
    borderColor: colors.success.emerald,
    borderRadius: spacing.radius.sm,
    paddingHorizontal: 18,
    paddingVertical: 4,
    transform: [{ rotate: '-12deg' }],
  },
  visitedStampText: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 20,
    color: colors.success.emerald,
    letterSpacing: 3,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  locName: {
    fontFamily: 'Baloo2-Bold',
    fontSize: 17,
    color: colors.text.primary,
    lineHeight: 22,
  },
  locDesc: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 19,
  },
});
