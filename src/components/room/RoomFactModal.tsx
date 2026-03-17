import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  FadeInDown,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Heading } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon, IconName } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useStore } from '../../store/useStore';
import type { CountryFact } from '../../types';

const ELABORATION_PROMPTS: { question: string; explanation: string }[] = [
  { question: 'Why do you think people do this?', explanation: 'Reflecting helps you connect new ideas to what you already know.' },
  { question: 'How is this different from your culture?', explanation: 'Comparing cultures deepens understanding of both.' },
  { question: 'What would happen if everyone did this?', explanation: 'Thinking about impact helps you remember why it matters.' },
  { question: 'Can you think of something similar where you live?', explanation: 'Making connections strengthens memory.' },
  { question: 'Why do you think this tradition started?', explanation: 'Understanding origins helps the fact stick with you.' },
  { question: 'How would you feel if you visited this place?', explanation: 'Imagining yourself there makes learning more personal.' },
  { question: 'What surprised you about this fact?', explanation: 'Surprise creates stronger memories.' },
  { question: 'How could you share this with a friend?', explanation: 'Explaining to others reinforces what you learned.' },
  { question: 'What else would you like to know about this?', explanation: 'Curiosity drives deeper learning.' },
  { question: 'Why do you think this matters to people?', explanation: 'Understanding significance helps you remember.' },
];

interface RoomFactModalProps {
  visible: boolean;
  fact: CountryFact | null;
  countryId: string;
  auraReward: number;
  hasMultipleFacts: boolean;
  onNextFact: () => void;
  onClose: () => void;
}

