import React, { useCallback, useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInRight,
  FadeInUp,
  FadeOutLeft,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Heading, Text, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { AURA_REWARDS, BITE_CATEGORIES_INFO, ANIMATION_CONFIG } from '../../config/constants';
import { showToast } from '../../store/useToast';
import { RootStackParamList, Bite } from '../../types';
import {
  getCountriesWithDishes,
  getDishesByCountry,
  searchDishes,
  type WorldDish,
} from '../../config/worldFoods';
import { AchievementCeremony } from '../../components/effects/AchievementCeremony';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type DishCardPressableProps = {
  dish: WorldDish;
  discovered: boolean;
  onPress: (dish: WorldDish) => void;
};

const DishCardPressable: React.FC<DishCardPressableProps> = React.memo(({ dish, discovered, onPress }) => {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.96, ANIMATION_CONFIG.SPRING);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, ANIMATION_CONFIG.SPRING);
  }, [scale]);

  return (
    <AnimatedPressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onPress(dish)}
      style={[styles.dishCard, animStyle]}
    >
      <Image source={{ uri: dish.imageUrl }} style={styles.dishImage} contentFit="cover" transition={150} />
      <View style={styles.dishBadgeRow}>
        <View style={styles.categoryBadge}>
          <Icon name={BITE_CATEGORIES_INFO[dish.category]?.icon || 'food'} size={14} color={colors.reward.peachDark} />
        </View>
        {discovered ? (
          <View style={styles.collectedBadge}>
            <Icon name="check" size={12} color={colors.text.inverse} />
            <Text style={styles.collectedBadgeText}>Collected</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.dishInfo}>
        <Text variant="body" style={styles.dishName}>{dish.name}</Text>
        <Caption>{dish.countryName}</Caption>
      </View>
    </AnimatedPressable>
  );
});

type QuizOptionProps = {
  option: string;
  index: number;
  onPress: (index: number) => void;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
};

const QuizOptionButton: React.FC<QuizOptionProps> = React.memo(({
  option, index, onPress, disabled, isSelected, isCorrect, isWrong,
}) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  React.useEffect(() => {
    if (isCorrect && isSelected) {
      scale.value = withSequence(withSpring(1.05, ANIMATION_CONFIG.SPRING), withSpring(1, ANIMATION_CONFIG.SPRING));
    } else if (isWrong) {
      translateX.value = withSequence(
        withSpring(-6, ANIMATION_CONFIG.SPRING),
        withSpring(6, ANIMATION_CONFIG.SPRING),
        withSpring(0, ANIMATION_CONFIG.SPRING),
      );
    }
  }, [isCorrect, isSelected, isWrong, scale, translateX]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: translateX.value }],
  }));

  return (
    <AnimatedPressable
      onPress={() => onPress(index)}
      disabled={disabled}
      style={[
        styles.quizOption,
        isSelected && styles.quizOptionSelected,
        isCorrect && styles.quizOptionCorrect,
        isWrong && styles.quizOptionWrong,
        animStyle,
      ]}
    >
      <Text
        variant="body"
        color={isCorrect ? colors.text.inverse : isWrong ? colors.status.error : colors.text.primary}
      >
        {option}
      </Text>
    </AnimatedPressable>
  );
});

type AddBiteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddBite'>;
  route: RouteProp<RootStackParamList, 'AddBite'>;
};

