import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import Animated, { ZoomIn, FadeIn } from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { whimsicalGradients } from '../../theme/whimsical';
import { Text, Heading } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Input } from '../../components/ui/Input';
import { useStore } from '../../store/useStore';
import { soundService } from '../../services/sound';
import { STAMP_TYPES_INFO, AURA_REWARDS, COUNTRIES } from '../../config/constants';
import { getCountryStampProgress } from '../../config/collectionGoals';
import { copy } from '../../config/copy';
import { showToast } from '../../store/useToast';
import { RootStackParamList, Stamp, StampType } from '../../types';
import { SAMPLE_LOCATIONS } from '../../config/locations';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const getStampReward = (type: StampType): number => {
  const map: Record<string, number> = {
    city: AURA_REWARDS.STAMP_CITY,
    country: AURA_REWARDS.STAMP_COUNTRY,
    landmark: AURA_REWARDS.STAMP_LANDMARK,
    park: AURA_REWARDS.STAMP_PARK,
    beach: AURA_REWARDS.STAMP_BEACH,
    mountain: AURA_REWARDS.STAMP_MOUNTAIN,
    museum: AURA_REWARDS.STAMP_MUSEUM,
    restaurant: AURA_REWARDS.STAMP_RESTAURANT,
    cafe: AURA_REWARDS.STAMP_CAFE,
    market: AURA_REWARDS.STAMP_MARKET,
    hidden_gem: AURA_REWARDS.STAMP_HIDDEN_GEM,
  };
  return map[type] || AURA_REWARDS.STAMP_CITY;
};

