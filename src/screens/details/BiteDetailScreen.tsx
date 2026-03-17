import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { RootStackParamList } from '../../types';
import { BITE_CATEGORIES_INFO } from '../../config/constants';
import { getDishById } from '../../config/worldFoods';

type BiteDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BiteDetail'>;
  route: { params: { biteId: string } };
};

export const BiteDetailScreen: React.FC<BiteDetailScreenProps> = ({ navigation, route }) => {
  const { biteId } = route.params;
  const bites = useStore(s => s.bites);
  const bite = bites.find((b) => b.id === biteId);

  if (!bite) {
    return (
      <LinearGradient
        colors={[colors.base.cream, colors.primary.wisteriaFaded]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.notFoundContainer}>
            <Icon name="food" size={64} color={colors.text.muted} />
            <Text variant="h2" align="center" style={styles.notFoundText}>
              Bite not found
            </Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="md" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const worldDish = bite.worldDishId ? getDishById(bite.worldDishId) : undefined;
  const recipe = worldDish?.recipe || bite.recipe;
  const categoryLabel = (worldDish?.category || bite.category)
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const heroImage = worldDish?.imageUrl || bite.photoUrl;
  const dishTitle = worldDish?.name || bite.name;
  const dishCountry = worldDish?.countryName || bite.country || bite.cuisine;
  const isDiscovery = Boolean(worldDish);

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Back Button */}
          <Animated.View entering={FadeInDown.duration(400).delay(50)}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.duration(400).delay(100)}>
          <View style={styles.photoContainer}>
            {heroImage ? (
              <Image
                source={{ uri: heroImage }}
                style={styles.photo}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon name="food" size={48} color={colors.text.muted} />
                <Caption style={styles.photoCaption}>No photo</Caption>
              </View>
            )}
          </View>

          <Heading level={1} style={styles.foodName}>
            {dishTitle}
          </Heading>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Text variant="label" color={colors.primary.wisteriaDark}>{dishCountry}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.reward.peachLight }]}>
              <Text variant="label" color={colors.text.secondary}>{categoryLabel}</Text>
            </View>
            {isDiscovery && (
              <View style={[styles.badge, { backgroundColor: colors.success.honeydew }]}>
                <Text variant="label" color={colors.success.emerald}>Discovered</Text>
              </View>
            )}
          </View>

          {isDiscovery ? (
            <>
              <Card style={styles.infoCard}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="globe" size={18} color={colors.primary.wisteriaDark} />
                  <Text variant="h3">Origin Story</Text>
                </View>
                <Text variant="body" color={colors.text.secondary}>
                  {worldDish?.originStory}
                </Text>
              </Card>

              <Card style={styles.notesCard}>
                <View style={styles.sectionTitleRow}>
                  <Icon name={BITE_CATEGORIES_INFO[worldDish?.category || bite.category]?.icon || 'food'} size={18} color={colors.reward.peachDark} />
                  <Text variant="h3">Cultural Meaning</Text>
                </View>
                <Text variant="body" color={colors.text.secondary}>
                  {worldDish?.culturalSignificance}
                </Text>
              </Card>

              <Card style={styles.notesCard}>
                <View style={styles.sectionTitleRow}>
                  <Icon name="sparkles" size={18} color={colors.reward.amber} />
                  <Text variant="h3">Did You Know?</Text>
                </View>
                <Text variant="body" color={colors.text.secondary}>
                  {worldDish?.funFact}
                </Text>
              </Card>

              {worldDish && (
                <Card style={styles.notesCard}>
                  <View style={styles.sectionTitleRow}>
                    <Icon name="food" size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="h3">Key Ingredients</Text>
                  </View>
                  <View style={styles.tagsContainer}>
                    {worldDish.keyIngredients.map((ingredient) => (
                      <View key={ingredient} style={styles.tag}>
                        <Text variant="caption" color={colors.primary.wisteriaDark}>{ingredient}</Text>
                      </View>
                    ))}
                  </View>
                </Card>
              )}
            </>
          ) : (
            <>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Icon
                    key={i}
                    name={i <= bite.rating ? 'star' : 'starOutline'}
                    size={24}
                    color={i <= bite.rating ? colors.reward.gold : colors.text.light}
                  />
                ))}
              </View>

              <Card style={styles.infoCard}>
                {bite.isMadeAtHome ? (
                  <View style={styles.restaurantRow}>
                    <Icon name="heart" size={20} color={colors.accent.rose} />
                    <View style={[styles.badge, { backgroundColor: colors.accent.blush }]}>
                      <Text variant="label" color={colors.text.secondary}>Homemade</Text>
                    </View>
                  </View>
                ) : (
                  <View style={styles.restaurantRow}>
                    <Icon name="location" size={20} color={colors.primary.wisteriaDark} />
                    <Text variant="body">{bite.restaurantName || 'Unknown restaurant'}</Text>
                  </View>
                )}

                {(bite.city || bite.country) && (
                  <View style={styles.locationRow}>
                    <Icon name="globe" size={16} color={colors.text.secondary} />
                    <Text variant="bodySmall" color={colors.text.secondary}>
                      {[bite.city, bite.country].filter(Boolean).join(', ')}
                    </Text>
                  </View>
                )}
              </Card>

              {bite.notes ? (
                <Card style={styles.notesCard}>
                  <View style={styles.sectionTitleRow}>
                    <Icon name="edit" size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="h3">Notes</Text>
                  </View>
                  <Text variant="body" color={colors.text.secondary}>
                    {bite.notes}
                  </Text>
                </Card>
              ) : null}
            </>
          )}

          {recipe ? (
            <Card style={styles.recipeCard}>
              <View style={styles.sectionTitleRow}>
                <Icon name="recipe" size={20} color={colors.primary.wisteriaDark} />
                <Text variant="h3">{isDiscovery ? 'Unlocked Recipe' : 'Recipe'}</Text>
              </View>

              <View style={styles.recipeMetaRow}>
                <View style={styles.recipeMeta}>
                  <Icon name="time" size={14} color={colors.text.muted} />
                  <Caption>Prep {recipe.prepTime}m</Caption>
                </View>
                <View style={styles.recipeMeta}>
                  <Icon name="flame" size={14} color={colors.text.muted} />
                  <Caption>Cook {recipe.cookTime}m</Caption>
                </View>
                <View style={styles.recipeMeta}>
                  <Icon name="person" size={14} color={colors.text.muted} />
                  <Caption>{recipe.servings} servings</Caption>
                </View>
              </View>

              <Text variant="h3" style={styles.recipeSubheading}>Ingredients</Text>
              {recipe.ingredients.map((ingredient, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text variant="body" color={colors.text.secondary}>{ingredient}</Text>
                </View>
              ))}

              <Text variant="h3" style={styles.recipeSubheading}>Instructions</Text>
              {recipe.instructions.map((step, idx) => (
                <View key={idx} style={styles.instructionRow}>
                  <View style={styles.stepNumber}>
                    <Text variant="label" color={colors.text.inverse}>{idx + 1}</Text>
                  </View>
                  <Text variant="body" color={colors.text.secondary} style={styles.instructionText}>
                    {step}
                  </Text>
                </View>
              ))}
            </Card>
          ) : null}

          {!isDiscovery && bite.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {bite.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text variant="caption" color={colors.primary.wisteriaDark}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
          </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.cream,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.screenPadding,
  },
  notFoundText: {
    marginTop: spacing.md,
  },
  photoContainer: {
    marginBottom: spacing.lg,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  photo: {
    height: 240,
    borderRadius: spacing.radius.xl,
  },
  photoPlaceholder: {
    height: 240,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoCaption: {
    color: colors.text.muted,
  },
  foodName: {
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  badge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  starsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  notesCard: {
    marginBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  recipeCard: {
    marginBottom: spacing.lg,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  recipeSubheading: {
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary.wisteria,
    marginTop: 8,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary.wisteriaDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
});

export default BiteDetailScreen;
