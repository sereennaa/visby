import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  ZoomIn,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { AURA_PACKS, AuraPack, COSMETICS_CATALOG } from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const { width } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = (width - spacing.screenPadding * 2 - CARD_GAP) / 2;

type AuraStoreScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const EARN_TIPS: { icon: IconName; text: string }[] = [
  { icon: 'book', text: 'Complete lessons: +50 Aura' },
  { icon: 'quiz', text: 'Pass a quiz: up to +100 Aura' },
  { icon: 'stamp', text: 'Earn stamps by learning: +skills!' },
  { icon: 'food', text: 'Log food: +25 Aura' },
  { icon: 'globe', text: 'Visit a country: learn & earn!' },
  { icon: 'sparkles', text: 'Play mini-games: earn Aura & skills!' },
];

const AnimatedAuraCounter: React.FC<{ value: number }> = ({ value }) => {
  const animVal = useSharedValue(value);

  useEffect(() => {
    animVal.value = withSpring(value, { damping: 20, stiffness: 80 });
  }, [value]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(Math.abs(animVal.value - value), [0, 50], [1, 1.1], 'clamp') }],
  }));

  return (
    <Animated.View style={[styles.counterWrap, style]}>
      <Icon name="sparkles" size={28} color={colors.reward.gold} />
      <Text variant="h1" color={colors.reward.amber} style={styles.counterText}>{value.toLocaleString()}</Text>
      <Caption color={colors.text.muted}>Aura</Caption>
    </Animated.View>
  );
};

const ShimmerCard: React.FC<{ children: React.ReactNode; popular?: boolean }> = ({ children, popular }) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    if (popular) {
      shimmer.value = withRepeat(
        withTiming(1, { duration: 3000, easing: Easing.linear }),
        -1,
        false,
      );
    }
  }, [popular]);

  const shimmerStyle = useAnimatedStyle(() => {
    if (!popular) return {};
    return {
      opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.6, 1, 0.6]),
    };
  });

  return <Animated.View style={shimmerStyle}>{children}</Animated.View>;
};

