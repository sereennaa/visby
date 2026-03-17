import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getShadowStyle } from '../../theme/shadows';
import { Text, Heading, Caption } from '../ui/Text';
import { Icon, IconName } from '../ui/Icon';
import { useStore } from '../../store/useStore';
import { VISBY_GIFTS } from '../../config/cosmetics';
import { VisbyGift } from '../../types';

interface GiftShopProps {
  onGiftGiven?: (gift: VisbyGift) => void;
}

export const GiftShop: React.FC<GiftShopProps> = ({ onGiftGiven }) => {
  const user = useStore(s => s.user);
  const giveGiftToVisby = useStore(s => s.giveGiftToVisby);
  const addBondPoints = useStore(s => s.addBondPoints);
  const [lastGiftReaction, setLastGiftReaction] = useState<string | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const handleGiveGift = (gift: VisbyGift) => {
    if (!user || user.aura < gift.price) {
      Alert.alert('Not Enough Aura', `You need ${gift.price} Aura to give this gift.`);
      return;
    }

    const success = giveGiftToVisby(gift.id, gift.price, gift.bondBonus, gift.needsBoost);
    if (success) {
      setLastGiftReaction(gift.visbyReaction);
      onGiftGiven?.(gift);
      timersRef.current.push(setTimeout(() => setLastGiftReaction(null), 3000));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="gift" size={18} color={colors.primary.wisteriaDark} />
        <Heading level={3}>Give a Gift</Heading>
      </View>

      {lastGiftReaction && (
        <Animated.View entering={FadeIn.duration(300)} style={styles.reactionBubble}>
          <Text variant="body" style={styles.reactionText}>{lastGiftReaction}</Text>
        </Animated.View>
      )}

      <View style={styles.giftsGrid}>
        {VISBY_GIFTS.map((gift, idx) => (
          <Animated.View
            key={gift.id}
            entering={FadeInDown.delay(idx * 80).duration(300)}
          >
            <TouchableOpacity
              style={styles.giftCard}
              activeOpacity={0.8}
              onPress={() => handleGiveGift(gift)}
            >
              <LinearGradient
                colors={gift.id === 'gift_special' ? ['#FFF8E0', '#FFE8A0'] : ['#FAFAFA', '#F0F0F0']}
                style={styles.giftGradient}
              >
                <View style={styles.giftIconWrap}>
                  <Icon name={gift.icon as IconName} size={24} color={colors.primary.wisteriaDark} />
                </View>
                <Text variant="body" numberOfLines={1} style={styles.giftName}>{gift.name}</Text>
                <View style={styles.giftPrice}>
                  <Icon name="sparkles" size={11} color={colors.reward.gold} />
                  <Text variant="caption" color={colors.reward.amber} style={styles.priceNum}>{gift.price}</Text>
                </View>
                <View style={styles.bondRow}>
                  <Icon name="heart" size={10} color="#E74C3C" />
                  <Text variant="caption" color="#E74C3C" style={styles.bondText}>+{gift.bondBonus}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );
};

// Shadow outside StyleSheet so the web preprocessor doesn't warn on shadow* props
const reactionBubbleShadow = getShadowStyle({
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 6,
});
const reactionBubbleElevation = Platform.OS !== 'web' ? { elevation: 3 } : {};

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.md },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.sm,
  },
  reactionBubble: {
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
    ...reactionBubbleShadow,
    ...reactionBubbleElevation,
  },
  reactionText: { textAlign: 'center' },
  giftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.screenPadding,
    gap: 10,
  },
  giftCard: {
    width: 100,
    borderRadius: 16,
    overflow: 'hidden',
  },
  giftGradient: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    borderRadius: 16,
  },
  giftIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(184,165,224,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  giftName: { fontSize: 12, fontWeight: '700', textAlign: 'center', marginBottom: 4 },
  giftPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  priceNum: { fontWeight: '800', fontSize: 12 },
  bondRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 2,
  },
  bondText: { fontWeight: '700', fontSize: 10 },
});
