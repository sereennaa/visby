import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { ExploreStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type ExploreScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'Explore'>;
};

export const ExploreScreen: React.FC<ExploreScreenProps> = ({ navigation }) => {
  const actions = [
    {
      icon: 'globe' as IconName,
      label: 'Visit the World',
      subtitle: 'New destinations & homes',
      gradient: [colors.primary.wisteriaFaded, colors.primary.wisteriaLight] as [string, string],
      iconBg: colors.primary.wisteriaDark,
      onPress: () => navigation.navigate('CountryWorld'),
    },
    {
      icon: 'compass' as IconName,
      label: 'Nearby Map',
      subtitle: 'Explore where you are',
      gradient: ['#E0F0FF', '#F0F7FF'] as [string, string],
      iconBg: '#5EA0D4',
      onPress: () => navigation.navigate('Map'),
    },
    {
      icon: 'stamp' as IconName,
      label: 'Collect a Stamp',
      subtitle: 'Remember a place',
      gradient: [colors.surface.peach, colors.reward.peachLight] as [string, string],
      iconBg: colors.reward.peachDark,
      onPress: () => (navigation.getParent() as any)?.getParent()?.navigate('CollectStamp', { locationId: 'quick' }),
    },
    {
      icon: 'bowl' as IconName,
      label: 'Log a Bite',
      subtitle: 'Save what you ate',
      gradient: [colors.accent.blush, colors.accent.rose] as [string, string],
      iconBg: colors.accent.coral,
      onPress: () => (navigation.getParent() as any)?.getParent()?.navigate('AddBite'),
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.base.cream, colors.calm.skyLight, colors.primary.wisteriaFaded, colors.reward.peachLight, colors.base.cream]}
        locations={[0, 0.3, 0.5, 0.8, 1]}
        style={StyleSheet.absoluteFill}
      />
      <FloatingParticles count={6} variant="mixed" opacity={0.25} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeInDown.duration(500).delay(100)} style={styles.header}>
            <Heading level={1}>Explore</Heading>
            <Caption style={styles.subtitle}>
              Go to new places, make a home in a new country, and learn something new.
            </Caption>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(500).delay(200)}>
            <View style={styles.sectionHeader}>
              <Text variant="body" style={styles.sectionLabel}>Where to go</Text>
            </View>
            <View style={styles.grid}>
              {actions.map((item, i) => (
                <Animated.View
                  key={item.label}
                  entering={FadeInDown.duration(400).delay(250 + i * 80)}
                >
                  <TouchableOpacity
                    style={styles.card}
                    onPress={item.onPress}
                    activeOpacity={0.85}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                  >
                    <LinearGradient
                      colors={item.gradient}
                      style={styles.cardGradient}
                    >
                      <View style={[styles.iconWrap, { backgroundColor: item.iconBg + '25' }]}>
                        <Icon name={item.icon} size={28} color={item.iconBg} />
                      </View>
                      <Text variant="body" style={styles.cardLabel}>{item.label}</Text>
                      <Caption style={styles.cardSubtitle}>{item.subtitle}</Caption>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Animated.View>

          <View style={styles.tip}>
            <Icon name="info" size={18} color={colors.primary.wisteriaDark} />
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.tipText}>
              Tap Visit the World to see all countries. Spend Aura to visit or buy a house there.
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const CARD_W = (340 - spacing.screenPadding * 2 - 12) / 2;

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: 120,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  subtitle: {
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontFamily: 'Nunito-SemiBold',
    color: colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: CARD_W,
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(184, 165, 224, 0.15)',
    minHeight: 120,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  cardLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: colors.text.primary,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.text.muted,
  },
  tip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: spacing.radius.md,
  },
  tipText: {
    flex: 1,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: spacing.lg,
  },
});

export default ExploreScreen;