export const AuraStoreScreen: React.FC<AuraStoreScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const addAura = useStore(s => s.addAura);
  const getDailyDeal = useStore(s => s.getDailyDeal);
  const currentAura = user?.aura ?? 0;

  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [selectedPack, setSelectedPack] = useState<AuraPack | null>(null);
  const [selectedTotalAmount, setSelectedTotalAmount] = useState(0);

  const dailyDealId = getDailyDeal();
  const dailyDealItem = dailyDealId ? COSMETICS_CATALOG.find((c) => c.id === dailyDealId) : null;

  const parseBonusAmount = (pack: AuraPack): number => {
    if (!pack.bonus) return 0;
    const match = pack.bonus.match(/\+(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handleBuy = (pack: AuraPack) => {
    const bonusAmount = parseBonusAmount(pack);
    const totalAmount = pack.amount + bonusAmount;
    setSelectedPack(pack);
    setSelectedTotalAmount(totalAmount);
    setBuyModalVisible(true);
  };

  const confirmBuy = () => {
    addAura(selectedTotalAmount);
    setBuyModalVisible(false);
    setSelectedPack(null);
  };

  const nextUnlockItem = COSMETICS_CATALOG
    .filter((c) => c.price > currentAura)
    .sort((a, b) => a.price - b.price)[0];

  const renderPackCard = (pack: AuraPack) => {
    const bonusAmount = parseBonusAmount(pack);
    return (
      <View key={pack.id} style={styles.packCardOuter}>
        {pack.popular && (
          <View style={styles.popularBadge}>
            <LinearGradient
              colors={[colors.primary.wisteria, colors.primary.wisteriaDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.popularGradient}
            >
              <Text variant="caption" color={colors.text.inverse} style={styles.popularText}>POPULAR</Text>
            </LinearGradient>
          </View>
        )}
        <ShimmerCard popular={pack.popular}>
          <LinearGradient
            colors={pack.popular ? [colors.reward.peachLight, colors.reward.goldSoft] : [colors.base.cream, colors.base.parchment]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.packCard, pack.popular && styles.packCardPopular]}
          >
            <Icon name={pack.icon} size={36} color={colors.reward.gold} />
            <Text variant="h2" align="center">{pack.amount.toLocaleString()}</Text>
            {bonusAmount > 0 && (
              <Text variant="caption" color={colors.success.emerald} style={styles.bonusText}>+{bonusAmount} bonus</Text>
            )}
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.priceTag}>{pack.priceLabel}</Text>
            <Button title="Buy" variant="reward" size="sm" fullWidth onPress={() => handleBuy(pack)} />
          </LinearGradient>
        </ShimmerCard>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.reward.peachLight, colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
      locations={[0, 0.35, 1]}
    >
      <FloatingParticles count={8} variant="stars" opacity={0.25} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Aura Store</Heading>
          <View style={styles.auraBalancePill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="label" color={colors.text.primary} style={styles.auraBalanceText}>{currentAura.toLocaleString()}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Animated Counter */}
          <AnimatedAuraCounter value={currentAura} />

          {/* Daily Deal */}
          {dailyDealItem && (
            <TouchableOpacity
              style={styles.dailyDeal}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('CosmeticShop')}
            >
              <LinearGradient colors={['#FFE8A0', '#FFF8E0']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.dailyDealGradient}>
                <View style={styles.dailyDealBadge}>
                  <Icon name="star" size={10} color="#FFFFFF" />
                  <Text variant="caption" color="#FFFFFF" style={styles.dailyDealBadgeText}>DAILY DEAL</Text>
                </View>
                <View style={styles.dailyDealContent}>
                  <View style={{ flex: 1 }}>
                    <Text variant="h3">{dailyDealItem.name}</Text>
                    <View style={styles.dailyDealPriceRow}>
                      <Text variant="caption" color={colors.text.muted} style={styles.strikePrice}>{dailyDealItem.price}</Text>
                      <View style={styles.dailyDealFinalPrice}>
                        <Icon name="sparkles" size={12} color={colors.reward.gold} />
                        <Text variant="h3" color={colors.reward.amber}>{Math.round(dailyDealItem.price * 0.5)}</Text>
                      </View>
                      <View style={styles.dailyDealSaveBadge}>
                        <Text variant="caption" color="#FFFFFF" style={styles.dailyDealSaveText}>50% OFF</Text>
                      </View>
                    </View>
                  </View>
                  <Icon name="chevronRight" size={20} color={colors.text.muted} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          )}

          {/* What Can I Buy */}
          {nextUnlockItem && (
            <Card variant="elevated" style={styles.whatCanIBuy} borderRadius={20}>
              <View style={styles.whatCanIBuyHeader}>
                <Icon name="sparkles" size={18} color={colors.primary.wisteriaDark} />
                <Text variant="h3">Next unlock</Text>
              </View>
              <Text variant="body" color={colors.text.secondary}>
                {nextUnlockItem.name} — needs {nextUnlockItem.price} Aura ({Math.max(0, nextUnlockItem.price - currentAura)} more)
              </Text>
              <View style={styles.unlockProgressBg}>
                <View style={[styles.unlockProgressFill, { width: `${Math.min(100, (currentAura / nextUnlockItem.price) * 100)}%` }]} />
              </View>
            </Card>
          )}

          {/* Aura Packs */}
          <Heading level={2} style={styles.sectionTitle}>Get More Aura</Heading>
          <View style={styles.packsGrid}>
            {AURA_PACKS.map(renderPackCard)}
          </View>
          <View style={styles.sustainabilityNote}>
            <Icon name="nature" size={16} color={colors.calm.ocean} />
            <Caption color={colors.text.secondary}>10% of purchase revenue goes to our sustainability fund.</Caption>
          </View>

          {/* Earn Section */}
          <Card variant="elevated" style={styles.earnSection} borderRadius={24}>
            <View style={styles.earnHeader}>
              <Icon name="star" size={24} color={colors.reward.gold} />
              <Heading level={2} style={styles.earnTitle}>Or earn Aura for free!</Heading>
            </View>
            <View style={styles.earnList}>
              {EARN_TIPS.map((tip, i) => (
                <View key={i} style={styles.earnRow}>
                  <Icon name={tip.icon} size={22} color={colors.primary.wisteriaDark} />
                  <Text variant="body" style={styles.earnText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Membership Link */}
          <TouchableOpacity style={styles.membershipLink} onPress={() => navigation.navigate('Membership')} activeOpacity={0.7}>
            <LinearGradient
              colors={[colors.primary.wisteriaFaded, colors.calm.skyLight]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.membershipGradient}
            >
              <Icon name="crown" size={28} color={colors.reward.gold} />
              <View style={styles.membershipTextBlock}>
                <Text variant="h3">Want unlimited visits?</Text>
                <Caption>Check out Membership</Caption>
              </View>
              <Icon name="chevronRight" size={20} color={colors.text.muted} />
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>

      <Modal visible={buyModalVisible} transparent animationType="none" onRequestClose={() => setBuyModalVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setBuyModalVisible(false)}>
          <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Heading level={3}>Demo Purchase</Heading>
            <Text variant="body" style={styles.modalBody}>
              This is a demo! Granting {selectedTotalAmount.toLocaleString()} Aura for free.
              {'\n'}In the real app this would cost {selectedPack?.priceLabel}.
            </Text>
            <View style={styles.modalActions}>
              <Button size="sm" variant="secondary" title="Cancel" onPress={() => setBuyModalVisible(false)} />
              <Button size="sm" variant="reward" title="Get Aura" onPress={confirmBuy} />
            </View>
          </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding, paddingVertical: spacing.md,
  },
  backButton: {
    width: 40, height: 40, borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.shadow.medium, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  auraBalancePill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.base.cream,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2, borderRadius: spacing.radius.round,
    gap: spacing.xs, shadowColor: colors.shadow.medium, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  auraBalanceText: { fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxxl + 20 },
  counterWrap: { alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.xs },
  counterText: { fontSize: 42, fontWeight: '900' },
  dailyDeal: { borderRadius: 20, overflow: 'hidden', marginBottom: spacing.lg },
  dailyDealGradient: { padding: spacing.md, borderRadius: 20, position: 'relative' },
  dailyDealBadge: {
    position: 'absolute', top: 0, left: 12, flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#E74C3C', paddingHorizontal: 8, paddingVertical: 3, borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
  },
  dailyDealBadgeText: { fontWeight: '800', fontSize: 9, letterSpacing: 0.8 },
  dailyDealContent: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm },
  dailyDealPriceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: 4 },
  strikePrice: { textDecorationLine: 'line-through', fontSize: 13 },
  dailyDealFinalPrice: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dailyDealSaveBadge: { backgroundColor: '#27AE60', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  dailyDealSaveText: { fontWeight: '800', fontSize: 10 },
  whatCanIBuy: { marginBottom: spacing.lg, padding: spacing.md },
  whatCanIBuyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs },
  unlockProgressBg: { height: 6, backgroundColor: 'rgba(184,165,224,0.15)', borderRadius: 3, overflow: 'hidden', marginTop: spacing.sm },
  unlockProgressFill: { height: 6, backgroundColor: colors.primary.wisteriaDark, borderRadius: 3 },
  sectionTitle: { marginBottom: spacing.md },
  packsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: CARD_GAP, marginBottom: spacing.md },
  sustainabilityNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  packCardOuter: { width: CARD_WIDTH, position: 'relative' },
  packCard: {
    borderRadius: 20, padding: spacing.lg, alignItems: 'center', gap: spacing.xs,
    shadowColor: colors.shadow.light, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 1, shadowRadius: 6, elevation: 3,
  },
  packCardPopular: { shadowColor: colors.reward.peachDark, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  bonusText: { fontWeight: '700' },
  priceTag: { fontWeight: '600', marginBottom: spacing.xs },
  popularBadge: { position: 'absolute', top: -1, alignSelf: 'center', zIndex: 10 },
  popularGradient: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xxs + 1,
    borderBottomLeftRadius: spacing.radius.sm, borderBottomRightRadius: spacing.radius.sm,
  },
  popularText: { fontWeight: '800', fontSize: 10, letterSpacing: 1 },
  earnSection: { marginBottom: spacing.xl, padding: spacing.xl },
  earnHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  earnTitle: { flex: 1 },
  earnList: { gap: spacing.md },
  earnRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  earnText: { flex: 1 },
  membershipLink: {
    borderRadius: 20, overflow: 'hidden', marginBottom: spacing.lg,
    shadowColor: colors.shadow.light, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2,
  },
  membershipGradient: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, gap: spacing.md },
  membershipTextBlock: { flex: 1 },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: spacing.xl, maxWidth: 360, width: '100%' },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.lg },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
});

export default AuraStoreScreen;
