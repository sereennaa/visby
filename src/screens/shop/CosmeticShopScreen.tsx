import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { RootStackParamList, CosmeticType, CosmeticBundle } from '../../types';
import {
  COSMETICS_CATALOG,
  COSMETIC_TYPES,
  RARITY_COLORS,
  RARITY_LABELS,
  ShopCosmetic,
  isCosmeticLocked,
  getUnlockCountryName,
  COSMETIC_BUNDLES,
} from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { FeaturedCarousel } from '../../components/shop/FeaturedCarousel';
import { BundleDealSection } from '../../components/shop/BundleDealCard';
import { RarityWrapper } from '../../components/shop/RarityEffects';
import { PurchaseCelebration } from '../../components/shop/PurchaseCelebration';

const SIDE_PAD = spacing.screenPadding;
const GAP = 12;
const NUM_COLS = 2;

type SortOption = 'default' | 'price_low' | 'price_high' | 'rarity';
type FilterOption = 'all' | 'owned' | 'not_owned' | 'wishlist';

type CosmeticShopScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const CosmeticShopScreen: React.FC<CosmeticShopScreenProps> = ({ navigation }) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = (screenW - SIDE_PAD * 2 - GAP * (NUM_COLS - 1)) / NUM_COLS;

  const user = useStore(s => s.user);
  const visby = useStore(s => s.visby);
  const spendAura = useStore(s => s.spendAura);
  const equipCosmetic = useStore(s => s.equipCosmetic);
  const checkAndAwardBadges = useStore(s => s.checkAndAwardBadges);
  const wishlist = useStore(s => s.wishlist);
  const toggleWishlist = useStore(s => s.toggleWishlist);
  const addBondPoints = useStore(s => s.addBondPoints);

  const [selectedType, setSelectedType] = useState<CosmeticType>('hat');
  const [previewItem, setPreviewItem] = useState<ShopCosmetic | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  const ownedCosmetics = visby?.ownedCosmetics ?? [];
  const equipped = visby?.equipped ?? {};
  const visitedCountries = user?.visitedCountries ?? [];

  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [buyModalItem, setBuyModalItem] = useState<ShopCosmetic | null>(null);
  const [buyModalError, setBuyModalError] = useState<string | null>(null);

  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [celebrationItem, setCelebrationItem] = useState<ShopCosmetic | null>(null);

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

  const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, epic: 3, legendary: 4 };

  const filteredItems = useMemo(() => {
    let items = COSMETICS_CATALOG.filter((c) => c.type === selectedType);
    if (filterBy === 'owned') items = items.filter((c) => ownedCosmetics.includes(c.id));
    else if (filterBy === 'not_owned') items = items.filter((c) => !ownedCosmetics.includes(c.id));
    else if (filterBy === 'wishlist') items = items.filter((c) => wishlist.includes(c.id));

    if (sortBy === 'price_low') items = [...items].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') items = [...items].sort((a, b) => b.price - a.price);
    else if (sortBy === 'rarity') items = [...items].sort((a, b) => (RARITY_ORDER[b.rarity] ?? 0) - (RARITY_ORDER[a.rarity] ?? 0));
    return items;
  }, [selectedType, sortBy, filterBy, ownedCosmetics, wishlist]);

  const isOwned = useCallback((id: string) => ownedCosmetics.includes(id), [ownedCosmetics]);
  const isEquipped = useCallback((cosmetic: ShopCosmetic) => equipped[cosmetic.type] === cosmetic.id, [equipped]);

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
    addBondPoints(5, 'purchase_cosmetic');
    setBuyModalVisible(false);
    setCelebrationItem(buyModalItem);
    setCelebrationVisible(true);
    setBuyModalItem(null);
  }, [buyModalItem, spendAura, checkAndAwardBadges, addBondPoints]);

  const handleBuyBundle = useCallback((bundle: CosmeticBundle) => {
    if (!user || user.aura < bundle.bundlePrice) {
      setBuyModalError('Not enough Aura for this bundle!');
      setBuyModalVisible(true);
      return;
    }
    const success = spendAura(bundle.bundlePrice);
    if (!success) return;
    const { visby: currentVisby } = useStore.getState();
    if (currentVisby) {
      const newOwned = [...new Set([...currentVisby.ownedCosmetics, ...bundle.items])];
      useStore.setState({ visby: { ...currentVisby, ownedCosmetics: newOwned } });
    }
    checkAndAwardBadges();
    addBondPoints(10, 'purchase_bundle');
  }, [user, spendAura, checkAndAwardBadges, addBondPoints]);

  const handleEquip = useCallback(
    (cosmetic: ShopCosmetic) => {
      equipCosmetic(cosmetic.type, equipped[cosmetic.type] === cosmetic.id ? undefined : cosmetic.id);
      setPreviewItem(null);
    },
    [equipped, equipCosmetic],
  );

  const handlePreview = useCallback(
    (cosmetic: ShopCosmetic) => setPreviewItem((prev) => (prev?.id === cosmetic.id ? null : cosmetic)),
    [],
  );

  const miniEquippedFor = useCallback(
    (item: ShopCosmetic) => ({ ...equipped, [item.type]: item.id }),
    [equipped],
  );

  const typeItemCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    COSMETICS_CATALOG.forEach((c) => { counts[c.type] = (counts[c.type] || 0) + 1; });
    return counts;
  }, []);

  const renderItem = ({ item, index }: { item: ShopCosmetic; index: number }) => {
    const owned = isOwned(item.id);
    const active = isEquipped(item);
    const previewing = previewItem?.id === item.id;
    const locked = !owned && isCosmeticLocked(item, visitedCountries);
    const unlockCountry = getUnlockCountryName(item);
    const rarityColor = RARITY_COLORS[item.rarity];
    const wishlisted = wishlist.includes(item.id);

    return (
      <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 50).duration(350).springify()}>
      <RarityWrapper rarity={item.rarity} style={{ width: cardW }}>
        <TouchableOpacity
          style={[
            styles.card,
            previewing && styles.cardPreviewing,
            locked && styles.cardLocked,
          ]}
          onPress={() => (locked ? undefined : handlePreview(item))}
          activeOpacity={locked ? 1 : 0.85}
          accessibilityRole="button"
          accessibilityLabel={`${item.name}, ${RARITY_LABELS[item.rarity]}${locked ? ', locked' : ''}`}
        >
          {/* Wishlist heart */}
          {!locked && (
            <TouchableOpacity
              style={styles.wishlistBtn}
              onPress={() => toggleWishlist(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={wishlisted ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
            >
              <Icon
                name={wishlisted ? 'heart' : 'heartOutline'}
                size={16}
                color={wishlisted ? '#E74C3C' : colors.text.light}
              />
            </TouchableOpacity>
          )}

          {/* New badge */}
          {item.isNew && (
            <View style={styles.newTag}>
              <Text variant="caption" color="#FFFFFF" style={styles.newTagText}>NEW</Text>
            </View>
          )}

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

          <Text variant="body" style={[styles.itemName, locked && styles.textLocked]} numberOfLines={1}>
            {item.name}
          </Text>

          <View style={styles.metaRow}>
            <View style={[styles.rarityPill, { backgroundColor: locked ? 'rgba(0,0,0,0.05)' : `${rarityColor}20` }]}>
              <View style={[styles.rarityDot, { backgroundColor: locked ? colors.text.light : rarityColor }]} />
              <Text variant="caption" color={locked ? colors.text.light : rarityColor} style={styles.rarityLabel}>
                {RARITY_LABELS[item.rarity]}
              </Text>
            </View>
            {item.country && (
              <Text variant="caption" color={locked ? colors.text.light : colors.text.muted} style={styles.countryLabel}>
                {item.country}
              </Text>
            )}
          </View>

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
                <Text variant="body" color={colors.reward.gold} style={styles.membersLabel}>Members Only</Text>
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
                  <Text variant="body" style={styles.priceText}>{item.price === 0 ? 'Free' : item.price}</Text>
                </View>
                <Button title="Buy" size="sm" variant="reward" onPress={() => handleBuy(item)} fullWidth disabled={item.membersOnly} />
              </View>
            )}
          </View>

          {active && (
            <View style={[styles.equippedBadge, { backgroundColor: rarityColor }]}>
              <Icon name="check" size={11} color="#FFFFFF" />
            </View>
          )}
        </TouchableOpacity>
      </RarityWrapper>
      </Animated.View>
    );
  };

  const ListHeader = () => (
    <>
      {/* Live Character Preview */}
      <View style={styles.livePreview}>
        <LinearGradient
          colors={['#F5F0FF', '#FFF6EE', '#F0ECFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.livePreviewGradient}
        >
          <VisbyCharacter appearance={appearance} equipped={previewEquipped} mood="happy" size={140} animated />
          {previewItem ? (
            <View style={styles.previewTag}>
              <Icon name="sparkles" size={12} color={colors.primary.wisteriaDark} />
              <Text variant="body" color={colors.primary.wisteriaDark} style={styles.previewTagText}>{previewItem.name}</Text>
            </View>
          ) : (
            <Text variant="caption" color={colors.text.muted} style={styles.previewHint}>Tap any item to see it on your Visby</Text>
          )}
        </LinearGradient>
      </View>

      {/* Featured Carousel */}
      <FeaturedCarousel onItemPress={(item) => handlePreview(item)} />

      {/* Bundle Deals */}
      <BundleDealSection onBuyBundle={handleBuyBundle} />

      {/* Type Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {COSMETIC_TYPES.map((ct) => {
          const on = selectedType === ct.type;
          const count = typeItemCounts[ct.type] || 0;
          return (
            <TouchableOpacity
              key={ct.type}
              style={[styles.tab, on && styles.tabOn]}
              onPress={() => { setSelectedType(ct.type); setPreviewItem(null); }}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityLabel={`${ct.label}, ${count} items`}
              accessibilityState={{ selected: on }}
            >
              <Icon name={ct.icon} size={16} color={on ? '#FFFFFF' : colors.text.muted} />
              <Text variant="body" style={[styles.tabLabel, on && styles.tabLabelOn]}>{ct.label}</Text>
              <View style={[styles.countBadge, on && styles.countBadgeOn]}>
                <Text variant="caption" color={on ? colors.primary.wisteriaDark : colors.text.muted} style={styles.countText}>{count}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filter/Sort Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {(['all', 'not_owned', 'owned', 'wishlist'] as FilterOption[]).map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterChip, filterBy === f && styles.filterChipActive]}
              onPress={() => setFilterBy(f)}
              accessibilityRole="tab"
              accessibilityLabel={f === 'all' ? 'All items' : f === 'not_owned' ? 'Available' : f === 'owned' ? 'Owned' : 'Wishlist'}
              accessibilityState={{ selected: filterBy === f }}
            >
              <Text variant="caption" color={filterBy === f ? '#FFFFFF' : colors.text.secondary} style={styles.filterChipText}>
                {f === 'all' ? 'All' : f === 'not_owned' ? 'Available' : f === 'owned' ? 'Owned' : 'Wishlist'}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.sortDivider} />
          {(['default', 'price_low', 'price_high', 'rarity'] as SortOption[]).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.filterChip, sortBy === s && styles.filterChipActive]}
              onPress={() => setSortBy(s)}
              accessibilityRole="button"
              accessibilityLabel={s === 'default' ? 'Default sort' : s === 'price_low' ? 'Sort by price low to high' : s === 'price_high' ? 'Sort by price high to low' : 'Sort by rarity'}
              accessibilityState={{ selected: sortBy === s }}
            >
              <Text variant="caption" color={sortBy === s ? '#FFFFFF' : colors.text.secondary} style={styles.filterChipText}>
                {s === 'default' ? 'Default' : s === 'price_low' ? 'Price ↑' : s === 'price_high' ? 'Price ↓' : 'Rarity'}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

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
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text variant="caption" color={colors.primary.wisteriaDark} style={styles.headerSub}>The Boutique</Text>
            <Heading level={1}>Shop</Heading>
          </View>
          <View style={styles.auraPill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="body" style={styles.auraAmount}>{user?.aura ?? 0}</Text>
          </View>
        </View>

        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          numColumns={NUM_COLS}
          columnWrapperStyle={[styles.gridRow, { gap: GAP }]}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={ListHeader}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={5}
          removeClippedSubviews={true}
        />
      </SafeAreaView>

      {/* Buy Modal */}
      <Modal visible={buyModalVisible} transparent animationType="fade" onRequestClose={() => setBuyModalVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setBuyModalVisible(false)}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
            {buyModalError ? (
              <>
                <Text style={styles.modalEmoji}>😢</Text>
                <Heading level={3}>Not Enough Aura</Heading>
                <Text variant="body" style={styles.modalBody}>{buyModalError}</Text>
                <View style={styles.modalRow}>
                  <Button size="sm" variant="secondary" title="OK" onPress={() => setBuyModalVisible(false)} />
                  <Button size="sm" variant="reward" title="Get Aura" onPress={() => { setBuyModalVisible(false); navigation.navigate('AuraStore'); }} />
                </View>
              </>
            ) : buyModalItem ? (
              <>
                <View style={styles.modalPreview}>
                  <VisbyCharacter appearance={appearance} equipped={miniEquippedFor(buyModalItem)} mood="excited" size={110} animated />
                </View>
                <Heading level={3}>Buy {buyModalItem.name}?</Heading>
                <View style={styles.modalPriceRow}>
                  <Icon name="sparkles" size={16} color={colors.reward.gold} />
                  <Text variant="h3" color={colors.reward.amber}>{buyModalItem.price} Aura</Text>
                </View>
                <Text variant="body" color={colors.text.secondary} align="center">Your balance: {user?.aura ?? 0} Aura</Text>
                {buyModalItem.country && (
                  <Text variant="caption" color={colors.text.muted} align="center" style={styles.modalCountry}>From {buyModalItem.country}</Text>
                )}
                <View style={styles.modalRow}>
                  <Button size="sm" variant="secondary" title="Cancel" onPress={() => setBuyModalVisible(false)} />
                  <Button size="sm" variant="reward" title="Buy Now" onPress={confirmBuy} />
                </View>
              </>
            ) : null}
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>

      {/* Purchase Celebration */}
      <PurchaseCelebration
        visible={celebrationVisible}
        itemName={celebrationItem?.name ?? ''}
        rarity={celebrationItem?.rarity ?? 'common'}
        appearance={appearance}
        equipped={celebrationItem ? { ...equipped, [celebrationItem.type]: celebrationItem.id } : equipped}
        onDismiss={() => { setCelebrationVisible(false); setCelebrationItem(null); }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SIDE_PAD, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1 },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    ...getShadowStyle({ shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2 }),
  },
  auraPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,215,0,0.12)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
  },
  auraAmount: { fontWeight: '800', color: colors.reward.amber, fontSize: 15 },
  livePreview: { marginHorizontal: SIDE_PAD, borderRadius: 22, overflow: 'hidden', marginBottom: spacing.md },
  livePreviewGradient: { alignItems: 'center', paddingVertical: spacing.lg },
  previewTag: {
    flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm,
    backgroundColor: 'rgba(184, 165, 224, 0.15)', paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 1, borderRadius: spacing.radius.round,
  },
  previewTagText: { fontWeight: '700', fontSize: 13 },
  previewHint: { marginTop: spacing.sm },
  tabs: { paddingHorizontal: SIDE_PAD, gap: spacing.sm, marginBottom: spacing.sm },
  tab: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4,
    paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md, borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream, borderWidth: 1, borderColor: 'rgba(184,165,224,0.15)',
  },
  tabOn: { backgroundColor: colors.primary.wisteriaDark, borderColor: colors.primary.wisteriaDark },
  tabLabel: { fontSize: 12, fontWeight: '600', color: colors.text.secondary },
  tabLabelOn: { color: '#FFFFFF', fontWeight: '700' },
  countBadge: {
    backgroundColor: 'rgba(0,0,0,0.06)', borderRadius: 8, paddingHorizontal: 5, paddingVertical: 1,
  },
  countBadgeOn: { backgroundColor: 'rgba(255,255,255,0.25)' },
  countText: { fontSize: 9, fontWeight: '700' },
  filterBar: { marginBottom: spacing.sm },
  filterScroll: { paddingHorizontal: SIDE_PAD, gap: 6, alignItems: 'center' },
  filterChip: {
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.7)', borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)',
  },
  filterChipActive: { backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark },
  filterChipText: { fontSize: 11, fontWeight: '600' },
  sortDivider: { width: 1, height: 20, backgroundColor: 'rgba(0,0,0,0.1)', marginHorizontal: 4 },
  gridRow: { paddingHorizontal: SIDE_PAD, marginBottom: GAP },
  gridContent: { paddingBottom: spacing.xxxl * 2 },
  card: {
    flex: 1, backgroundColor: colors.base.cream, borderRadius: 22, padding: spacing.md,
    alignItems: 'center', borderWidth: 2, borderColor: 'transparent', position: 'relative',
    ...getShadowStyle({ shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 8, elevation: 2 }),
  },
  cardPreviewing: { borderColor: colors.primary.wisteria, backgroundColor: colors.primary.wisteriaFaded },
  cardLocked: { opacity: 0.85, backgroundColor: colors.base.parchment },
  wishlistBtn: { position: 'absolute', top: 8, left: 8, zIndex: 5, padding: 4 },
  newTag: {
    position: 'absolute', top: 0, right: 12, backgroundColor: '#FF6B6B',
    paddingHorizontal: 6, paddingVertical: 2, borderBottomLeftRadius: 6, borderBottomRightRadius: 6, zIndex: 5,
  },
  newTagText: { fontWeight: '800', fontSize: 8, letterSpacing: 0.8 },
  previewBubble: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: 'rgba(184, 165, 224, 0.08)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm, overflow: 'hidden',
  },
  previewBubbleLocked: { backgroundColor: 'rgba(0,0,0,0.03)' },
  lockOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.4)' },
  lockCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' },
  itemName: { fontWeight: '700', fontSize: 14, textAlign: 'center', marginBottom: 4 },
  textLocked: { color: colors.text.muted },
  metaRow: { alignItems: 'center', gap: 3, marginBottom: spacing.sm },
  rarityPill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  rarityDot: { width: 6, height: 6, borderRadius: 3 },
  rarityLabel: { fontSize: 11, fontWeight: '600' },
  countryLabel: { fontSize: 11, marginTop: 1 },
  cardFooter: { width: '100%', marginTop: 'auto', paddingTop: spacing.xs },
  lockedRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: spacing.sm },
  lockedLabel: { fontSize: 12, fontWeight: '700' },
  membersRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: spacing.sm },
  membersLabel: { fontSize: 13, fontWeight: '700' },
  buyRow: { gap: spacing.xs },
  pricePill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: spacing.xs },
  priceText: { fontWeight: '800', color: colors.reward.amber, fontSize: 15 },
  equippedBadge: { position: 'absolute', top: 8, right: 8, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: spacing.xl, maxWidth: 380, width: '100%', alignItems: 'center' },
  modalEmoji: { fontSize: 40, marginBottom: spacing.sm },
  modalPreview: { marginBottom: spacing.md },
  modalPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: spacing.sm, marginBottom: spacing.xs },
  modalCountry: { marginTop: spacing.xs, marginBottom: spacing.xs },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.lg, textAlign: 'center' },
  modalRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});

export default CosmeticShopScreen;
