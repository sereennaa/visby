import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { STAMP_TYPES_INFO } from '../../config/constants';
import { RootStackParamList, Stamp, StampType } from '../../types';

const SELECTABLE_TYPES: StampType[] = [
  'city', 'park', 'beach', 'landmark', 'museum', 'cafe', 'restaurant', 'market',
];

type CollectStampScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CollectStamp'>;
  route: RouteProp<RootStackParamList, 'CollectStamp'>;
};

export const CollectStampScreen: React.FC<CollectStampScreenProps> = ({
  navigation,
  route,
}) => {
  const { locationId } = route.params;
  const { user, currentLocation, addStamp, addAura } = useStore();

  const [locationName, setLocationName] = useState('');
  const [selectedType, setSelectedType] = useState<StampType>('city');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const locationDisplay = currentLocation?.city && currentLocation?.country
    ? `${currentLocation.city}, ${currentLocation.country}`
    : 'Unknown Location';

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

  const handleCollect = () => {
    if (!locationName.trim()) {
      Alert.alert('Missing Name', 'Please enter a location name.');
      return;
    }

    const stamp: Stamp = {
      id: `stamp_${Date.now()}`,
      userId: user?.id || '',
      type: selectedType,
      locationId: locationId,
      locationName: locationName,
      city: currentLocation?.city || 'Unknown',
      country: currentLocation?.country || 'Unknown',
      countryCode: currentLocation?.countryCode || 'XX',
      latitude: currentLocation?.latitude || 0,
      longitude: currentLocation?.longitude || 0,
      collectedAt: new Date(),
      photoUrl: photoUri || undefined,
      notes: notes || undefined,
      isFastTravel: false,
      isPublic: true,
      likes: 0,
    };

    addStamp(stamp);
    addAura(50);

    Alert.alert(
      'Stamp Collected! +50 Aura ✨',
      `You collected a ${STAMP_TYPES_INFO[selectedType]?.label || selectedType} stamp at ${locationName}!`,
      [{ text: 'Awesome!', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={2}>Collect Stamp</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Current Location */}
          <Card style={styles.locationCard}>
            <Icon name="location" size={28} color={colors.primary.wisteriaDark} />
            <View style={styles.locationText}>
              <Text variant="bodySmall" color={colors.text.secondary}>
                Current Location
              </Text>
              <Text variant="h3">{locationDisplay}</Text>
            </View>
          </Card>

          {/* Location Name */}
          <View style={styles.section}>
            <Input
              label="Location Name"
              value={locationName}
              onChangeText={setLocationName}
              placeholder="e.g. Central Park, Eiffel Tower"
            />
          </View>

          {/* Stamp Type Selector */}
          <View style={styles.section}>
            <Text variant="body" style={styles.sectionLabel}>Stamp Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {SELECTABLE_TYPES.map((type) => {
                const info = STAMP_TYPES_INFO[type];
                const isSelected = selectedType === type;
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setSelectedType(type)}
                    style={[
                      styles.chip,
                      isSelected && { backgroundColor: info?.color || colors.primary.wisteria },
                    ]}
                  >
                    <Icon
                      name={info?.icon || 'stamp'}
                      size={18}
                      color={isSelected ? colors.text.inverse : colors.text.primary}
                    />
                    <Text
                      variant="bodySmall"
                      color={isSelected ? colors.text.inverse : colors.text.primary}
                    >
                      {info?.label || type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Input
              label="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholder="What makes this place special?"
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
              <Icon name="camera" size={24} color={colors.primary.wisteriaDark} />
              <Text variant="body" color={colors.primary.wisteriaDark}>
                Add a Photo
              </Text>
            </TouchableOpacity>
          )}

          {/* Collect Button */}
          <View style={styles.submitSection}>
            <Button
              title="Collect Stamp!"
              onPress={handleCollect}
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
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  locationText: {
    flex: 1,
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: spacing.radius.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary.wisteriaDark,
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
});

export default CollectStampScreen;
