import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { COUNTRIES } from '../../config/constants';
import { getMapPin } from '../../config/countryMap';
import { getCountryLocations, CountryLocation } from '../../config/learningContent';
import { ExploreStackParamList } from '../../types';
import { useStore } from '../../store/useStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - spacing.screenPadding * 2;
const IMAGE_HEIGHT = 220;

const CATEGORY_ICONS: Record<CountryLocation['category'], IconName> = {
  landmark: 'landmark',
  food: 'food',
  nature: 'nature',
  culture: 'culture',
  hidden_gem: 'sparkles',
};

type PlaceStreetScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'PlaceStreet'>;
  route: { params: { countryId: string; pinId: string } };
};

export const PlaceStreetScreen: React.FC<PlaceStreetScreenProps> = ({ navigation, route }) => {
  const { countryId, pinId } = route.params;
  const { addAura } = useStore();

  const country = COUNTRIES.find((c) => c.id === countryId);
  const pin = getMapPin(countryId, pinId);

  const stops = useMemo(() => {
    if (!pin) return [];
    const all = getCountryLocations(countryId);
    const idSet = new Set(pin.locationIds);
    return pin.locationIds.map((id) => all.find((loc) => loc.id === id)).filter((loc): loc is CountryLocation => !!loc);
  }, [countryId, pin]);

  if (!country || !pin) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[country.accentColor + '18', colors.base.cream]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Heading level={3} style={styles.headerTitle}>{pin.name}</Heading>
            <Caption style={styles.headerSub}>{country.name} · Walk the street</Caption>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {stops.map((loc, index) => (
            <View key={loc.id} style={styles.stopCard}>
              {/* Full-bleed style image */}
              <View style={styles.imageWrap}>
                {loc.imageUrl ? (
                  <Image source={{ uri: loc.imageUrl }} style={styles.image} resizeMode="cover" />
                ) : (
                  <View style={[styles.image, styles.imagePlaceholder]}>
                    <Icon name={CATEGORY_ICONS[loc.category]} size={56} color={colors.primary.wisteriaLight} />
                  </View>
                )}
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.7)']}
                  style={styles.imageOverlay}
                />
                <View style={styles.imageCaption}>
                  <View style={styles.stopBadge}>
                    <Icon name={CATEGORY_ICONS[loc.category]} size={16} color="#FFF" />
                    <Text style={styles.stopBadgeText}>{loc.category.replace('_', ' ')}</Text>
                  </View>
                  <Heading level={2} style={styles.stopName}>{loc.name}</Heading>
                </View>
              </View>
              <View style={styles.stopBody}>
                <Text variant="bodyLarge" style={styles.stopDescription}>{loc.description}</Text>
                <View style={styles.pointsRow}>
                  <Icon name="sparkles" size={18} color={colors.reward.gold} />
                  <Text style={styles.pointsText}>+{loc.learningPoints} Aura when you visit</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { textAlign: 'center' },
  headerSub: { marginTop: 2 },
  headerSpacer: { width: 40 },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.xxl * 2,
    paddingTop: spacing.sm,
  },
  stopCard: {
    marginBottom: spacing.xl,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.base.cream + 'ee',
    borderWidth: 1,
    borderColor: colors.primary.wisteriaLight + '40',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrap: {
    width: '100%',
    height: IMAGE_HEIGHT,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.primary.wisteriaFaded,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  imageCaption: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
  },
  stopBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 6,
  },
  stopBadgeText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 11,
    color: '#FFF',
    textTransform: 'capitalize',
  },
  stopName: {
    color: '#FFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  stopBody: {
    padding: spacing.lg,
  },
  stopDescription: {
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pointsText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: colors.reward.amber,
  },
});

export default PlaceStreetScreen;
