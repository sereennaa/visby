import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
  Platform,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import {
  getAvailableFurniture,
  WALLPAPER_OPTIONS,
  FLOORING_OPTIONS,
  COUNTRY_ORIGIN_NAMES,
} from '../../config/furniture';
import type { PlacedFurniture, FurnitureItem } from '../../types';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const COLLAPSED_HEIGHT = 210;
const EXPANDED_HEIGHT = Math.min(SCREEN_HEIGHT * 0.62, 540);
const SNAP_COLLAPSED = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;
const SNAP_EXPANDED = 0;
const SNAP_HIDDEN = EXPANDED_HEIGHT + 20;
const SPRING_CONFIG = { damping: 22, stiffness: 220, mass: 0.8 };

type PanelTab = 'furniture' | 'wallpaper' | 'flooring';
type FurnitureFilter = 'all' | 'functional' | 'decor' | 'wall' | 'floor' | 'owned';

const PLACEMENT_CYCLE = [
  { x: 50, y: 45 }, { x: 30, y: 35 }, { x: 70, y: 35 },
  { x: 40, y: 55 }, { x: 60, y: 55 }, { x: 25, y: 45 },
  { x: 75, y: 45 }, { x: 35, y: 25 }, { x: 65, y: 25 },
];

const FILTER_CHIPS: { key: FurnitureFilter; label: string; icon?: IconName }[] = [
  { key: 'all', label: 'All' },
  { key: 'functional', label: 'Functional', icon: 'sparkles' },
  { key: 'decor', label: 'Decor', icon: 'star' },
  { key: 'wall', label: 'Wall', icon: 'edit' },
  { key: 'floor', label: 'Floor', icon: 'home' },
  { key: 'owned', label: 'Owned', icon: 'check' },
];

const TAB_CONFIG: { key: PanelTab; label: string; icon: IconName }[] = [
  { key: 'furniture', label: 'Furniture', icon: 'home' },
  { key: 'wallpaper', label: 'Wall', icon: 'edit' },
  { key: 'flooring', label: 'Floor', icon: 'culture' },
];

interface FurniturePanelProps {
  visible: boolean;
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
  const [activeTab, setActiveTab] = useState<PanelTab>('furniture');
  const [filter, setFilter] = useState<FurnitureFilter>('all');
  const [search, setSearch] = useState('');
  const [notEnoughAuraFor, setNotEnoughAuraFor] = useState<string | null>(null);
  const placementIdx = useRef(0);
  const translateY = useSharedValue(SNAP_HIDDEN);
  const startY = useSharedValue(0);
  const prevVisible = useRef(false);

  useEffect(() => {
    if (visible && !prevVisible.current) {
      translateY.value = SNAP_HIDDEN;
      translateY.value = withSpring(SNAP_COLLAPSED, SPRING_CONFIG);
      setActiveTab('furniture');
      setFilter('all');
      setSearch('');
      setNotEnoughAuraFor(null);
      placementIdx.current = 0;
    } else if (!visible && prevVisible.current) {
      translateY.value = withTiming(SNAP_HIDDEN, { duration: 250 });
    }
    prevVisible.current = visible;
  }, [visible]);

  const collapseSheet = useCallback(() => {
    translateY.value = withSpring(SNAP_COLLAPSED, SPRING_CONFIG);
  }, []);

