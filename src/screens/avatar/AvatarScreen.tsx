import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeIn,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { PulseGlow, MagicBorder } from '../../components/effects/Shimmer';
import { useStore } from '../../store/useStore';
import { RootStackParamList, VisbyMood, CosmeticType } from '../../types';
import {
  COSMETICS_CATALOG,
  RARITY_COLORS,
  RARITY_LABELS,
  ShopCosmetic,
} from '../../config/cosmetics';

const { width: SCREEN_W } = Dimensions.get('window');

type AvatarScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Avatar'>;
};

const MOODS: { mood: VisbyMood; label: string; emoji: string; color: string; bg: string }[] = [
  { mood: 'happy', label: 'Happy', emoji: '😊', color: '#FFB020', bg: '#FFF6E0' },
  { mood: 'excited', label: 'Excited', emoji: '🤩', color: '#FF6B8A', bg: '#FFF0F3' },
  { mood: 'curious', label: 'Curious', emoji: '🧐', color: '#6B9BD9', bg: '#EDF4FF' },
  { mood: 'sleepy', label: 'Sleepy', emoji: '😴', color: '#9B8EC4', bg: '#F0ECF9' },
  { mood: 'proud', label: 'Proud', emoji: '😎', color: '#5CB85C', bg: '#EEFAEE' },
  { mood: 'adventurous', label: 'Adventure', emoji: '⚔️', color: '#E07040', bg: '#FFF0E8' },
  { mood: 'cozy', label: 'Cozy', emoji: '🧸', color: '#D4886B', bg: '#FFF4EE' },
];

const SKIN_TONES: { color: string; label: string }[] = [
  { color: '#FFDAB9', label: 'Peach' },
  { color: '#F5C8A0', label: 'Apricot' },
  { color: '#E8B89D', label: 'Sand' },
  { color: '#D4A574', label: 'Caramel' },
  { color: '#A67C52', label: 'Cocoa' },
  { color: '#8B5A3C', label: 'Chestnut' },
];

const HAIR_COLORS: { color: string; label: string }[] = [
  { color: '#F7E07D', label: 'Gold' },
  { color: '#E8C55A', label: 'Honey' },
  { color: '#8B4513', label: 'Brown' },
  { color: '#A0522D', label: 'Auburn' },
  { color: '#2F2F2F', label: 'Black' },
  { color: '#D75C37', label: 'Red' },
  { color: '#9B6FA6', label: 'Purple' },
  { color: '#6B9BC3', label: 'Blue' },
  { color: '#FFB6C1', label: 'Pink' },
];

const EYE_COLORS: { color: string; label: string }[] = [
  { color: '#4A90D9', label: 'Sky' },
  { color: '#6B9B6B', label: 'Forest' },
  { color: '#8B4513', label: 'Hazel' },
  { color: '#2F2F2F', label: 'Onyx' },
  { color: '#9B6FA6', label: 'Violet' },
  { color: '#40E0D0', label: 'Aqua' },
];

const HAIR_STYLES: { id: string; label: string; icon: string }[] = [
  { id: 'default', label: 'Viking', icon: '⚔️' },
  { id: 'short', label: 'Short', icon: '✂️' },
  { id: 'long', label: 'Long', icon: '🧜' },
  { id: 'curly', label: 'Curly', icon: '🌀' },
  { id: 'braids', label: 'Braids', icon: '🎀' },
  { id: 'bun', label: 'Bun', icon: '🍡' },
];

const EYE_SHAPES: { id: string; label: string; icon: string }[] = [
  { id: 'round', label: 'Round', icon: '⭕' },
  { id: 'almond', label: 'Almond', icon: '🌰' },
  { id: 'big', label: 'Big', icon: '👀' },
  { id: 'sleepy', label: 'Sleepy', icon: '😌' },
  { id: 'sparkle', label: 'Sparkle', icon: '✨' },
];

const WARDROBE_TABS: { type: CosmeticType; label: string; icon: IconName }[] = [
  { type: 'hat', label: 'Hats', icon: 'crown' },
  { type: 'outfit', label: 'Outfits', icon: 'shirt' },
  { type: 'accessory', label: 'Items', icon: 'viking' },
];

