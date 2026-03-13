import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

type BiteDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'BiteDetail'>;
  route: { params: { biteId: string } };
};

export const BiteDetailScreen: React.FC<BiteDetailScreenProps> = ({ navigation, route }) => {
  const { biteId } = route.params;
  const { bites } = useStore();
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

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= bite.rating ? 'star' : 'starOutline'}
          size={24}
          color={i <= bite.rating ? colors.reward.gold : colors.text.light}
        />,
      );
    }
    return stars;
  };

  const categoryLabel = bite.category
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Photo Area */}
          <View style={styles.photoContainer}>
            {bite.photoUrl ? (
              <View style={styles.photoPlaceholder}>
                <Icon name="image" size={48} color={colors.text.muted} />
                <Caption style={styles.photoCaption}>Photo</Caption>
              </View>
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon name="food" size={48} color={colors.text.muted} />
                <Caption style={styles.photoCaption}>No photo</Caption>
              </View>
            )}
          </View>

          {/* Food Name & Badges */}
          <Heading level={1} style={styles.foodName}>
            {bite.name}
          </Heading>

          <View style={styles.badgeRow}>
            <View style={[styles.badge, { backgroundColor: colors.primary.wisteriaFaded }]}>
              <Text variant="label" color={colors.primary.wisteriaDark}>{bite.cuisine}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.reward.peachLight }]}>
              <Text variant="label" color={colors.text.secondary}>{categoryLabel}</Text>
            </View>
          </View>

          {/* Star Rating */}
          <View style={styles.starsRow}>{renderStars()}</View>

          {/* Restaurant / Homemade */}
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

          {/* Notes */}
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

          {/* Recipe */}
          {bite.recipe ? (
            <Card style={styles.recipeCard}>
              <View style={styles.sectionTitleRow}>
                <Icon name="recipe" size={20} color={colors.primary.wisteriaDark} />
                <Text variant="h3">Recipe</Text>
              </View>

              <View style={styles.recipeMetaRow}>
                <View style={styles.recipeMeta}>
                  <Icon name="time" size={14} color={colors.text.muted} />
                  <Caption>Prep {bite.recipe.prepTime}m</Caption>
                </View>
                <View style={styles.recipeMeta}>
                  <Icon name="flame" size={14} color={colors.text.muted} />
                  <Caption>Cook {bite.recipe.cookTime}m</Caption>
                </View>
                <View style={styles.recipeMeta}>
                  <Icon name="person" size={14} color={colors.text.muted} />
                  <Caption>{bite.recipe.servings} servings</Caption>
                </View>
              </View>

              <Text variant="h3" style={styles.recipeSubheading}>Ingredients</Text>
              {bite.recipe.ingredients.map((ingredient, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text variant="body" color={colors.text.secondary}>{ingredient}</Text>
                </View>
              ))}

              <Text variant="h3" style={styles.recipeSubheading}>Instructions</Text>
              {bite.recipe.instructions.map((step, idx) => (
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

          {/* Tags */}
          {bite.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {bite.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text variant="caption" color={colors.primary.wisteriaDark}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
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
