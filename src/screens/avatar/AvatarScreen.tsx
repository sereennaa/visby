import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { RootStackParamList, VisbyMood } from '../../types';

type AvatarScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Avatar'>;
};

const MOODS: { mood: VisbyMood; emoji: string }[] = [
  { mood: 'happy', emoji: '😊' },
  { mood: 'excited', emoji: '🤩' },
  { mood: 'curious', emoji: '🧐' },
  { mood: 'sleepy', emoji: '😴' },
  { mood: 'proud', emoji: '💪' },
];

const SKIN_TONES = ['#FFDAB9', '#E8B89D', '#D4A574', '#8B5A3C'];
const HAIR_COLORS = ['#F7E07D', '#8B4513', '#A0522D', '#2F2F2F', '#D75C37', '#9B6FA6'];
const EYE_COLORS = ['#4A90D9', '#6B9B6B', '#8B4513', '#2F2F2F', '#9B6FA6'];

export const AvatarScreen: React.FC<AvatarScreenProps> = ({ navigation }) => {
  const { visby, updateVisbyAppearance } = useStore();
  const [selectedMood, setSelectedMood] = useState<VisbyMood>(visby?.currentMood || 'happy');

  const appearance = visby?.appearance || {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  };

  const renderColorSwatches = (
    swatchColors: string[],
    selectedColor: string,
    onSelect: (color: string) => void,
  ) => (
    <View style={styles.swatchRow}>
      {swatchColors.map((color) => (
        <TouchableOpacity
          key={color}
          onPress={() => onSelect(color)}
          style={[
            styles.swatch,
            { backgroundColor: color },
            selectedColor === color && styles.swatchSelected,
          ]}
        />
      ))}
    </View>
  );

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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Heading level={1}>Your Visby</Heading>
            <View style={styles.headerSpacer} />
          </View>

          {/* Character Display */}
          <View style={styles.characterContainer}>
            <VisbyCharacter
              appearance={appearance}
              mood={selectedMood}
              size={200}
              animated={true}
            />
            <Text variant="h2" align="center" style={styles.visbyName}>
              {visby?.name || 'Your Visby'}
            </Text>
          </View>

          {/* Mood Selector */}
          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Mood</Text>
            <View style={styles.moodRow}>
              {MOODS.map(({ mood, emoji }) => (
                <TouchableOpacity
                  key={mood}
                  onPress={() => setSelectedMood(mood)}
                  style={[
                    styles.moodButton,
                    selectedMood === mood && styles.moodButtonSelected,
                  ]}
                >
                  <Text style={styles.moodEmoji}>{emoji}</Text>
                  <Caption>{mood}</Caption>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Appearance Section */}
          <Heading level={2} style={styles.appearanceTitle}>Appearance</Heading>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Skin Tone</Text>
            {renderColorSwatches(
              SKIN_TONES,
              appearance.skinTone,
              (color) => updateVisbyAppearance({ skinTone: color }),
            )}
          </Card>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Hair Color</Text>
            {renderColorSwatches(
              HAIR_COLORS,
              appearance.hairColor,
              (color) => updateVisbyAppearance({ hairColor: color }),
            )}
          </Card>

          <Card style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>Eye Color</Text>
            {renderColorSwatches(
              EYE_COLORS,
              appearance.eyeColor,
              (color) => updateVisbyAppearance({ eyeColor: color }),
            )}
          </Card>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.round,
    backgroundColor: colors.base.warmWhite,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow.light,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerSpacer: {
    width: 40,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  visbyName: {
    marginTop: spacing.md,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  moodButtonSelected: {
    borderColor: colors.primary.wisteria,
    backgroundColor: colors.primary.wisteriaFaded,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  appearanceTitle: {
    marginBottom: spacing.md,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.transparent,
  },
  swatchSelected: {
    borderColor: colors.primary.wisteriaDark,
    borderWidth: 3,
  },
});

export default AvatarScreen;
