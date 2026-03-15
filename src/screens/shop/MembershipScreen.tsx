import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { RootStackParamList } from '../../types';
import { MEMBERSHIP_TIERS, MembershipTier } from '../../config/cosmetics';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type MembershipScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const TIER_GRADIENTS: Record<string, [string, string]> = {
  free: [colors.base.parchment, colors.base.cream],
  plus: [colors.calm.skyLight, colors.calm.sky],
  premium: [colors.reward.peachLight, colors.reward.goldSoft],
};

const TIER_BORDER_COLORS: Record<string, string> = {
  free: colors.text.light,
  plus: colors.calm.ocean,
  premium: colors.reward.gold,
};

export const MembershipScreen: React.FC<MembershipScreenProps> = ({ navigation }) => {
  const [currentTier] = useState('free');
  const [comingSoonVisible, setComingSoonVisible] = useState(false);

  const currentTierData = MEMBERSHIP_TIERS.find((t) => t.id === currentTier) || MEMBERSHIP_TIERS[0];

  const renderTierCard = (tier: MembershipTier) => {
    const isCurrent = tier.id === currentTier;
    const isLegend = tier.id === 'premium';
    const isVoyager = tier.id === 'plus';
    const gradient = TIER_GRADIENTS[tier.id];
    const borderColor = TIER_BORDER_COLORS[tier.id];

    return (
      <View key={tier.id} style={[styles.tierCardWrapper, { borderColor }]}>
        {isLegend && (
          <View style={styles.bestValueBadge}>
            <LinearGradient
              colors={[colors.reward.gold, colors.reward.amber]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.bestValueGradient}
            >
              <Text variant="caption" color={colors.text.primary} style={styles.bestValueText}>
                BEST VALUE
              </Text>
            </LinearGradient>
          </View>
        )}
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tierCardGradient}
        >
          <View style={styles.tierHeader}>
            <Icon name={tier.icon} size={40} color={tier.color} />
            <View style={styles.tierNameBlock}>
              <Heading level={2}>{tier.name}</Heading>
              <Text
                variant="bodyLarge"
                color={isLegend ? colors.reward.amber : colors.text.secondary}
                style={styles.priceLabel}
              >
                {tier.priceLabel}
              </Text>
            </View>
          </View>

          <View style={styles.perksList}>
            {tier.perks.map((perk, i) => (
              <View key={i} style={styles.perkRow}>
                <Icon
                  name="checkCircle"
                  size={18}
                  color={
                    isLegend
                      ? colors.reward.gold
                      : isVoyager
                        ? colors.calm.ocean
                        : colors.success.emerald
                  }
                />
                <Text variant="body" style={styles.perkText}>{perk}</Text>
              </View>
            ))}
          </View>

          {isCurrent ? (
            <View style={styles.currentPlanPill}>
              <Text variant="label" color={colors.text.secondary}>
                Current Plan
              </Text>
            </View>
          ) : isLegend ? (
            <Button
              title="Go Legend"
              variant="reward"
              size="lg"
              fullWidth
              onPress={() => setComingSoonVisible(true)}
            />
          ) : (
            <Button
              title="Upgrade"
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => setComingSoonVisible(true)}
            />
          )}
        </LinearGradient>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.base.cream]}
      style={styles.container}
      locations={[0, 0.4, 1]}
    >
      <FloatingParticles count={5} variant="hearts" opacity={0.2} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={1}>Membership</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Tier Summary */}
          <Card
            variant="gradient"
            gradientColors={[colors.primary.wisteriaFaded, colors.primary.wisteriaLight]}
            style={styles.currentTierCard}
          >
            <Icon name={currentTierData.icon} size={48} color={currentTierData.color} />
            <Heading level={2} align="center">
              You're on the {currentTierData.name} plan
            </Heading>
            <Caption align="center" style={styles.currentTierCaption}>
              {currentTier === 'free'
                ? 'Upgrade to unlock more perks and rewards!'
                : 'Enjoy your premium perks!'}
            </Caption>
          </Card>

          {/* Tier Cards */}
          {MEMBERSHIP_TIERS.map(renderTierCard)}

          {/* Bottom Motivator */}
          <View style={styles.bottomSection}>
            <Icon name="sparkles" size={24} color={colors.reward.gold} />
            <Caption align="center" style={styles.bottomText}>
              Earn Aura for free by completing lessons, collecting stamps, and exploring!
            </Caption>
          </View>
        </ScrollView>
      </SafeAreaView>

      <Modal
        visible={comingSoonVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setComingSoonVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setComingSoonVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Heading level={3} style={{ color: colors.primary.wisteriaDark }}>Coming soon</Heading>
            <Text variant="body" style={styles.modalBody}>
              We're brewing something special for members. Stay tuned!
            </Text>
            <View style={styles.modalActions}>
              <Button size="sm" variant="primary" title="OK" onPress={() => setComingSoonVisible(false)} />
            </View>
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl + 20,
  },
  currentTierCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingVertical: spacing.xl,
  },
  currentTierCaption: {
    marginTop: spacing.xs,
  },
  tierCardWrapper: {
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  tierCardGradient: {
    padding: spacing.xl,
    borderRadius: 22,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  tierNameBlock: {
    flex: 1,
  },
  priceLabel: {
    fontWeight: '700',
    marginTop: spacing.xxs,
  },
  perksList: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  perkText: {
    flex: 1,
  },
  currentPlanPill: {
    alignSelf: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.parchment,
    borderWidth: 1,
    borderColor: colors.text.light,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -1,
    right: 16,
    zIndex: 10,
  },
  bestValueGradient: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomLeftRadius: spacing.radius.sm,
    borderBottomRightRadius: spacing.radius.sm,
  },
  bestValueText: {
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 1,
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  bottomText: {
    lineHeight: 20,
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

export default MembershipScreen;
