import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { BITE_CATEGORIES_INFO, AURA_REWARDS } from '../../config/constants';
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
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedAura, setEarnedAura] = useState(0);

  const takePhoto = async () => {
    const cameraResult = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!cameraResult.canceled) {
      setPhotoUri(cameraResult.assets[0].uri);
      return;
    }

    const libraryResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 0.7,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!libraryResult.canceled) {
      setPhotoUri(libraryResult.assets[0].uri);
    }
  };

  const handleSave = () => {
    setFormError('');

    if (!foodName.trim()) {
      setFormError('Please enter a food name.');
      return;
    }

    if (rating === 0) {
      setFormError('Please select a rating.');
      return;
    }

    const reward = isMadeAtHome ? AURA_REWARDS.BITE_WITH_RECIPE : AURA_REWARDS.BITE_UPLOAD;

    const bite: Bite = {
      id: `bite_${Date.now()}`,
      userId: user?.id || '',
      name: foodName,
      description: description,
      cuisine: cuisine,
      category: selectedCategory,
      city: currentLocation?.city,
      country: currentLocation?.country,
      photoUrl: photoUri || '',
      rating: rating,
      notes: notes || undefined,
      isMadeAtHome: isMadeAtHome,
      collectedAt: new Date(),
      isPublic: true,
      likes: 0,
      tags: [],
    };

    addBite(bite);
    addAura(reward);
    setEarnedAura(reward);
    setShowSuccess(true);
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.reward.peachLight]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
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
          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image source={{ uri: photoUri }} style={styles.photoPreview} />
              <TouchableOpacity
                onPress={() => setPhotoUri(null)}
                style={styles.photoRemoveButton}
              >
                <Icon name="close" size={16} color={colors.text.inverse} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={takePhoto} style={styles.photoButton}>
              <Icon name="camera" size={24} color={colors.reward.peachDark} />
              <Text variant="body" color={colors.reward.peachDark}>
                Add a Photo
              </Text>
            </TouchableOpacity>
          )}

          {/* Error Banner */}
          {formError ? (
            <View style={styles.errorBanner}>
              <Icon name="close" size={16} color={colors.status.error} />
              <Text variant="bodySmall" color={colors.status.error}>
                {formError}
              </Text>
            </View>
          ) : null}

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

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => {}}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Icon name="food" size={48} color={colors.reward.peachDark} />
            </View>
            <Heading level={3} style={styles.modalTitle}>Bite Saved!</Heading>
            <Text variant="h3" color={colors.reward.gold} style={styles.modalAura}>
              +{earnedAura} Aura
            </Text>
            <Text variant="body" color={colors.text.secondary} style={styles.modalFoodName}>
              {foodName}
            </Text>
            <Button
              title="Yum!"
              onPress={() => {
                setShowSuccess(false);
                navigation.goBack();
              }}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        </Pressable>
      </Modal>
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
  photoPreviewContainer: {
    position: 'relative',
    marginBottom: spacing.xl,
    borderRadius: spacing.radius.lg,
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: spacing.radius.lg,
  },
  photoRemoveButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitSection: {
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.status.errorLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.md,
    marginBottom: spacing.md,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  modalContent: {
    backgroundColor: colors.base.cream,
    borderRadius: spacing.radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.reward.peachLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalAura: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalFoodName: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});

export default AddBiteScreen;
