import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { PulseGlow } from '../../components/effects/Shimmer';
import { useStore } from '../../store/useStore';
import { RootStackParamList, VisbyMood, CosmeticType } from '../../types';
import {
  COSMETICS_CATALOG,
  RARITY_COLORS,
  ShopCosmetic,
} from '../../config/cosmetics';

type AvatarScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Avatar'>;
};

const MOODS: { mood: VisbyMood; emoji: string }[] = [
  { mood: 'happy', emoji: '😊' },
  { mood: 'excited', emoji: '🤩' },
  { mood: 'curious', emoji: '🧐' },
  { mood: 'sleepy', emoji: '😴' },
  { mood: 'proud', emoji: '💪' },
  { mood: 'adventurous', emoji: '🗺️' },
  { mood: 'cozy', emoji: '☕' },
];

const SKIN_TONES = ['#FFDAB9', '#F5C8A0', '#E8B89D', '#D4A574', '#A67C52', '#8B5A3C'];
const HAIR_COLORS = ['#F7E07D', '#E8C55A', '#8B4513', '#A0522D', '#2F2F2F', '#D75C37', '#9B6FA6', '#6B9BC3', '#FFB6C1'];
const EYE_COLORS = ['#4A90D9', '#6B9B6B', '#8B4513', '#2F2F2F', '#9B6FA6', '#40E0D0'];

