import React from 'react';
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
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { useStore } from '../../store/useStore';
import { COUNTRIES } from '../../config/constants';
import { RootStackParamList } from '../../types';
import { UserHouse } from '../../types';
import { FloatingParticles } from '../../components/effects/FloatingParticles';

type CountryWorldScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CountryWorld'>;
};

export const CountryWorldScreen: React.FC<CountryWorldScreenProps> = ({ navigation }) => {
  const { user, userHouses, spendAura, addUserHouse } = useStore();
  const aura = user?.aura ?? 0;

  const hasHouse = (countryId: string) =>
    userHouses.some((h) => h.countryId === countryId);

  const handleVisit = (countryId: string) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    if (!country) return;

    const owned = hasHouse(countryId);
    if (owned) {
      navigation.navigate('CountryRoom', { countryId });
      return;
    }

    const cost = country.visitCostAura;
    if (aura < cost) {
      Alert.alert(
        'Not enough Aura ✨',
        `You need ${cost} Aura to visit ${country.name}. Earn more by collecting stamps, logging food, and learning!`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `Visit ${country.flagEmoji} ${country.name}?`,
      `Spend ${cost} Aura to visit and explore. You can learn fun facts while you're there!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Visit!',
          onPress: () => {
            if (spendAura(cost)) {
              navigation.navigate('CountryRoom', { countryId });
            }
          },
        },
      ]
    );
  };

  const handleBuyHouse = (countryId: string) => {
    const country = COUNTRIES.find((c) => c.id === countryId);
    if (!country || hasHouse(countryId)) return;

    const cost = country.housePriceAura;
    if (aura < cost) {
      Alert.alert(
        'Not enough Aura ✨',
        `You need ${cost} Aura to buy a house in ${country.name}. Then you can visit anytime for free!`,
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      `Buy a house in ${country.flagEmoji} ${country.name}?`,
      `Spend ${cost} Aura to buy your very own house. After that, you can visit and walk around whenever you want—no more Aura needed!`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy house!',
          onPress: () => {
            if (spendAura(cost)) {
              const newHouse: UserHouse = {
                id: `house_${Date.now()}`,
                userId: user?.id || '',
                countryId,
                purchasedAt: new Date(),
              };
              addUserHouse(newHouse);
              Alert.alert('You did it! 🏠', `You now have a house in ${country.name}. Tap "Enter" to go inside!`, [
                { text: 'Go!', onPress: () => navigation.navigate('CountryRoom', { countryId }) },
              ]);
            }
          },
        },
      ]
    );
  };

  return (
    <LinearGradient
      colors={[colors.base.cream, colors.primary.wisteriaFaded, colors.calm.skyLight]}
      style={styles.container}
      locations={[0, 0.4, 1]}
    >
      <FloatingParticles count={10} variant="mixed" opacity={0.3} speed="normal" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Heading level={1}>Visit the World 🌍</Heading>
            <Caption>Pay Aura to visit a country, or buy a house to visit anytime!</Caption>
            <View style={styles.auraRow}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text variant="body" style={styles.auraText}>{aura} Aura</Text>
            </View>
          </View>

          {COUNTRIES.map((country) => {
            const owned = hasHouse(country.id);
            return (
              <Card
                key={country.id}
                variant="elevated"
                style={[styles.countryCard, { borderLeftColor: country.accentColor, borderLeftWidth: 4 }]}
                onPress={() => handleVisit(country.id)}
              >
                <View style={styles.countryRow}>
                  <View style={styles.flagCircle}>
                    <Text style={styles.flagEmoji}>{country.flagEmoji}</Text>
                  </View>
                  <View style={styles.countryInfo}>
                    <Text variant="h2">{country.name}</Text>
                    <Caption numberOfLines={2}>{country.description}</Caption>
                    <View style={styles.actions}>
                      {owned ? (
                        <Button
                          size="sm"
                          variant="primary"
                          title="Enter my house"
                          onPress={() => handleVisit(country.id)}
                          style={styles.enterBtn}
                        />
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="primary"
                            title={`Visit ${country.visitCostAura} ✨`}
                            onPress={() => handleVisit(country.id)}
                            style={styles.visitBtn}
                          />
                          <TouchableOpacity
                            style={styles.buyHouseBtn}
                            onPress={() => handleBuyHouse(country.id)}
                          >
                            <Icon name="home" size={18} color={colors.primary.wisteriaDark} />
                            <Text variant="caption" color={colors.primary.wisteriaDark}>
                              Buy house {country.housePriceAura} ✨
                            </Text>
                          </TouchableOpacity>
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
          <View style={styles.footer}>
            <Text variant="caption" color={colors.text.muted} align="center">
              In each country you can walk around and learn fun facts—like Club Penguin!
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xxl * 4 },
  header: { marginBottom: spacing.lg },
  auraRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.xs },
  auraText: { fontFamily: 'Nunito-SemiBold' },
  countryCard: { marginBottom: spacing.md },
  countryRow: { flexDirection: 'row', alignItems: 'flex-start' },
  flagCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.base.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  flagEmoji: { fontSize: 32 },
  countryInfo: { flex: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm },
  visitBtn: { marginRight: spacing.xs },
  enterBtn: {},
  buyHouseBtn: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm },
  footer: { marginTop: spacing.lg, paddingHorizontal: spacing.sm },
});
