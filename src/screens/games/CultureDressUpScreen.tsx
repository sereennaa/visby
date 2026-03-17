import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Card } from '../../components/ui/Card';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { useStore } from '../../store/useStore';
import { analyticsService } from '../../services/analytics';
import { COUNTRIES } from '../../config/constants';
import { getGameOfTheDayBonusAura } from '../../config/gameOfTheDay';
import { soundService } from '../../services/sound';
import { SpeakerButton } from '../../components/ui/SpeakerButton';
import { GameLaunchSequence } from '../../components/effects/GameLaunchSequence';
import { GameCelebration, getCelebrationTier } from '../../components/effects/GameCelebration';
import type { RootStackParamList } from '../../types';

interface CulturalOutfit {
  id: string;
  name: string;
  countryId: string;
  countryName: string;
  hat?: string;
  outfit?: string;
  accessory?: string;
  funFact: string;
}

const CULTURAL_OUTFITS: CulturalOutfit[] = [
  { id: 'jp_traditional', name: 'Japanese Kimono', countryId: 'jp', countryName: 'Japan', outfit: 'kimono', hat: 'rice_hat', funFact: 'Kimonos have been worn in Japan for over 1,000 years! The word means "thing to wear."' },
  { id: 'mx_traditional', name: 'Mexican Sombrero', countryId: 'mx', countryName: 'Mexico', hat: 'sombrero', outfit: 'poncho', funFact: 'The word "sombrero" comes from "sombra" meaning shade. Perfect for sunny days!' },
  { id: 'gb_royal', name: 'British Royal Guard', countryId: 'gb', countryName: 'United Kingdom', hat: 'top_hat', outfit: 'default_tunic', funFact: "The Queen's Guard at Buckingham Palace can't move or laugh while on duty!" },
  { id: 'kr_hanbok', name: 'Korean Hanbok', countryId: 'kr', countryName: 'South Korea', outfit: 'hanbok', funFact: 'Hanbok is worn on special occasions like Seollal (Lunar New Year) and Chuseok (harvest festival).' },
  { id: 'ke_dashiki', name: 'Kenyan Dashiki', countryId: 'ke', countryName: 'Kenya', outfit: 'dashiki', funFact: 'Dashiki means "shirt" in Yoruba. The bright colors and patterns each have special meanings!' },
  { id: 'fr_beret', name: 'French Beret', countryId: 'fr', countryName: 'France', hat: 'beret', accessory: 'scarf', funFact: 'The beret originally comes from the Basque region. French artists made it famous worldwide!' },
  { id: 'tr_fez', name: 'Turkish Fez', countryId: 'tr', countryName: 'Turkey', hat: 'fez', funFact: 'The fez was once the official hat of the Ottoman Empire. It has no brim so you can touch your forehead to the ground during prayer.' },
  { id: 'no_viking', name: 'Viking Explorer', countryId: 'no', countryName: 'Norway', hat: 'viking_helmet', accessory: 'shield', funFact: "Real Viking helmets didn't actually have horns! That was invented by artists in the 1800s." },
  { id: 'in_sari', name: 'Indian Sari', countryId: 'in', countryName: 'India', outfit: 'sari', funFact: 'A sari is one long piece of cloth, usually 5-9 meters! There are over 80 ways to drape it.' },
  { id: 'pe_chullo', name: 'Peruvian Chullo', countryId: 'pe', countryName: 'Peru', hat: 'feather_headdress', outfit: 'poncho', funFact: 'The chullo hat with ear flaps was invented to keep warm in the cold Andes mountains!' },
];

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CultureDressUp'>;
  route: RouteProp<RootStackParamList, 'CultureDressUp'>;
};

const GAME_NAME = 'CultureDressUp';

