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
import { getCountryQuiz, QuizQuestion } from '../../config/learningContent';
import { COUNTRY_HOUSES, RoomObject, HouseRoom } from '../../config/countryRooms';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = 70;
const ROOM_HEIGHT = 280;
const FACT_AURA_REWARD = 5;
const QUIZ_AURA_PER_CORRECT = 25;

type CountryRoomScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryRoom'>;
  route: { params: { countryId: string } };
};

export const CountryRoomScreen: React.FC<CountryRoomScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const houseData = COUNTRY_HOUSES[countryId];
  const { visby, user, addAura, getStreakMultiplier, userHouses } = useStore();

  const isOwner = userHouses.some((h) => h.countryId === countryId);
  const rooms = houseData?.rooms ?? [];

  // Room navigation
  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const currentRoom: HouseRoom | undefined = rooms[currentRoomIdx];

  // Interactive object modal
  const [activeObject, setActiveObject] = useState<RoomObject | null>(null);
  const [interactedObjects, setInteractedObjects] = useState<Set<string>>(new Set());

  // Facts
  const [learningFact, setLearningFact] = useState<CountryFact | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [readFacts, setReadFacts] = useState<Set<string>>(new Set());

  // Quiz
  const [quizActive, setQuizActive] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizSelected, setQuizSelected] = useState<number | null>(null);

  // Avatar walk
  const avatarX = useSharedValue(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2);
  const avatarDirection = useSharedValue<'left' | 'right'>('right');

  const multiplier = getStreakMultiplier();
  const aura = user?.aura ?? 0;
  const streak = user?.currentStreak ?? 0;

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
      Math.max(spacing.lg, avatarX.value - 28),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const moveRight = useCallback(() => {
    avatarDirection.value = 'right';
    avatarX.value = withSpring(
      Math.min(SCREEN_WIDTH - AVATAR_SIZE - spacing.lg, avatarX.value + 28),
      { damping: 14, stiffness: 120 }
    );
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: avatarX.value },
      { scaleX: avatarDirection.value === 'left' ? -1 : 1 },
    ],
  }));

  // Room navigation
  const goToRoom = useCallback((idx: number) => {
    if (idx >= 0 && idx < rooms.length) {
      setCurrentRoomIdx(idx);
      avatarX.value = withSpring(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2, { damping: 14, stiffness: 120 });
    }
  }, [rooms.length]);

  // Object interaction
  const handleObjectTap = useCallback((obj: RoomObject) => {
    if (!obj.interactive) return;
    setActiveObject(obj);
    if (!interactedObjects.has(obj.id) && obj.auraReward) {
      setInteractedObjects((prev) => new Set(prev).add(obj.id));
      addAura(obj.auraReward);
    }
  }, [interactedObjects, addAura]);

  // Facts
  const openFact = useCallback((fact: CountryFact) => {
    setLearningFact(fact);
    if (!readFacts.has(fact.id)) {
      setReadFacts((prev) => new Set(prev).add(fact.id));
      addAura(FACT_AURA_REWARD);
    }
  }, [readFacts, addAura]);

  const closeFact = useCallback(() => setLearningFact(null), []);

  const nextFact = useCallback(() => {
    if (!country?.facts.length) return;
    const nextIdx = (factIndex + 1) % country.facts.length;
    setFactIndex(nextIdx);
    const next = country.facts[nextIdx];
    setLearningFact(next);
    if (!readFacts.has(next.id)) {
      setReadFacts((prev) => new Set(prev).add(next.id));
      addAura(FACT_AURA_REWARD);
    }
  }, [country?.facts, factIndex, readFacts, addAura]);

  // Quiz
  const startQuiz = useCallback(() => {
    const qs = getCountryQuiz(countryId, 8);
    if (qs.length === 0) return;
    setQuizQuestions(qs);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizFinished(false);
    setQuizSelected(null);
    setQuizActive(true);
  }, [countryId]);

  const handleQuizAnswer = useCallback((optionIndex: number) => {
    if (quizSelected !== null) return;
    setQuizSelected(optionIndex);
    const correct = quizQuestions[quizIndex].correct === optionIndex;
    if (correct) setQuizScore((s) => s + 1);
    setTimeout(() => {
      if (quizIndex + 1 >= quizQuestions.length) {
        const finalScore = correct ? quizScore + 1 : quizScore;
        const reward = finalScore * QUIZ_AURA_PER_CORRECT;
        if (reward > 0) addAura(reward);
        setQuizFinished(true);
      } else {
        setQuizIndex((i) => i + 1);
        setQuizSelected(null);
      }
    }, 800);
  }, [quizSelected, quizIndex, quizQuestions, quizScore, addAura]);

  const totalInteractive = currentRoom?.objects.filter((o) => o.interactive).length ?? 0;
  const roomInteracted = currentRoom?.objects.filter((o) => o.interactive && interactedObjects.has(o.id)).length ?? 0;

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
        colors={[country.accentColor + '30', currentRoom?.wallColor ?? colors.base.cream, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.45, 1]}
      />
      <FloatingParticles count={6} variant="sparkle" opacity={0.2} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.flagTitle}>{country.flagEmoji} {country.name}</Text>
              {isOwner && <Caption style={styles.ownerTag}>🏠 Your House</Caption>}
            </View>
            <View style={styles.auraChip}>
              <Text style={styles.auraChipText}>✨ {aura}</Text>
            </View>
          </View>

          {/* Streak Banner */}
          {streak > 0 && (
            <View style={styles.streakBanner}>
              <Text style={styles.streakText}>🔥 {streak}-day streak</Text>
              <View style={styles.multiplierBadge}>
                <Text style={styles.multiplierText}>{multiplier.toFixed(1)}x</Text>
              </View>
            </View>
          )}

          {/* Room tabs */}
          {rooms.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomTabs}>
              {rooms.map((room, idx) => (
                <TouchableOpacity
                  key={room.id}
                  style={[styles.roomTab, idx === currentRoomIdx && styles.roomTabActive]}
                  onPress={() => goToRoom(idx)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.roomTabIcon}>{room.icon}</Text>
                  <Text style={idx === currentRoomIdx ? { ...styles.roomTabText, ...styles.roomTabTextActive } : styles.roomTabText}>
                    {room.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Room View */}
          {currentRoom && (
            <View style={[styles.roomContainer, { backgroundColor: currentRoom.wallColor }]}>
              {/* Room name */}
              <View style={styles.roomNameRow}>
                <Text style={styles.roomNameText}>{currentRoom.icon} {currentRoom.name}</Text>
                {totalInteractive > 0 && (
                  <View style={styles.roomProgressChip}>
                    <Text style={styles.roomProgressText}>{roomInteracted}/{totalInteractive} discovered</Text>
                  </View>
                )}
              </View>

              {/* Interactive objects */}
              <View style={styles.objectsLayer}>
                {currentRoom.objects.map((obj) => {
                  const wasInteracted = interactedObjects.has(obj.id);
                  return (
                    <TouchableOpacity
                      key={obj.id}
                      style={[
                        styles.roomObject,
                        { left: `${obj.x}%` as any, top: `${obj.y}%` as any },
                      ]}
                      onPress={() => obj.interactive ? handleObjectTap(obj) : undefined}
                      activeOpacity={obj.interactive ? 0.7 : 1}
                      disabled={!obj.interactive}
                    >
                      <Text style={styles.objectEmoji}>{obj.emoji}</Text>
                      <Text style={wasInteracted ? { ...styles.objectLabel, ...styles.objectLabelDone } : styles.objectLabel}>{obj.label}</Text>
                      {obj.interactive && !wasInteracted && (
                        <View style={styles.interactiveDot} />
                      )}
                      {obj.interactive && wasInteracted && (
                        <Text style={styles.objectCheck}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Avatar on the floor */}
              <Animated.View style={[styles.avatarContainer, avatarStyle]}>
                <VisbyCharacter
                  appearance={defaultAppearance}
                  equipped={visby?.equipped}
                  mood="curious"
                  size={AVATAR_SIZE}
                  animated
                />
              </Animated.View>

              {/* Walk controls + floor */}
              <View style={[styles.floor, { backgroundColor: currentRoom.floorColor }]}>
                <View style={styles.walkControls}>
                  <TouchableOpacity style={styles.walkBtn} onPress={moveLeft} activeOpacity={0.8}>
                    <Icon name="chevronLeft" size={28} color={colors.primary.wisteriaDark} />
                  </TouchableOpacity>
                  <Text variant="caption" color={colors.text.muted}>Walk</Text>
                  <TouchableOpacity style={styles.walkBtn} onPress={moveRight} activeOpacity={0.8}>
                    <Icon name="chevronRight" size={28} color={colors.primary.wisteriaDark} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Room nav arrows */}
              {currentRoomIdx > 0 && (
                <TouchableOpacity style={styles.roomNavLeft} onPress={() => goToRoom(currentRoomIdx - 1)}>
                  <View style={styles.doorArrow}>
                    <Text style={styles.doorArrowText}>🚪 ←</Text>
                    <Text style={styles.doorLabel}>{rooms[currentRoomIdx - 1].name}</Text>
                  </View>
                </TouchableOpacity>
              )}
              {currentRoomIdx < rooms.length - 1 && (
                <TouchableOpacity style={styles.roomNavRight} onPress={() => goToRoom(currentRoomIdx + 1)}>
                  <View style={styles.doorArrow}>
                    <Text style={styles.doorArrowText}>→ 🚪</Text>
                    <Text style={styles.doorLabel}>{rooms[currentRoomIdx + 1].name}</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionCard} onPress={startQuiz}>
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionLabel}>Take Quiz</Text>
              <Text style={styles.actionSub}>+{QUIZ_AURA_PER_CORRECT}/correct</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard} onPress={() => { if (facts.length > 0) { setFactIndex(0); openFact(facts[0]); } }}>
              <Text style={styles.actionEmoji}>📖</Text>
              <Text style={styles.actionLabel}>Read Facts</Text>
              <Text style={styles.actionSub}>{readFacts.size}/{facts.length} read</Text>
            </TouchableOpacity>
          </View>

          {/* Fun Facts scroll */}
          <View style={styles.factsSection}>
            <Text style={styles.sectionTitle}>✨ Fun Facts about {country.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.factsScroll}>
              {facts.map((fact, index) => {
                const isRead = readFacts.has(fact.id);
                return (
                  <TouchableOpacity
                    key={fact.id}
                    style={[styles.factChip, { borderColor: country.accentColor }, isRead && styles.factChipRead]}
                    onPress={() => { setFactIndex(index); openFact(fact); }}
                  >
                    <Text style={styles.factChipIcon}>{fact.icon}</Text>
                    <Text variant="caption" numberOfLines={1} style={isRead ? styles.factTextRead : undefined}>{fact.title}</Text>
                    {isRead && <Text style={styles.checkMark}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Earning guide */}
          <View style={styles.guideSection}>
            <Text style={styles.sectionTitle}>💰 Earn Aura Here</Text>
            <View style={styles.guideGrid}>
              <View style={styles.guideItem}>
                <Text style={styles.guideEmoji}>🏠</Text>
                <Text style={styles.guideLabel}>Explore rooms</Text>
                <Text style={styles.guideAmount}>+8 per object</Text>
              </View>
              <View style={styles.guideItem}>
                <Text style={styles.guideEmoji}>📝</Text>
                <Text style={styles.guideLabel}>Quiz</Text>
                <Text style={styles.guideAmount}>+{QUIZ_AURA_PER_CORRECT}/correct</Text>
              </View>
              <View style={styles.guideItem}>
                <Text style={styles.guideEmoji}>📖</Text>
                <Text style={styles.guideLabel}>Read facts</Text>
                <Text style={styles.guideAmount}>+{FACT_AURA_REWARD} each</Text>
              </View>
              <View style={styles.guideItem}>
                <Text style={styles.guideEmoji}>🔥</Text>
                <Text style={styles.guideLabel}>Streak</Text>
                <Text style={styles.guideAmount}>{multiplier.toFixed(1)}x boost</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Object detail modal */}
      <Modal visible={!!activeObject} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setActiveObject(null)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            {activeObject && (
              <>
                <View style={styles.modalIconRow}>
                  <Text style={styles.modalIcon}>{activeObject.emoji}</Text>
                </View>
                <Heading level={3}>{activeObject.learnTitle ?? activeObject.label}</Heading>
                <Text variant="body" style={styles.modalBody}>
                  {activeObject.learnContent ?? `This is a ${activeObject.label}.`}
                </Text>
                {activeObject.auraReward && (
                  <View style={styles.auraEarnedRow}>
                    <Text style={styles.auraEarnedText}>
                      ✨ +{Math.round(activeObject.auraReward * multiplier)} Aura earned!
                    </Text>
                  </View>
                )}
                <View style={styles.modalActions}>
                  <Button size="sm" variant="primary" title="Cool!" onPress={() => setActiveObject(null)} />
                </View>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>

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
                <View style={styles.auraEarnedRow}>
                  <Text style={styles.auraEarnedText}>✨ +{FACT_AURA_REWARD} Aura</Text>
                </View>
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

      {/* Quiz modal */}
      <Modal visible={quizActive} transparent animationType="slide">
        <Pressable style={styles.modalOverlay}>
          <View style={styles.quizModal}>
            {!quizFinished ? (
              quizQuestions.length > 0 ? (
                <>
                  <View style={styles.quizProgress}>
                    <Text style={styles.quizProgressText}>Q {quizIndex + 1}/{quizQuestions.length}</Text>
                    <Text style={styles.quizScoreText}>Score: {quizScore}</Text>
                  </View>
                  <Heading level={3} style={styles.quizQuestion}>{quizQuestions[quizIndex].question}</Heading>
                  <View style={styles.quizOptions}>
                    {quizQuestions[quizIndex].options.map((opt, i) => {
                      const isCorrect = quizQuestions[quizIndex].correct === i;
                      const isSelected = quizSelected === i;
                      return (
                        <TouchableOpacity
                          key={i}
                          style={{
                            ...styles.quizOption,
                            ...(quizSelected !== null && isCorrect ? styles.quizOptionCorrect : {}),
                            ...(quizSelected !== null && isSelected && !isCorrect ? styles.quizOptionWrong : {}),
                          }}
                          onPress={() => handleQuizAnswer(i)}
                          disabled={quizSelected !== null}
                          activeOpacity={0.8}
                        >
                          <Text style={{
                            ...styles.quizOptionText,
                            ...(quizSelected !== null && isCorrect ? styles.quizOptionTextCorrect : {}),
                            ...(quizSelected !== null && isSelected && !isCorrect ? styles.quizOptionTextWrong : {}),
                          }}>
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : (
                <Text>No quiz available for this country yet.</Text>
              )
            ) : (
              <View style={styles.quizResults}>
                <Text style={styles.quizResultEmoji}>
                  {quizScore >= quizQuestions.length * 0.8 ? '🏆' : quizScore >= quizQuestions.length * 0.5 ? '⭐' : '📚'}
                </Text>
                <Heading level={2}>Quiz Complete!</Heading>
                <Text style={styles.quizResultScore}>{quizScore}/{quizQuestions.length} correct</Text>
                <View style={styles.quizRewardRow}>
                  <Text style={styles.quizRewardText}>✨ +{Math.round(quizScore * QUIZ_AURA_PER_CORRECT * multiplier)} Aura</Text>
                  {streak > 0 && <Text style={styles.quizRewardMultiplier}>({multiplier.toFixed(1)}x streak!)</Text>}
                </View>
                <View style={styles.quizResultActions}>
                  <Button title="Try Again" variant="secondary" onPress={startQuiz} style={styles.quizResultBtn} />
                  <Button title="Done" variant="primary" onPress={() => setQuizActive(false)} style={styles.quizResultBtn} />
                </View>
              </View>
            )}
            {!quizFinished && (
              <TouchableOpacity style={styles.quizClose} onPress={() => setQuizActive(false)}>
                <Text style={styles.quizCloseText}>✕ Close</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { paddingBottom: spacing.xxl * 3 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { alignItems: 'center', flex: 1 },
  flagTitle: { fontSize: 20, fontFamily: 'Baloo2-SemiBold', color: colors.text.primary },
  ownerTag: { color: '#4CAF50', fontFamily: 'Nunito-Bold', fontSize: 12 },
  auraChip: {
    backgroundColor: colors.reward.peach, paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs, borderRadius: 16,
  },
  auraChipText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.reward.gold },

  streakBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: spacing.xs,
    paddingVertical: 6, paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255, 200, 100, 0.2)', borderRadius: 14,
    borderWidth: 1, borderColor: 'rgba(255, 180, 50, 0.3)',
  },
  streakText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#D4760A' },
  multiplierBadge: { backgroundColor: '#FFD700', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  multiplierText: { fontFamily: 'Baloo2-Bold', fontSize: 12, color: '#7A5A00' },

  // Room tabs
  roomTabs: { paddingHorizontal: spacing.md, gap: spacing.xs, paddingVertical: spacing.sm },
  roomTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 14,
    borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1.5, borderColor: 'transparent',
  },
  roomTabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.primary.wisteria,
    shadowColor: colors.primary.wisteria, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 3,
  },
  roomTabIcon: { fontSize: 18 },
  roomTabText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.secondary },
  roomTabTextActive: { color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold' },

  // Room container
  roomContainer: {
    marginHorizontal: spacing.md, borderRadius: 24,
    overflow: 'hidden', minHeight: ROOM_HEIGHT,
    position: 'relative',
  },
  roomNameRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
  },
  roomNameText: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.text.primary },
  roomProgressChip: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  roomProgressText: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: '#4CAF50' },

  // Objects
  objectsLayer: {
    height: ROOM_HEIGHT - 80, position: 'relative', marginTop: spacing.xs,
  },
  roomObject: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -24 }, { translateY: -16 }],
  },
  objectEmoji: { fontSize: 30 },
  objectLabel: { fontFamily: 'Nunito-Medium', fontSize: 9, color: colors.text.secondary, textAlign: 'center', maxWidth: 64 },
  objectLabelDone: { color: '#4CAF50' },
  interactiveDot: {
    position: 'absolute', top: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FFD700', borderWidth: 1.5, borderColor: '#FFFFFF',
  },
  objectCheck: { fontSize: 10, color: '#4CAF50', fontWeight: '700', position: 'absolute', top: -4, right: -4 },

  // Avatar
  avatarContainer: {
    position: 'absolute', left: spacing.lg, bottom: 50,
    width: AVATAR_SIZE, height: AVATAR_SIZE,
  },

  // Floor
  floor: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 50, borderTopLeftRadius: 12, borderTopRightRadius: 12,
    justifyContent: 'center',
  },
  walkControls: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  walkBtn: {
    padding: 6, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 16,
  },

  // Door navigation
  roomNavLeft: { position: 'absolute', left: 4, top: '40%' as any, zIndex: 10 },
  roomNavRight: { position: 'absolute', right: 4, top: '40%' as any, zIndex: 10 },
  doorArrow: {
    alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 6, paddingHorizontal: 8, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
  },
  doorArrowText: { fontSize: 16 },
  doorLabel: { fontFamily: 'Nunito-Medium', fontSize: 9, color: colors.text.secondary, maxWidth: 56, textAlign: 'center' },

  // Quick actions
  actionsRow: {
    flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.lg,
  },
  actionCard: {
    flex: 1, alignItems: 'center', padding: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(184, 165, 224, 0.2)',
  },
  actionEmoji: { fontSize: 28, marginBottom: 4 },
  actionLabel: { fontFamily: 'Baloo2-SemiBold', fontSize: 14, color: colors.text.primary },
  actionSub: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.muted },

  // Facts section
  factsSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  sectionTitle: { fontFamily: 'Baloo2-Bold', fontSize: 17, color: colors.text.primary, marginBottom: 6 },
  factsScroll: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  factChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: 8, paddingHorizontal: 12,
    borderRadius: 18, borderWidth: 2, backgroundColor: colors.base.cream,
  },
  factChipRead: { backgroundColor: 'rgba(200, 230, 200, 0.4)', borderStyle: 'dashed' as any },
  factTextRead: { color: colors.text.muted },
  checkMark: { fontSize: 13, color: '#4CAF50', fontWeight: '700' },
  factChipIcon: { fontSize: 18 },

  // Guide
  guideSection: {
    marginHorizontal: spacing.lg, marginTop: spacing.lg,
    padding: spacing.lg, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20,
  },
  guideGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.xs },
  guideItem: {
    width: '46%' as any, alignItems: 'center', padding: spacing.sm,
    backgroundColor: colors.base.cream, borderRadius: 14,
  },
  guideEmoji: { fontSize: 24, marginBottom: 2 },
  guideLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 12, color: colors.text.primary, textAlign: 'center' },
  guideAmount: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.secondary, textAlign: 'center' },

  // Modals
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  modalContent: {
    backgroundColor: '#FFFFFF', borderRadius: 24,
    padding: spacing.xl, maxWidth: 340, width: '100%',
  },
  modalIconRow: { alignItems: 'center', marginBottom: spacing.sm },
  modalIcon: { fontSize: 48 },
  modalBody: { marginTop: spacing.sm, marginBottom: spacing.sm },
  auraEarnedRow: {
    alignItems: 'center', paddingVertical: 8, marginBottom: spacing.sm,
    backgroundColor: 'rgba(255,215,0,0.15)', borderRadius: 12,
  },
  auraEarnedText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: '#D4760A' },
  modalActions: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'flex-end' },

  // Quiz modal
  quizModal: {
    backgroundColor: '#FFFFFF', borderRadius: 28,
    padding: spacing.xl, maxWidth: 400, width: '100%', maxHeight: '85%',
  },
  quizProgress: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  quizProgressText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  quizScoreText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.primary.wisteriaDark },
  quizQuestion: { marginBottom: spacing.lg },
  quizOptions: { gap: spacing.sm },
  quizOption: {
    padding: spacing.md, borderRadius: 16, borderWidth: 2,
    borderColor: colors.primary.wisteriaFaded, backgroundColor: '#FAFAFE',
  },
  quizOptionCorrect: { borderColor: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.1)' },
  quizOptionWrong: { borderColor: '#F44336', backgroundColor: 'rgba(244, 67, 54, 0.1)' },
  quizOptionText: { fontFamily: 'Nunito-SemiBold', fontSize: 15, color: colors.text.primary },
  quizOptionTextCorrect: { color: '#2E7D32' },
  quizOptionTextWrong: { color: '#C62828' },
  quizClose: { alignSelf: 'center', paddingVertical: spacing.md },
  quizCloseText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.muted },
  quizResults: { alignItems: 'center', paddingVertical: spacing.md },
  quizResultEmoji: { fontSize: 56, marginBottom: spacing.sm },
  quizResultScore: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.text.primary, marginVertical: spacing.sm },
  quizRewardRow: { alignItems: 'center', marginVertical: spacing.md },
  quizRewardText: { fontFamily: 'Baloo2-Bold', fontSize: 18, color: '#D4760A' },
  quizRewardMultiplier: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.reward.gold, marginTop: 4 },
  quizResultActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  quizResultBtn: { minWidth: 100 },
});
