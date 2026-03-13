import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { AURA_PACKS, AuraPack } from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const { width } = Dimensions.get('window');
const CARD_GAP = spacing.md;
const CARD_WIDTH = (width - spacing.screenPadding * 2 - CARD_GAP) / 2;

type AuraStoreScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const EARN_TIPS = [
  { emoji: '📖', text: 'Complete lessons: +50 Aura' },
  { emoji: '🧠', text: 'Pass a quiz: up to +100 Aura' },
  { emoji: '📍', text: 'Collect a stamp: +50 Aura' },
  { emoji: '🍜', text: 'Log food: +25 Aura' },
  { emoji: '🌍', text: 'Visit a country: learn & earn!' },
];

export const AuraStoreScreen: React.FC<AuraStoreScreenProps> = ({ navigation }) => {
  const { user, addAura } = useStore();
  const currentAura = user?.aura ?? 0;

  const parseBonusAmount = (pack: AuraPack): number => {
    if (!pack.bonus) return 0;
    const match = pack.bonus.match(/\+(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const handleBuy = (pack: AuraPack) => {
    const bonusAmount = parseBonusAmount(pack);
    const totalAmount = pack.amount + bonusAmount;

    Alert.alert(
      'Demo Purchase ✨',
      `This is a demo! Granting ${totalAmount.toLocaleString()} Aura for free.\nIn the real app this would cost ${pack.priceLabel}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim Aura!',
          onPress: () => addAura(totalAmount),
        },
      ],
    );
  };

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
              <Text variant="caption" color={colors.text.inverse} style={styles.popularText}>
                POPULAR
              </Text>
            </LinearGradient>
          </View>
        )}
        <LinearGradient
          colors={
            pack.popular
              ? [colors.reward.peachLight, colors.reward.goldSoft]
              : [colors.base.cream, colors.base.parchment]
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.packCard,
            pack.popular && styles.packCardPopular,
          ]}
        >
          <Text style={styles.packEmoji}>{pack.emoji}</Text>
          <Text variant="h2" align="center">
            {pack.amount.toLocaleString()} ✨
          </Text>
          {bonusAmount > 0 && (
            <Text variant="caption" color={colors.success.emerald} style={styles.bonusText}>
              +{bonusAmount} bonus
            </Text>
          )}
          <Text variant="bodySmall" color={colors.text.secondary} style={styles.priceTag}>
            {pack.priceLabel}
          </Text>
          <Button
            title="Buy"
            variant="reward"
            size="sm"
            fullWidth
            onPress={() => handleBuy(pack)}
          />
        </LinearGradient>
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Aura Store</Heading>
          <View style={styles.auraBalancePill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="label" color={colors.text.primary} style={styles.auraBalanceText}>
              {currentAura.toLocaleString()}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Text style={styles.heroEmoji}>✨</Text>
            <Heading level={1} align="center">
              Get More Aura ✨
            </Heading>
            <Caption align="center" style={styles.heroSubtitle}>
              Aura lets you visit countries, buy houses, and shop for cosmetics
            </Caption>
          </View>

          {/* Aura Packs Grid */}
          <View style={styles.packsGrid}>
            {AURA_PACKS.map(renderPackCard)}
          </View>

          {/* Earn Aura Section */}
          <Card variant="elevated" style={styles.earnSection} borderRadius={24}>
            <View style={styles.earnHeader}>
              <Icon name="star" size={24} color={colors.reward.gold} />
              <Heading level={2} style={styles.earnTitle}>
                Or earn Aura for free!
              </Heading>
            </View>
            <View style={styles.earnList}>
              {EARN_TIPS.map((tip, i) => (
                <View key={i} style={styles.earnRow}>
                  <Text style={styles.earnEmoji}>{tip.emoji}</Text>
                  <Text variant="body" style={styles.earnText}>{tip.text}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Membership Link */}
          <TouchableOpacity
            style={styles.membershipLink}
            onPress={() => navigation.navigate('Membership')}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={[colors.primary.wisteriaFaded, colors.calm.skyLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
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
  auraBalancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: spacing.radius.round,
    gap: spacing.xs,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  auraBalanceText: {
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl + 20,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: spacing.md,
  },
  heroEmoji: {
    fontSize: 56,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    marginTop: spacing.sm,
    paddingHorizontal: spacing.xl,
    lineHeight: 20,
  },
  packsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CARD_GAP,
    marginBottom: spacing.xl,
  },
  packCardOuter: {
    width: CARD_WIDTH,
    position: 'relative',
  },
  packCard: {
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  packCardPopular: {
    shadowColor: colors.reward.peachDark,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  packEmoji: {
    fontSize: 36,
    marginBottom: spacing.xxs,
  },
  bonusText: {
    fontWeight: '700',
  },
  priceTag: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  popularBadge: {
    position: 'absolute',
    top: -1,
    alignSelf: 'center',
    zIndex: 10,
  },
  popularGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 1,
    borderBottomLeftRadius: spacing.radius.sm,
    borderBottomRightRadius: spacing.radius.sm,
  },
  popularText: {
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 1,
  },
  earnSection: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
  },
  earnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  earnTitle: {
    flex: 1,
  },
  earnList: {
    gap: spacing.md,
  },
  earnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  earnEmoji: {
    fontSize: 22,
    width: 30,
    textAlign: 'center',
  },
  earnText: {
    flex: 1,
  },
  membershipLink: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  membershipGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  membershipTextBlock: {
    flex: 1,
  },
});

export default AuraStoreScreen;
