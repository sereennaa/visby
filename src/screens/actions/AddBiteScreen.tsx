import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { BITE_CATEGORIES_INFO } from '../../config/constants';
import { RootStackParamList, Bite, BiteCategory } from '../../types';

const SELECTABLE_CATEGORIES: BiteCategory[] = [
  'main_dish', 'appetizer', 'dessert', 'snack', 'drink', 'street_food',
];

type AddBiteScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddBite'>;
};

export const AddBiteScreen: React.FC<AddBiteScreenProps> = ({ navigation }) => {
  const { user, currentLocation, addBite, addAura } = useStore();

  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BiteCategory>('main_dish');
  const [rating, setRating] = useState(0);
  const [isMadeAtHome, setIsMadeAtHome] = useState(false);
  const [notes, setNotes] = useState('');

  const handlePhoto = () => {
    Alert.alert('Coming soon', 'Photo capture will be available in a future update.');
  };

  const handleSave = () => {
    if (!foodName.trim()) {
      Alert.alert('Missing Name', 'Please enter a food name.');
      return;
    }

    if (rating === 0) {
      Alert.alert('Missing Rating', 'Please select a rating.');
      return;
    }

    const bite: Bite = {
      id: `bite_${Date.now()}`,
      userId: user?.id || '',
      name: foodName,
      description: description,
      cuisine: cuisine,
      category: selectedCategory,
      city: currentLocation?.city,
      country: currentLocation?.country,
      photoUrl: '',
      rating: rating,
      notes: notes || undefined,
      isMadeAtHome: isMadeAtHome,
      collectedAt: new Date(),
      isPublic: true,
      likes: 0,
      tags: [],
    };

    addBite(bite);
    addAura(25);

    Alert.alert(
      'Bite Saved! +25 Aura ✨',
      `${foodName} has been added to your collection!`,
      [{ text: 'Yum!', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.reward.peachLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Add a Bite</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Food Name */}
          <View style={styles.section}>
            <Input
              label="Food Name"
              value={foodName}
              onChangeText={setFoodName}
              placeholder="e.g. Pad Thai, Margherita Pizza"
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="What was it like?"
              multiline
            />
          </View>

          {/* Cuisine */}
          <View style={styles.section}>
            <Input
              label="Cuisine"
              value={cuisine}
              onChangeText={setCuisine}
              placeholder="e.g. Japanese, Italian, Mexican"
            />
          </View>

          {/* Category Selector */}
          <View style={styles.section}>
            <Text variant="body" style={styles.sectionLabel}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {SELECTABLE_CATEGORIES.map((cat) => {
                const info = BITE_CATEGORIES_INFO[cat];
                const isSelected = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setSelectedCategory(cat)}
                    style={[
                      styles.chip,
                      isSelected && styles.chipSelected,
                    ]}
                  >
                    <Icon
                      name={info?.icon || 'food'}
                      size={18}
                      color={isSelected ? colors.text.inverse : colors.text.primary}
                    />
                    <Text
                      variant="bodySmall"
                      color={isSelected ? colors.text.inverse : colors.text.primary}
                    >
                      {info?.label || cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Rating */}
          <View style={styles.section}>
            <Text variant="body" style={styles.sectionLabel}>Rating</Text>
            <View style={styles.ratingRow}>
              {[1, 2, 3, 4, 5].map((starValue) => (
                <TouchableOpacity
                  key={starValue}
                  onPress={() => setRating(starValue)}
                  style={styles.starButton}
                >
                  <Icon
                    name={starValue <= rating ? 'star' : 'starOutline'}
                    size={36}
                    color={starValue <= rating ? colors.reward.gold : colors.text.light}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Made at Home Toggle */}
          <TouchableOpacity
            onPress={() => setIsMadeAtHome(!isMadeAtHome)}
            style={styles.toggleRow}
          >
            <View style={[styles.checkbox, isMadeAtHome && styles.checkboxChecked]}>
              {isMadeAtHome && (
                <Icon name="check" size={16} color={colors.text.inverse} />
              )}
            </View>
            <Text variant="body">Made at home</Text>
          </TouchableOpacity>

          {/* Notes */}
          <View style={styles.section}>
            <Input
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="Any extra thoughts?"
              multiline
            />
          </View>

          {/* Photo */}
          <TouchableOpacity onPress={handlePhoto} style={styles.photoButton}>
            <Icon name="camera" size={24} color={colors.reward.peachDark} />
            <Text variant="body" color={colors.reward.peachDark}>
              Add a Photo
            </Text>
          </TouchableOpacity>

          {/* Save Button */}
          <View style={styles.submitSection}>
            <Button
              title="Save Bite"
              onPress={handleSave}
              variant="primary"
              size="lg"
              fullWidth
            />
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
    paddingVertical: spacing.md,
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
  section: {
    marginBottom: spacing.lg,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.text.primary,
  },
  chipScroll: {
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.parchment,
    borderWidth: 1,
    borderColor: colors.shadow.light,
  },
  chipSelected: {
    backgroundColor: colors.reward.peachDark,
    borderColor: colors.reward.peachDark,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  starButton: {
    padding: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: spacing.radius.sm,
    borderWidth: 2,
    borderColor: colors.text.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary.wisteriaDark,
    borderColor: colors.primary.wisteriaDark,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.reward.peachDark,
    marginBottom: spacing.xl,
  },
  submitSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
});

export default AddBiteScreen;