export const CultureDressUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const pathNodeId = route.params?.pathNodeId;
  const countryId = route.params?.countryId ?? null;
  const visby = useStore(s => s.visby);
  const addAura = useStore(s => s.addAura);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const incrementGameStat = useStore(s => s.incrementGameStat);
  const checkDailyMissionCompletion = useStore(s => s.checkDailyMissionCompletion);
  const playWithVisby = useStore(s => s.playWithVisby);
  const completePathNode = useStore(s => s.completePathNode);

  React.useEffect(() => {
    analyticsService.trackGameStart(GAME_NAME);
  }, []);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);
  const [phase, setPhase] = useState<'browse' | 'quiz'>('browse');
  const [selectedOutfit, setSelectedOutfit] = useState<CulturalOutfit>(
    countryId ? CULTURAL_OUTFITS.find((item) => item.countryId === countryId) ?? CULTURAL_OUTFITS[0] : CULTURAL_OUTFITS[0],
  );
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showFact, setShowFact] = useState(false);
  const [isLaunching, setIsLaunching] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);

  const prioritizedOutfits = useMemo(() => {
    if (!countryId) return CULTURAL_OUTFITS;
    const target = CULTURAL_OUTFITS.find((item) => item.countryId === countryId);
    if (!target) return CULTURAL_OUTFITS;
    return [target, ...CULTURAL_OUTFITS.filter((item) => item.id !== target.id)];
  }, [countryId]);

  const quizQuestions = useMemo(() => {
    return [...prioritizedOutfits].sort(() => Math.random() - 0.5).slice(0, 6).map((outfit) => {
      const wrong = CULTURAL_OUTFITS.filter((o) => o.id !== outfit.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 2)
        .map((o) => o.countryName);
      const options = [...wrong, outfit.countryName].sort(() => Math.random() - 0.5);
      return { outfit, options, correctIndex: options.indexOf(outfit.countryName) };
    });
  }, [prioritizedOutfits]);

  const handleSelectOutfit = (outfit: CulturalOutfit) => {
    setSelectedOutfit(outfit);
    setShowFact(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    soundService.playTap();
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
    setQuizIndex(0);
    setQuizScore(0);
    setShowCelebration(false);
  };

  const handleQuizAnswer = (index: number) => {
    const q = quizQuestions[quizIndex];
    if (index === q.correctIndex) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      soundService.playMatch();
      setQuizScore((s) => s + 1);
      addAura(15);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }

    timersRef.current.push(setTimeout(() => {
      if (quizIndex + 1 >= quizQuestions.length) {
        const finalScore = quizScore + (index === q.correctIndex ? 1 : 0);
        incrementGameStat('gamesPlayed');
        analyticsService.trackGameComplete(GAME_NAME, finalScore, finalScore === quizQuestions.length);
        addSkillPoints('culture', 6);
        playWithVisby();
        checkDailyMissionCompletion('play_minigame', 1);
        if (pathNodeId) completePathNode(pathNodeId);
        const bonus = getGameOfTheDayBonusAura('CultureDressUp');
        if (bonus > 0) addAura(bonus);
        setShowCelebration(true);
      }
      setQuizIndex((i) => i + 1);
    }, 800));
  };

  const defaultAppearance = visby?.appearance || {
    skinTone: '#FFAD6B', hairColor: '#B8875A', hairStyle: 'default', eyeColor: '#2A1A0A', eyeShape: 'round',
  };

  if (isLaunching) {
    return (
      <GameLaunchSequence
        gameName="Culture Dress-Up"
        gameIcon="culture"
        rules="Dress up Visby and test your cultural knowledge!"
        onComplete={() => setIsLaunching(false)}
      />
    );
  }

  if (phase === 'quiz' && quizIndex >= quizQuestions.length) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.reward.peachLight, colors.base.cream]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea}>
          <Animated.View entering={ZoomIn.duration(500)} style={styles.resultCard}>
            <Heading level={2}>Culture Expert!</Heading>
            <Text style={styles.resultScore}>{quizScore}/{quizQuestions.length} correct</Text>
            <View style={styles.resultAuraRow}>
              <Icon name="sparkles" size={20} color={colors.reward.gold} />
              <Text style={styles.resultAura}>+{quizScore * 15} Aura</Text>
            </View>
            <Button title="Dress Up More" onPress={() => { setPhase('browse'); setShowCelebration(false); }} variant="primary" size="lg" fullWidth style={{ marginTop: spacing.lg }} />
            <Button title="Done" onPress={() => navigation.goBack()} variant="ghost" size="md" style={{ marginTop: spacing.sm }} />
          </Animated.View>
        </SafeAreaView>
        {showCelebration && (
          <GameCelebration
            tier={getCelebrationTier(quizScore, quizQuestions.length)}
            score={quizScore}
            maxScore={quizQuestions.length}
            auraEarned={quizScore * 15}
            gameName="Culture Dress-Up"
            onDismiss={() => setShowCelebration(false)}
          />
        )}
      </View>
    );
  }

  if (phase === 'quiz') {
    const q = quizQuestions[quizIndex];
    return (
      <View style={styles.container}>
        <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setPhase('browse')} accessibilityRole="button">
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.progress}>{quizIndex + 1}/{quizQuestions.length}</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.quizCenter}>
            <Caption style={{ marginBottom: spacing.md }}>Which country wears this?</Caption>
            <View style={styles.previewCircle}>
              <VisbyCharacter
                appearance={defaultAppearance}
                equipped={{
                  hat: q.outfit.hat,
                  outfit: q.outfit.outfit,
                  accessory: q.outfit.accessory,
                }}
                mood="curious"
                size={120}
                animated
              />
            </View>
            <Text style={styles.outfitNameQuiz}>{q.outfit.name}</Text>
            <View style={styles.quizOptions}>
              {q.options.map((opt, i) => (
                <TouchableOpacity key={i} style={styles.quizOption} onPress={() => handleQuizAnswer(i)} activeOpacity={0.7}>
                  <Text style={styles.quizOptionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Browse mode
  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.primary.wisteriaFaded, colors.base.cream]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevronLeft" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <Heading level={3}>Culture Dress-Up</Heading>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.previewArea}>
          <VisbyCharacter
            appearance={defaultAppearance}
            equipped={{
              hat: selectedOutfit.hat,
              outfit: selectedOutfit.outfit,
              accessory: selectedOutfit.accessory,
            }}
            mood="proud"
            size={140}
            animated
          />
          <Text style={styles.outfitName}>{selectedOutfit.name}</Text>
          <Caption>{selectedOutfit.countryName}</Caption>
        </View>

        {showFact && (
          <Animated.View entering={FadeInUp.duration(300)} style={styles.factCard}>
            <View style={styles.factHeader}>
              <Icon name="sparkles" size={16} color={colors.primary.wisteriaDark} />
              <SpeakerButton text={selectedOutfit.funFact} countryId={selectedOutfit.countryId} size={16} compact />
            </View>
            <Text style={styles.factText}>{selectedOutfit.funFact}</Text>
          </Animated.View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.outfitScroll} contentContainerStyle={styles.outfitScrollContent}>
          {CULTURAL_OUTFITS.map((outfit) => (
            <TouchableOpacity
              key={outfit.id}
              style={[styles.outfitChip, selectedOutfit.id === outfit.id && styles.outfitChipActive]}
              onPress={() => handleSelectOutfit(outfit)}
              activeOpacity={0.7}
            >
              <Text style={[styles.outfitChipText, selectedOutfit.id === outfit.id && styles.outfitChipTextActive]}>
                {outfit.countryName}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.bottomActions}>
          <Button title="Quiz Me!" onPress={handleStartQuiz} variant="primary" size="lg" fullWidth icon="quiz" />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  progress: { fontFamily: 'Nunito-Bold', fontSize: 16, color: colors.text.primary },
  previewArea: { alignItems: 'center', paddingVertical: spacing.lg },
  previewCircle: { alignItems: 'center', justifyContent: 'center' },
  outfitName: { fontFamily: 'Baloo2-SemiBold', fontSize: 20, color: colors.text.primary, marginTop: spacing.sm },
  outfitNameQuiz: { fontFamily: 'Baloo2-SemiBold', fontSize: 18, color: colors.text.primary, marginTop: spacing.sm, marginBottom: spacing.md },
  factCard: { backgroundColor: colors.primary.wisteriaFaded, marginHorizontal: spacing.md, padding: spacing.md, borderRadius: 16, gap: spacing.xs },
  factHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  factText: { fontFamily: 'Nunito-Medium', fontSize: 14, color: colors.primary.wisteriaDark, lineHeight: 20 },
  outfitScroll: { marginTop: spacing.md, maxHeight: 50 },
  outfitScrollContent: { paddingHorizontal: spacing.md, gap: spacing.sm },
  outfitChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface.card, borderWidth: 2, borderColor: 'transparent' },
  outfitChipActive: { borderColor: colors.primary.wisteriaDark, backgroundColor: colors.primary.wisteriaFaded },
  outfitChipText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },
  outfitChipTextActive: { color: colors.primary.wisteriaDark },
  bottomActions: { padding: spacing.md, marginTop: 'auto' },
  quizCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  quizOptions: { width: '100%', gap: spacing.sm },
  quizOption: { backgroundColor: colors.surface.card, borderRadius: 16, paddingVertical: 14, paddingHorizontal: spacing.md, borderWidth: 2, borderColor: 'transparent' },
  quizOptionText: { fontFamily: 'Nunito-SemiBold', fontSize: 16, color: colors.text.primary, textAlign: 'center' },
  resultCard: { alignItems: 'center', padding: spacing.xl, margin: spacing.lg, backgroundColor: colors.surface.card, borderRadius: 28 },
  resultScore: { fontFamily: 'Nunito-SemiBold', fontSize: 18, color: colors.text.secondary, marginVertical: spacing.sm },
  resultAuraRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultAura: { fontFamily: 'Nunito-Bold', fontSize: 20, color: colors.reward.gold },
});

export default CultureDressUpScreen;
