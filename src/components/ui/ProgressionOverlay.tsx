import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn, BounceIn } from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from './Text';
import { Button } from './Button';
import { Icon, IconName } from './Icon';
import { useStore, getGrowthStage } from '../../store/useStore';

const LEVEL_TITLES: Record<number, string> = {
  1: 'Novice Explorer',
  2: 'Curious Wanderer',
  3: 'Path Finder',
  4: 'Trail Blazer',
  5: 'Globe Trotter',
  6: 'World Walker',
  7: 'Culture Seeker',
  8: 'Memory Keeper',
  9: 'Horizon Chaser',
  10: 'Legendary Voyager',
};

const STAGE_INFO: Record<string, { title: string; desc: string; icon: IconName }> = {
  egg: { title: 'A New Egg!', desc: 'Take care of your Visby to hatch it!', icon: 'sparkles' },
  baby: { title: 'Baby Visby!', desc: 'Your egg hatched! Keep caring for your Visby!', icon: 'heart' },
  kid: { title: 'Kid Visby!', desc: 'Your Visby is growing up! Keep exploring!', icon: 'star' },
  teen: { title: 'Teen Visby!', desc: 'Your Visby is getting stronger and smarter!', icon: 'rocket' },
  adult: { title: 'Adult Visby!', desc: 'Your Visby is fully grown! Legendary explorer!', icon: 'trophy' },
};

const STAGE_LABELS = ['E', 'B', 'K', 'T', 'A'];
const STAGES = ['egg', 'baby', 'kid', 'teen', 'adult'];

export const ProgressionOverlay: React.FC = () => {
  const { user } = useStore();
  const [lastCelebratedLevel, setLastCelebratedLevel] = useState(user?.level || 1);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showStageUp, setShowStageUp] = useState(false);
  const [lastStage, setLastStage] = useState(getGrowthStage(user?.totalCarePoints || 0));

  useEffect(() => {
    if (!user) return;

    if (user.level > lastCelebratedLevel) {
      setShowLevelUp(true);
      setLastCelebratedLevel(user.level);
    }

    const currentStage = getGrowthStage(user.totalCarePoints || 0);
    if (currentStage !== lastStage) {
      setShowStageUp(true);
      setLastStage(currentStage);
    }
  }, [user?.level, user?.totalCarePoints]);

  const stage = getGrowthStage(user?.totalCarePoints || 0);
  const info = STAGE_INFO[stage];

  return (
    <>
      <Modal visible={showLevelUp} transparent animationType="fade">
        <View style={s.overlay}>
          <Animated.View entering={ZoomIn.duration(500)} style={s.card}>
            <LinearGradient colors={['#FFD700', '#FFA500']} style={s.iconCircle}>
              <Icon name="star" size={48} color="#FFFFFF" />
            </LinearGradient>
            <Animated.View entering={BounceIn.delay(300)}>
              <Heading level={1} style={s.title}>Level Up!</Heading>
            </Animated.View>
            <View style={s.levelBadge}>
              <Text style={s.levelNum}>{user?.level || 1}</Text>
            </View>
            <Text style={s.desc}>
              {LEVEL_TITLES[user?.level || 1] || 'Explorer'}
            </Text>
            <Caption style={s.sub}>Keep exploring to level up more!</Caption>
            <Button title="Awesome!" onPress={() => setShowLevelUp(false)} variant="primary" style={s.btn} />
          </Animated.View>
        </View>
      </Modal>

      <Modal visible={showStageUp} transparent animationType="fade">
        <View style={s.overlay}>
          <Animated.View entering={ZoomIn.duration(500)} style={s.card}>
            <LinearGradient colors={['#B794F4', '#8B6FC0']} style={s.iconCircle}>
              <Icon name={info?.icon || 'sparkles'} size={48} color="#FFFFFF" />
            </LinearGradient>
            <Animated.View entering={BounceIn.delay(300)}>
              <Heading level={1} style={s.title}>{info?.title || 'Evolution!'}</Heading>
            </Animated.View>
            <Text style={s.desc}>{info?.desc || 'Your Visby evolved!'}</Text>
            <View style={s.stageRow}>
              {STAGES.map((st, i) => (
                <View key={st} style={[s.stageDot, st === stage && s.stageDotActive]}>
                  <Text style={[s.stageDotText, st === stage && s.stageDotTextActive]}>
                    {STAGE_LABELS[i]}
                  </Text>
                </View>
              ))}
            </View>
            <Button title="Amazing!" onPress={() => setShowStageUp(false)} variant="primary" style={s.btn} />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: spacing.radius.xxl,
    maxWidth: 320,
    width: '85%',
    alignItems: 'center',
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  levelBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  levelNum: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  desc: {
    textAlign: 'center',
    marginTop: spacing.md,
  },
  sub: {
    textAlign: 'center',
    marginTop: spacing.xs,
    color: colors.text.muted,
  },
  btn: {
    marginTop: spacing.xl,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  stageDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.base.parchment ?? '#E8E0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotActive: {
    backgroundColor: '#8B6FC0',
  },
  stageDotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.muted,
  },
  stageDotTextActive: {
    color: '#FFFFFF',
  },
});

export default ProgressionOverlay;
