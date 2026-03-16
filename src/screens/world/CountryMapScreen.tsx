import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Icon, IconName } from '../../components/ui/Icon';
import { COUNTRIES } from '../../config/constants';
import { getCountryMapPins, getPinRegionHint } from '../../config/countryMap';
import { getCountryOutlinePath } from '../../config/countryOutlines';
import { CountryOutline } from '../../components/maps/CountryOutline';
import { ExploreStackParamList } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAP_PADDING = 24;
const MAP_WIDTH = SCREEN_WIDTH - MAP_PADDING * 2;
const MAP_HEIGHT = Math.min(SCREEN_HEIGHT * 0.52, 380);
const PIN_SIZE = 44;

type CountryMapScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'CountryMap'>;
  route: { params: { countryId: string } };
};

export const CountryMapScreen: React.FC<CountryMapScreenProps> = ({ navigation, route }) => {
  const { countryId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const pins = getCountryMapPins(countryId);

  if (!country) {
    return null;
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[country.accentColor + '28', colors.base.cream, colors.base.parchment]}
        style={StyleSheet.absoluteFill}
        locations={[0, 0.4, 1]}
      />
      <FloatingParticles count={4} variant="sparkle" opacity={0.12} speed="slow" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} accessibilityLabel="Back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3} style={styles.headerTitle}>Map of {country.name}</Heading>
          <View style={styles.headerSpacer} />
        </View>

        <Caption style={styles.subtitle}>
          You&apos;re in {country.name}. Cities and landmarks are shown on the map. Tap one to explore.
        </Caption>

        {/* Map canvas: country outline with pins positioned by x/y percent */}
        <View style={styles.mapWrap}>
          <View style={styles.mapCanvas}>
            {getCountryOutlinePath(countryId) ? (
              <View style={styles.mapOutlineWrap}>
                <CountryOutline
                  countryId={countryId}
                  width={MAP_WIDTH}
                  height={MAP_HEIGHT}
                  fill={country.accentColor + '35'}
                  stroke={colors.primary.wisteriaLight + '80'}
                  strokeWidth={2}
                />
              </View>
            ) : (
              <LinearGradient
                colors={[colors.base.cream + 'ee', colors.base.skyLight + 'cc']}
                style={StyleSheet.absoluteFill}
              />
            )}
            {pins.map((pin) => {
              const x = (pin.xPercent / 100) * (MAP_WIDTH - PIN_SIZE);
              const y = (pin.yPercent / 100) * (MAP_HEIGHT - PIN_SIZE);
              return (
                <TouchableOpacity
                  key={pin.id}
                  style={[
                    styles.pin,
                    { left: x, top: y, backgroundColor: pin.type === 'city' ? colors.primary.wisteria : colors.reward.peach },
                  ]}
                  onPress={() => navigation.navigate('PlaceStreet', { countryId, pinId: pin.id })}
                  activeOpacity={0.85}
                >
                  <Icon
                    name={pin.type === 'city' ? 'city' : 'landmark'}
                    size={22}
                    color="#FFF"
                  />
                  <Text style={styles.pinLabel} numberOfLines={1}>{pin.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* List of pins for accessibility / small screens */}
        <ScrollView
          style={styles.listScroll}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {pins.map((pin) => {
            const regionHint = getPinRegionHint(pin.id);
            return (
              <TouchableOpacity
                key={pin.id}
                style={[styles.listRow, { borderLeftColor: pin.type === 'city' ? colors.primary.wisteria : colors.reward.peach }]}
                onPress={() => navigation.navigate('PlaceStreet', { countryId, pinId: pin.id })}
                activeOpacity={0.8}
              >
                <View style={[styles.listIconWrap, { backgroundColor: pin.type === 'city' ? colors.primary.wisteriaFaded : colors.reward.peachLight }]}>
                  <Icon name={pin.type === 'city' ? 'city' : 'landmark'} size={24} color={pin.type === 'city' ? colors.primary.wisteriaDark : colors.reward.peachDark} />
                </View>
                <View style={styles.listTextWrap}>
                  <Text style={styles.listTitle}>{pin.name}</Text>
                  <Caption style={styles.listMeta}>{pin.type === 'city' ? 'City' : 'Landmark'} · {pin.locationIds.length} stop{pin.locationIds.length !== 1 ? 's' : ''}</Caption>
                  {regionHint ? <Caption style={styles.listHint}>{regionHint}</Caption> : null}
                </View>
                <Icon name="chevronRight" size={20} color={colors.text.muted} />
              </TouchableOpacity>
            );
          })}
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
  headerTitle: { flex: 1, textAlign: 'center' },
  headerSpacer: { width: 40 },
  subtitle: {
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  mapWrap: {
    paddingHorizontal: MAP_PADDING,
    marginBottom: spacing.lg,
  },
  mapCanvas: {
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: colors.primary.wisteriaLight + '60',
    overflow: 'hidden',
    position: 'relative',
  },
  mapOutlineWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  pin: {
    position: 'absolute',
    width: PIN_SIZE,
    minHeight: PIN_SIZE,
    borderRadius: 22,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pinLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 9,
    color: '#FFF',
    marginTop: 2,
    textAlign: 'center',
  },
  listScroll: { flex: 1 },
  listContent: { paddingHorizontal: spacing.screenPadding, paddingBottom: spacing.xxl * 2 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.base.cream + 'ee',
    borderRadius: 16,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
  },
  listIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  listTextWrap: { flex: 1 },
  listTitle: { fontFamily: 'Baloo2-SemiBold', fontSize: 16, color: colors.text.primary },
  listMeta: { marginTop: 2 },
  listHint: { marginTop: 2, fontStyle: 'italic', color: colors.text.muted },
});

export default CountryMapScreen;