const RARITY_GLOW: Record<string, string> = {
  common: 'transparent',
  uncommon: 'rgba(92, 184, 92, 0.15)',
  rare: 'rgba(74, 144, 217, 0.15)',
  epic: 'rgba(155, 89, 182, 0.2)',
  legendary: 'rgba(255, 215, 0, 0.25)',
};

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ navigation }) => {
  const { visby, updateVisbyAppearance, equipCosmetic, setVisbyMood } = useStore();
  const [selectedMood, setSelectedMood] = useState<VisbyMood>(visby?.currentMood || 'happy');
  const [wardrobeTab, setWardrobeTab] = useState<CosmeticType>('hat');

  const appearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const equipped = visby?.equipped || {};
  const owned = visby?.ownedCosmetics || [];
  const aura = useStore.getState().user?.aura || 0;

  const ownedItems = COSMETICS_CATALOG.filter(
    (c) => c.type === wardrobeTab && (owned.includes(c.id) || c.price === 0)
  );

  const isEquipped = (id: string, type: CosmeticType) => equipped[type] === id;

  const toggleEquip = useCallback((item: ShopCosmetic) => {
    if (isEquipped(item.id, item.type)) {
      equipCosmetic(item.type, undefined);
    } else {
      equipCosmetic(item.type, item.id);
    }
  }, [equipped, equipCosmetic]);

  const handleMoodSelect = useCallback((mood: VisbyMood) => {
    setSelectedMood(mood);
    setVisbyMood(mood);
  }, [setVisbyMood]);

  const renderColorSwatches = (
    swatches: { color: string; label: string }[],
    selectedColor: string,
    onSelect: (color: string) => void,
  ) => (
    <View style={styles.swatchRow}>
      {swatches.map(({ color, label }) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelect(color)}
          style={styles.swatchContainer}
          accessibilityLabel={`Select ${label}`}
          accessibilityRole="button"
        >
          <View
            style={[
              styles.swatch,
              { backgroundColor: color },
              selectedColor === color && styles.swatchSelected,
            ]}
          >
            {selectedColor === color && (
              <Icon name="check" size={14} color={isLightColor(color) ? '#2D2D3A' : '#FFFFFF'} />
            )}
          </View>
          <Text variant="caption" align="center" style={styles.swatchLabel}>
            {label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#FAF8FF', '#EDE4FF', '#FFF3EE', '#F0ECFF', '#FAF8FF']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      <FloatingParticles count={10} variant="mixed" opacity={0.3} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Icon name="chevronLeft" size={22} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text variant="caption" color={colors.primary.wisteriaDark} style={styles.headerSubtitle}>
                Customize
              </Text>
              <Heading level={1}>Your Visby</Heading>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CosmeticShop')}
              style={styles.shopButton}
              accessibilityRole="button"
              accessibilityLabel="Open shop"
            >
              <Icon name="shirt" size={18} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
          </View>

          {/* Character Display */}
          <MagicBorder
            borderRadius={28}
            borderWidth={2}
            colors={['#C7B8EA', '#FFD700', '#7FBDE8', '#FFB6C1', '#C7B8EA']}
            style={styles.characterBorder}
          >
            <LinearGradient
              colors={['#F5F0FF', '#FFF6EE', '#F0ECFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.characterGradient}
            >
              <PulseGlow color="rgba(199, 184, 234, 0.6)" intensity={24} speed={3000}>
                <VisbyCharacter
                  appearance={appearance}
                  equipped={equipped}
                  mood={selectedMood}
                  size={220}
                  animated={true}
                />
              </PulseGlow>
              <Text variant="h2" align="center" style={styles.visbyName}>
                {visby?.name || 'Your Visby'}
              </Text>
              <View style={styles.auraRow}>
                <View style={styles.auraPill}>
                  <Icon name="sparkles" size={14} color={colors.reward.gold} />
                  <Text variant="caption" color={colors.reward.amber} style={styles.auraText}>
                    {aura} Aura
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </MagicBorder>

          {/* Mood Selector */}
          <SectionHeader icon="sparkles" title="Mood" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodScroll}
          >
            {MOODS.map(({ mood, label, emoji, color, bg }) => {
              const active = selectedMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  onPress={() => handleMoodSelect(mood)}
                  style={[
                    styles.moodChip,
                    { backgroundColor: active ? bg : colors.base.cream },
                    active && { borderColor: color },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Set mood to ${label}`}
                  accessibilityState={{ selected: active }}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Text
                    variant="caption"
                    color={active ? color : colors.text.secondary}
                    style={active ? styles.moodLabelActive : undefined}
                  >
                    {label}
                  </Text>
                  {active && <View style={[styles.moodDot, { backgroundColor: color }]} />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Wardrobe */}
          <View style={styles.wardrobeHeader}>
            <View style={styles.wardrobeHeaderLeft}>
              <Icon name="star" size={18} color={colors.reward.gold} />
              <Heading level={2} style={styles.wardrobeTitle}>Wardrobe</Heading>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('CosmeticShop')}
              style={styles.shopLink}
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.primary.wisteriaLight]}
                style={styles.shopLinkGradient}
              >
                <Icon name="add" size={14} color={colors.primary.wisteriaDark} />
                <Text variant="caption" color={colors.primary.wisteriaDark}>Shop</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Wardrobe Tabs */}
          <View style={styles.tabRow}>
            {WARDROBE_TABS.map((tab) => {
              const active = wardrobeTab === tab.type;
              return (
                <TouchableOpacity
                  key={tab.type}
                  onPress={() => setWardrobeTab(tab.type)}
                  style={[styles.tab, active && styles.tabSelected]}
                >
                  <Icon
                    name={tab.icon}
                    size={15}
                    color={active ? '#FFFFFF' : colors.text.muted}
                  />
                  <Text
                    variant="caption"
                    color={active ? '#FFFFFF' : colors.text.muted}
                    style={active ? styles.tabLabelActive : undefined}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Wardrobe Items */}
          {ownedItems.length > 0 ? (
            <View style={styles.wardrobeGrid}>
              {/* "None" to unequip */}
              <TouchableOpacity
                style={[
                  styles.wardrobeItem,
                  !equipped[wardrobeTab] && styles.wardrobeItemActive,
                ]}
                onPress={() => equipCosmetic(wardrobeTab, undefined)}
                accessibilityRole="button"
                accessibilityLabel="Unequip"
              >
                <View style={styles.wardrobeItemInner}>
                  <View style={styles.wardrobeIconCircle}>
                    <Icon name="close" size={20} color={colors.text.muted} />
                  </View>
                  <Caption style={styles.wardrobeItemName}>None</Caption>
                </View>
                {!equipped[wardrobeTab] && (
                  <View style={styles.equippedBadge}>
                    <Icon name="check" size={10} color="#FFFFFF" />
                  </View>
                )}
              </TouchableOpacity>

              {ownedItems.map((item) => {
                const active = isEquipped(item.id, item.type);
                const rarityColor = RARITY_COLORS[item.rarity];
                const rarityGlow = RARITY_GLOW[item.rarity];
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.wardrobeItem,
                      active && styles.wardrobeItemActive,
                      { backgroundColor: active ? rarityGlow : colors.base.cream },
                      active && { borderColor: rarityColor },
                    ]}
                    onPress={() => toggleEquip(item)}
                    accessibilityRole="button"
                    accessibilityLabel={`${active ? 'Unequip' : 'Equip'} ${item.name}`}
                  >
                    <View style={styles.wardrobeItemInner}>
                      <View style={[styles.wardrobeIconCircle, { backgroundColor: `${rarityColor}18` }]}>
                        <Icon name={item.icon} size={26} color={rarityColor} />
                      </View>
                      <Caption numberOfLines={1} style={styles.wardrobeItemName}>{item.name}</Caption>
                      <View style={styles.rarityRow}>
                        <View style={[styles.rarityDot, { backgroundColor: rarityColor }]} />
                        <Text
                          variant="caption"
                          color={rarityColor}
                          style={styles.rarityText}
                        >
                          {RARITY_LABELS[item.rarity]}
                        </Text>
                      </View>
                    </View>
                    {active && (
                      <View style={[styles.equippedBadge, { backgroundColor: rarityColor }]}>
                        <Icon name="check" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Card style={styles.emptyWardrobe}>
              <Text variant="h3" align="center">No {wardrobeTab}s yet!</Text>
              <Text variant="body" align="center" color={colors.text.secondary} style={styles.emptyText}>
                Visit the shop to find treasures
              </Text>
              <Button
                title="Browse Shop"
                onPress={() => navigation.navigate('CosmeticShop')}
                variant="primary"
                size="sm"
              />
            </Card>
          )}

          {/* Appearance Section */}
          <SectionHeader icon="star" title="Appearance" />

          <Card variant="magic" style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text variant="h3">Skin Tone</Text>
            </View>
            {renderColorSwatches(
              SKIN_TONES,
              appearance.skinTone,
              (color) => updateVisbyAppearance({ skinTone: color }),
            )}
          </Card>

          <Card variant="magic" style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text variant="h3">Hair Color</Text>
            </View>
            {renderColorSwatches(
              HAIR_COLORS,
              appearance.hairColor,
              (color) => updateVisbyAppearance({ hairColor: color }),
            )}
          </Card>

          <Card variant="magic" style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text variant="h3">Hair Style</Text>
            </View>
            <View style={styles.styleRow}>
              {HAIR_STYLES.map((style) => {
                const active = appearance.hairStyle === style.id;
                return (
                  <TouchableOpacity
                    key={style.id}
                    onPress={() => updateVisbyAppearance({ hairStyle: style.id })}
                    style={[
                      styles.styleChip,
                      active && styles.styleChipSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${style.label} hair style`}
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={styles.styleEmoji}>{style.icon}</Text>
                    <Caption color={active ? colors.primary.wisteriaDark : colors.text.secondary}>
                      {style.label}
                    </Caption>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          <Card variant="magic" style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text variant="h3">Eye Color</Text>
            </View>
            {renderColorSwatches(
              EYE_COLORS,
              appearance.eyeColor,
              (color) => updateVisbyAppearance({ eyeColor: color }),
            )}
          </Card>

          <Card variant="magic" style={styles.section}>
            <View style={styles.sectionTitleRow}>
              <Text variant="h3">Eye Shape</Text>
            </View>
            <View style={styles.styleRow}>
              {EYE_SHAPES.map((shape) => {
                const active = appearance.eyeShape === shape.id;
                return (
                  <TouchableOpacity
                    key={shape.id}
                    onPress={() => updateVisbyAppearance({ eyeShape: shape.id })}
                    style={[
                      styles.styleChip,
                      active && styles.styleChipSelected,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`Select ${shape.label} eye shape`}
                    accessibilityState={{ selected: active }}
                  >
                    <Text style={styles.styleEmoji}>{shape.icon}</Text>
                    <Caption color={active ? colors.primary.wisteriaDark : colors.text.secondary}>
                      {shape.label}
                    </Caption>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card>

          {/* Quick Links */}
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('AuraStore')}
            >
              <LinearGradient
                colors={['#FFF6E0', '#FFE8B0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickLinkGradient}
              >
                <View style={styles.quickLinkIcon}>
                  <Icon name="sparkles" size={22} color={colors.reward.gold} />
                </View>
                <Text variant="caption" color={colors.reward.amber}>Get Aura</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('Membership')}
            >
              <LinearGradient
                colors={['#F0ECFF', '#DDD4F2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.quickLinkGradient}
              >
                <View style={styles.quickLinkIcon}>
                  <Icon name="crown" size={22} color={colors.primary.wisteriaDark} />
                </View>
                <Text variant="caption" color={colors.primary.wisteriaDark}>Membership</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const SectionHeader: React.FC<{ icon: IconName; title: string }> = ({ icon, title }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionDivider} />
    <View style={styles.sectionHeaderContent}>
      <Icon name={icon} size={14} color={colors.reward.gold} />
      <Heading level={2} style={styles.sectionHeaderText}>{title}</Heading>
      <Icon name={icon} size={14} color={colors.reward.gold} />
    </View>
    <View style={styles.sectionDivider} />
  </View>
);

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

const ITEM_WIDTH = (SCREEN_W - spacing.screenPadding * 2 - spacing.sm * 2) / 3;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl * 2 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  backButton: {
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
  shopButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Character
  characterBorder: {
    marginBottom: spacing.xl,
  },
  characterGradient: {
    alignItems: 'center',
    paddingVertical: spacing.xl + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: 26,
  },
  visbyName: { marginTop: spacing.md },
  auraRow: { marginTop: spacing.sm },
  auraPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs + 2,
    backgroundColor: 'rgba(255,215,0,0.12)',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.round,
  },
  auraText: { fontWeight: '700' },

  // Mood
  moodScroll: {
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  moodChip: {
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 72,
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: 2,
  },
  moodLabelActive: {
    fontWeight: '700',
  },
  moodDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 4,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(184, 165, 224, 0.2)',
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  sectionHeaderText: {
    marginBottom: 0,
  },

  // Wardrobe
  wardrobeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  wardrobeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  wardrobeTitle: {
    marginBottom: 0,
  },
  shopLink: {
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  shopLinkGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
  },
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm + 2,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  tabSelected: {
    backgroundColor: colors.primary.wisteriaDark,
    borderColor: colors.primary.wisteriaDark,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  wardrobeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  wardrobeItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
    ...(Platform.OS !== 'web'
      ? { shadowColor: 'rgba(0,0,0,0.04)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 1 }
      : {}),
  },
  wardrobeItemActive: {
    borderWidth: 2,
  },
  wardrobeItemInner: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  wardrobeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(184, 165, 224, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wardrobeItemName: {
    textAlign: 'center',
  },
  rarityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  rarityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  rarityText: {
    fontSize: 9,
    fontWeight: '600',
  },
  equippedBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: colors.primary.wisteriaDark,
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyWardrobe: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  emptyText: {
    marginTop: -spacing.xs,
  },

  // Appearance
  section: {
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  swatchContainer: {
    alignItems: 'center',
    gap: 4,
  },
  swatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchSelected: {
    borderWidth: 3,
    borderColor: colors.primary.wisteriaDark,
  },
  swatchLabel: {
    fontSize: 9,
    marginTop: 1,
  },
  styleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  styleChip: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: colors.base.parchment,
    minWidth: 68,
    gap: 2,
  },
  styleChipSelected: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  styleEmoji: {
    fontSize: 18,
  },

  // Quick Links
  quickLinks: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  quickLink: {
    flex: 1,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  quickLinkGradient: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.xs,
  },
  quickLinkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
});

export default AvatarScreen;
