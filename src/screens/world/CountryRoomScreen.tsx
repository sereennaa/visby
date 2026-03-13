import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { COUNTRIES } from '../../config/constants';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import type { CountryFact } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const AVATAR_SIZE = 80;
const FLOOR_Y = SCREEN_HEIGHT - 140;
const MOVE_RANGE = SCREEN_WIDTH - AVATAR_SIZE - spacing.lg * 2;

type CountryRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryRoom'>;
  route: { params: { countryId: string } };
};

export const CountryRoomScreen: React.FC<CountryRoomScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const { visby } = useStore();
  const [learningFact, setLearningFact] = useState<CountryFact | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  const avatarX = useSharedValue(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2);
  const avatarDirection = useSharedValue<'left' | 'right'>('right');
  const MOVE_STEP = 24;

  const defaultAppearance = visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const moveLeft = useCallback(() => {
    avatarDirection.value = 'left';
    avatarX.value = withSpring(
      Math.max(spacing.lg, avatarX.value - MOVE_STEP),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const moveRight = useCallback(() => {
    avatarDirection.value = 'right';
    avatarX.value = withSpring(
      Math.min(SCREEN_WIDTH - AVATAR_SIZE - spacing.lg, avatarX.value + MOVE_STEP),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: avatarX.value },
      { scaleX: avatarDirection.value === 'left' ? -1 : 1 },
    ],
  }));

  const openFact = useCallback((fact: CountryFact) => {
    setLearningFact(fact);
  }, []);

  const closeFact = useCallback(() => {
    setLearningFact(null);
  }, []);

  const nextFact = useCallback(() => {
    if (!country?.facts.length) return;
    setFactIndex((i) => (i + 1) % country.facts.length);
    setLearningFact(country.facts[(factIndex + 1) % country.facts.length]);
  }, [country?.facts, factIndex]);

  if (!country) {
    return (
      <View style={styles.centered}>
        <Text>Country not found.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const facts = country.facts;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[country.accentColor + '40', colors.base.cream, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.5, 1]}
      />

      <FloatingParticles count={8} variant="sparkle" opacity={0.25} speed="slow" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.flagTitle}>{country.flagEmoji} {country.name}</Text>
            <Caption>Walk around and tap ✨ to learn!</Caption>
          </View>
          <View style={styles.headerRight} />
        </View>

        {/* Room area - tap arrows to walk your Visby */}
        <View style={styles.room}>
          <View style={styles.roomDecoration}>
            <Text style={styles.roomEmoji}>🏠</Text>
            <Text style={styles.roomLabel}>Your spot in {country.name}</Text>
          </View>
          <Animated.View style={[styles.avatarContainer, avatarStyle]}>
            <VisbyCharacter
              appearance={defaultAppearance}
              equipped={visby?.equipped}
              mood="curious"
              size={AVATAR_SIZE}
              animated
            />
          </Animated.View>
          <View style={styles.walkControls}>
            <TouchableOpacity style={styles.walkBtn} onPress={moveLeft} activeOpacity={0.8}>
              <Icon name="chevronLeft" size={32} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
            <Text variant="caption" color={colors.text.muted}>Walk</Text>
            <TouchableOpacity style={styles.walkBtn} onPress={moveRight} activeOpacity={0.8}>
              <Icon name="chevronRight" size={32} color={colors.primary.wisteriaDark} />
            </TouchableOpacity>
          </View>
          <View style={styles.floor} />
        </View>

        {/* Learn section */}
        <View style={styles.learnSection}>
          <Heading level={3}>Learn about {country.name}</Heading>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.factsScroll}
          >
            {facts.map((fact, index) => (
              <TouchableOpacity
                key={fact.id}
                style={[styles.factChip, { borderColor: country.accentColor }]}
                onPress={() => {
                  setFactIndex(index);
                  openFact(fact);
                }}
              >
                <Text style={styles.factChipIcon}>{fact.icon}</Text>
                <Text variant="caption" numberOfLines={1}>{fact.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Caption style={styles.hint}>Tap a bubble to read a fun fact!</Caption>
        </View>
      </SafeAreaView>

      {/* Fact modal */}
      <Modal visible={!!learningFact} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeFact}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {learningFact && (
              <>
                <View style={styles.modalIconRow}>
                  <Text style={styles.modalIcon}>{learningFact.icon}</Text>
                </View>
                <Heading level={3}>{learningFact.title}</Heading>
                <Text variant="body" style={styles.modalBody}>{learningFact.content}</Text>
                <View style={styles.modalActions}>
                  {facts.length > 1 && (
                    <Button size="sm" variant="secondary" title="Next fact" onPress={nextFact} />
                  )}
                  <Button size="sm" variant="primary" title="Got it!" onPress={closeFact} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { alignItems: 'center', flex: 1 },
  headerRight: { width: 40 },
  flagTitle: { fontSize: 20, fontFamily: 'Fredoka-SemiBold', color: colors.text.primary },
  room: {
    flex: 1,
    minHeight: 220,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.6)',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  roomDecoration: {
    position: 'absolute',
    top: spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  roomEmoji: { fontSize: 48, marginBottom: spacing.xs },
  roomLabel: { fontFamily: 'Quicksand-Medium', color: colors.text.secondary, fontSize: 14 },
  avatarContainer: {
    position: 'absolute',
    left: spacing.lg,
    bottom: 24,
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  walkControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  walkBtn: {
    padding: spacing.sm,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 20,
  },
  floor: {
    height: 24,
    backgroundColor: colors.base.parchment,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  learnSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  factsScroll: { gap: spacing.sm, paddingVertical: spacing.sm, paddingRight: spacing.lg },
  factChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 2,
    backgroundColor: colors.base.cream,
  },
  factChipIcon: { fontSize: 20 },
  hint: { marginTop: spacing.xs },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: colors.base.cream,
    borderRadius: 24,
    padding: spacing.xl,
    maxWidth: 340,
    width: '100%',
  },
  modalIconRow: { alignItems: 'center', marginBottom: spacing.sm },
  modalIcon: { fontSize: 48 },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.lg },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
});
