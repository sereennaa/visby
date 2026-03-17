import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  FadeIn,
  ZoomIn,
  SlideInDown,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text, Heading, Caption } from '../ui/Text';
import { Button } from '../ui/Button';
import { Icon } from '../ui/Icon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { soundService } from '../../services/sound';
import type { QuizQuestion } from '../../config/learningContent';

const CONFETTI_COLORS = ['#FFD700', '#FF6B6B', '#4CAF50', '#42A5F5', '#AB47BC', '#FF9800'];

interface QuizOptionButtonProps {
  option: string;
  index: number;
  isCorrectOption: boolean;
  selected: number | null;
  onPress: (index: number) => void;
}

const QuizOptionButton: React.FC<QuizOptionButtonProps> = ({ option, index, isCorrectOption, selected, onPress }) => {
  const scale = useSharedValue(1);
  const isSelected = selected === index;

  useEffect(() => {
    if (isSelected) {
      scale.value = withSequence(
        withSpring(1.06, { damping: 4, stiffness: 300 }),
        withSpring(1, { damping: 10, stiffness: 200 }),
      );
    } else {
      scale.value = 1;
    }
  }, [isSelected]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[
          styles.option,
          selected !== null && isCorrectOption && styles.optionCorrect,
          selected !== null && isSelected && !isCorrectOption && styles.optionWrong,
        ]}
        onPress={() => onPress(index)}
        disabled={selected !== null}
        activeOpacity={0.8}
      >
        <View style={styles.optionContent}>
          {selected !== null && isCorrectOption && (
            <Animated.View entering={ZoomIn.duration(300)}>
              <Icon name="checkCircle" size={18} color="#2E7D32" />
            </Animated.View>
          )}
          {selected !== null && isSelected && !isCorrectOption && (
            <Animated.View entering={ZoomIn.duration(300)}>
              <Icon name="close" size={18} color="#C62828" />
            </Animated.View>
          )}
          <Text style={[
            styles.optionText,
            selected !== null && isCorrectOption && styles.optionTextCorrect,
            selected !== null && isSelected && !isCorrectOption && styles.optionTextWrong,
          ]}>
            {option}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ConfettiPiece: React.FC<{ index: number }> = ({ index }) => {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const left = 10 + (index * 37) % 80;
  const delay = index * 60;
  const size = 6 + (index % 4) * 2;
  const rotation = (index * 45) % 360;

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(400).springify()}
      style={[
        styles.confettiPiece,
        {
          left: `${left}%`,
          top: `${10 + (index * 13) % 60}%`,
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: size * 0.15,
          transform: [{ rotate: `${rotation}deg` }],
        },
      ]}
    />
  );
};

interface RoomQuizModalProps {
  visible: boolean;
  onClose: () => void;
  countryId: string;
  countryName: string;
  streakMultiplier: number;
  streak: number;
  isPlaceComplete: boolean;
  getQuestions: () => QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
}

