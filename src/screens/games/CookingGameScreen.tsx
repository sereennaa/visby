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
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';

const RECIPES = [
  {
    name: 'Japanese Ramen',
    country: 'Japan',
    correctIngredients: ['Noodles', 'Broth', 'Pork', 'Egg', 'Green Onion'],
    wrongIngredients: ['Tortilla', 'Cheese', 'Ketchup'],
    icon: 'food' as IconName,
  },
  {
    name: 'Italian Pizza Margherita',
    country: 'Italy',
    correctIngredients: ['Dough', 'Tomato Sauce', 'Mozzarella', 'Basil'],
    wrongIngredients: ['Soy Sauce', 'Rice', 'Curry Powder', 'Avocado'],
    icon: 'food' as IconName,
  },
  {
    name: 'Mexican Tacos',
    country: 'Mexico',
    correctIngredients: ['Tortilla', 'Beef', 'Salsa', 'Cheese', 'Lettuce'],
    wrongIngredients: ['Noodles', 'Soy Sauce', 'Wasabi'],
    icon: 'food' as IconName,
  },
  {
    name: 'French Crepes',
    country: 'France',
    correctIngredients: ['Flour', 'Eggs', 'Milk', 'Butter'],
    wrongIngredients: ['Rice', 'Soy Sauce', 'Chili', 'Tofu'],
    icon: 'food' as IconName,
  },
  {
    name: 'Indian Curry',
    country: 'India',
    correctIngredients: ['Curry Powder', 'Chicken', 'Onion', 'Tomato', 'Rice'],
    wrongIngredients: ['Pasta', 'Cream Cheese', 'Ketchup'],
    icon: 'food' as IconName,
  },
  {
    name: 'Korean Bibimbap',
    country: 'Korea',
    correctIngredients: ['Rice', 'Vegetables', 'Egg', 'Gochujang', 'Beef'],
    wrongIngredients: ['Bread', 'Cream', 'Maple Syrup'],
    icon: 'food' as IconName,
  },
  {
    name: 'Thai Pad Thai',
    country: 'Thailand',
    correctIngredients: ['Rice Noodles', 'Shrimp', 'Peanuts', 'Lime', 'Bean Sprouts'],
    wrongIngredients: ['Pasta', 'Cream', 'Ketchup'],
    icon: 'food' as IconName,
  },
  {
    name: 'Brazilian Feijoada',
    country: 'Brazil',
    correctIngredients: ['Black Beans', 'Pork', 'Rice', 'Orange', 'Garlic'],
    wrongIngredients: ['Noodles', 'Soy Sauce', 'Wasabi'],
    icon: 'food' as IconName,
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

export const CookingGameScreen: React.FC<CookingGameScreenProps> = ({ navigation }) => {
  const { addAura, feedVisby, addSkillPoints } = useStore();

  const [recipeIndex, setRecipeIndex] = useState(() => Math.floor(Math.random() * RECIPES.length));
  const recipe = RECIPES[recipeIndex];

  const shuffledIngredients = useMemo(
    () => shuffleArray([...recipe.correctIngredients, ...recipe.wrongIngredients]),
    [recipeIndex],
  );

  const [addedIngredients, setAddedIngredients] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [nextCorrectIndex, setNextCorrectIndex] = useState(0);
  const [ingredientStates, setIngredientStates] = useState<Record<string, 'idle' | 'correct' | 'wrong' | 'used'>>({});
  const [gamePhase, setGamePhase] = useState<'playing' | 'won' | 'lost'>('playing');
  const [score, setScore] = useState(0);
  const wrongTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (wrongTimerRef.current) clearTimeout(wrongTimerRef.current);
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
          setTimeout(() => {
            setScore(finalScore);
            setGamePhase('won');
            addAura(finalScore);
            feedVisby();
            addSkillPoints('cooking', 5);
          }, 600);
        }
      } else {
        setIngredientStates((prev) => ({ ...prev, [ingredient]: 'wrong' }));
        const newLives = lives - 1;
        setLives(newLives);

        wrongTimerRef.current = setTimeout(() => {
          setIngredientStates((prev) => ({ ...prev, [ingredient]: 'idle' }));
        }, 600);

        if (newLives <= 0) {
          setTimeout(() => {
            setGamePhase('lost');
            const finalScore = score;
            if (finalScore > 0) addAura(finalScore);
            feedVisby();
          }, 700);
        }
      }
    },
    [gamePhase, recipe, nextCorrectIndex, lives, score, addAura, feedVisby, potScale],
  );

  const handlePlayAgain = () => {
    const newIndex = (recipeIndex + 1) % RECIPES.length;
    setRecipeIndex(newIndex);
    setAddedIngredients([]);
    setLives(3);
    setNextCorrectIndex(0);
    setIngredientStates({});
    setGamePhase('playing');
    setScore(0);
  };

  if (gamePhase === 'won' || gamePhase === 'lost') {
    return (
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
    );
  }

  return (
    <LinearGradient colors={['#FFF5E8', '#FFECD2']} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
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

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Recipe Card */}
          <Animated.View entering={FadeInDown.duration(400)}>
            <Card variant="gradient" gradientColors={['#FFFAF0', '#FFF0DB']} style={styles.recipeCard}>
              <View style={styles.recipeHeader}>
                <View style={styles.recipeIconWrap}>
                  <Icon name={recipe.icon} size={28} color={colors.reward.peachDark} />
                </View>
                <View style={styles.recipeInfo}>
                  <Heading level={2} color={colors.text.primary}>
                    {recipe.name}
                  </Heading>
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