export const AddBiteScreen: React.FC<AddBiteScreenProps> = ({ navigation, route }) => {
  const prefilterCountryId = route.params?.countryId ?? null;
  const user = useStore(s => s.user);
  const bites = useStore(s => s.bites);
  const discoverDish = useStore(s => s.discoverDish);
  const getDiscoveredDishesByCountry = useStore(s => s.getDiscoveredDishesByCountry);
  const markGamePlayed = useStore(s => s.markGamePlayed);
  const addDiscovery = useStore(s => s.addDiscovery);

  const [step, setStep] = useState<'browse' | 'learn' | 'quiz'>('browse');
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>(prefilterCountryId ?? 'all');
  const [selectedDish, setSelectedDish] = useState<WorldDish | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedAura, setEarnedAura] = useState(0);
  const [createdBiteId, setCreatedBiteId] = useState<string | null>(null);

  const countries = useMemo(() => getCountriesWithDishes(), []);
  const discoveredIds = useMemo(
    () => new Set(bites.map((bite) => bite.worldDishId).filter(Boolean)),
    [bites]
  );

  const filteredDishes = useMemo(() => {
    const searched = searchDishes(query);
    if (selectedCountry === 'all') return searched;
    return searched.filter((dish) => dish.country === selectedCountry);
  }, [query, selectedCountry]);

  const existingDiscovery = useMemo(() => {
    if (!selectedDish) return null;
    return bites.find((bite) => bite.worldDishId === selectedDish.id) ?? null;
  }, [bites, selectedDish]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizScore(0);
    setSelectedOption(null);
  };

  const handleChooseDish = (dish: WorldDish) => {
    setSelectedDish(dish);
    setStep('learn');
    resetQuiz();
  };

  const handleBack = () => {
    if (step === 'quiz') {
      setStep('learn');
      setSelectedOption(null);
      return;
    }
    if (step === 'learn') {
      setStep('browse');
      setSelectedDish(null);
      return;
    }
    navigation.goBack();
  };

  const completeDiscovery = (finalQuizScore: number) => {
    if (!selectedDish) return;

    const alreadyDiscovered = bites.find((bite) => bite.worldDishId === selectedDish.id);
    if (alreadyDiscovered) {
      navigation.navigate('BiteDetail', { biteId: alreadyDiscovered.id });
      return;
    }

    const countryDiscoveries = getDiscoveredDishesByCountry(selectedDish.country);
    const totalCountryDishes = getDishesByCountry(selectedDish.country).length;
    const isFirstInCountry = countryDiscoveries.length === 0;
    const completesCountrySet = countryDiscoveries.length + 1 === totalCountryDishes;

    const auraReward =
      AURA_REWARDS.DISCOVER_DISH +
      finalQuizScore * AURA_REWARDS.DISCOVERY_QUIZ_CORRECT +
      (isFirstInCountry ? AURA_REWARDS.DISCOVERY_FIRST_COUNTRY : 0) +
      (completesCountrySet ? AURA_REWARDS.DISCOVERY_COMPLETE_COUNTRY : 0);

    const bite: Bite = {
      id: `bite_${Date.now()}`,
      userId: user?.id || '',
      name: selectedDish.name,
      description: selectedDish.originStory,
      cuisine: selectedDish.countryName,
      category: selectedDish.category,
      country: selectedDish.countryName,
      photoUrl: selectedDish.imageUrl,
      rating: 5,
      isMadeAtHome: false,
      recipe: selectedDish.recipe,
      collectedAt: new Date(),
      isPublic: true,
      likes: 0,
      tags: selectedDish.tags,
      worldDishId: selectedDish.id,
      quizScore: finalQuizScore,
      auraEarned: auraReward,
      recipeUnlocked: true,
    };

    discoverDish(bite, auraReward);
    const dishCountryId = selectedDish.country;
    if (dishCountryId) {
      markGamePlayed(dishCountryId);
      addDiscovery(`Discovered: ${selectedDish.name}`, dishCountryId, 'dish');
    }
    setCreatedBiteId(bite.id);
    setEarnedAura(auraReward);
    setShowSuccess(true);
  };

  const handleAnswer = (answerIndex: number) => {
    if (!selectedDish || selectedOption !== null) return;

    const question = selectedDish.quizQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === question.correctIndex;
    const nextScore = quizScore + (isCorrect ? 1 : 0);

    setSelectedOption(answerIndex);
    if (isCorrect) {
      setQuizScore(nextScore);
    }

    setTimeout(() => {
      const isLastQuestion = currentQuestionIndex === selectedDish.quizQuestions.length - 1;
      if (isLastQuestion) {
        completeDiscovery(nextScore);
        return;
      }

      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
    }, 700);
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.reward.peachLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={2}>Discover a Dish</Heading>
            <Caption>
              {step === 'browse' ? 'Pick a food' : step === 'learn' ? 'Learn the story' : 'Quick quiz'}
            </Caption>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.stepPills}>
            {['browse', 'learn', 'quiz'].map((stepId, index) => {
              const active = step === stepId;
              return (
                <View key={stepId} style={[styles.stepPill, active && styles.stepPillActive]}>
                  <Text variant="caption" color={active ? colors.text.inverse : colors.text.secondary}>
                    {index + 1}
                  </Text>
                </View>
              );
            })}
          </View>

          {step === 'browse' && (
            <Animated.View entering={FadeInRight.duration(300).springify()} exiting={FadeOutLeft.duration(200)}>
              <View style={styles.section}>
                <Input
                  label="Search the menu"
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Sushi, ramen, tacos..."
                />
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.countryChips}>
                <TouchableOpacity
                  onPress={() => setSelectedCountry('all')}
                  style={[styles.countryChip, selectedCountry === 'all' && styles.countryChipSelected]}
                >
                  <Text variant="bodySmall" color={selectedCountry === 'all' ? colors.text.inverse : colors.text.primary}>
                    All
                  </Text>
                </TouchableOpacity>
                {countries.map((country) => (
                  <TouchableOpacity
                    key={country.id}
                    onPress={() => setSelectedCountry(country.id)}
                    style={[styles.countryChip, selectedCountry === country.id && styles.countryChipSelected]}
                  >
                    <Text variant="bodySmall" color={selectedCountry === country.id ? colors.text.inverse : colors.text.primary}>
                      {country.flag} {country.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View style={styles.sectionHeader}>
                <Text variant="h3">Pick a dish to learn</Text>
                <Caption>{filteredDishes.length} dishes</Caption>
              </View>

              <View style={styles.dishGrid}>
                {filteredDishes.map((dish, index) => {
                  const discovered = discoveredIds.has(dish.id);
                  return (
                    <Animated.View
                      key={dish.id}
                      entering={FadeInDown.duration(300).delay(index * 60).springify()}
                    >
                      <DishCardPressable
                        dish={dish}
                        discovered={discovered}
                        onPress={handleChooseDish}
                      />
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {step === 'learn' && selectedDish && (
            <Animated.View entering={FadeInRight.duration(300).springify()} exiting={FadeOutLeft.duration(200)}>
              <Animated.View entering={ZoomIn.duration(400).springify()} style={styles.heroCard}>
                <Image source={{ uri: selectedDish.imageUrl }} style={styles.heroImage} contentFit="cover" transition={200} />
                <View style={styles.heroOverlay}>
                  <Text variant="h2" color={colors.text.inverse}>{selectedDish.name}</Text>
                  <Text variant="bodySmall" color={colors.text.inverse}>
                    {selectedDish.countryName} • {BITE_CATEGORIES_INFO[selectedDish.category]?.label || 'Dish'}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(300).delay(100)} style={styles.section}>
                <Text variant="h3" style={styles.learnHeading}>Origin Story</Text>
                <Text variant="body" color={colors.text.secondary}>{selectedDish.originStory}</Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(300).delay(200)} style={styles.section}>
                <Text variant="h3" style={styles.learnHeading}>Why it matters</Text>
                <Text variant="body" color={colors.text.secondary}>{selectedDish.culturalSignificance}</Text>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(300).delay(300)} style={styles.section}>
                <Text variant="h3" style={styles.learnHeading}>Did you know?</Text>
                <View style={styles.factCard}>
                  <Icon name="sparkles" size={18} color={colors.reward.amber} />
                  <Text variant="body" color={colors.text.secondary} style={styles.factText}>
                    {selectedDish.funFact}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(300).delay(400)} style={styles.section}>
                <Text variant="h3" style={styles.learnHeading}>Key ingredients</Text>
                <View style={styles.ingredientWrap}>
                  {selectedDish.keyIngredients.map((ingredient) => (
                    <View key={ingredient} style={styles.ingredientChip}>
                      <Text variant="caption">{ingredient}</Text>
                    </View>
                  ))}
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.duration(300).delay(500)} style={styles.submitSection}>
                {existingDiscovery ? (
                  <Button
                    title="View in Taste Atlas"
                    onPress={() => navigation.navigate('BiteDetail', { biteId: existingDiscovery.id })}
                    variant="primary"
                    size="lg"
                    fullWidth
                  />
                ) : (
                  <Button
                    title="Start quiz"
                    onPress={() => {
                      resetQuiz();
                      setStep('quiz');
                    }}
                    variant="primary"
                    size="lg"
                    fullWidth
                  />
                )}
              </Animated.View>
            </Animated.View>
          )}

          {step === 'quiz' && selectedDish && (
            <Animated.View entering={FadeInRight.duration(300).springify()} exiting={FadeOutLeft.duration(200)}>
              <View style={styles.quizProgressRow}>
                <Text variant="bodySmall" color={colors.text.secondary}>
                  Question {currentQuestionIndex + 1} of {selectedDish.quizQuestions.length}
                </Text>
                <Text variant="bodySmall" color={colors.reward.peachDark}>
                  Score {quizScore}
                </Text>
              </View>

              <Animated.View key={`q_${currentQuestionIndex}`} entering={FadeIn.duration(300)} style={styles.quizCard}>
                <Text variant="h3" style={styles.quizQuestion}>
                  {selectedDish.quizQuestions[currentQuestionIndex].question}
                </Text>

                <View style={styles.quizOptions}>
                  {selectedDish.quizQuestions[currentQuestionIndex].options.map((option, index) => {
                    const correctIndex = selectedDish.quizQuestions[currentQuestionIndex].correctIndex;
                    const isSelected = selectedOption === index;
                    const isCorrect = index === correctIndex;
                    const isWrong = isSelected && !isCorrect;
                    return (
                      <QuizOptionButton
                        key={`${currentQuestionIndex}_${index}`}
                        option={option}
                        index={index}
                        onPress={handleAnswer}
                        disabled={selectedOption !== null}
                        isSelected={isSelected}
                        isCorrect={selectedOption !== null && isCorrect}
                        isWrong={isWrong}
                      />
                    );
                  })}
                </View>
              </Animated.View>
            </Animated.View>
          )}
        </ScrollView>
      </SafeAreaView>

      {showSuccess && (
        <AchievementCeremony
          icon="food"
          title="Dish Discovered!"
          subtitle={selectedDish ? `${selectedDish.emoji} ${selectedDish.name} — ${selectedDish.countryName}` : undefined}
          auraReward={earnedAura}
          onDismiss={() => {
            setShowSuccess(false);
            showToast('Dish discovered!', 'success');
            if (createdBiteId) {
              navigation.replace('BiteDetail', { biteId: createdBiteId });
            } else {
              navigation.goBack();
            }
          }}
        />
      )}
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
  headerCenter: {
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.parchment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  stepPills: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepPill: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.base.parchment,
  },
  stepPillActive: {
    backgroundColor: colors.reward.peachDark,
  },
  section: {
    marginBottom: spacing.lg,
  },
  countryChips: {
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  countryChip: {
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.parchment,
  },
  countryChipSelected: {
    backgroundColor: colors.reward.peachDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  dishGrid: {
    gap: spacing.md,
  },
  dishCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  dishImage: {
    width: '100%',
    height: 180,
  },
  dishBadgeRow: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.base.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.success.emerald,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: spacing.radius.round,
  },
  collectedBadgeText: {
    fontSize: 11,
    fontFamily: 'Nunito-Bold',
    color: colors.text.inverse,
  },
  dishInfo: {
    padding: spacing.md,
  },
  dishName: {
    marginBottom: spacing.xxs,
  },
  heroCard: {
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  heroImage: {
    width: '100%',
    height: 240,
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  learnHeading: {
    marginBottom: spacing.sm,
  },
  factCard: {
    backgroundColor: colors.reward.peachLight,
    borderRadius: spacing.radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  factText: {
    flex: 1,
  },
  ingredientWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  ingredientChip: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  quizProgressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  quizCard: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    padding: spacing.lg,
    shadowColor: colors.shadow.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  quizQuestion: {
    marginBottom: spacing.lg,
  },
  quizOptions: {
    gap: spacing.sm,
  },
  quizOption: {
    borderWidth: 1,
    borderColor: colors.base.parchment,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  quizOptionSelected: {
    borderColor: colors.primary.wisteriaDark,
  },
  quizOptionCorrect: {
    backgroundColor: colors.success.emerald,
    borderColor: colors.success.emerald,
  },
  quizOptionWrong: {
    borderColor: colors.status.error,
    backgroundColor: colors.status.errorLight,
  },
  submitSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default AddBiteScreen;