const SELECTABLE_TYPES: StampType[] = [
  'city', 'park', 'beach', 'landmark', 'museum', 'cafe', 'restaurant', 'market', 'mountain', 'hidden_gem',
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
  const user = useStore(s => s.user);
  const currentLocation = useStore(s => s.currentLocation);
  const addStamp = useStore(s => s.addStamp);
  const addAura = useStore(s => s.addAura);
  const addSkillPoints = useStore(s => s.addSkillPoints);

  const [locationName, setLocationName] = useState('');
  const [selectedType, setSelectedType] = useState<StampType>('city');
  const [notes, setNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [earnedAura, setEarnedAura] = useState(0);
  const [firstStampEver, setFirstStampEver] = useState(false);
  const [countrySetCompleted, setCountrySetCompleted] = useState<string | null>(null);

  // Pre-fill from locationId: known place from map, or "Current location"
  const prefillLocation = locationId && locationId !== 'quick' && locationId !== 'current'
    ? SAMPLE_LOCATIONS.find((l) => l.id === locationId)
    : null;

  useEffect(() => {
    if (locationId === 'current') {
      setLocationName('Current location');
    } else if (prefillLocation) {
      setLocationName(prefillLocation.name);
      setSelectedType(prefillLocation.type);
    }
  }, [locationId, prefillLocation?.id, prefillLocation?.name, prefillLocation?.type]);

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

  const handleCollect = async () => {
    setFormError('');

    if (!locationName.trim()) {
      setFormError(copy.errors.formValidation.locationRequired);
      return;
    }

    const reward = getStampReward(selectedType);

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
      source: 'visit',
      isFastTravel: false,
      isPublic: true,
      likes: 0,
    };

    const saved = await addStamp(stamp);
    if (!saved) return;

    addAura(reward);
    addSkillPoints('exploration', 5);
    setEarnedAura(reward);
    setShowSuccess(true);
    soundService.playStampCollected();
    const stampsNow = useStore.getState().stamps;
    if (stampsNow.length === 1) setFirstStampEver(true);
    // Check if this stamp completed a country set
    const countryId = COUNTRIES.find((c) => c.name === saved.country || c.countryCode === saved.countryCode)?.id;
    if (countryId) {
      const progress = getCountryStampProgress(stampsNow, countryId);
      if (progress?.completed && progress.remaining === 0) setCountrySetCompleted(progress.countryName);
    }
  };

  return (
    <LinearGradient
      colors={[...whimsicalGradients.hero]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={2} style={styles.headerTitle}>{copy.stamps.collectScreenTitle}</Heading>
            <Text variant="bodySmall" color={colors.text.secondary} style={styles.headerSubtitle}>{copy.stamps.collectScreenSubtitle}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {prefillLocation ? (
            <Card style={styles.prefillCard}>
              <Icon name="stamp" size={22} color={colors.primary.wisteriaDark} />
              <View style={styles.prefillTextWrap}>
                <Text variant="bodySmall" color={colors.text.secondary} style={styles.prefillLabel}>{copy.stamps.youAreAdding}</Text>
                <Text variant="body" style={styles.prefillName}>{prefillLocation.name}</Text>
              </View>
            </Card>
          ) : null}

          {/* Current Location */}
          <Card style={styles.locationCard}>
            <Icon name="location" size={28} color={colors.primary.wisteriaDark} />
            <View style={styles.locationText}>
              <Text variant="bodySmall" color={colors.text.secondary}>
                {copy.stamps.youAreHere}
              </Text>
              <Text variant="h3">{locationDisplay}</Text>
            </View>
          </Card>

          {/* Location Name */}
          <View style={styles.section}>
            <Input
              label={copy.stamps.giveItAName}
              value={locationName}
              onChangeText={(text) => { setLocationName(text); setFormError(''); }}
              placeholder={copy.stamps.giveItANamePlaceholder}
            />
            {formError ? (
              <Text variant="bodySmall" color={colors.status.error} style={styles.errorText}>
                {formError}
              </Text>
            ) : null}
          </View>

          {/* Stamp Type Selector (with Aura reward) */}
          <View style={styles.section}>
            <Text variant="body" style={styles.sectionLabel}>{copy.stamps.whatKindOfPlace}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
            >
              {SELECTABLE_TYPES.map((type) => {
                const info = STAMP_TYPES_INFO[type];
                const isSelected = selectedType === type;
                const aura = getStampReward(type);
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
                      {info?.label || type} +{aura}
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
              placeholder={copy.stamps.notesPlaceholder}
              multiline
            />
          </View>

          {/* Photo */}
          {photoUri ? (
            <View style={styles.photoPreviewContainer}>
              <Image
                source={{ uri: photoUri }}
                style={styles.photoPreview}
                contentFit="cover"
                transition={200}
                placeholder={{ blurhash: 'LKO2?U%2Tw=w]~RBVZRi};RPxuwH' }}
              />
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
                {copy.stamps.addAPhoto}
              </Text>
            </TouchableOpacity>
          )}

          {/* Collect Button */}
          <View style={styles.submitSection}>
            <Button
              title={prefillLocation ? copy.stamps.addToPassportCta : locationId === 'quick' ? copy.stamps.addPlaceCta : copy.stamps.addToPassportCta}
              onPress={handleCollect}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Success Modal — dreamy celebration */}
      <Modal visible={showSuccess} transparent animationType="none">
        <Pressable style={styles.modalOverlay} onPress={() => {}}>
          <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
            <FloatingParticles variant="sparkle" count={12} speed="slow" opacity={0.9} />
          </View>
          <Animated.View entering={ZoomIn.duration(500).springify()} style={styles.modalContentWrap}>
            <LinearGradient
              colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight]}
              style={styles.modalContent}
            >
              <Animated.View entering={ZoomIn.delay(80).duration(350).springify()} style={styles.modalIconContainer}>
                <Icon name="stamp" size={52} color={colors.primary.wisteriaDark} />
              </Animated.View>
              <Heading level={3} style={styles.modalTitle}>{copy.stamps.successTitle}</Heading>
              {firstStampEver && (
                <Text variant="body" color={colors.primary.wisteriaDark} style={styles.modalFirstEver}>
                  {copy.stamps.successFirstStamp}
                </Text>
              )}
              {countrySetCompleted && (
                <Text variant="body" color={colors.primary.wisteriaDark} style={styles.modalCountrySet}>
                  {copy.stamps.successCountrySet.replace('{country}', countrySetCompleted)}
                </Text>
              )}
              <Animated.View entering={FadeIn.delay(180).duration(400)}>
                <Text variant="h3" color={colors.reward.gold} style={styles.modalAura}>
                  {copy.stamps.successAura.replace('{aura}', String(earnedAura))}
                </Text>
              </Animated.View>
              <Text variant="body" color={colors.text.secondary} style={styles.modalLocation}>
                {locationName}
              </Text>
              <Button
                title={copy.stamps.successKeepDreaming}
                onPress={() => {
                  setShowSuccess(false);
                  setCountrySetCompleted(null);
                  showToast(copy.success.stampCollected, 'success');
                  navigation.goBack();
                }}
                variant="primary"
                size="lg"
                fullWidth
              />
            </LinearGradient>
          </Animated.View>
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSubtitle: {
    marginTop: 2,
    textAlign: 'center',
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
  prefillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.primary.wisteriaFaded,
    borderWidth: 0,
    shadowColor: colors.primary.wisteria,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  prefillTextWrap: { flex: 1 },
  prefillLabel: { color: colors.text.secondary, marginBottom: 2 },
  prefillName: { fontFamily: 'Nunito-SemiBold', color: colors.text.primary },
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
    borderColor: colors.primary.wisteria + '99',
    backgroundColor: colors.primary.wisteriaFaded + '60',
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
  errorText: {
    marginTop: spacing.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(45, 45, 58, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.screenPadding,
  },
  modalContentWrap: {
    width: '100%',
    maxWidth: 340,
    borderRadius: spacing.radius.xl + 4,
    overflow: 'hidden',
    shadowColor: colors.primary.wisteriaDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalContent: {
    borderRadius: spacing.radius.xl + 4,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight,
  },
  modalTitle: {
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  modalFirstEver: {
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: 'Nunito-Bold',
  },
  modalCountrySet: {
    marginBottom: spacing.sm,
    textAlign: 'center',
    fontFamily: 'Nunito-SemiBold',
  },
  modalAura: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  modalLocation: {
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});

export default CollectStampScreen;