  const expandSheet = useCallback(() => {
    translateY.value = withSpring(SNAP_EXPANDED, SPRING_CONFIG);
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((e) => {
      translateY.value = Math.max(SNAP_EXPANDED, Math.min(SNAP_HIDDEN, startY.value + e.translationY));
    })
    .onEnd((e) => {
      const vel = e.velocityY;
      const pos = translateY.value;
      if (vel > 800) {
        if (pos > SNAP_COLLAPSED * 0.7) {
          translateY.value = withTiming(SNAP_HIDDEN, { duration: 250 });
          runOnJS(onClose)();
        } else {
          collapseSheet();
        }
      } else if (vel < -800) {
        expandSheet();
      } else {
        const distExp = Math.abs(pos - SNAP_EXPANDED);
        const distCol = Math.abs(pos - SNAP_COLLAPSED);
        if (distExp < distCol) {
          expandSheet();
        } else {
          collapseSheet();
        }
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const filteredFurniture = useMemo(() => {
    let items = [...getAvailableFurniture(visitedCountries)];

    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.description && i.description.toLowerCase().includes(q)) ||
          (i.countryOrigin && COUNTRY_ORIGIN_NAMES[i.countryOrigin]?.toLowerCase().includes(q)),
      );
    }

    switch (filter) {
      case 'functional':
        items = items.filter((i) => !!i.interactionType);
        break;
      case 'decor':
        items = items.filter((i) => i.category === 'decor');
        break;
      case 'wall':
        items = items.filter((i) => i.category === 'wall');
        break;
      case 'floor':
        items = items.filter((i) => i.category === 'floor');
        break;
      case 'owned':
        items = items.filter((i) => ownedFurniture.includes(i.id));
        break;
    }

    items.sort((a, b) => {
      const aOwned = ownedFurniture.includes(a.id) ? 0 : 1;
      const bOwned = ownedFurniture.includes(b.id) ? 0 : 1;
      if (aOwned !== bOwned) return aOwned - bOwned;
      const aFunc = a.interactionType ? 0 : 1;
      const bFunc = b.interactionType ? 0 : 1;
      if (aFunc !== bFunc) return aFunc - bFunc;
      return a.price - b.price;
    });

    return items;
  }, [visitedCountries, search, filter, ownedFurniture]);

  const handleBuy = useCallback(
    (item: FurnitureItem) => {
      setNotEnoughAuraFor(null);
      const ok = onBuyFurniture(item.id, item.price);
      if (!ok) setNotEnoughAuraFor(item.id);
      else Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
    [onBuyFurniture],
  );

  const handlePlace = useCallback(
    (item: FurnitureItem) => {
      const pos = PLACEMENT_CYCLE[placementIdx.current % PLACEMENT_CYCLE.length];
      placementIdx.current++;
      const placed: PlacedFurniture = {
        id: `${item.id}_${Date.now()}`,
        furnitureId: item.id,
        roomId,
        x: pos.x,
        y: pos.y,
        rotation: 0,
      };
      onPlaceFurniture(placed);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setNotEnoughAuraFor(null);
      collapseSheet();
    },
    [roomId, onPlaceFurniture, collapseSheet],
  );

  const handleTabPress = useCallback(
    (tab: PanelTab) => {
      setActiveTab(tab);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      expandSheet();
    },
    [expandSheet],
  );

  if (!visible) return null;

  const ownedCount = filteredFurniture.filter((i) => ownedFurniture.includes(i.id)).length;

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Animated.View style={[styles.sheet, sheetStyle]}>
        {/* Drag handle */}
        <GestureDetector gesture={panGesture}>
          <View style={styles.handleArea}>
            <View style={styles.handle} />
          </View>
        </GestureDetector>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {TAB_CONFIG.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, active && styles.tabBtnActive]}
                onPress={() => handleTabPress(tab.key)}
                activeOpacity={0.8}
              >
                <Icon
                  name={tab.icon}
                  size={16}
                  color={active ? '#FFFFFF' : colors.primary.wisteriaDark}
                />
                <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'furniture' && (
            <>
              {/* Search */}
              <View style={styles.searchRow}>
                <View style={styles.searchWrap}>
                  <Icon name="compass" size={14} color={colors.text.muted} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search furniture..."
                    placeholderTextColor={colors.text.muted}
                    value={search}
                    onChangeText={setSearch}
                    returnKeyType="search"
                    autoCorrect={false}
                  />
                  {search.length > 0 && (
                    <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Icon name="close" size={14} color={colors.text.muted} />
                    </TouchableOpacity>
                  )}
                </View>
                <Caption style={styles.countLabel}>
                  {ownedCount} owned
                </Caption>
              </View>

              {/* Filter chips */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
              >
                {FILTER_CHIPS.map((chip) => {
                  const active = filter === chip.key;
                  return (
                    <TouchableOpacity
                      key={chip.key}
                      style={[styles.filterChip, active && styles.filterChipActive]}
                      onPress={() => setFilter(chip.key)}
                      activeOpacity={0.8}
                    >
                      {chip.icon && (
                        <Icon
                          name={chip.icon}
                          size={12}
                          color={active ? '#FFFFFF' : colors.text.secondary}
                        />
                      )}
                      <Text
                        style={[
                          styles.filterChipText,
                          active && styles.filterChipTextActive,
                        ]}
                      >
                        {chip.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Furniture grid */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.grid}
                keyboardShouldPersistTaps="handled"
              >
                {filteredFurniture.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Icon name="home" size={32} color={colors.text.muted} />
                    <Text style={styles.emptyText}>
                      {search ? 'No furniture matches your search' : 'No furniture in this category'}
                    </Text>
                  </View>
                ) : (
                  filteredFurniture.map((item) => {
                    const owned = ownedFurniture.includes(item.id);
                    const isFunctional = !!item.interactionType;
                    const showNotEnough = notEnoughAuraFor === item.id;
                    return (
                      <View
                        key={item.id}
                        style={[styles.card, isFunctional && styles.cardFunctional]}
                      >
                        <View style={styles.iconWrap}>
                          {isFunctional ? (
                            <FurnitureVisual
                              interactionType={item.interactionType!}
                              icon={item.icon as IconName}
                              size="small"
                              showHint
                            />
                          ) : (
                            <Icon
                              name={item.icon as IconName}
                              size={28}
                              color={colors.text.primary}
                            />
                          )}
                        </View>
                        <Text style={styles.name} numberOfLines={1}>
                          {item.name}
                        </Text>
                        {isFunctional && item.interactionLabel && (
                          <Text style={styles.interactionHint} numberOfLines={2}>
                            {item.interactionLabel}
                          </Text>
                        )}
                        {item.countryOrigin && (
                          <Caption style={styles.origin}>
                            {COUNTRY_ORIGIN_NAMES[item.countryOrigin] ?? item.countryOrigin}
                          </Caption>
                        )}
                        <Caption style={styles.rarity}>{item.rarity}</Caption>
                        {owned ? (
                          <TouchableOpacity
                            style={styles.placeBtn}
                            onPress={() => handlePlace(item)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.placeBtnText}>Place</Text>
                          </TouchableOpacity>
                        ) : (
                          <>
                            <TouchableOpacity
                              style={styles.buyBtn}
                              onPress={() => handleBuy(item)}
                              activeOpacity={0.8}
                            >
                              <Text style={styles.buyBtnText}>
                                {item.price} Aura
                              </Text>
                            </TouchableOpacity>
                            {showNotEnough && (
                              <Text style={styles.notEnough}>
                                Not enough Aura
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    );
                  })
                )}
              </ScrollView>
            </>
          )}

          {activeTab === 'wallpaper' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.swatchScroll}
            >
              <Text style={styles.swatchHint}>
                Tap a color to preview it on your walls instantly.
              </Text>
              <View style={styles.swatchGrid}>
                {WALLPAPER_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.swatch,
                      { backgroundColor: opt.color },
                      currentWallColor === opt.color && styles.swatchActive,
                    ]}
                    onPress={() => {
                      onUpdateWallColor(opt.color);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    activeOpacity={0.8}
                  >
                    {currentWallColor === opt.color && (
                      <Icon name="check" size={16} color="#FFFFFF" />
                    )}
                    <Text style={styles.swatchLabel}>{opt.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}

          {activeTab === 'flooring' && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.swatchScroll}
            >
              <Text style={styles.swatchHint}>
                Choose a floor material — changes apply instantly.
              </Text>
              <View style={styles.swatchGrid}>
                {FLOORING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    style={[
                      styles.swatch,
                      { backgroundColor: opt.color },
                      currentFloorColor === opt.color && styles.swatchActive,
                    ]}
                    onPress={() => {
                      onUpdateFloorColor(opt.color);
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }}
                    activeOpacity={0.8}
                  >
                    {currentFloorColor === opt.color && (
                      <Icon name="check" size={16} color="#FFFFFF" />
                    )}
                    <Text style={styles.swatchLabel}>{opt.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 50,
    pointerEvents: 'box-none' as any,
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: EXPANDED_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px -4px 20px rgba(0,0,0,0.12)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 16,
        }),
  },
  handleArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.muted + '40',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.surface.lavender,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: colors.primary.wisteria,
    borderColor: colors.primary.wisteriaDark,
  },
  tabLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: colors.primary.wisteriaDark,
  },
  tabLabelActive: { color: '#FFFFFF' },

  content: {
    flex: 1,
    overflow: 'hidden',
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.base.cream,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.primary,
    padding: 0,
  },
  countLabel: {
    fontSize: 11,
    color: colors.text.muted,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: colors.base.cream,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  filterChipActive: {
    backgroundColor: colors.primary.wisteria,
    borderColor: colors.primary.wisteriaDark,
  },
  filterChipText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: colors.text.secondary,
  },
  filterChipTextActive: { color: '#FFFFFF' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },
  card: {
    width: '30%' as any,
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  cardFunctional: {
    borderColor: colors.primary.wisteria + '40',
    backgroundColor: colors.surface.lavender,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 10,
    color: colors.text.primary,
    textAlign: 'center',
  },
  interactionHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 9,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 1,
    maxWidth: '100%',
  },
  origin: {
    fontSize: 8,
    color: colors.primary.wisteria,
    marginTop: 1,
  },
  rarity: {
    fontSize: 9,
    color: colors.text.muted,
    textTransform: 'capitalize' as any,
    marginBottom: 4,
  },
  placeBtn: {
    paddingVertical: 4,
    paddingHorizontal: 14,
    backgroundColor: colors.primary.wisteria,
    borderRadius: 12,
  },
  placeBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: '#FFFFFF' },
  buyBtn: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: colors.reward.peach,
    borderRadius: 12,
  },
  buyBtnText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.reward.gold },
  notEnough: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: colors.status.error,
    marginTop: 2,
    textAlign: 'center',
  },

  emptyState: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: spacing.xl,
    gap: spacing.sm,
  },
  emptyText: {
    fontFamily: 'Nunito-Medium',
    fontSize: 13,
    color: colors.text.muted,
    textAlign: 'center',
  },

  swatchScroll: {
    paddingHorizontal: spacing.md,
    paddingBottom: 40,
  },
  swatchHint: {
    fontFamily: 'Nunito-Medium',
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  swatchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  swatch: {
    width: 68,
    height: 68,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 3px rgba(0,0,0,0.08)' }
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 2,
          elevation: 1,
        }),
  },
  swatchActive: {
    borderColor: colors.primary.wisteria,
    borderWidth: 3,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(184,165,224,0.5)' }
      : {
          shadowColor: colors.primary.wisteria,
          shadowOpacity: 0.4,
          shadowRadius: 8,
          elevation: 4,
        }),
  },
  swatchLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 9,
    color: colors.text.secondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
