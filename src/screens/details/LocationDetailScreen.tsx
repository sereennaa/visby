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
import { STAMP_TYPES_INFO } from '../../config/constants';
import { RootStackParamList } from '../../types';

const SAMPLE_LOCATIONS = [
  { id: '1', name: 'Central Park', type: 'park', distance: '0.5 km', description: 'Beautiful urban park with walking trails' },
  { id: '2', name: 'City Museum', type: 'museum', distance: '1.2 km', description: 'Local history and art museum' },
  { id: '3', name: 'Ocean Beach', type: 'beach', distance: '3.5 km', description: 'Sandy beach with great sunset views' },
  { id: '4', name: 'Old Town Square', type: 'landmark', distance: '0.8 km', description: 'Historic town center' },
  { id: '5', name: 'Mountain View Trail', type: 'mountain', distance: '15 km', description: 'Scenic hiking trail' },
  { id: '6', name: 'Local Market', type: 'market', distance: '0.3 km', description: 'Fresh produce and local goods' },
  { id: '7', name: 'Cozy Corner Café', type: 'cafe', distance: '0.2 km', description: 'Great coffee and pastries' },
  { id: '8', name: 'Hidden Garden', type: 'hidden_gem', distance: '1.5 km', description: 'Secret garden with rare flowers' },
];

type LocationDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'LocationDetail'>;
  route: { params: { locationId: string } };
};

export const LocationDetailScreen: React.FC<LocationDetailScreenProps> = ({ navigation, route }) => {
  const { locationId } = route.params;
  const location = SAMPLE_LOCATIONS.find((l) => l.id === locationId);

  if (!location) {
    return (
      <LinearGradient
        colors={[colors.base.cream, colors.primary.wisteriaFaded]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.notFoundContainer}>
            <Icon name="location" size={64} color={colors.text.muted} />
            <Text variant="h2" align="center" style={styles.notFoundText}>
              Location not found
            </Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="md" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const typeInfo = STAMP_TYPES_INFO[location.type] || { label: location.type, icon: 'location', color: colors.text.muted };

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

          {/* Header Card */}
          <Card style={styles.headerCard}>
            <View style={[styles.iconCircle, { backgroundColor: typeInfo.color + '20' }]}>
              <Icon name={typeInfo.icon} size={40} color={typeInfo.color} />
            </View>

            <Heading level={1} style={styles.locationName}>
              {location.name}
            </Heading>

            <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '20' }]}>
              <Icon name={typeInfo.icon} size={16} color={typeInfo.color} />
              <Text variant="label" color={typeInfo.color}>{typeInfo.label}</Text>
            </View>
          </Card>

          {/* Description */}
          <Card style={styles.descriptionCard}>
            <View style={styles.sectionTitleRow}>
              <Icon name="info" size={18} color={colors.primary.wisteriaDark} />
              <Text variant="h3">About</Text>
            </View>
            <Text variant="body" color={colors.text.secondary}>
              {location.description}
            </Text>
          </Card>

          {/* Distance */}
          <Card style={styles.distanceCard}>
            <View style={styles.distanceRow}>
              <View style={styles.distanceLeft}>
                <Icon name="location" size={24} color={colors.primary.wisteriaDark} />
                <View>
                  <Text variant="h3">Distance</Text>
                  <Caption>{location.distance} away</Caption>
                </View>
              </View>
              <View style={styles.distanceBadge}>
                <Text variant="h2" color={colors.primary.wisteriaDark}>
                  {location.distance}
                </Text>
              </View>
            </View>
          </Card>

          {/* Spacer before CTA */}
          <View style={styles.ctaSpacer} />

          {/* Collect Stamp CTA */}
          <Button
            title="Collect Stamp Here"
            onPress={() => navigation.navigate('CollectStamp', { locationId: location.id })}
            variant="primary"
            size="lg"
            icon={<Icon name="stamp" size={20} color={colors.text.inverse} />}
          />
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
  headerCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  locationName: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  descriptionCard: {
    marginBottom: spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  distanceCard: {
    marginBottom: spacing.lg,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  distanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  distanceBadge: {
    backgroundColor: colors.primary.wisteriaFaded,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radius.lg,
  },
  ctaSpacer: {
    height: spacing.xl,
  },
});
