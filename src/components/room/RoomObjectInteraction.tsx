import React from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { ZoomIn, FadeIn, FadeOut, FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon, IconName } from '../ui/Icon';
import { FurnitureVisual } from '../furniture/FurnitureVisual';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { RoomObject } from '../../config/countryRooms';
import type { FurnitureItem, PlacedFurniture } from '../../types';
import type { FurnitureInteractionType } from '../../types';

interface ObjectDetailModalProps {
  object: RoomObject | null;
  multiplier: number;
  onClose: () => void;
}

export const ObjectDetailModal = React.memo<ObjectDetailModalProps>(({
  object,
  multiplier,
  onClose,
}) => {
  if (!object) return null;
  return (
    <Modal visible={!!object} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()} exiting={FadeOut.duration(200)}>
        <Pressable style={styles.contentWithImage} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[colors.surface.lavender, colors.base.cream]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          {object.imageUrl ? (
            <Animated.View entering={FadeIn.duration(300)} style={styles.objectImageWrap}>
              <Image
                source={{ uri: object.imageUrl }}
                style={styles.objectImage}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
              <View style={styles.objectImageOverlay} />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.duration(300).delay(50)} style={styles.iconRowLarge}>
              <View style={styles.iconCircle}>
                <Icon name={object.icon as IconName} size={48} color={colors.primary.wisteriaDark} />
              </View>
            </Animated.View>
          )}
          <Animated.View entering={FadeInDown.duration(350).delay(100)} style={styles.contentBody}>
            <Animated.View entering={FadeInDown.duration(250).delay(150)} style={styles.didYouKnowBadge}>
              <Icon name="sparkles" size={14} color={colors.reward.gold} />
              <Text style={styles.didYouKnowText}>Did you know?</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(250).delay(200)}>
              <Heading level={3} style={{ textAlign: 'center' }}>{object.learnTitle ?? object.label}</Heading>
            </Animated.View>
            <Animated.View entering={FadeInDown.duration(250).delay(250)}>
              <Text variant="body" style={styles.body}>
                {object.learnContent ?? `This is a ${object.label}.`}
              </Text>
            </Animated.View>
            {object.auraReward != null && (
              <Animated.View entering={FadeInDown.duration(250).delay(300)} style={styles.auraRow}>
                <Icon name="sparkles" size={16} color={colors.reward.gold} />
                <Text style={styles.auraText}>
                  +{Math.round(object.auraReward * multiplier)} Aura earned!
                </Text>
              </Animated.View>
            )}
            <Animated.View entering={FadeInDown.duration(250).delay(350)} style={styles.actions}>
              <Button size="sm" variant="primary" title="Cool!" onPress={onClose} />
            </Animated.View>
          </Animated.View>
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

interface FurnitureInteractionModalProps {
  interaction: { placed: PlacedFurniture; catalogItem: FurnitureItem } | null;
  multiplier: number;
  streak: number;
  onUse: (type: FurnitureInteractionType, aura: number) => void;
  onClose: () => void;
}

export const FurnitureInteractionModal = React.memo<FurnitureInteractionModalProps>(({
  interaction,
  multiplier,
  streak,
  onUse,
  onClose,
}) => {
  if (!interaction) return null;
  const { catalogItem } = interaction;
  const type = catalogItem.interactionType!;
  const needLabel = type === 'table' || type === 'stove' ? 'Hunger' : type === 'bed' ? 'Energy' : type === 'toy' ? 'Happiness' : 'Knowledge';
  const aura = catalogItem.interactionAura ?? 15;
  const totalAura = Math.round(aura * multiplier);

  return (
    <Modal visible={!!interaction} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()} exiting={FadeOut.duration(200)}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[colors.surface.lavender, colors.base.cream]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Animated.View entering={FadeInDown.duration(250).delay(50)} style={styles.iconRow}>
            <FurnitureVisual interactionType={type} icon={catalogItem.icon as IconName} size="large" showHint />
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(250).delay(100)}>
            <Heading level={3}>{catalogItem.interactionLabel ?? `Use ${catalogItem.name}`}</Heading>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(250).delay(150)}>
            <Text variant="body" style={styles.body}>
              Your Visby will love this. Fills {needLabel} and earns you Aura.
            </Text>
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(250).delay(200)} style={[styles.auraRow, { marginBottom: spacing.md }]}>
            <Text style={styles.auraText}>+{totalAura} Aura</Text>
            {multiplier > 1 && (
              <Text style={styles.auraSubtext}>{multiplier.toFixed(1)}x streak bonus</Text>
            )}
          </Animated.View>
          <Animated.View entering={FadeInDown.duration(250).delay(250)} style={styles.actions}>
            <Button size="sm" variant="secondary" title="Cancel" onPress={onClose} />
            <Button size="sm" variant="primary" title="Do it!" onPress={() => onUse(type, aura)} />
          </Animated.View>
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

