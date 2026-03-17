import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getAvailableFurniture, WALLPAPER_OPTIONS, FLOORING_OPTIONS } from '../../config/furniture';
import type { PlacedFurniture, FurnitureItem } from '../../types';

type PanelType = 'furniture' | 'wallpaper' | 'flooring';

interface FurniturePanelProps {
  visible: boolean;
  panelType: PanelType;
  onClose: () => void;
  visitedCountries: string[];
  ownedFurniture: string[];
  onBuyFurniture: (id: string, price: number) => boolean;
  onPlaceFurniture: (item: PlacedFurniture) => void;
  onUpdateWallColor: (color: string) => void;
  onUpdateFloorColor: (color: string) => void;
  currentWallColor: string;
  currentFloorColor: string;
  roomId: string;
}

export const FurniturePanel = React.memo<FurniturePanelProps>(({
  visible,
  panelType,
  onClose,
  visitedCountries,
  ownedFurniture,
  onBuyFurniture,
  onPlaceFurniture,
  onUpdateWallColor,
  onUpdateFloorColor,
  currentWallColor,
  currentFloorColor,
  roomId,
}) => {
  const [notEnoughAuraFor, setNotEnoughAuraFor] = useState<string | null>(null);

  const availableFurniture = useMemo(
    () => [...getAvailableFurniture(visitedCountries)].sort(
      (a, b) => (a.interactionType ? 0 : 1) - (b.interactionType ? 0 : 1)
    ),
    [visitedCountries],
  );

  const handleBuy = useCallback((item: FurnitureItem) => {
    setNotEnoughAuraFor(null);
    const ok = onBuyFurniture(item.id, item.price);
    if (!ok) setNotEnoughAuraFor(item.id);
  }, [onBuyFurniture]);

  const handlePlace = useCallback((item: FurnitureItem) => {
    const placed: PlacedFurniture = {
      id: `${item.id}_${Date.now()}`,
      furnitureId: item.id,
      roomId,
      x: 50,
      y: 50,
      rotation: 0,
    };
    onPlaceFurniture(placed);
    onClose();
    setNotEnoughAuraFor(null);
  }, [roomId, onPlaceFurniture, onClose]);

  if (!visible) return null;

  const title = panelType === 'furniture' ? 'Furniture' : panelType === 'wallpaper' ? 'Wallpaper' : 'Flooring';

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay} onPress={() => { onClose(); setNotEnoughAuraFor(null); }}>
        <Pressable style={styles.panel} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Heading level={3}>{title}</Heading>
            <TouchableOpacity onPress={() => { onClose(); setNotEnoughAuraFor(null); }}>
              <Icon name="close" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          {panelType === 'furniture' && (
            <>
              <Text style={styles.hint}>
                Place in your room — tap tables, stoves & beds to fill Visby's needs and earn Aura.
                Traditional furniture unlocks when you visit new places!
              </Text>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.grid}>
                {availableFurniture.map((item) => {
                  const owned = ownedFurniture.includes(item.id);
                  const isFunctional = !!item.interactionType;
                  const showNotEnough = notEnoughAuraFor === item.id;
                  return (
                    <View key={item.id} style={[styles.card, isFunctional && styles.cardFunctional]}>
                      <View style={styles.iconWrap}>
                        {isFunctional ? (
                          <FurnitureVisual interactionType={item.interactionType!} icon={item.icon as IconName} size="small" showHint />
                        ) : (
                          <Icon name={item.icon as IconName} size={32} color={colors.text.primary} />
                        )}
                      </View>
                      <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                      {isFunctional && item.interactionLabel && (
                        <Text style={styles.interactionHint} numberOfLines={2}>{item.interactionLabel}</Text>
                      )}
                      <Caption style={styles.rarity}>{item.rarity}</Caption>
                      {owned ? (
                        <TouchableOpacity style={styles.placeBtn} onPress={() => handlePlace(item)} activeOpacity={0.8}>
                          <Text style={styles.placeBtnText}>Place</Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          <TouchableOpacity style={styles.buyBtn} onPress={() => handleBuy(item)} activeOpacity={0.8}>
                            <Text style={styles.buyBtnText}>{item.price} Aura</Text>
                          </TouchableOpacity>
                          {showNotEnough && (
                            <Text style={styles.notEnough}>Need {item.price} Aura</Text>
                          )}
                        </>
                      )}
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}

          {panelType === 'wallpaper' && (
            <View style={styles.swatchGrid}>
              {WALLPAPER_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.swatch, { backgroundColor: opt.color }, currentWallColor === opt.color && styles.swatchActive]}
                  onPress={() => onUpdateWallColor(opt.color)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.swatchLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {panelType === 'flooring' && (
            <View style={styles.swatchGrid}>
              {FLOORING_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.swatch, { backgroundColor: opt.color }, currentFloorColor === opt.color && styles.swatchActive]}
                  onPress={() => onUpdateFloorColor(opt.color)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.swatchLabel}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  hint: {
    fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.secondary,
    marginBottom: spacing.sm, paddingHorizontal: 2,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingBottom: spacing.lg },
  card: {
    width: '30%' as any, alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.base.cream, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  cardFunctional: {
    borderColor: colors.primary.wisteria + '40',
    backgroundColor: colors.surface.lavender,
  },
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 4,
  },
  name: { fontFamily: 'Nunito-SemiBold', fontSize: 10, color: colors.text.primary, textAlign: 'center' },
  interactionHint: {
    fontFamily: 'Nunito-Medium', fontSize: 9, color: colors.text.secondary,
    textAlign: 'center', marginTop: 2, maxWidth: '100%',
  },
  rarity: { fontSize: 9, color: colors.text.muted, textTransform: 'capitalize' as any, marginBottom: 4 },
  notEnough: {
    fontFamily: 'Nunito-SemiBold', fontSize: 10, color: colors.status.error,
    marginTop: 4, textAlign: 'center',
  },
  placeBtn: {
    paddingVertical: 4, paddingHorizontal: 14,
    backgroundColor: colors.primary.wisteria, borderRadius: 12,
  },
  placeBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: '#FFFFFF' },
  buyBtn: {
    paddingVertical: 4, paddingHorizontal: 10,
    backgroundColor: colors.reward.peach, borderRadius: 12,
  },
  buyBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.reward.gold },
  swatchGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    justifyContent: 'center', paddingBottom: spacing.md,
  },
  swatch: {
    width: 68, height: 68, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'transparent',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08, shadowRadius: 2, elevation: 1,
  },
  swatchActive: {
    borderColor: colors.primary.wisteria, borderWidth: 3,
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
  swatchLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 9, color: colors.text.secondary, textAlign: 'center' },
});
