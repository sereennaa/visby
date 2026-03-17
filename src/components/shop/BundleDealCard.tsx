import React, { useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon } from '../ui/Icon';
import { VisbyCharacter } from '../avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { CosmeticBundle } from '../../types';
import { COSMETIC_BUNDLES, COSMETICS_CATALOG } from '../../config/cosmetics';

interface BundleDealSectionProps {
  onBuyBundle: (bundle: CosmeticBundle) => void;
}

export const BundleDealSection: React.FC<BundleDealSectionProps> = ({ onBuyBundle }) => {
  const visby = useStore((s) => s.visby);
  const ownedCosmetics = visby?.ownedCosmetics ?? [];

  const appearance = visby?.appearance ?? {
    skinTone: '#FFAD6B',
    hairColor: '#B8875A',
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };
  const equipped = visby?.equipped ?? {};

  const visibleBundles = COSMETIC_BUNDLES.filter(
    (b) => !b.items.every((id) => ownedCosmetics.includes(id))
  );

  if (visibleBundles.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="gift" size={16} color={colors.primary.wisteriaDark} />
        <Text variant="h3" style={styles.headerText}>Bundle Deals</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {visibleBundles.map((bundle, idx) => {
          const savings = Math.round(((bundle.originalPrice - bundle.bundlePrice) / bundle.originalPrice) * 100);
          return (
            <Animated.View key={bundle.id} entering={FadeInRight.delay(idx * 120).duration(400).springify()}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => onBuyBundle(bundle)}
              style={styles.card}
            >
              <LinearGradient
                colors={bundle.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                {bundle.isLimited && (
                  <View style={styles.limitedBadge}>
                    <Text variant="caption" color="#FFFFFF" style={styles.limitedText}>LIMITED</Text>
                  </View>
                )}
                <View style={styles.saveBadge}>
                  <Text variant="caption" color="#FFFFFF" style={styles.saveText}>-{savings}%</Text>
                </View>

                <Text variant="h3" numberOfLines={1} style={styles.bundleName}>{bundle.name}</Text>
                <Caption numberOfLines={2} style={styles.bundleDesc}>{bundle.description}</Caption>

                <View style={styles.previewRow}>
                  {bundle.items.slice(0, 3).map((itemId) => {
                    const cosmetic = COSMETICS_CATALOG.find((c) => c.id === itemId);
                    if (!cosmetic) return null;
                    const owned = ownedCosmetics.includes(itemId);
                    return (
                      <View key={itemId} style={[styles.miniPreview, owned && styles.miniPreviewOwned]}>
                        <VisbyCharacter
                          appearance={appearance}
                          equipped={{ ...equipped, [cosmetic.type]: cosmetic.id }}
                          mood="happy"
                          size={48}
                          animated={false}
                        />
                        {owned && (
                          <View style={styles.ownedCheck}>
                            <Icon name="check" size={8} color="#FFFFFF" />
                          </View>
                        )}
                      </View>
                    );
                  })}
                  {bundle.items.length > 3 && (
                    <View style={styles.moreCircle}>
                      <Text variant="caption" color={colors.text.muted}>+{bundle.items.length - 3}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.priceRow}>
                  <Text variant="caption" color={colors.text.muted} style={styles.originalPrice}>
                    {bundle.originalPrice}
                  </Text>
                  <View style={styles.finalPrice}>
                    <Icon name="sparkles" size={14} color={colors.reward.gold} />
                    <Text variant="h3" color={colors.reward.amber}>{bundle.bundlePrice}</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  headerText: { marginBottom: 0 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    gap: 12,
  },
  card: {
    width: 220,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.md,
    borderRadius: 20,
    position: 'relative',
  },
  limitedBadge: {
    position: 'absolute',
    top: 0,
    left: 12,
    backgroundColor: '#E74C3C',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
  },
  limitedText: { fontWeight: '800', fontSize: 9, letterSpacing: 1 },
  saveBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#27AE60',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  saveText: { fontWeight: '800', fontSize: 11 },
  bundleName: { marginBottom: 4, marginTop: spacing.xs },
  bundleDesc: { marginBottom: spacing.sm, lineHeight: 16, fontSize: 11 },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  miniPreview: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  miniPreviewOwned: {
    borderWidth: 2,
    borderColor: '#5CB85C',
  },
  ownedCheck: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#5CB85C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    fontSize: 13,
  },
  finalPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