export const RoomFactModal = React.memo<RoomFactModalProps>(({
  visible,
  fact,
  countryId,
  auraReward,
  hasMultipleFacts,
  onNextFact,
  onClose,
}) => {
  const [elaborationPrompt, setElaborationPrompt] = useState<typeof ELABORATION_PROMPTS[0] | null>(null);
  const [elaborationRevealed, setElaborationRevealed] = useState(false);
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [showTeachBack, setShowTeachBack] = useState(false);
  const [teachBackAnswer, setTeachBackAnswer] = useState<number | null>(null);
  const { addDiscovery, addAura } = useStore();
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (visible) {
      const prompt = ELABORATION_PROMPTS[Math.floor(Math.random() * ELABORATION_PROMPTS.length)];
      setElaborationPrompt(prompt);
      setElaborationRevealed(false);
      setSavedToJournal(false);
      setShowTeachBack(false);
      setTeachBackAnswer(null);
      scale.value = withSpring(1, { damping: 14, stiffness: 120 });
    } else {
      scale.value = 0.95;
    }
  }, [visible]);

  const generateTeachBackOptions = (factContent: string): string[] => {
    const keywords = factContent.split(' ').slice(0, 8).join(' ');
    const correct = `${keywords}...`;
    const wrong1 = 'This fact is about weather patterns around the world.';
    const wrong2 = 'This describes how volcanoes form underground.';
    const options = [correct, wrong1, wrong2];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const handleTeachBackAnswer = (index: number) => {
    if (teachBackAnswer !== null) return;
    setTeachBackAnswer(index);
    const factContent = fact?.content || '';
    const keywords = factContent.split(' ').slice(0, 8).join(' ');
    const isCorrect = generateTeachBackOptions(factContent)[index]?.startsWith(keywords);
    if (isCorrect) {
      addAura(10);
    }
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleSaveToJournal = () => {
    if (!fact) return;
    addDiscovery(fact.title, countryId, 'fact');
    setSavedToJournal(true);
    timersRef.current.push(setTimeout(() => setSavedToJournal(false), 1800));
  };

  if (!visible || !fact) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={ZoomIn.duration(300).springify()}>
        <Animated.View style={[styles.card, cardAnimatedStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={(e) => e.stopPropagation()}>
          <LinearGradient
            colors={[colors.surface.lavender, colors.base.cream, colors.calm.skyLight]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          {fact.imageUrl ? (
            <View style={styles.imageWrap}>
              <Image
                source={{ uri: fact.imageUrl }}
                style={styles.image}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
              <View style={styles.imageOverlay} />
            </View>
          ) : (
            <View style={styles.iconWrap}>
              <Icon name={fact.icon as IconName} size={48} color={colors.primary.wisteriaDark} />
            </View>
          )}
          <Animated.View entering={FadeInDown.duration(400).delay(80)} style={styles.body}>
            <Heading level={2} style={styles.title}>{fact.title}</Heading>
            <Text variant="body" style={styles.content}>{fact.content}</Text>
            <View style={styles.auraRow}>
              <Icon name="sparkles" size={18} color={colors.reward.gold} />
              <Text style={styles.auraText}>+{auraReward} Aura</Text>
            </View>
            {elaborationPrompt && (
              <Pressable
                style={styles.elaborationWrap}
                onPress={() => setElaborationRevealed((v) => !v)}
              >
                <Text variant="body" style={styles.elaborationQuestion}>
                  Think about it: {elaborationPrompt.question}
                </Text>
                {elaborationRevealed && (
                  <Text variant="caption" style={styles.elaborationExplanation}>
                    {elaborationPrompt.explanation}
                  </Text>
                )}
              </Pressable>
            )}
            <TouchableOpacity
              style={styles.saveToJournalBtn}
              onPress={handleSaveToJournal}
              activeOpacity={0.8}
              disabled={savedToJournal}
            >
              {savedToJournal ? (
                <>
                  <Icon name="check" size={18} color={colors.success.emerald} />
                  <Text style={styles.savedText}>Saved!</Text>
                </>
              ) : (
                <>
                  <Icon name="book" size={18} color={colors.calm.ocean} />
                  <Text style={styles.saveToJournalText}>Save to journal</Text>
                </>
              )}
            </TouchableOpacity>
            {showTeachBack ? (
              <View style={styles.teachBackWrap}>
                <Text style={styles.teachBackTitle}>Can you explain what you just learned?</Text>
                <Text style={styles.teachBackSubtitle}>Pick the best summary:</Text>
                {(fact ? generateTeachBackOptions(fact.content) : []).map((opt, i) => {
                  const factContent = fact?.content || '';
                  const keywords = factContent.split(' ').slice(0, 8).join(' ');
                  const isCorrect = opt.startsWith(keywords);
                  const isSelected = teachBackAnswer === i;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        styles.teachBackOption,
                        teachBackAnswer !== null && isCorrect && styles.teachBackCorrect,
                        teachBackAnswer !== null && isSelected && !isCorrect && styles.teachBackWrong,
                      ]}
                      onPress={() => handleTeachBackAnswer(i)}
                      disabled={teachBackAnswer !== null}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.teachBackOptionText} numberOfLines={2}>{opt}</Text>
                    </TouchableOpacity>
                  );
                })}
                {teachBackAnswer !== null && (
                  <View style={styles.teachBackResult}>
                    <Text style={styles.teachBackResultText}>
                      {(() => {
                        const factContent = fact?.content || '';
                        const keywords = factContent.split(' ').slice(0, 8).join(' ');
                        const isCorrect = generateTeachBackOptions(factContent)[teachBackAnswer]?.startsWith(keywords);
                        return isCorrect ? 'Great teacher! +10 Aura' : 'Not quite, but you\'re learning!';
                      })()}
                    </Text>
                    <Button size="sm" variant="primary" title="Continue" onPress={onClose} />
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.actions}>
                {hasMultipleFacts && (
                  <Button size="sm" variant="secondary" title="Next fact" onPress={onNextFact} />
                )}
                <Button size="sm" variant="primary" title="Got it!" onPress={() => setShowTeachBack(true)} />
              </View>
            )}
          </Animated.View>
        </Pressable>
        </Animated.View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
});

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  card: {
    maxWidth: 360, width: '100%', borderRadius: 28, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 8px 24px rgba(0,0,0,0.15)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 24, elevation: 8 }),
  },
  imageWrap: { width: '100%', height: 180, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.3)' },
  iconWrap: {
    paddingVertical: spacing.lg, alignItems: 'center',
    backgroundColor: colors.primary.wisteriaFaded,
  },
  body: { padding: spacing.xl },
  title: { marginBottom: spacing.sm, textAlign: 'center' },
  content: { marginBottom: spacing.md, textAlign: 'center', lineHeight: 22 },
  auraRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs,
    paddingVertical: 8, marginBottom: spacing.sm,
    backgroundColor: colors.status.streakBg, borderRadius: 12,
    borderWidth: 1, borderColor: colors.reward.gold + '30',
  },
  auraText: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.status.streak },
  elaborationWrap: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight + '80',
  },
  elaborationQuestion: {
    color: colors.primary.wisteriaDark,
    fontStyle: 'italic',
  },
  elaborationExplanation: {
    marginTop: spacing.sm,
    color: colors.text.secondary,
  },
  saveToJournalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.calm.skyLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.calm.ocean + '40',
  },
  saveToJournalText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.calm.ocean },
  savedText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.success.emerald },
  actions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },
  teachBackWrap: {
    marginTop: spacing.sm,
  },
  teachBackTitle: {
    fontFamily: 'Nunito-Bold', fontSize: 15, color: colors.primary.wisteriaDark,
    textAlign: 'center', marginBottom: 4,
  },
  teachBackSubtitle: {
    fontFamily: 'Nunito-Medium', fontSize: 13, color: colors.text.secondary,
    textAlign: 'center', marginBottom: spacing.sm,
  },
  teachBackOption: {
    padding: spacing.sm, borderRadius: 12, borderWidth: 2,
    borderColor: colors.primary.wisteriaFaded, backgroundColor: '#FAFAFE',
    marginBottom: spacing.xs,
  },
  teachBackCorrect: { borderColor: '#4CAF50', backgroundColor: 'rgba(76,175,80,0.1)' },
  teachBackWrong: { borderColor: '#F44336', backgroundColor: 'rgba(244,67,54,0.1)' },
  teachBackOptionText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary },
  teachBackResult: {
    alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm,
  },
  teachBackResultText: {
    fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.amber,
  },
});