interface MicroEventModalProps {
  visible: boolean;
  aura?: number;
  isRare?: boolean;
  onClose: () => void;
}

export const MicroEventModal = React.memo<MicroEventModalProps>(({
  visible,
  aura = 5,
  isRare = false,
  onClose,
}) => {
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()}>
        <Pressable style={styles.microCard} onPress={(e) => e.stopPropagation()}>
          <LinearGradient colors={[colors.reward.peachLight, colors.primary.wisteriaFaded]} style={StyleSheet.absoluteFill} />
          <Icon name={isRare ? 'sparkles' : 'star'} size={40} color={isRare ? colors.reward.gold : colors.reward.amber} />
          <Heading level={3} style={styles.microTitle}>
            {isRare ? 'Rare find!' : 'Visby found something!'}
          </Heading>
          <Text variant="body" color={colors.text.secondary} style={styles.microSub}>+{aura} Aura</Text>
          <Button title="Awesome!" onPress={onClose} variant="primary" size="sm" />
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

interface GamesModalProps {
  visible: boolean;
  onClose: () => void;
  countryId: string;
  onNavigateToGame: (gameKey: string) => void;
}

export const GamesModal = React.memo<GamesModalProps>(({
  visible,
  onClose,
  countryId,
  onNavigateToGame,
}) => {
  if (!visible) return null;
  const games = [
    { key: 'WordMatch', name: 'Word Match', icon: 'language' as IconName, desc: 'Match foreign words', color: colors.primary.wisteriaDark },
    { key: 'MemoryCards', name: 'Memory', icon: 'flashcard' as IconName, desc: 'Flip and match pairs', color: colors.calm.ocean },
    { key: 'CookingGame', name: 'Cooking', icon: 'food' as IconName, desc: 'Cook world recipes', color: colors.reward.peachDark },
    { key: 'TreasureHunt', name: 'Treasure Hunt', icon: 'compass' as IconName, desc: 'Find hidden items', color: colors.success.emerald },
  ];
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()}>
        <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
          <Heading level={3} style={{ textAlign: 'center', marginBottom: spacing.md }}>Mini-Games</Heading>
          <View style={styles.gamesGrid}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.key}
                style={styles.gameCard}
                onPress={() => { onClose(); onNavigateToGame(game.key); }}
                activeOpacity={0.8}
              >
                <View style={[styles.gameIcon, { backgroundColor: game.color + '20' }]}>
                  <Icon name={game.icon} size={24} color={game.color} />
                </View>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button title="Close" variant="secondary" onPress={onClose} style={{ marginTop: spacing.md }} />
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

import { TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.xl,
  },
  content: {
    borderRadius: 24, overflow: 'hidden',
    padding: spacing.xl, maxWidth: 340, width: '100%',
  },
  contentWithImage: {
    borderRadius: 28, overflow: 'hidden',
    maxWidth: 372, width: '100%',
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  objectImageWrap: { width: '100%', height: 194, position: 'relative' },
  objectImage: { width: '100%', height: '100%' },
  objectImageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.15)' },
  iconRowLarge: { paddingVertical: spacing.xl, alignItems: 'center', backgroundColor: colors.primary.wisteriaFaded },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.8)', alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.primary.wisteria + '30',
  },
  contentBody: { padding: spacing.xl, gap: spacing.xs },
  didYouKnowBadge: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    paddingVertical: 6, paddingHorizontal: spacing.md, marginBottom: spacing.sm,
    backgroundColor: colors.reward.peachLight, borderRadius: 12, alignSelf: 'center',
  },
  didYouKnowText: { fontFamily: 'Nunito-Bold', fontSize: 12, color: colors.reward.amber },
  iconRow: { alignItems: 'center', marginBottom: spacing.sm },
  body: { marginTop: spacing.sm, marginBottom: spacing.sm, textAlign: 'center', lineHeight: 23 },
  auraRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    paddingVertical: 9, marginBottom: spacing.sm,
    backgroundColor: colors.status.streakBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.reward.gold + '30',
  },
  auraText: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.status.streak },
  auraSubtext: { fontFamily: 'Nunito-SemiBold', fontSize: 12, color: colors.reward.gold, marginTop: 2 },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end', marginTop: spacing.sm },
  microCard: {
    padding: spacing.xl, borderRadius: 24, alignItems: 'center',
    maxWidth: 280, overflow: 'hidden',
  },
  microTitle: { marginTop: spacing.md, textAlign: 'center' },
  microSub: { marginTop: spacing.xs, marginBottom: spacing.md },
  gamesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gameCard: {
    width: '47%' as any, alignItems: 'center', padding: spacing.md,
    backgroundColor: colors.base.cream, borderRadius: 16,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.15)',
  },
  gameIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  gameName: { fontFamily: 'Nunito-Bold', fontSize: 13, color: colors.text.primary },
  gameDesc: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.secondary, textAlign: 'center' },
});
