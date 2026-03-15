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
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { useStore } from '../../store/useStore';
import { RootStackParamList, FurnitureItem } from '../../types';
import {
  FURNITURE_CATALOG,
  getAvailableFurniture,
  COUNTRY_ORIGIN_NAMES,
  WALLPAPER_OPTIONS,
  FLOORING_OPTIONS,
} from '../../config/furniture';

const GAP = 12;
const NUM_COLS = 2;

type Tab = 'Furniture' | 'Wallpaper' | 'Flooring';
const TABS: Tab[] = ['Furniture', 'Wallpaper', 'Flooring'];

const RARITY_COLORS: Record<string, string> = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

type FurnitureShopScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const FurnitureShopScreen: React.FC<FurnitureShopScreenProps> = ({ navigation }) => {
  const { width: screenW } = useWindowDimensions();
  const cardW = (screenW - spacing.screenPadding * 2 - GAP) / NUM_COLS;

  const { user, ownedFurniture, buyFurniture, spendAura } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('Furniture');
  const [infoModal, setInfoModal] = useState<{ title: string; message: string } | null>(null);
  const [detailItem, setDetailItem] = useState<FurnitureItem | null>(null);
  const aura = user?.aura ?? 0;
  const visitedCountries = user?.visitedCountries ?? [];
  const availableFurniture = useMemo(() => getAvailableFurniture(visitedCountries), [visitedCountries]);

  const isOwned = useCallback(
    (id: string) => ownedFurniture.includes(id),
    [ownedFurniture],
  );

  const handleBuyFurniture = useCallback(
    (item: FurnitureItem) => {
      if (ownedFurniture.includes(item.id)) return;
      if (aura < item.price) {
        setInfoModal({ title: 'Not enough Aura', message: `You need ${item.price} Aura but only have ${aura}. Keep exploring to earn more!` });
        return;
      }
      const success = buyFurniture(item.id, item.price);
      if (!success) {
        setInfoModal({ title: 'Not enough Aura', message: 'Keep exploring to earn more Aura!' });
      }
    },
    [ownedFurniture, aura, buyFurniture],
  );

  const renderFurnitureItem = useCallback(
    ({ item }: { item: FurnitureItem }) => {
      const owned = isOwned(item.id);
      const rarityColor = RARITY_COLORS[item.rarity] ?? '#9E9E9E';
      const originName = item.countryOrigin ? COUNTRY_ORIGIN_NAMES[item.countryOrigin] ?? item.countryOrigin : null;
      return (
        <TouchableOpacity
          style={[styles.itemCard, { width: cardW }]}
          onPress={() => setDetailItem(item)}
          activeOpacity={0.9}
        >
          <View style={styles.itemIconWrap}>
            {item.imageUrl ? (
              <Image source={{ uri: item.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            ) : (
              <Icon name={item.icon as IconName} size={36} color={colors.text.primary} />
            )}
          </View>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.rarityRow}>
            <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
            <Caption style={styles.rarityText}>{item.rarity}</Caption>
          </View>
          {originName && (
            <Caption style={styles.originText}>From {originName}</Caption>
          )}
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
              onPress={(e) => { e.stopPropagation(); handleBuyFurniture(item); }}
              activeOpacity={0.8}
            >
              <Text style={styles.buyBtnText}>{item.price} Aura</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
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

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.primary.wisteriaFaded, colors.base.cream, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.45, 1]}
      />
      <FloatingParticles count={6} variant="sparkle" opacity={0.15} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3} style={styles.headerTitle}>Furniture Shop</Heading>
          <View style={styles.auraChip}>
            <Text style={styles.auraChipText}>{aura}</Text>
          </View>
        </View>

        {/* Tab bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
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
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Content */}
        {activeTab === 'Furniture' && (
          <>
            {visitedCountries.length < 2 && (
              <Text style={styles.unlockHint}>Visit new places in the World to unlock traditional furniture from each country!</Text>
            )}
            <FlatList
              data={sortedFurniture}
              keyExtractor={(item) => item.id}
              renderItem={renderFurnitureItem}
              numColumns={NUM_COLS}
              contentContainerStyle={styles.gridContent}
              columnWrapperStyle={styles.gridRow}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        {activeTab === 'Wallpaper' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.swatchContent}>
            <Text style={styles.swatchHint}>
              Wallpapers can be applied in your house rooms via the Decorate mode.
            </Text>
            <View style={styles.swatchGrid}>
              {WALLPAPER_OPTIONS.map((opt) => (
                <View key={opt.id} style={styles.swatchCard}>
                  <View style={[styles.swatchColor, { backgroundColor: opt.color }]} />
                  <Text style={styles.swatchName}>{opt.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {activeTab === 'Flooring' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.swatchContent}>
            <Text style={styles.swatchHint}>
              Flooring options can be applied in your house rooms via the Decorate mode.
            </Text>
            <View style={styles.swatchGrid}>
              {FLOORING_OPTIONS.map((opt) => (
                <View key={opt.id} style={styles.swatchCard}>
                  <View style={[styles.swatchColor, { backgroundColor: opt.color }]} />
                  <Text style={styles.swatchName}>{opt.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>

      {detailItem && (
        <Modal visible transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setDetailItem(null)}>
            <Pressable style={styles.detailModalCard} onPress={(e) => e.stopPropagation()}>
              <View style={styles.detailIconWrap}>
                {detailItem.imageUrl ? (
                  <Image source={{ uri: detailItem.imageUrl }} style={styles.detailImage} resizeMode="cover" />
                ) : (
                  <Icon name={detailItem.icon as IconName} size={48} color={colors.primary.wisteriaDark} />
                )}
              </View>
              <Heading level={2} style={styles.detailTitle}>{detailItem.name}</Heading>
              {detailItem.countryOrigin && (
                <Caption style={styles.detailOrigin}>From {COUNTRY_ORIGIN_NAMES[detailItem.countryOrigin] ?? detailItem.countryOrigin}</Caption>
              )}
              {detailItem.description ? (
                <Text variant="body" style={styles.detailDescription}>{detailItem.description}</Text>
              ) : null}
              <View style={styles.detailMeta}>
                <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[detailItem.rarity] ?? '#9E9E9E' }]} />
                <Caption style={styles.rarityText}>{detailItem.rarity}</Caption>
                <Text variant="body" style={styles.detailPrice}>{detailItem.price} Aura</Text>
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
          </Pressable>
        </Modal>
      )}

      {infoModal && (
        <Modal visible transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setInfoModal(null)}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
              <Icon name="sparkles" size={32} color={colors.reward.gold} />
              <Heading level={2} style={{ textAlign: 'center', marginTop: spacing.sm }}>{infoModal.title}</Heading>
              <Text variant="body" style={{ textAlign: 'center', color: colors.text.secondary, marginTop: spacing.xs }}>{infoModal.message}</Text>
              <Button title="OK" onPress={() => setInfoModal(null)} variant="primary" style={{ marginTop: spacing.lg }} />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerTitle: { flex: 1, textAlign: 'center' },
  auraChip: {
    backgroundColor: colors.reward.peach,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 16,
  },
  auraChipText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.reward.gold,
  },

  tabBar: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabActive: {
    backgroundColor: colors.primary.wisteria,
    borderColor: colors.primary.wisteriaDark,
  },
  tabText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },

  unlockHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  gridContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl * 3,
    paddingTop: spacing.xs,
  },
  detailModalCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  detailIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: colors.primary.wisteriaFaded,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailTitle: { textAlign: 'center', marginBottom: spacing.xs },
  detailOrigin: { marginBottom: spacing.sm, textTransform: 'none' },
  detailDescription: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  detailMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailPrice: { fontFamily: 'Nunito-Bold', color: colors.reward.amber },
  detailClose: { marginTop: spacing.sm },
  detailCloseText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  gridRow: {
    gap: GAP,
    marginBottom: GAP,
  },

  itemCard: {
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  itemIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.base.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemName: {
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 13,
    color: colors.text.primary,
    textAlign: 'center',
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rarityText: {
    fontSize: 10,
    textTransform: 'capitalize' as any,
    color: colors.text.muted,
  },
  originText: {
    fontSize: 9,
    color: colors.text.muted,
    marginBottom: 2,
  },
  itemDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 10,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 6,
    lineHeight: 14,
  },
  ownedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(76, 175, 80, 0.12)',
  },
  ownedText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#4CAF50',
  },
  buyBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    backgroundColor: colors.reward.peach,
    borderRadius: 14,
  },
  buyBtnText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: colors.reward.gold,
  },

  swatchContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl * 3,
    paddingTop: spacing.xs,
  },
  swatchHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
  },
  swatchCard: {
    alignItems: 'center',
    gap: 4,
  },
  swatchColor: {
    width: 72,
    height: 72,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  swatchName: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  modalCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.lg,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
});

export default FurnitureShopScreen;
