import React from 'react';
import { View, StyleSheet, Modal, Pressable } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading, Caption } from '../ui/Text';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useStore } from '../../store/useStore';

interface WeeklyRecapModalProps {
  visible: boolean;
  onClose: () => void;
}

const STAT_CONFIG: { key: string; label: string; icon: IconName }[] = [
  { key: 'countriesExplored', label: 'Countries explored', icon: 'globe' },
  { key: 'quizzesCompleted', label: 'Quizzes completed', icon: 'quiz' },
  { key: 'factsLearned', label: 'Facts learned', icon: 'book' },
  { key: 'auraEarned', label: 'Aura earned', icon: 'sparkles' },
  { key: 'streakDays', label: 'Streak days', icon: 'flame' },
];

export const WeeklyRecapModal: React.FC<WeeklyRecapModalProps> = ({ visible, onClose }) => {
  const getWeeklyRecapStats = useStore((s) => s.getWeeklyRecapStats);
  const stats = getWeeklyRecapStats();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()}>
          <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[colors.primary.wisteriaFaded, colors.surface.lavender]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            <View style={styles.iconCircle}>
              <Icon name="trophy" size={40} color={colors.primary.wisteriaDark} />
            </View>
            <Heading level={2} style={styles.title}>This Week in Review</Heading>
            <Card variant="elevated" padding="md" style={styles.statsCard}>
              <View style={styles.statsGrid}>
                {STAT_CONFIG.map(({ key, label, icon }) => (
                  <View key={key} style={styles.statItem}>
                    <View style={styles.statIconWrap}>
                      <Icon name={icon} size={22} color={colors.primary.wisteriaDark} />
                    </View>
                    <Text variant="body" style={styles.statValue}>
                      {stats[key as keyof typeof stats] ?? 0}
                    </Text>
                    <Caption style={styles.statLabel}>{label}</Caption>
                  </View>
                ))}
              </View>
            </Card>
            <Button title="Great job!" onPress={onClose} variant="primary" style={styles.button} />
          </LinearGradient>
        </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modal: {
    maxWidth: 360,
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  gradient: {
    padding: spacing.xl,
    borderRadius: 28,
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsCard: {
    width: '100%',
    marginBottom: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  statValue: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: colors.text.primary,
  },
  statLabel: {
    textAlign: 'center',
    fontSize: 11,
    marginTop: 2,
  },
  button: {
    minWidth: 160,
  },
});
