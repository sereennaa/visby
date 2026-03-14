import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  useWindowDimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { RootStackParamList, CosmeticType } from '../../types';
import {
  COSMETICS_CATALOG,
  COSMETIC_TYPES,
  RARITY_COLORS,
  RARITY_LABELS,
  ShopCosmetic,
  isCosmeticLocked,
  getUnlockCountryName,
} from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const SIDE_PAD = spacing.screenPadding;
const GAP = 12;
const NUM_COLS = 2;

type CosmeticShopScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const CosmeticShopScreen: React.FC<CosmeticShopScreenProps> = ({ navigation }) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = (screenW - SIDE_PAD * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

  const { user, visby, spendAura, equipCosmetic, checkAndAwardBadges } = useStore();

  const [selectedType, setSelectedType] = useState<CosmeticType>('hat');
  const [previewItem, setPreviewItem] = useState<ShopCosmetic | null>(null);

  const ownedCosmetics = visby?.ownedCosmetics ?? [];
  const equipped = visby?.equipped ?? {};
  const visitedCountries = user?.visitedCountries ?? [];

  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [buyModalItem, setBuyModalItem] = useState<ShopCosmetic | null>(null);
  const [buyModalError, setBuyModalError] = useState<string | null>(null);

  const appearance = visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const previewEquipped = previewItem
    ? { ...equipped, [previewItem.type]: previewItem.id }
    : equipped;

  const filteredItems = useMemo(
    () => COSMETICS_CATALOG.filter((c) => c.type === selectedType),
    [selectedType],
  );

  const isOwned = useCallback(
    (id: string) => ownedCosmetics.includes(id),
    [ownedCosmetics],
  );

  const isEquipped = useCallback(
    (cosmetic: ShopCosmetic) => equipped[cosmetic.type] === cosmetic.id,
    [equipped],
  );

  const handleBuy = useCallback((cosmetic: ShopCosmetic) => {
    if (ownedCosmetics.includes(cosmetic.id)) return;
    setBuyModalItem(cosmetic);
    setBuyModalError(null);
    setBuyModalVisible(true);
  }, [ownedCosmetics]);

  const confirmBuy = useCallback(() => {
    if (!buyModalItem) return;
    const success = spendAura(buyModalItem.price);
    if (!success) {
      setBuyModalError('Not enough Aura! Keep exploring to earn more.');
      return;
    }
    const { visby: currentVisby } = useStore.getState();
    if (currentVisby && !currentVisby.ownedCosmetics.includes(buyModalItem.id)) {
      useStore.setState({
        visby: {
          ...currentVisby,
          ownedCosmetics: [...currentVisby.ownedCosmetics, buyModalItem.id],
        },
      });
    }
    checkAndAwardBadges();
    setBuyModalVisible(false);
    setBuyModalItem(null);
  }, [buyModalItem, spendAura, checkAndAwardBadges]);

  const handleEquip = useCallback(
    (cosmetic: ShopCosmetic) => {
      equipCosmetic(
        cosmetic.type,
        equipped[cosmetic.type] === cosmetic.id ? undefined : cosmetic.id,
      );
      setPreviewItem(null);
    },
    [equipped, equipCosmetic],
  );

  const handlePreview = useCallback(
    (cosmetic: ShopCosmetic) =>
      setPreviewItem((prev) => (prev?.id === cosmetic.id ? null : cosmetic)),
    [],
  );

  const miniEquippedFor = useCallback(
    (item: ShopCosmetic) => ({ ...equipped, [item.type]: item.id }),
    [equipped],
  );

  // ----- Item Card -----
  const renderItem = ({ item }: { item: ShopCosmetic }) => {
    const owned = isOwned(item.id);
    const active = isEquipped(item);
    const previewing = previewItem?.id === item.id;
    const locked = !owned && isCosmeticLocked(item, visitedCountries);
    const unlockCountry = getUnlockCountryName(item);
    const rarityColor = RARITY_COLORS[item.rarity];

    return (
      <TouchableOpacity
        style={[
          styles.card,
          { width: cardW },
          previewing && styles.cardPreviewing,
          locked && styles.cardLocked,
        ]}
        onPress={() => (locked ? undefined : handlePreview(item))}
        activeOpacity={locked ? 1 : 0.85}
        accessibilityLabel={`${item.name}, ${RARITY_LABELS[item.rarity]}${locked ? ', locked' : ''}`}
      >
        {/* Mini character preview */}
        <View style={[styles.previewBubble, locked && styles.previewBubbleLocked]}>
          <VisbyCharacter
            appearance={appearance}
            equipped={miniEquippedFor(item)}
            mood="happy"
            size={80}
            animated={false}
          />
          {locked && (
            <View style={styles.lockOverlay}>
              <View style={styles.lockCircle}>
                <Icon name="lock" size={14} color="#FFFFFF" />
              </View>
            </View>
          )}
        </View>

        {/* Name */}
        <Text
          variant="body"
          style={[styles.itemName, locked && styles.textLocked]}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        {/* Rarity + Country */}
        <View style={styles.metaRow}>
          <View
            style={[
              styles.rarityPill,
              { backgroundColor: locked ? 'rgba(0,0,0,0.05)' : `${rarityColor}20` },
            ]}
          >
            <View
              style={[styles.rarityDot, { backgroundColor: locked ? colors.text.light : rarityColor }]}
            />
            <Text
              variant="caption"
              color={locked ? colors.text.light : rarityColor}
              style={styles.rarityLabel}
            >
              {RARITY_LABELS[item.rarity]}
            </Text>
          </View>
          {item.country && (
            <Text variant="caption" color={locked ? colors.text.light : colors.text.muted} style={styles.countryLabel}>
              {item.country}
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          {locked ? (
            <View style={styles.lockedRow}>
              <Icon name="globe" size={14} color={colors.primary.wisteriaDark} />
              <Text variant="body" color={colors.primary.wisteriaDark} style={styles.lockedLabel}>
                Visit {unlockCountry}
              </Text>
            </View>
          ) : item.membersOnly && !owned ? (
            <View style={styles.membersRow}>
              <Icon name="crown" size={16} color={colors.reward.gold} />
              <Text variant="body" color={colors.reward.gold} style={styles.membersLabel}>
                Members Only
              </Text>
            </View>
          ) : owned ? (
            <Button
              title={active ? 'Equipped' : 'Equip'}
              size="sm"
              variant={active ? 'secondary' : 'primary'}
              onPress={() => handleEquip(item)}
              fullWidth
            />
          ) : (
            <View style={styles.buyRow}>
              <View style={styles.pricePill}>
                <Icon name="sparkles" size={12} color={colors.reward.gold} />
                <Text variant="body" style={styles.priceText}>
                  {item.price === 0 ? 'Free' : item.price}
                </Text>
              </View>
              <Button
                title="Buy"
                size="sm"
                variant="reward"
                onPress={() => handleBuy(item)}
                fullWidth
                disabled={item.membersOnly}
              />
            </View>
          )}
        </View>

        {/* Equipped check */}
        {active && (
          <View style={[styles.equippedBadge, { backgroundColor: rarityColor }]}>
            <Icon name="check" size={11} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={['#FAF8FF', '#EDE4FF', '#FFF3EE', '#FAF8FF']}
      locations={[0, 0.3, 0.65, 1]}
      style={styles.container}
    >
      <FloatingParticles count={8} variant="mixed" opacity={0.25} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text variant="caption" color={colors.primary.wisteriaDark} style={styles.headerSub}>
              Browse &amp; Equip
            </Text>
            <Heading level={1}>Shop</Heading>
          </View>
          <View style={styles.auraPill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="body" style={styles.auraAmount}>{user?.aura ?? 0}</Text>
          </View>
        </View>

        {/* Live Character Preview */}
        <View style={styles.livePreview}>
          <LinearGradient
            colors={['#F5F0FF', '#FFF6EE', '#F0ECFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.livePreviewGradient}
          >
            <VisbyCharacter
              appearance={appearance}
              equipped={previewEquipped}
              mood="happy"
              size={140}
              animated
            />
            {previewItem ? (
              <View style={styles.previewTag}>
                <Icon name="sparkles" size={12} color={colors.primary.wisteriaDark} />
                <Text variant="body" color={colors.primary.wisteriaDark} style={styles.previewTagText}>
                  {previewItem.name}
                </Text>
              </View>
            ) : (
              <Text variant="caption" color={colors.text.muted} style={styles.previewHint}>
                Tap an item to preview
              </Text>
            )}
          </LinearGradient>
        </View>

        {/* Type Tabs */}
        <View style={styles.tabs}>
          {COSMETIC_TYPES.map((ct) => {
            const on = selectedType === ct.type;
            return (
              <TouchableOpacity
                key={ct.type}
                style={[styles.tab, on && styles.tabOn]}
                onPress={() => {
                  setSelectedType(ct.type);
                  setPreviewItem(null);
                }}
                activeOpacity={0.75}
              >
                <Icon
                  name={ct.icon}
                  size={16}
                  color={on ? '#FFFFFF' : colors.text.muted}
                />
                <Text
                  variant="body"
                  style={[styles.tabLabel, on && styles.tabLabelOn]}
                >
                  {ct.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Items Grid */}
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={NUM_COLS}
          columnWrapperStyle={[styles.gridRow, { gap: GAP }]}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      {/* Buy Modal */}
      <Modal
        visible={buyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBuyModalVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setBuyModalVisible(false)}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            {buyModalError ? (
              <>
                <Text style={styles.modalEmoji}>😢</Text>
                <Heading level={3}>Not Enough Aura</Heading>
                <Text variant="body" style={styles.modalBody}>{buyModalError}</Text>
                <View style={styles.modalRow}>
                  <Button size="sm" variant="secondary" title="OK" onPress={() => setBuyModalVisible(false)} />
                  <Button
                    size="sm"
                    variant="reward"
                    title="Get Aura"
                    onPress={() => { setBuyModalVisible(false); navigation.navigate('AuraStore'); }}
                  />
                </View>
              </>
            ) : buyModalItem ? (
              <>
                <View style={styles.modalPreview}>
                  <VisbyCharacter
                    appearance={appearance}
                    equipped={miniEquippedFor(buyModalItem)}
                    mood="excited"
                    size={110}
                    animated
                  />
                </View>
                <Heading level={3}>Buy {buyModalItem.name}?</Heading>
                <View style={styles.modalPriceRow}>
                  <Icon name="sparkles" size={16} color={colors.reward.gold} />
                  <Text variant="h3" color={colors.reward.amber}>{buyModalItem.price} Aura</Text>
                </View>
                <Text variant="body" color={colors.text.secondary} align="center">
                  Your balance: {user?.aura ?? 0} Aura
                </Text>
                {buyModalItem.country && (
                  <Text variant="caption" color={colors.text.muted} align="center" style={styles.modalCountry}>
                    From {buyModalItem.country}
                  </Text>
                )}
                <View style={styles.modalRow}>
                  <Button size="sm" variant="secondary" title="Cancel" onPress={() => setBuyModalVisible(false)} />
                  <Button size="sm" variant="reward" title="Buy Now" onPress={confirmBuy} />
                </View>
              </>
            ) : null}
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIDE_PAD,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1 },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS !== 'web'
      ? { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 }
      : {}),
  },
  auraPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,215,0,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
  },
  auraAmount: { fontWeight: '800', color: colors.reward.amber, fontSize: 15 },

  // Live preview
  livePreview: {
    marginHorizontal: SIDE_PAD,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  livePreviewGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  previewTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: spacing.sm,
    backgroundColor: 'rgba(184, 165, 224, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1,
    borderRadius: spacing.radius.round,
  },
  previewTagText: { fontWeight: '700', fontSize: 13 },
  previewHint: { marginTop: spacing.sm },

  // Tabs
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIDE_PAD,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
    borderWidth: 1,
    borderColor: 'rgba(184,165,224,0.15)',
  },
  tabOn: {
    backgroundColor: colors.primary.wisteriaDark,
    borderColor: colors.primary.wisteriaDark,
  },
  tabLabel: { fontSize: 14, fontWeight: '600', color: colors.text.secondary },
  tabLabelOn: { color: '#FFFFFF', fontWeight: '700' },

  // Grid
  gridRow: {
    paddingHorizontal: SIDE_PAD,
    marginBottom: GAP,
  },
  gridContent: {
    paddingBottom: spacing.xxxl * 2,
  },

  // Card
  card: {
    backgroundColor: colors.base.cream,
    borderRadius: 22,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    ...(Platform.OS !== 'web'
      ? { shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 }
      : {}),
  },
  cardPreviewing: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  cardLocked: {
    opacity: 0.6,
    backgroundColor: colors.base.parchment,
  },

  // Mini preview
  previewBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(184, 165, 224, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  previewBubbleLocked: {
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  lockCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Item text
  itemName: {
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 4,
  },
  textLocked: { color: colors.text.muted },

  // Meta row
  metaRow: {
    alignItems: 'center',
    gap: 3,
    marginBottom: spacing.sm,
  },
  rarityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  rarityDot: { width: 6, height: 6, borderRadius: 3 },
  rarityLabel: { fontSize: 11, fontWeight: '600' },
  countryLabel: { fontSize: 11, marginTop: 1 },

  // Card footer
  cardFooter: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: spacing.xs,
  },
  lockedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: spacing.sm,
  },
  lockedLabel: { fontSize: 12, fontWeight: '700' },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: spacing.sm,
  },
  membersLabel: { fontSize: 13, fontWeight: '700' },
  buyRow: { gap: spacing.xs },
  pricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginBottom: spacing.xs,
  },
  priceText: { fontWeight: '800', color: colors.reward.amber, fontSize: 15 },
  equippedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: spacing.xl,
    maxWidth: 380,
    width: '100%',
    alignItems: 'center',
  },
  modalEmoji: { fontSize: 40, marginBottom: spacing.sm },
  modalPreview: {
    marginBottom: spacing.md,
  },
  modalPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  modalCountry: { marginTop: spacing.xs, marginBottom: spacing.xs },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.lg, textAlign: 'center' },
  modalRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});

export default CosmeticShopScreen;
