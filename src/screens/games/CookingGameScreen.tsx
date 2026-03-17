import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  FadeIn,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  runOnJS,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import * as Haptics from 'expo-haptics';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analytics';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { getPostGameLine } from '../../config/visbyLines';
import { RootStackParamList } from '../../types';
import { getDiscoveryCookingRecipes, getDishesByCountry } from '../../config/worldFoods';
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';

const BASE_RECIPES = [
  {
    name: 'Japanese Ramen',
    country: 'Japan',
    correctIngredients: ['Noodles', 'Broth', 'Pork', 'Egg', 'Green Onion'],
    wrongIngredients: ['Tortilla', 'Cheese', 'Ketchup'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=600',
  },
  {
    name: 'Italian Pizza Margherita',
    country: 'Italy',
    correctIngredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    wrongIngredients: ['Soy Sauce', 'Rice', 'Curry Powder', 'Avocado'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600',
  },
  {
    name: 'Mexican Tacos',
    country: 'Mexico',
    correctIngredients: ['Tortilla', 'Beef', 'Salsa', 'Cheese', 'Lettuce'],
    wrongIngredients: ['Noodles', 'Soy Sauce', 'Wasabi'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=600',
  },
  {
    name: 'French Crepes',
    country: 'France',
    correctIngredients: ['Flour', 'Eggs', 'Milk', 'Butter'],
    wrongIngredients: ['Rice', 'Soy Sauce', 'Chili', 'Tofu'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?w=600',
  },
  {
    name: 'Indian Curry',
    country: 'India',
    correctIngredients: ['Curry Powder', 'Chicken', 'Onion', 'Tomato', 'Rice'],
    wrongIngredients: ['Pasta', 'Cream Cheese', 'Ketchup'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600',
  },
  {
    name: 'Korean Bibimbap',
    country: 'Korea',
    correctIngredients: ['Rice', 'Vegetables', 'Egg', 'Gochujang', 'Beef'],
    wrongIngredients: ['Bread', 'Cream', 'Maple Syrup'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=600',
  },
  {
    name: 'Thai Pad Thai',
    country: 'Thailand',
    correctIngredients: ['Rice Noodles', 'Shrimp', 'Peanuts', 'Lime', 'Bean Sprouts'],
    wrongIngredients: ['Pasta', 'Cream', 'Ketchup'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=600',
  },
  {
    name: 'Brazilian Feijoada',
    country: 'Brazil',
    correctIngredients: ['Black Beans', 'Pork', 'Rice', 'Orange', 'Garlic'],
    wrongIngredients: ['Noodles', 'Soy Sauce', 'Wasabi'],
    icon: 'food' as IconName,
    imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600',
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

type CookingGameScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CookingGame'>;
  route: RouteProp<RootStackParamList, 'CookingGame'>;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = spacing.sm;
const GRID_PADDING = spacing.screenPadding;
const BUTTON_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;

interface IngredientButtonProps {
  name: string;
  onPress: () => void;
  disabled: boolean;
  state: 'idle' | 'correct' | 'wrong' | 'used';
}

const IngredientButton: React.FC<IngredientButtonProps> = ({ name, onPress, disabled, state }) => {
  const shakeX = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (state === 'correct') {
      scale.value = withSequence(
        withSpring(1.15, { damping: 8, stiffness: 300 }),
        withSpring(0.01, { damping: 12, stiffness: 200 }),
      );
      opacity.value = withDelay(300, withTiming(0, { duration: 200 }));
    } else if (state === 'wrong') {
      shakeX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [state]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const bgColor =
    state === 'correct'
      ? colors.success.honeydew
      : state === 'wrong'
        ? colors.status.errorLight
        : state === 'used'
          ? colors.base.parchment
          : colors.base.cream;

  const borderColor =
    state === 'correct'
      ? colors.success.emerald
      : state === 'wrong'
        ? colors.status.error
        : 'transparent';

  return (
    <Animated.View style={[styles.ingredientButtonWrapper, animatedStyle]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || state === 'used' || state === 'correct'}
        activeOpacity={0.7}
        style={[
          styles.ingredientButton,
          {
            backgroundColor: bgColor,
            borderColor,
            borderWidth: state === 'correct' || state === 'wrong' ? 2 : 1,
          },
          state === 'used' && { opacity: 0.4 },
        ]}
      >
        <Text
          variant="body"
          color={state === 'used' ? colors.text.muted : colors.text.primary}
          style={styles.ingredientText}
          align="center"
          numberOfLines={2}
        >
          {name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const GAME_NAME = 'CookingGame';

export const CookingGameScreen: React.FC<CookingGameScreenProps> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
  const countryId = route.params?.countryId ?? null;
  const addAura = useStore(s => s.addAura);
  const bites = useStore(s => s.bites);
  const feedVisby = useStore(s => s.feedVisby);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const incrementGameStat = useStore(s => s.incrementGameStat);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const setAdventureGamePlayed = useStore(s => s.setAdventureGamePlayed);
  const getVisbyMood = useStore(s => s.getVisbyMood);

  const completePathNode = useStore(s => s.completePathNode);

  const RECIPES = useMemo(() => {
    const discoveredIds = bites.filter(b => b.worldDishId).map(b => b.worldDishId!);
    const discoveryRecipes = getDiscoveryCookingRecipes(discoveredIds).map(r => ({
      ...r,
      icon: 'food' as IconName,
    }));
    const countryRecipes = countryId
      ? getDishesByCountry(countryId).slice(0, 4).map((dish) => ({
          name: dish.name,
          country: dish.countryName,
          correctIngredients: dish.keyIngredients.slice(0, 5).map((item) => item.replace(/\b\w/g, (c) => c.toUpperCase())),
          wrongIngredients: ['Sugar', 'Ketchup', 'Chocolate'].filter(
            (item) => !dish.keyIngredients.some((key) => key.toLowerCase() === item.toLowerCase()),
          ),
          icon: 'food' as IconName,
          imageUrl: dish.imageUrl,
        }))
      : [];
    const merged = [...countryRecipes, ...BASE_RECIPES, ...discoveryRecipes];
    return merged;
  }, [bites, countryId]);

  useEffect(() => {
    analyticsService.trackGameStart(GAME_NAME);
  }, []);

  const [recipeIndex, setRecipeIndex] = useState(0);
  const recipe = RECIPES[recipeIndex % RECIPES.length];

  useEffect(() => {
    if (RECIPES.length === 0) return;
    setRecipeIndex(Math.floor(Math.random() * RECIPES.length));
  }, [RECIPES.length, countryId]);

  const shuffledIngredients = useMemo(
    () => shuffleArray([...recipe.correctIngredients, ...recipe.wrongIngredients]),
    [recipeIndex],
  );

  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [nextCorrectIndex, setNextCorrectIndex] = useState(0);
  const [ingredientStates, setIngredientStates] = useState<Record<string, 'idle' | 'correct' | 'wrong' | 'used'>>({});
  const [gamePhase, setGamePhase] = useState<'launching' | 'playing' | 'won' | 'lost'>('launching');
  const [score, setScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const potScale = useSharedValue(1);

  const potAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: potScale.value }],
  }));

  const progress =
    recipe.correctIngredients.length > 0
      ? (addedIngredients.length / recipe.correctIngredients.length) * 100
      : 0;

  const handleIngredientTap = useCallback(
    (ingredient: string) => {
      if (gamePhase !== 'playing') return;

      const expectedIngredient = recipe.correctIngredients[nextCorrectIndex];

      if (ingredient === expectedIngredient) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
        setIngredientStates((prev) => ({ ...prev, [ingredient]: 'correct' }));
        setAddedIngredients((prev) => [...prev, ingredient]);
        setScore((prev) => prev + 10);
        setNextCorrectIndex((prev) => prev + 1);

        potScale.value = withSequence(
          withSpring(1.06, { damping: 8, stiffness: 300 }),
          withSpring(1, { damping: 10, stiffness: 250 }),
        );

        if (nextCorrectIndex + 1 >= recipe.correctIngredients.length) {
          const bonus = lives === 3 ? 15 : 0;
          const finalScore = score + 10 + bonus;
          timersRef.current.push(setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
            setScore(finalScore);
            setGamePhase('won');
            setShowCelebration(true);
            addAura(finalScore);
            const bonus = getGameOfTheDayBonusAura('CookingGame');
            if (bonus > 0) addAura(bonus);
            feedVisby();
            addSkillPoints('cooking', 5);
            incrementGameStat('gamesPlayed');
            analyticsService.trackGameComplete(GAME_NAME, finalScore, lives === 3);
            checkDailyMissionCompletion('play_minigame', 1);
            setAdventureGamePlayed();
            if (pathNodeId) completePathNode(pathNodeId);
            if (lives === 3) {
              incrementGameStat('perfectCookingGames');
            }
          }, 600));
        }
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
        setIngredientStates((prev) => ({ ...prev, [ingredient]: 'wrong' }));
        const newLives = lives - 1;
        setLives(newLives);

        wrongTimerRef.current = setTimeout(() => {
          setIngredientStates((prev) => ({ ...prev, [ingredient]: 'idle' }));
        }, 600);

        if (newLives <= 0) {
          timersRef.current.push(setTimeout(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
            setGamePhase('lost');
            const finalScore = score;
            if (finalScore > 0) addAura(finalScore);
            feedVisby();
            checkDailyMissionCompletion('play_minigame', 1);
            setAdventureGamePlayed();
          }, 700));
        }
      }
    },
    [gamePhase, recipe, nextCorrectIndex, lives, score, addAura, feedVisby, addSkillPoints, incrementGameStat, potScale, checkDailyMissionCompletion, setAdventureGamePlayed],
  );

  const handlePlayAgain = () => {
    const newIndex = (recipeIndex + 1) % (RECIPES.length || 1);
    setRecipeIndex(newIndex);
    setAddedIngredients([]);
    setLives(3);
    setNextCorrectIndex(0);
    setIngredientStates({});
    setGamePhase('playing');
    setScore(0);
  };

  if (gamePhase === 'launching') {
    return (
      <GameLaunchSequence
        gameName="World Cooking"
        gameIcon="food"
        countryName={recipe?.country}
        rules="Add the right ingredients in order!"
        onComplete={() => setGamePhase('playing')}
      />
    );
  }

  if (gamePhase === 'won' || gamePhase === 'lost') {
    return (
      <>
        {showCelebration && gamePhase === 'won' && (
          <GameCelebration
            tier={getCelebrationTier(score, recipe.correctIngredients.length * 10 + 15)}
            score={score}
            maxScore={recipe.correctIngredients.length * 10 + 15}
            auraEarned={score}
            gameName="World Cooking"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        <LinearGradient
          colors={
            gamePhase === 'won'
              ? [colors.reward.peachLight, colors.base.cream]
            : [colors.status.errorLight, colors.base.cream]
        }
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <Animated.View entering={FadeIn.duration(400)} style={styles.resultsContainer}>
            <Card style={styles.resultsCard}>
              <View style={styles.resultsContent}>
                <Animated.View entering={ZoomIn.delay(200).duration(400)}>
                  <Icon
                    name={gamePhase === 'won' ? 'trophy' : 'heart'}
                    size={64}
                    color={gamePhase === 'won' ? colors.reward.gold : colors.status.error}
                  />
                </Animated.View>

                <Heading level={1} style={styles.resultsTitle}>
                  {gamePhase === 'won' ? 'Delicious!' : 'Nice Try!'}
                </Heading>

                <Text variant="body" color={colors.text.secondary} style={styles.resultsSubtitle}>
                  {gamePhase === 'won'
                    ? `You made ${recipe.name} perfectly!`
                    : `${recipe.name} needs more practice`}
                </Text>

                <View style={styles.resultsDivider} />

                <View style={styles.auraRow}>
                  <Icon name="sparkles" size={24} color={colors.reward.gold} />
                  <Text variant="h2" color={colors.reward.amber}>
                    +{score}
                  </Text>
                  <Text variant="body" color={colors.text.secondary}>
                    Aura earned
                  </Text>
                </View>

                {gamePhase === 'won' && lives === 3 && (
                  <Animated.View entering={FadeInUp.delay(400)} style={styles.bonusBadge}>
                    <Icon name="star" size={16} color={colors.reward.gold} />
                    <Text variant="bodySmall" color={colors.reward.amber}>
                      Perfect bonus +15
                    </Text>
                  </Animated.View>
                )}
                <View style={styles.visbyLineWrap}>
                  <Text variant="body" style={styles.visbyLine}>
                    — Visby: "{getPostGameLine('CookingGame', gamePhase === 'won' ? (lives === 3 ? 'perfect' : 'won') : 'lost', getVisbyMood())}"
                  </Text>
                </View>
              </View>
            </Card>

            <Button
              title="Cook Another Dish"
              onPress={handlePlayAgain}
              variant="primary"
              size="lg"
              fullWidth
            />
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="secondary"
              size="lg"
              fullWidth
            />
          </Animated.View>
        </SafeAreaView>
      </LinearGradient>
      </>
    );
  }

  return (
    <LinearGradient colors={['#FFF5E8', '#FFECD2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.View entering={FadeInDown.duration(400).delay(50)}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>

          <Heading level={2}>Cooking Game</Heading>

          <View style={styles.livesRow}>
            {[0, 1, 2].map((i) => (
              <Icon
                key={i}
                name={i < lives ? 'heart' : 'heartOutline'}
                size={20}
                color={i < lives ? colors.status.error : colors.text.light}
              />
            ))}
          </View>
        </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.duration(400).delay(100)} style={{ flex: 1 }}>
        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipe Card */}
          <Animated.View>
            <Card variant="gradient" gradientColors={['#FFFAF0', '#FFF0DB']} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                {recipe.imageUrl ? (
                  <Image
                    source={{ uri: recipe.imageUrl }}
                    style={styles.recipeImage}
                    contentFit="cover"
                    transition={200}
                  />
                ) : (
                  <View style={styles.recipeIconWrap}>
                    <Icon name={recipe.icon} size={28} color={colors.reward.peachDark} />
                  </View>
                )}
                <View style={styles.recipeInfo}>
                  <View style={styles.recipeNameRow}>
                    <Heading level={2} color={colors.text.primary}>
                      {recipe.name}
                    </Heading>
                    <SpeakerButton text={recipe.name} size={16} compact />
                  </View>
                  <Caption>{recipe.country}</Caption>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressBarTrack}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <Caption style={styles.progressLabel}>
              {addedIngredients.length} / {recipe.correctIngredients.length} ingredients
            </Caption>
          </View>

          {/* Pot Area */}
          <Animated.View style={[styles.potContainer, potAnimatedStyle]}>
            <LinearGradient
              colors={['#F5E6D0', '#EDD8BF']}
              style={styles.potGradient}
            >
              <View style={styles.potInner}>
                {addedIngredients.length === 0 ? (
                  <Caption style={styles.potPlaceholder}>
                    Tap ingredients to add them
                  </Caption>
                ) : (
                  <View style={styles.potItems}>
                    {addedIngredients.map((ingredient, i) => (
                      <Animated.View
                        key={ingredient}
                        entering={ZoomIn.delay(i * 50).duration(300)}
                        style={styles.potChip}
                      >
                        <Icon name="check" size={14} color={colors.success.emerald} />
                        <Text variant="bodySmall" color={colors.success.emerald}>
                          {ingredient}
                        </Text>
                      </Animated.View>
                    ))}
                  </View>
                )}
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Ingredient Hint */}
          <View style={styles.hintRow}>
            <Icon name="info" size={16} color={colors.text.muted} />
            <Caption style={styles.hintText}>
              Add ingredients in the right order!
            </Caption>
          </View>

          {/* Ingredient Grid */}
          <View style={styles.ingredientGrid}>
            {shuffledIngredients.map((ingredient) => (
              <IngredientButton
                key={ingredient}
                name={ingredient}
                onPress={() => handleIngredientTap(ingredient)}
                disabled={gamePhase !== 'playing'}
                state={ingredientStates[ingredient] || 'idle'}
              />
            ))}
          </View>
        </ScrollView>
        </Animated.View>
      </SafeAreaView>
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
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    padding: spacing.sm,
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.round,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
      },
      android: { elevation: 2 },
    }),
  },
  livesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  recipeCard: {
    marginBottom: spacing.lg,
  },
  recipeImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recipeIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 192, 112, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  recipeInfo: {
    flex: 1,
  },
  recipeNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressSection: {
    marginBottom: spacing.lg,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: spacing.radius.round,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.success.emerald,
    borderRadius: spacing.radius.round,
  },
  progressLabel: {
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  potContainer: {
    marginBottom: spacing.lg,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#C8A060',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: { elevation: 4 },
    }),
  },
  potGradient: {
    borderRadius: spacing.radius.xl,
    padding: 3,
  },
  potInner: {
    minHeight: 100,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: spacing.radius.xl - 2,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  potPlaceholder: {
    textAlign: 'center',
  },
  potItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  potChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success.honeydew,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    borderWidth: 1,
    borderColor: colors.success.honeydewDark,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  hintText: {
    textAlign: 'center',
  },
  ingredientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
  },
  ingredientButtonWrapper: {
    width: BUTTON_WIDTH,
  },
  ingredientButton: {
    height: 56,
    borderRadius: spacing.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  ingredientText: {
    fontFamily: 'Nunito-Bold',
  },
  resultsContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.screenPadding,
    gap: spacing.lg,
  },
  resultsCard: {
    paddingVertical: spacing.xxxl,
  },
  resultsContent: {
    alignItems: 'center',
  },
  visbyLineWrap: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  visbyLine: {
    fontStyle: 'italic',
    color: colors.text.secondary,
    textAlign: 'center',
  },
  resultsTitle: {
    textAlign: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  resultsSubtitle: {
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  resultsDivider: {
    width: 80,
    height: 2,
    backgroundColor: colors.primary.wisteriaLight,
    marginVertical: spacing.md,
    borderRadius: 1,
  },
  auraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  bonusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.reward.peachLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
    marginTop: spacing.md,
  },
});

export default CookingGameScreen;
