import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  FadeInDown,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { FloatingParticles } from '../../components/effects/FloatingParticles';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { getFeaturedItems } from '../../config/cosmetics';

const { width: SCREEN_W } = Dimensions.get('window');
const PORTAL_SIZE = (SCREEN_W - spacing.screenPadding * 2 - 16) / 2;

type ShopHubScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

interface PortalCardProps {
  title: string;
  subtitle: string;
  icon: IconName;
  gradient: [string, string];
  onPress: () => void;
  delay: number;
  hasNew?: boolean;
}

const PortalCard: React.FC<PortalCardProps> = ({ title, subtitle, icon, gradient, onPress, delay, hasNew }) => {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.03, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <Animated.View entering={FadeInDown.delay(delay).springify().damping(14)} style={{ width: PORTAL_SIZE }}>
      <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
        <Animated.View style={animStyle}>
          <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.portalCard}>
            {hasNew && (
              <View style={styles.newBadge}>
                <Text variant="caption" color="#FFFFFF" style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            <View style={styles.portalIconWrap}>
              <Icon name={icon} size={32} color="#FFFFFF" />
            </View>
            <Text variant="h3" color="#FFFFFF" style={styles.portalTitle}>{title}</Text>
            <Caption color="rgba(255,255,255,0.8)" style={styles.portalSubtitle}>{subtitle}</Caption>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const ShopHubScreen: React.FC<ShopHubScreenProps> = ({ navigation }) => {
  const user = useStore(s => s.user);
  const visby = useStore(s => s.visby);
  const featuredCount = getFeaturedItems().length;

  const appearance = visby?.appearance ?? {
    skinTone: '#FFAD6B',
    hairColor: '#B8875A',
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };
  const equipped = visby?.equipped ?? {};

  return (
    <LinearGradient
      colors={['#F5F0FF', '#FFF6EE', '#FAF8FF']}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      <FloatingParticles count={10} variant="mixed" opacity={0.2} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={22} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={1}>Shop</Heading>
            <Caption color={colors.text.muted}>Everything for your Visby adventure</Caption>
          </View>
          <View style={styles.auraPill}>
            <Icon name="sparkles" size={16} color={colors.reward.gold} />
            <Text variant="body" style={styles.auraAmount}>{user?.aura ?? 0}</Text>
          </View>
        </View>

        {/* Visby preview */}
        <View style={styles.visbySection}>
          <VisbyCharacter
            appearance={appearance}
            equipped={equipped}
            mood="excited"
            size={120}
            animated
          />
        </View>

        {/* Portal Grid */}
        <View style={styles.portalsGrid}>
          <PortalCard
            title="Boutique"
            subtitle="Hats, outfits & more"
            icon="crown"
            gradient={['#9B59B6', '#8E44AD']}
            onPress={() => navigation.navigate('CosmeticShop')}
            delay={0}
            hasNew={featuredCount > 0}
          />
          <PortalCard
            title="Workshop"
            subtitle="Furniture & decor"
            icon="home"
            gradient={['#3498DB', '#2980B9']}
            onPress={() => navigation.navigate('FurnitureShop')}
            delay={100}
          />
          <PortalCard
            title="Real Estate"
            subtitle="Houses & rooms"
            icon="globe"
            gradient={['#27AE60', '#219A52']}
            onPress={() => navigation.navigate('AuraStore')}
            delay={200}
          />
          <PortalCard
            title="Gift Shop"
            subtitle="Gifts for Visby"
            icon="gift"
            gradient={['#E74C3C', '#C0392B']}
            onPress={() => navigation.navigate('AuraStore')}
            delay={300}
          />
        </View>

        {/* Cross-sell prompts */}
        <View style={styles.crossSellSection}>
          <TouchableOpacity
            style={styles.crossSellCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('AuraStore')}
          >
            <LinearGradient
              colors={['rgba(255,215,0,0.12)', 'rgba(255,215,0,0.04)']}
              style={styles.crossSellGradient}
            >
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <View style={styles.crossSellTextWrap}>
                <Text variant="body" style={styles.crossSellTitle}>Need more Aura?</Text>
                <Caption color={colors.text.muted}>Earn or buy Aura to unlock amazing items</Caption>
              </View>
              <Icon name="chevronRight" size={18} color={colors.text.muted} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.crossSellCard}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('Membership')}
          >
            <LinearGradient
              colors={['rgba(184,165,224,0.15)', 'rgba(184,165,224,0.05)']}
              style={styles.crossSellGradient}
            >
              <Icon name="crown" size={20} color={colors.primary.wisteriaDark} />
              <View style={styles.crossSellTextWrap}>
                <Text variant="body" style={styles.crossSellTitle}>Unlock Membership</Text>
                <Caption color={colors.text.muted}>Exclusive items & unlimited visits</Caption>
              </View>
              <Icon name="chevronRight" size={18} color={colors.text.muted} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const BOTTOM_NAV_PADDING = 88;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: BOTTOM_NAV_PADDING },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.screenPadding, paddingTop: spacing.sm, paddingBottom: spacing.md,
  },
  headerCenter: { alignItems: 'center' },
  backBtn: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: 'rgba(0,0,0,0.06)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 6, elevation: 2,
  },
  auraPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,215,0,0.12)', paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
  },
  auraAmount: { fontWeight: '800', color: colors.reward.amber, fontSize: 15 },
  visbySection: { alignItems: 'center', marginBottom: spacing.lg },
  portalsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 16,
    paddingHorizontal: spacing.screenPadding,
    marginBottom: spacing.lg,
  },
  portalCard: {
    borderRadius: 24, padding: spacing.lg, height: PORTAL_SIZE * 0.85,
    justifyContent: 'flex-end', position: 'relative', overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.15)', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 12, elevation: 5,
  },
  portalIconWrap: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  portalTitle: { marginBottom: 2 },
  portalSubtitle: { fontSize: 11 },
  newBadge: {
    position: 'absolute', top: 10, right: 10,
    backgroundColor: '#FF6B6B', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  newBadgeText: { fontWeight: '800', fontSize: 9, letterSpacing: 0.8 },
  crossSellSection: {
    paddingHorizontal: spacing.screenPadding, gap: spacing.sm,
  },
  crossSellCard: { borderRadius: 16, overflow: 'hidden' },
  crossSellGradient: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm, borderRadius: 16,
  },
  crossSellTextWrap: { flex: 1 },
  crossSellTitle: { fontWeight: '700', marginBottom: 2 },
});

export default ShopHubScreen;