const WARDROBE_TABS: { type: CosmeticType; label: string; emoji: string }[] = [
  { type: 'hat', label: 'Hats', emoji: '🎩' },
  { type: 'outfit', label: 'Outfits', emoji: '👘' },
  { type: 'accessory', label: 'Items', emoji: '⚔️' },
];

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ navigation }) => {
  const { visby, updateVisbyAppearance, equipCosmetic } = useStore();
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

  const ownedItems = COSMETICS_CATALOG.filter(
    (c) => c.type === wardrobeTab && (owned.includes(c.id) || c.price === 0)
  );

  const isEquipped = (id: string, type: CosmeticType) => {
    return equipped[type] === id;
  };

  const toggleEquip = (item: ShopCosmetic) => {
    if (isEquipped(item.id, item.type)) {
      equipCosmetic(item.type, undefined);
    } else {
      equipCosmetic(item.type, item.id);
    }
  };

  const renderColorSwatches = (
    swatchColors: string[],
    selectedColor: string,
    onSelect: (color: string) => void,
  ) => (
    <View style={styles.swatchRow}>
      {swatchColors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelect(color)}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selectedColor === color && styles.swatchSelected,
          ]}
        />
      ))}
    </View>
  );

  return (
    <LinearGradient
      colors={['#FAF8FF', '#F0E8FF', '#FFF8F0', '#FAF8FF']}
      locations={[0, 0.3, 0.6, 1]}
      style={styles.container}
    >
      <FloatingParticles count={6} variant="sparkle" opacity={0.25} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={1}>Your Visby</Heading>
            <TouchableOpacity
              onPress={() => navigation.navigate('CosmeticShop')}
              style={styles.shopButton}
            >
              <Icon name="shirt" size={20} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
          </View>

          {/* Character Display */}
          <Card
            variant="gradient"
            gradientColors={[colors.primary.wisteriaFaded, colors.base.cream]}
            style={styles.characterCard}
          >
            <PulseGlow color="rgba(199, 184, 234, 0.5)" intensity={20} speed={3000}>
              <VisbyCharacter
                appearance={appearance}
                equipped={equipped}
                mood={selectedMood}
                size={200}
                animated={true}
              />
            </PulseGlow>
            <Text variant="h2" align="center" style={styles.visbyName}>
              {visby?.name || 'Your Visby'}
            </Text>
            <View style={styles.auraRow}>
              <Icon name="sparkles" size={16} color={colors.reward.gold} />
              <Text variant="caption" color={colors.reward.amber}>
                {useStore.getState().user?.aura || 0} Aura
              </Text>
            </View>
          </Card>

          {/* Mood Selector */}
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Mood</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.moodRow}>
                {MOODS.map(({ mood, emoji }) => (
                  <TouchableOpacity
                    key={mood}
                    onPress={() => setSelectedMood(mood)}
                    style={[
                      styles.moodButton,
                      selectedMood === mood && styles.moodButtonSelected,
                    ]}
                  >
                    <Text style={styles.moodEmoji}>{emoji}</Text>
                    <Caption>{mood}</Caption>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Card>

          {/* Wardrobe Section */}
          <View style={styles.wardrobeHeader}>
            <Heading level={2}>Wardrobe</Heading>
            <TouchableOpacity
              onPress={() => navigation.navigate('CosmeticShop')}
              style={styles.shopLink}
            >
              <Icon name="add" size={16} color={colors.primary.wisteriaDark} />
              <Text variant="caption" color={colors.primary.wisteriaDark}>Shop</Text>
            </TouchableOpacity>
          </View>

          {/* Wardrobe Tabs */}
          <View style={styles.tabRow}>
            {WARDROBE_TABS.map((tab) => (
              <TouchableOpacity
                key={tab.type}
                onPress={() => setWardrobeTab(tab.type)}
                style={[
                  styles.tab,
                  wardrobeTab === tab.type && styles.tabSelected,
                ]}
              >
                <Text style={styles.tabEmoji}>{tab.emoji}</Text>
                <Text
                  variant="caption"
                  color={wardrobeTab === tab.type ? colors.text.inverse : colors.text.secondary}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Wardrobe Items */}
          {ownedItems.length > 0 ? (
            <View style={styles.wardrobeGrid}>
              {/* "None" option to unequip */}
              <TouchableOpacity
                style={[
                  styles.wardrobeItem,
                  !equipped[wardrobeTab] && styles.wardrobeItemEquipped,
                ]}
                onPress={() => equipCosmetic(wardrobeTab, undefined)}
              >
                <Text style={styles.itemEmoji}>❌</Text>
                <Caption>None</Caption>
              </TouchableOpacity>
              {ownedItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.wardrobeItem,
                    isEquipped(item.id, item.type) && styles.wardrobeItemEquipped,
                  ]}
                  onPress={() => toggleEquip(item)}
                >
                  <Text style={styles.itemEmoji}>{item.emoji}</Text>
                  <Caption numberOfLines={1}>{item.name}</Caption>
                  <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[item.rarity] }]} />
                  {isEquipped(item.id, item.type) && (
                    <View style={styles.equippedBadge}>
                      <Icon name="check" size={10} color={colors.text.inverse} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Card style={styles.emptyWardrobe}>
              <Text variant="body" align="center" color={colors.text.secondary}>
                No {wardrobeTab}s yet!
              </Text>
              <Button
                title="Visit Shop"
                onPress={() => navigation.navigate('CosmeticShop')}
                variant="primary"
                size="sm"
              />
            </Card>
          )}

          {/* Appearance Section */}
          <Heading level={2} style={styles.appearanceTitle}>Appearance</Heading>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Skin Tone</Text>
            {renderColorSwatches(
              SKIN_TONES,
              appearance.skinTone,
              (color) => updateVisbyAppearance({ skinTone: color }),
            )}
          </Card>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Hair Color</Text>
            {renderColorSwatches(
              HAIR_COLORS,
              appearance.hairColor,
              (color) => updateVisbyAppearance({ hairColor: color }),
            )}
          </Card>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Eye Color</Text>
            {renderColorSwatches(
              EYE_COLORS,
              appearance.eyeColor,
              (color) => updateVisbyAppearance({ eyeColor: color }),
            )}
          </Card>

          {/* Quick links */}
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('AuraStore')}
            >
              <LinearGradient
                colors={[colors.reward.peachLight, colors.reward.peach]}
                style={styles.quickLinkGradient}
              >
                <Text style={{ fontSize: 24 }}>✨</Text>
                <Text variant="caption">Get Aura</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('Membership')}
            >
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.primary.wisteriaLight]}
                style={styles.quickLinkGradient}
              >
                <Text style={{ fontSize: 24 }}>👑</Text>
                <Text variant="caption">Membership</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl * 2 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.base.warmWhite,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.shadow.light, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  shopButton: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center', justifyContent: 'center',
  },
  characterCard: { alignItems: 'center', marginBottom: spacing.lg, paddingVertical: spacing.xl },
  visbyName: { marginTop: spacing.md },
  auraRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: spacing.xs },
  section: { marginBottom: spacing.md },
  sectionTitle: { marginBottom: spacing.md },
  moodRow: { flexDirection: 'row', gap: spacing.sm },
  moodButton: {
    alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.lg, borderWidth: 2, borderColor: colors.transparent,
  },
  moodButtonSelected: { borderColor: colors.primary.wisteria, backgroundColor: colors.primary.wisteriaFaded },
  moodEmoji: { fontSize: 28, marginBottom: spacing.xs },
  wardrobeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.md, marginTop: spacing.sm,
  },
  shopLink: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  tabRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.xs, paddingVertical: spacing.sm, borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
  },
  tabSelected: { backgroundColor: colors.primary.wisteriaDark },
  tabEmoji: { fontSize: 16 },
  wardrobeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  wardrobeItem: {
    width: '30%', alignItems: 'center', paddingVertical: spacing.md,
    backgroundColor: colors.base.cream, borderRadius: spacing.radius.xl,
    borderWidth: 2, borderColor: colors.transparent, position: 'relative',
  },
  wardrobeItemEquipped: { borderColor: colors.primary.wisteria, backgroundColor: colors.primary.wisteriaFaded },
  itemEmoji: { fontSize: 32, marginBottom: spacing.xs },
  rarityDot: { width: 6, height: 6, borderRadius: 3, marginTop: spacing.xxs },
  equippedBadge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: colors.primary.wisteriaDark, borderRadius: 8,
    width: 16, height: 16, alignItems: 'center', justifyContent: 'center',
  },
  emptyWardrobe: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.xl, marginBottom: spacing.lg },
  appearanceTitle: { marginBottom: spacing.md, marginTop: spacing.sm },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  swatch: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: colors.transparent },
  swatchSelected: { borderColor: colors.primary.wisteriaDark, borderWidth: 3 },
  quickLinks: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  quickLink: { flex: 1, borderRadius: spacing.radius.xl, overflow: 'hidden' },
  quickLinkGradient: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs },
});

export default AvatarScreen;