export const RoomQuizModal = React.memo<RoomQuizModalProps>(({
  visible,
  onClose,
  countryName,
  streakMultiplier,
  streak,
  isPlaceComplete,
  getQuestions,
  onComplete,
}) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const AURA_PER_CORRECT = 25;
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const startQuiz = useCallback(() => {
    const qs = getQuestions();
    if (qs.length === 0) return;
    setQuestions(qs);
    setIndex(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
    setShowConfetti(false);
  }, [getQuestions]);

  React.useEffect(() => {
    if (visible) startQuiz();
  }, [visible, startQuiz]);

  const handleAnswer = useCallback((optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    const correct = questions[index].correct === optionIndex;
    const newScore = correct ? score + 1 : score;
    if (correct) {
      setScore(newScore);
      soundService.playMatch();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      soundService.playTap();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    timersRef.current.push(setTimeout(() => {
      if (index + 1 >= questions.length) {
        const highScore = newScore >= questions.length * 0.8;
        if (highScore) {
          setShowConfetti(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        onComplete(newScore, questions.length);
        setFinished(true);
      } else {
        setIndex((i) => i + 1);
        setSelected(null);
      }
    }, 900));
  }, [selected, index, questions, score, onComplete]);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <Pressable style={styles.overlay}>
        <Animated.View entering={SlideInDown.duration(400).springify()} style={styles.quizModal}>
          {!finished ? (
            questions.length > 0 ? (
              <>
                <View style={styles.progress}>
                  <View style={styles.progressBarTrack}>
                    <Animated.View
                      style={[
                        styles.progressBarFill,
                        { width: `${((index + (selected !== null ? 1 : 0)) / questions.length) * 100}%` },
                      ]}
                    />
                  </View>
                  <View style={styles.progressRow}>
                    <Text style={styles.progressText}>Q {index + 1}/{questions.length}</Text>
                    <Text style={styles.scoreText}>Score: {score}</Text>
                  </View>
                </View>
                {questions[index].imageUrl && (
                  <View style={styles.questionImageWrap}>
                    <Image
                    source={{ uri: questions[index].imageUrl }}
                    style={styles.questionImage}
                    contentFit="cover"
                    transition={200}
                    placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
                  />
                  </View>
                )}
                <Heading level={3} style={styles.question}>{questions[index].question}</Heading>
                <View style={styles.options}>
                  {questions[index].options.map((opt, i) => (
                    <QuizOptionButton
                      key={`${index}-${i}`}
                      option={opt}
                      index={i}
                      isCorrectOption={questions[index].correct === i}
                      selected={selected}
                      onPress={handleAnswer}
                    />
                  ))}
                </View>
              </>
            ) : (
              <Text>No quiz available for this country yet.</Text>
            )
          ) : (
            <View style={styles.results}>
              {showConfetti && (
                <View style={styles.confettiContainer}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <ConfettiPiece key={i} index={i} />
                  ))}
                </View>
              )}
              <Animated.View entering={ZoomIn.duration(500).springify()}>
                <Icon
                  name={score >= questions.length * 0.8 ? 'trophy' : score >= questions.length * 0.5 ? 'star' : 'book'}
                  size={56}
                  color={colors.reward.gold}
                />
              </Animated.View>
              <Heading level={2}>Quiz Complete!</Heading>
              <Text style={styles.resultScore}>{score}/{questions.length} correct</Text>
              <View style={styles.rewardRow}>
                <Text style={styles.rewardText}>+{Math.round(score * AURA_PER_CORRECT * streakMultiplier)} Aura</Text>
                {streak > 0 && (
                  <Text style={styles.rewardMultiplier}>({streakMultiplier.toFixed(1)}x streak!)</Text>
                )}
              </View>
              {isPlaceComplete && (
                <View style={styles.placeCompleteRow}>
                  <Icon name="trophy" size={20} color={colors.reward.gold} />
                  <Text style={styles.placeCompleteText}>You've mastered {countryName}! Explore the next place.</Text>
                </View>
              )}
              <View style={styles.resultActions}>
                <Button title="Try Again" variant="secondary" onPress={startQuiz} style={styles.resultBtn} />
                <Button title="Done" variant="primary" onPress={onClose} style={styles.resultBtn} />
              </View>
            </View>
          )}
          {!finished && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="close" size={16} color={colors.text.secondary} />
                <Text style={styles.closeText}>Close</Text>
              </View>
            </TouchableOpacity>
          )}
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
  quizModal: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '85%',
  },
  progress: { marginBottom: spacing.md },
  progressBarTrack: {
    height: 4, borderRadius: 2, backgroundColor: colors.primary.wisteriaFaded,
    marginBottom: spacing.sm, overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%', borderRadius: 2, backgroundColor: colors.primary.wisteria,
  },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  scoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.primary.wisteriaDark },
  questionImageWrap: {
    width: '100%', height: 140, borderRadius: 16, overflow: 'hidden', marginBottom: spacing.md,
    backgroundColor: colors.calm.skyLight, borderWidth: 1, borderColor: colors.primary.wisteriaLight + '60',
  },
  questionImage: { width: '100%', height: '100%' },
  question: { marginBottom: spacing.lg },
  options: { gap: spacing.sm },
  option: {
    padding: spacing.md, borderRadius: 16, borderWidth: 2,
    borderColor: colors.primary.wisteriaFaded, backgroundColor: '#FAFAFE',
  },
  optionCorrect: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  optionWrong: { borderColor: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)' },
  optionContent: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  optionText: { fontFamily: 'Nunito-SemiBold', fontSize: 15, color: colors.text.primary, flex: 1 },
  optionTextCorrect: { color: '#2E7D32' },
  optionTextWrong: { color: '#C62828' },
  closeBtn: { alignSelf: 'center', paddingVertical: spacing.md },
  closeText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.muted },
  results: { alignItems: 'center', paddingVertical: spacing.md },
  resultScore: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.text.primary, marginVertical: spacing.sm },
  rewardRow: { alignItems: 'center', marginVertical: spacing.md },
  rewardText: { fontFamily: 'Baloo2-Bold', fontSize: 18, color: '#D4760A' },
  rewardMultiplier: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.reward.gold, marginTop: 4 },
  placeCompleteRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    marginBottom: spacing.md, paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.success.honeydew, borderRadius: 14, borderWidth: 1, borderColor: colors.success.emerald + '40',
  },
  placeCompleteText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary, flex: 1 },
  resultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  resultBtn: { minWidth: 100 },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  confettiPiece: {
    position: 'absolute',
  },
});
