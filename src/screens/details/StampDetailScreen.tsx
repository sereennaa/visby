import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, Image } from 'react-native';
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

type StampDetailScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'StampDetail'>;
  route: { params: { stampId: string } };
};

export const StampDetailScreen: React.FC<StampDetailScreenProps> = ({ navigation, route }) => {
  const { stampId } = route.params;
  const { stamps } = useStore();
  const stamp = stamps.find((s) => s.id === stampId);

  if (!stamp) {
    return (
      <LinearGradient
        colors={[colors.base.cream, colors.primary.wisteriaFaded]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.notFoundContainer}>
            <Icon name="stamp" size={64} color={colors.text.muted} />
            <Text variant="h2" align="center" style={styles.notFoundText}>
              Stamp not found
            </Text>
            <Button title="Go Back" onPress={() => navigation.goBack()} variant="secondary" size="md" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const typeInfo = STAMP_TYPES_INFO[stamp.type] || { label: stamp.type, icon: 'stamp', color: colors.text.muted };
  const collectedDate = new Date(stamp.collectedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={28} color={colors.text.primary} />
          </TouchableOpacity>

          {/* Photo Area */}
          <View style={styles.photoContainer}>
            {stamp.photoUrl ? (
              <Image source={{ uri: stamp.photoUrl }} style={styles.photo} resizeMode="cover" />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon name="camera" size={48} color={colors.text.muted} />
                <Caption style={styles.photoCaption}>No photo</Caption>
              </View>
            )}
          </View>

          {/* Stamp Info Card */}
          <Card style={styles.infoCard}>
            <View style={styles.typeBadgeRow}>
              <View style={[styles.typeBadge, { backgroundColor: typeInfo.color + '20' }]}>
                <Icon name={typeInfo.icon} size={20} color={typeInfo.color} />
                <Text variant="label" color={typeInfo.color}>
                  {typeInfo.label}
                </Text>
              </View>
              {stamp.isFastTravel && (
                <View style={[styles.typeBadge, { backgroundColor: colors.calm.skyLight }]}>
                  <Icon name="flash" size={16} color={colors.calm.ocean} />
                  <Text variant="label" color={colors.calm.ocean}>Fast Travel</Text>
                </View>
              )}
              {!stamp.isFastTravel && (
                <View style={[styles.typeBadge, { backgroundColor: colors.success.honeydew }]}>
                  <Icon name="location" size={16} color={colors.success.emerald} />
                  <Text variant="label" color={colors.success.emerald}>Physical</Text>
                </View>
              )}
            </View>

            <Heading level={2} style={styles.locationName}>
              {stamp.locationName}
            </Heading>

            <View style={styles.locationRow}>
              <Icon name="location" size={16} color={colors.text.secondary} />
              <Text variant="body" color={colors.text.secondary}>
                {stamp.city}, {stamp.country}
              </Text>
            </View>

            <View style={styles.dateRow}>
              <Icon name="calendar" size={16} color={colors.text.secondary} />
              <Text variant="bodySmall" color={colors.text.secondary}>
                Collected {collectedDate}
              </Text>
            </View>

            {stamp.isFastTravel && stamp.auraSpent !== undefined && (
              <View style={styles.dateRow}>
                <Icon name="sparkles" size={16} color={colors.reward.gold} />
                <Text variant="bodySmall" color={colors.text.secondary}>
                  {stamp.auraSpent} aura spent
                </Text>
              </View>
            )}
          </Card>

          {/* Notes */}
          {stamp.notes ? (
            <Card style={styles.notesCard}>
              <View style={styles.sectionTitleRow}>
                <Icon name="edit" size={18} color={colors.primary.wisteriaDark} />
                <Text variant="h3">Notes</Text>
              </View>
              <Text variant="body" color={colors.text.secondary}>
                {stamp.notes}
              </Text>
            </Card>
          ) : null}

          {/* Share Button */}
          <Button
            title="Share"
            onPress={() => Share.share({ message: `Check out this stamp I collected at ${stamp.locationName}! #Visby` })}
            variant="ghost"
            size="lg"
            icon={<Icon name="share" size={20} color={colors.primary.wisteriaDark} />}
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
  photoContainer: {
    marginBottom: spacing.lg,
    borderRadius: spacing.radius.xl,
    overflow: 'hidden',
  },
  photo: {
    height: 220,
    borderRadius: spacing.radius.xl,
  },
  photoPlaceholder: {
    height: 220,
    backgroundColor: colors.base.parchment,
    borderRadius: spacing.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
  },
  photoCaption: {
    color: colors.text.muted,
  },
  infoCard: {
    marginBottom: spacing.lg,
  },
  typeBadgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.round,
  },
  locationName: {
    marginBottom: spacing.sm,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  dateRow: {
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
});
