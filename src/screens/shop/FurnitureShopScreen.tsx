import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { FurnitureVisual } from '../../components/furniture/FurnitureVisual';
import { RoomPreviewMini } from '../../components/shop/RoomPreviewMini';
import { RarityWrapper } from '../../components/shop/RarityEffects';
import { PurchaseCelebration } from '../../components/shop/PurchaseCelebration';
import { useStore } from '../../store/useStore';
import { RootStackParamList, FurnitureItem, FurnitureSet } from '../../types';
import {
  FURNITURE_CATALOG,
  getAvailableFurniture,
  COUNTRY_ORIGIN_NAMES,
  WALLPAPER_OPTIONS,
  FLOORING_OPTIONS,
  FURNITURE_SETS,
} from '../../config/furniture';

const GAP = 12;
const NUM_COLS = 2;

type Tab = 'Furniture' | 'Wallpaper' | 'Flooring';
const TABS: Tab[] = ['Furniture', 'Wallpaper', 'Flooring'];

const RARITY_COLORS: Record<string, string> = {
  common: '#9E9E9E', uncommon: '#4CAF50', rare: '#2196F3', epic: '#9C27B0', legendary: '#FF9800',
};

type FurnitureShopScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const FurnitureShopScreen: React.FC<FurnitureShopScreenProps> = ({ navigation }) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = (screenW - spacing.screenPadding * 2 - GAP) / NUM_COLS;

  const user = useStore(s => s.user);
  const visby = useStore(s => s.visby);
  const ownedFurniture = useStore(s => s.ownedFurniture);
  const buyFurniture = useStore(s => s.buyFurniture);
  const spendAura = useStore(s => s.spendAura);
  const addBondPoints = useStore(s => s.addBondPoints);
  const userHouses = useStore(s => s.userHouses);
  const [activeTab, setActiveTab] = useState<Tab>('Furniture');
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);
  const [detailItem, setDetailItem] = useState<FurnitureItem | null>(null);
  const [celebrationItem, setCelebrationItem] = useState<FurnitureItem | null>(null);
  const aura = user?.aura ?? 0;
  const visitedCountries = user?.visitedCountries ?? [];
  const availableFurniture = useMemo(() => getAvailableFurniture(visitedCountries), [visitedCountries]);
  const appearance = visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };
  const equipped = visby?.equipped ?? {};

  const primaryHouse = userHouses[0];
  const primaryRoom = primaryHouse?.roomCustomizations?.['living'];

  const isOwned = useCallback((id: string) => ownedFurniture.includes(id), [ownedFurniture]);

  const handleBuyFurniture = useCallback(
    (item: FurnitureItem) => {
      if (ownedFurniture.includes(item.id)) return;
      if (aura < item.price) {
        setInfoModal({ title: 'Not enough Aura', message: `You need ${item.price} Aura but only have ${aura}. Keep exploring to earn more!` });
        return;
      }
      const success = buyFurniture(item.id, item.price);
      if (success) {
        addBondPoints(3, 'purchase_furniture');
        setCelebrationItem(item);
      } else {
        setInfoModal({ title: 'Not enough Aura', message: 'Keep exploring to earn more Aura!' });
      }
    },
    [ownedFurniture, aura, buyFurniture, addBondPoints],
  );

  const handleBuySet = useCallback((fset: FurnitureSet) => {
    if (aura < fset.bundlePrice) {
      setInfoModal({ title: 'Not enough Aura', message: `You need ${fset.bundlePrice} Aura for this set.` });
      return;
    }
    const success = spendAura(fset.bundlePrice);
    if (!success) return;
    const newOwned = [...new Set([...ownedFurniture, ...fset.items])];
    useStore.setState({ ownedFurniture: newOwned });
    addBondPoints(8, 'purchase_furniture_set');
  }, [aura, ownedFurniture, spendAura, addBondPoints]);

  const renderFurnitureItem = useCallback(
    ({ item, index }: { item: FurnitureItem; index: number }) => {
      const owned = isOwned(item.id);
      const rarityColor = RARITY_COLORS[item.rarity] ?? '#9E9E9E';
      const originName = item.countryOrigin ? COUNTRY_ORIGIN_NAMES[item.countryOrigin] ?? item.countryOrigin : null;
      return (
        <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 50).duration(350).springify()}>
        <RarityWrapper rarity={item.rarity} style={{ width: cardW }}>
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => setDetailItem(item)}
            activeOpacity={0.9}
          >
            <View style={styles.itemIconWrap}>
              <FurnitureVisual item={item} size="medium" />
            </View>
            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.rarityRow}>
              <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
              <Caption style={styles.rarityText}>{item.rarity}</Caption>
            </View>
            {originName && <Caption style={styles.originText}>From {originName}</Caption>}
            {item.description ? (
              <Text style={styles.itemDescription} numberOfLines={2}>{item.description}</Text>
            ) : null}
            {owned ? (
              <View style={styles.ownedBadge}>
                <Icon name="check" size={14} color="#4CAF50" />
                <Text style={styles.ownedText}>Owned</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.buyBtn}
                onPress={(e: any) => { e.stopPropagation?.(); handleBuyFurniture(item); }}
                activeOpacity={0.8}
              >
                <Icon name="sparkles" size={11} color={colors.reward.gold} />
                <Text style={styles.buyBtnText}>{item.price}</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </RarityWrapper>
        </Animated.View>
      );
    },
    [cardW, isOwned, handleBuyFurniture],
  );

  const sortedFurniture = useMemo(
    () =>
      [...availableFurniture].sort((a, b) => {
        const aOwned = ownedFurniture.includes(a.id) ? 1 : 0;
        const bOwned = ownedFurniture.includes(b.id) ? 1 : 0;
        if (aOwned !== bOwned) return aOwned - bOwned;
        return a.price - b.price;
      }),
    [availableFurniture, ownedFurniture],
  );

  const renderSetCard = (fset: FurnitureSet) => {
    const allOwned = fset.items.every((id) => ownedFurniture.includes(id));
    const originName = fset.countryOrigin ? COUNTRY_ORIGIN_NAMES[fset.countryOrigin] ?? fset.countryOrigin : null;
    return (
      <TouchableOpacity key={fset.id} style={styles.setCard} activeOpacity={0.9} onPress={() => handleBuySet(fset)}>
        <LinearGradient colors={['#F5F0FF', '#FFF6EE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.setGradient}>
          <Text variant="h3" numberOfLines={1} style={styles.setName}>{fset.name}</Text>
          {originName && <Caption style={styles.setOrigin}>{originName}</Caption>}
          <Caption numberOfLines={2} style={styles.setDesc}>{fset.description}</Caption>
          <Text variant="caption" color={colors.text.muted} style={styles.setCount}>{fset.items.length} pieces</Text>
          {allOwned ? (
            <View style={styles.ownedBadge}><Icon name="check" size={12} color="#4CAF50" /><Text style={styles.ownedText}>Complete</Text></View>
          ) : (
            <View style={styles.setPriceRow}>
              <Icon name="sparkles" size={13} color={colors.reward.gold} />
              <Text variant="h3" color={colors.reward.amber}>{fset.bundlePrice}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const FurnitureListHeader = () => (
    <>
      {FURNITURE_SETS.length > 0 && (
        <View style={styles.setsSection}>
          <View style={styles.sectionHeader}>
            <Icon name="gift" size={16} color={colors.primary.wisteriaDark} />
            <Text variant="h3">Furniture Sets</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.setsScroll}>
            {FURNITURE_SETS.map(renderSetCard)}
          </ScrollView>
        </View>
      )}
      {visitedCountries.length < 2 && (
        <Text style={styles.unlockHint}>Visit new places in the World to unlock traditional furniture!</Text>
      )}
    </>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.wisteriaFaded, colors.base.cream, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.45, 1]}
      />
      <FloatingParticles count={6} variant="sparkle" opacity={0.15} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text variant="caption" color={colors.primary.wisteriaDark} style={styles.headerSub}>The Workshop</Text>
            <Heading level={2}>Furniture</Heading>
          </View>
          <View style={styles.auraChip}>
            <Icon name="sparkles" size={14} color={colors.reward.gold} />
            <Text style={styles.auraChipText}>{aura}</Text>
          </View>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Icon
                name={tab === 'Furniture' ? 'home' : tab === 'Wallpaper' ? 'edit' : 'culture'}
                size={18}
                color={activeTab === tab ? '#FFFFFF' : colors.text.secondary}
              />
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeTab === 'Furniture' && (
          <FlatList
            data={sortedFurniture}
            keyExtractor={(item) => item.id}
            renderItem={renderFurnitureItem}
            numColumns={NUM_COLS}
            contentContainerStyle={styles.gridContent}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={FurnitureListHeader}
            initialNumToRender={8}
            maxToRenderPerBatch={6}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}

        {activeTab === 'Wallpaper' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.swatchContent}>
            <Text style={styles.swatchHint}>Apply wallpapers in your house rooms via Decorate mode.</Text>
            <View style={styles.swatchGrid}>
              {WALLPAPER_OPTIONS.map((opt) => (
                <View key={opt.id} style={styles.swatchCard}>
                  <RoomPreviewMini width={80} height={60} wallColor={opt.color} floorColor="#D4C5A0" />
                  <Text style={styles.swatchName}>{opt.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'Flooring' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.swatchContent}>
            <Text style={styles.swatchHint}>Apply flooring in your house rooms via Decorate mode.</Text>
            <View style={styles.swatchGrid}>
              {FLOORING_OPTIONS.map((opt) => (
                <View key={opt.id} style={styles.swatchCard}>
                  <RoomPreviewMini width={80} height={60} wallColor="#FAF0E6" floorColor={opt.color} />
                  <Text style={styles.swatchName}>{opt.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      {/* Enhanced Detail Modal */}
      {detailItem && (
        <Modal visible transparent animationType="none">
          <Pressable style={styles.modalOverlay} onPress={() => setDetailItem(null)}>
            <Animated.View entering={ZoomIn.duration(300).springify()} style={{ width: '100%', alignItems: 'center' }}>
            <Pressable style={styles.detailModalCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.detailVisualWrap}>
                <FurnitureVisual item={detailItem} size="large" />
              </View>

              <Heading level={2} style={styles.detailTitle}>{detailItem.name}</Heading>

              {detailItem.countryOrigin && (
                <View style={styles.detailCountryBadge}>
                  <Icon name="globe" size={12} color={colors.primary.wisteriaDark} />
                  <Caption>{COUNTRY_ORIGIN_NAMES[detailItem.countryOrigin] ?? detailItem.countryOrigin}</Caption>
                </View>
              )}

              {detailItem.description && (
                <Text variant="body" style={styles.detailDescription}>{detailItem.description}</Text>
              )}

              {/* Interaction preview */}
              {detailItem.interactionType && detailItem.interactionLabel && (
                <View style={styles.interactionPreview}>
                  <Icon name="sparkles" size={14} color={colors.primary.wisteriaDark} />
                  <Text variant="body" color={colors.primary.wisteriaDark} style={styles.interactionText}>
                    {detailItem.interactionLabel}
                  </Text>
                  {detailItem.interactionAura && (
                    <View style={styles.interactionAura}>
                      <Icon name="sparkles" size={10} color={colors.reward.gold} />
                      <Text variant="caption" color={colors.reward.amber}>+{detailItem.interactionAura}</Text>
                    </View>
                  )}
                </View>
              )}

              {/* Room preview */}
              <View style={styles.roomPreviewSection}>
                <Caption style={styles.roomPreviewLabel}>How it looks</Caption>
                <RoomPreviewMini
                  width={200}
                  height={120}
                  wallColor={primaryRoom?.wallColor ?? '#FAF0E6'}
                  floorColor={primaryRoom?.floorColor ?? '#D4C5A0'}
                  furnitureItem={detailItem}
                />
              </View>

              {/* Stats row */}
              <View style={styles.detailMeta}>
                <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[detailItem.rarity] ?? '#9E9E9E' }]} />
                <Caption style={styles.rarityText}>{detailItem.rarity}</Caption>
                <Caption style={styles.detailCategory}>{detailItem.category}</Caption>
              </View>

              {isOwned(detailItem.id) ? (
                <View style={styles.ownedBadge}><Icon name="check" size={14} color="#4CAF50" /><Text style={styles.ownedText}>Owned</Text></View>
              ) : (
                <Button title={`Buy for ${detailItem.price} Aura`} onPress={() => { handleBuyFurniture(detailItem); setDetailItem(null); }} variant="primary" />
              )}
              <TouchableOpacity style={styles.detailClose} onPress={() => setDetailItem(null)}>
                <Text style={styles.detailCloseText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      )}

      {infoModal && (
        <Modal visible transparent animationType="none">
          <Pressable style={styles.modalOverlay} onPress={() => setInfoModal(null)}>
            <Animated.View entering={ZoomIn.duration(300).springify()} style={{ width: '100%', alignItems: 'center' }}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Icon name="sparkles" size={32} color={colors.reward.gold} />
              <Heading level={2} style={{ textAlign: 'center', marginTop: spacing.sm }}>{infoModal.title}</Heading>
              <Text variant="body" style={{ textAlign: 'center', color: colors.text.secondary, marginTop: spacing.xs }}>{infoModal.message}</Text>
              <View style={styles.infoModalActions}>
                <Button title="OK" onPress={() => setInfoModal(null)} variant="secondary" size="sm" />
                <Button title="Get Aura" onPress={() => { setInfoModal(null); navigation.navigate('AuraStore'); }} variant="reward" size="sm" />
              </View>
            </Pressable>
            </Animated.View>
          </Pressable>
        </Modal>
      )}

      {celebrationItem && (
        <PurchaseCelebration
          visible={!!celebrationItem}
          itemName={celebrationItem.name}
          rarity={celebrationItem.rarity}
          appearance={appearance}
          equipped={equipped}
          onDismiss={() => setCelebrationItem(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  headerCenter: { alignItems: 'center' },
  headerSub: { fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1 },
  backBtn: { padding: spacing.xs },
  auraChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,215,0,0.12)', paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  auraChipText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.gold },
  tabBar: { paddingHorizontal: spacing.md, gap: spacing.xs, paddingVertical: spacing.sm },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)', borderWidth: 1.5, borderColor: 'transparent',
  },
  tabActive: { backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark },
  tabText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  tabTextActive: { color: '#FFFFFF', fontFamily: 'Nunito-Bold' },
  setsSection: { marginBottom: spacing.md },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingHorizontal: spacing.screenPadding, marginBottom: spacing.sm,
  },
  setsScroll: { paddingHorizontal: spacing.screenPadding, gap: 12 },
  setCard: { width: 200, borderRadius: 18, overflow: 'hidden' },
  setGradient: { padding: spacing.md, borderRadius: 18, gap: 4 },
  setName: { marginBottom: 2 },
  setOrigin: { fontSize: 10 },
  setDesc: { lineHeight: 15, fontSize: 11 },
  setCount: { fontSize: 10 },
  setPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  unlockHint: {
    fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.secondary,
    textAlign: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.xs,
  },
  gridContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 3, paddingTop: spacing.xs },
  gridRow: { gap: GAP, marginBottom: GAP },
  itemCard: {
    flex: 1, alignItems: 'center', padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18, borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  itemIconWrap: {
    width: 64, height: 56, borderRadius: 16, backgroundColor: colors.base.cream,
    justifyContent: 'center', alignItems: 'center', marginBottom: 6, overflow: 'hidden',
  },
  itemName: { fontFamily: 'Baloo2-SemiBold', fontSize: 13, color: colors.text.primary, textAlign: 'center' },
  rarityRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  rarityDot: { width: 8, height: 8, borderRadius: 4 },
  rarityText: { fontSize: 10, textTransform: 'capitalize' as any, color: colors.text.muted },
  originText: { fontSize: 9, color: colors.text.muted, marginBottom: 2 },
  itemDescription: {
    fontFamily: 'Nunito-Regular', fontSize: 10, color: colors.text.secondary,
    textAlign: 'center', marginBottom: 6, lineHeight: 14,
  },
  ownedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12, backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  ownedText: { fontFamily: 'Nunito-Bold', fontSize: 12, color: '#4CAF50' },
  buyBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 6, paddingHorizontal: 16, backgroundColor: colors.reward.peach, borderRadius: 14,
  },
  buyBtnText: { fontFamily: 'Nunito-Bold', fontSize: 12, color: colors.reward.gold },
  swatchContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 3, paddingTop: spacing.xs },
  swatchHint: { fontFamily: 'Nunito-Medium', fontSize: 13, color: colors.text.muted, textAlign: 'center', marginBottom: spacing.md },
  swatchGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: GAP, justifyContent: 'center' },
  swatchCard: { alignItems: 'center', gap: 4 },
  swatchName: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, textAlign: 'center' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.base.cream, borderRadius: spacing.lg, padding: spacing.xl,
    width: '100%', maxWidth: 340, alignItems: 'center',
  },
  detailModalCard: {
    backgroundColor: '#FFFFFF', borderRadius: 24, padding: spacing.xl,
    width: '100%', maxWidth: 360, alignItems: 'center',
  },
  detailVisualWrap: {
    width: 100, height: 80, borderRadius: 20, backgroundColor: colors.primary.wisteriaFaded,
    justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md,
  },
  detailTitle: { textAlign: 'center', marginBottom: spacing.xs },
  detailCountryBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginBottom: spacing.sm, backgroundColor: 'rgba(184,165,224,0.1)',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  detailDescription: {
    textAlign: 'center', color: colors.text.secondary, marginBottom: spacing.md, lineHeight: 20,
  },
  interactionPreview: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(184,165,224,0.1)', paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12, marginBottom: spacing.md,
  },
  interactionText: { fontWeight: '600', fontSize: 13 },
  interactionAura: { flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 'auto' },
  roomPreviewSection: { alignItems: 'center', marginBottom: spacing.md },
  roomPreviewLabel: { marginBottom: spacing.xs },
  detailMeta: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md,
  },
  detailCategory: { fontSize: 10, textTransform: 'capitalize' as any, color: colors.text.muted },
  detailClose: { marginTop: spacing.sm },
  detailCloseText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  infoModalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
});

export default FurnitureShopScreen;
