import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
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
import { COSMETICS_CATALOG, COSMETIC_TYPES, RARITY_COLORS, RARITY_LABELS, ShopCosmetic } from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const { width } = Dimensions.get('window');
const COLUMN_GAP = spacing.md;
const CARD_WIDTH = (width - spacing.screenPadding * 2 - COLUMN_GAP) / 2;

type CosmeticShopScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export const CosmeticShopScreen: React.FC<CosmeticShopScreenProps> = ({ navigation }) => {
  const { user, visby, spendAura, equipCosmetic } = useStore();

  const [selectedType, setSelectedType] = useState<CosmeticType>('hat');
  const [previewItem, setPreviewItem] = useState<ShopCosmetic | null>(null);

  const ownedCosmetics = visby?.ownedCosmetics ?? [];
  const equipped = visby?.equipped ?? {};

  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [buyModalItem, setBuyModalItem] = useState<ShopCosmetic | null>(null);
  const [buyModalError, setBuyModalError] = useState<string | null>(null);

  const defaultAppearance = visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const previewEquipped = previewItem
    ? { ...equipped, [previewItem.type]: previewItem.id }
    : equipped;

  const filteredItems = COSMETICS_CATALOG.filter((c) => c.type === selectedType);

  const isOwned = (id: string) => ownedCosmetics.includes(id);
  const isEquipped = (cosmetic: ShopCosmetic) => equipped[cosmetic.type] === cosmetic.id;

  const handleBuy = (cosmetic: ShopCosmetic) => {
    if (isOwned(cosmetic.id)) return;
    setBuyModalItem(cosmetic);
    setBuyModalError(null);
    setBuyModalVisible(true);
  };

  const confirmBuy = () => {
    if (!buyModalItem) return;
    const success = spendAura(buyModalItem.price);
    if (!success) {
      setBuyModalError('Not enough Aura. Keep exploring to earn more!');
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
    setBuyModalVisible(false);
    setBuyModalItem(null);
  };

  const handleEquip = (cosmetic: ShopCosmetic) => {
    if (isEquipped(cosmetic)) {
      equipCosmetic(cosmetic.type, undefined);
      setPreviewItem(null);
    } else {
      equipCosmetic(cosmetic.type, cosmetic.id);
      setPreviewItem(null);
    }
  };

  const handlePreview = (cosmetic: ShopCosmetic) => {
    setPreviewItem((prev) => (prev?.id === cosmetic.id ? null : cosmetic));
  };

  const renderItem = ({ item }: { item: ShopCosmetic }) => {
    const owned = isOwned(item.id);
    const currentlyEquipped = isEquipped(item);
    const isPreviewing = previewItem?.id === item.id;

    return (
      <TouchableOpacity
        style={[styles.itemCard, isPreviewing && styles.itemCardActive]}
        onPress={() => handlePreview(item)}
        activeOpacity={0.8}
      >
        <View style={styles.itemEmojiContainer}>
          <Icon name={item.icon} size={28} color={colors.primary.wisteriaDark} />
        </View>

        <Text variant="bodySmall" style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.rarityRow}>
          <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
          <Caption color={RARITY_COLORS[item.rarity]}>{RARITY_LABELS[item.rarity]}</Caption>
        </View>

        {item.country && (
          <Caption color={colors.text.muted} style={styles.countryLabel}>
            {item.country}
          </Caption>
        )}

        <View style={styles.itemFooter}>
          {item.membersOnly && !owned ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="crown" size={14} color={colors.reward.gold} />
              <Text variant="caption" style={styles.membersLabel}>Members Only</Text>
            </View>
          ) : owned ? (
            currentlyEquipped ? (
              <Button
                title="Equipped"
                size="sm"
                variant="secondary"
                onPress={() => handleEquip(item)}
                fullWidth
              />
            ) : (
              <Button
                title="Equip"
                size="sm"
                variant="primary"
                onPress={() => handleEquip(item)}
                fullWidth
              />
            )
          ) : (
            <>
              <Text variant="caption" style={styles.priceText}>
                {item.price === 0 ? 'Free' : `${item.price}`}
              </Text>
              <Button
                title="Buy"
                size="sm"
                variant="reward"
                onPress={() => handleBuy(item)}
                fullWidth
                disabled={item.membersOnly}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.reward.peachLight]}
      style={styles.container}
      locations={[0, 0.5, 1]}
    >
      <FloatingParticles count={6} variant="sparkle" opacity={0.2} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Cosmetic Shop</Heading>
          <View style={styles.auraDisplay}>
            <Icon name="sparkles" size={18} color={colors.reward.gold} />
            <Text variant="body" style={styles.auraText}>{user?.aura ?? 0}</Text>
          </View>
        </View>

        {/* Character Preview */}
        <View style={styles.previewContainer}>
          <Card
            variant="gradient"
            gradientColors={[colors.primary.wisteriaFaded, colors.base.cream]}
            style={styles.previewCard}
          >
            <VisbyCharacter
              appearance={defaultAppearance}
              equipped={previewEquipped}
              mood="happy"
              size={120}
              animated
            />
            {previewItem && (
              <View style={styles.previewLabel}>
                <Text variant="caption" color={colors.primary.wisteriaDark}>
                  Previewing: {previewItem.name}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Type Tabs */}
        <View style={styles.tabsContainer}>
          {COSMETIC_TYPES.map((ct) => {
            const active = selectedType === ct.type;
            return (
              <TouchableOpacity
                key={ct.type}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => {
                  setSelectedType(ct.type);
                  setPreviewItem(null);
                }}
                activeOpacity={0.7}
              >
                <Text
                  variant="body"
                  style={[styles.tabText, active && styles.tabTextActive] as any}
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
          numColumns={2}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>

      <Modal
        visible={buyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setBuyModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setBuyModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {buyModalError ? (
              <>
                <Heading level={3}>Not Enough Aura</Heading>
                <Text variant="body" style={styles.modalBody}>{buyModalError}</Text>
                <View style={styles.modalActions}>
                  <Button size="sm" variant="primary" title="OK" onPress={() => setBuyModalVisible(false)} />
                </View>
              </>
            ) : buyModalItem ? (
              <>
                <Heading level={3}>Buy {buyModalItem.name}?</Heading>
                <Text variant="body" style={styles.modalBody}>
                  Cost: {buyModalItem.price} Aura{'\n'}Your balance: {user?.aura ?? 0} Aura
                </Text>
                <View style={styles.modalActions}>
                  <Button size="sm" variant="secondary" title="Cancel" onPress={() => setBuyModalVisible(false)} />
                  <Button size="sm" variant="reward" title="Buy" onPress={confirmBuy} />
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  auraDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    gap: spacing.xs,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  auraText: {
    fontWeight: '700',
    color: colors.text.primary,
  },

  // Preview
  previewContainer: {
    alignItems: 'center',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
  },
  previewCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    width: '100%',
  },
  previewLabel: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary.wisteriaLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: colors.primary.wisteria,
    shadowColor: colors.shadow.colored,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  tabTextActive: {
    color: colors.text.inverse,
  },

  // Grid
  gridRow: {
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding,
    marginBottom: COLUMN_GAP,
  },
  gridContent: {
    paddingBottom: spacing.xxxl,
  },

  // Item Card
  itemCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    padding: spacing.md,
    alignItems: 'center',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  itemCardActive: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  itemEmojiContainer: {
    width: 56,
    height: 56,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  itemName: {
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xxs,
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xxs,
  },
  rarityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  countryLabel: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  itemFooter: {
    width: '100%',
    marginTop: 'auto',
    paddingTop: spacing.sm,
    gap: spacing.xs,
    alignItems: 'center',
  },
  priceText: {
    fontWeight: '700',
    color: colors.reward.amber,
    textAlign: 'center',
  },
  membersLabel: {
    fontWeight: '600',
    color: colors.reward.gold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: spacing.xl,
    maxWidth: 360,
    width: '100%',
  },
  modalBody: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
});

export default CosmeticShopScreen;
