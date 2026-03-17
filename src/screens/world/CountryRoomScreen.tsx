import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  ZoomIn,
  FadeIn,
  FadeOut,
  FadeInDown,
  SlideInRight,
  SlideInLeft,
  FadeInRight,
  FadeInLeft,
} from 'react-native-reanimated';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Text, Heading, Caption } from '../../components/ui/Text';
import { Button } from '../../components/ui/Button';
import { Icon, IconName } from '../../components/ui/Icon';
import { VisbyCharacter } from '../../components/avatar/VisbyCharacter';
import { COUNTRIES } from '../../config/constants';
import { useStore } from '../../store/useStore';
import { Tooltip } from '../../components/ui/Tooltip';
import { ExploreStackParamList, PlacedFurniture, DEFAULT_ROOM_DEFINITIONS } from '../../types';
import type { CountryFact } from '../../types';
import { FURNITURE_CATALOG } from '../../config/furniture';
import { FloatingParticles, getCountryParticleVariant } from '../../components/effects/FloatingParticles';
import { getCountryQuiz, getCountryLocations, getMythsForCountry, getNatureForCountry, getHistoryForCountry, getPhrasesForCountry } from '../../config/learningContent';
import { COUNTRY_HOUSES, RoomObject, HouseRoom } from '../../config/countryRooms';
import { getCountryAtmosphere } from '../../config/countryAtmosphere';
import { getCountryStampProgress } from '../../config/collectionGoals';
import { getRoomEntryLine } from '../../config/visbyLines';
import { FurnitureVisual } from '../../components/furniture/FurnitureVisual';
import { NavBreadcrumb } from '../../components/ui/NavBreadcrumb';
import type { FurnitureInteractionType } from '../../types';

import * as Haptics from 'expo-haptics';
import { PlaceChatModal } from '../../components/room/PlaceChatModal';
import { RoomQuizModal } from '../../components/room/RoomQuizModal';
import { RoomFactModal } from '../../components/room/RoomFactModal';
import { FurniturePanel } from '../../components/room/FurniturePanel';
import { ObjectDetailModal, FurnitureInteractionModal, MicroEventModal, GamesModal } from '../../components/room/RoomObjectInteraction';
import { LocationsModal } from '../../components/room/LocationsModal';
import { DraggableFurniture, GridOverlay } from '../../components/room/DraggableFurniture';
import { RoomTintOverlay, DynamicWindow } from '../../components/room/RoomAtmosphere';
import { FurnitureMicroAnim, getAnimTypeForInteraction } from '../../components/room/FurnitureMicroAnim';
import { VisbyReactions, ReactionTrigger } from '../../components/visby/VisbyReactions';
import { AchievementCeremony } from '../../components/effects/AchievementCeremony';
import { calculateTraitLevels, getDominantTrait } from '../../config/visbyPersonality';
import { getActiveSeasonalVisuals } from '../../config/seasonalEvents';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AVATAR_SIZE = 84;
const ROOM_HEIGHT = 560;
const WALL_HEIGHT = 380;
const FLOOR_HEIGHT = 180;
const WINDOW_STRIP_HEIGHT = 80;
const TEXTURE_DOT_COUNT = 20;
const KNOT_POSITIONS_CR = [
  { plank: 1, left: '30%', top: '40%' },
  { plank: 3, left: '55%', top: '50%' },
  { plank: 5, left: '20%', top: '35%' },
];
const FRINGE_COUNT_CR = 16;
const FACT_AURA_REWARD = 5;
const QUIZ_AURA_PER_CORRECT = 25;

const FURNITURE_MAP = new Map(FURNITURE_CATALOG.map(f => [f.id, f]));

const BreathingPulse: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pulse = useSharedValue(1);
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1500 }),
        withTiming(1.0, { duration: 1500 }),
      ),
      -1,
      true,
    );
  }, []);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: pulse.value }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
};

type CountryRoomScreenProps = {
  navigation: NativeStackNavigationProp<ExploreStackParamList, 'CountryRoom'>;
  route: { params: { countryId: string; friendUserId?: string } };
};

export const CountryRoomScreen: React.FC<CountryRoomScreenProps> = ({ navigation, route }) => {
  const { countryId, friendUserId } = route.params;
  const country = COUNTRIES.find((c) => c.id === countryId);
  const houseData = COUNTRY_HOUSES[countryId];

  const visby = useStore(s => s.visby);
  const user = useStore(s => s.user);
  const friends = useStore(s => s.friends);
  const stamps = useStore(s => s.stamps);
  const userHouses = useStore(s => s.userHouses);
  const ownedFurniture = useStore(s => s.ownedFurniture);
  const storyBeatsShown = useStore(s => s.storyBeatsShown);
  const chatMode = useStore(s => s.settings.chatMode);

  const addAura = useStore(s => s.addAura);
  const getStreakMultiplier = useStore(s => s.getStreakMultiplier);
  const buyFurniture = useStore(s => s.buyFurniture);
  const placeFurniture = useStore(s => s.placeFurniture);
  const removePlacedFurniture = useStore(s => s.removePlacedFurniture);
  const updateRoomColors = useStore(s => s.updateRoomColors);
  const feedVisby = useStore(s => s.feedVisby);
  const restVisby = useStore(s => s.restVisby);
  const playWithVisby = useStore(s => s.playWithVisby);
  const studyWithVisby = useStore(s => s.studyWithVisby);
  const markFactRead = useStore(s => s.markFactRead);
  const markQuizCompleted = useStore(s => s.markQuizCompleted);
  const getCountryProgress = useStore(s => s.getCountryProgress);
  const chargeSocialBattery = useStore(s => s.chargeSocialBattery);
  const getPlaceChatMessages = useStore(s => s.getPlaceChatMessages);
  const addPlaceChatMessage = useStore(s => s.addPlaceChatMessage);
  const markStoryBeatShown = useStore(s => s.markStoryBeatShown);
  const recordSeasonalCountryEntry = useStore(s => s.recordSeasonalCountryEntry);
  const addDiscovery = useStore(s => s.addDiscovery);
  const recordRoomVisit = useStore(s => s.recordRoomVisit);
  const tryRoomMicroEvent = useStore(s => s.tryRoomMicroEvent);
  const addSkillPoints = useStore(s => s.addSkillPoints);
  const unlockRoom = useStore(s => s.unlockRoom);
  const getUnlockedRooms = useStore(s => s.getUnlockedRooms);
  const enterRoom = useStore(s => s.enterRoom);
  const leaveRoom = useStore(s => s.leaveRoom);
  const syncPresenceInRoom = useStore(s => s.syncPresenceInRoom);

  const friend = friendUserId ? friends.find((f) => f.userId === friendUserId) : null;
  const isViewingFriendHouse = !!friendUserId && !!friend;
  const isOwner = !isViewingFriendHouse && userHouses.some((h) => h.countryId === countryId);
  const roomTitle = isViewingFriendHouse ? `${friend?.displayName}'s Home` : (country?.name ?? 'Room');
  const rooms = houseData?.rooms ?? [];

  const [friendHouseData, setFriendHouseData] = useState<{ roomCustomizations?: Record<string, any>; visbyAppearance?: any } | null>(null);

  useEffect(() => {
    if (!isViewingFriendHouse || !friendUserId) return;
    import('../../services/socialSync').then(({ fetchUserHouse }) => {
      fetchUserHouse(friendUserId).then(data => {
        if (data) setFriendHouseData(data);
      }).catch(() => {});
    });
  }, [isViewingFriendHouse, friendUserId]);

  const [currentRoomIdx, setCurrentRoomIdx] = useState(0);
  const [roomTransitionKey, setRoomTransitionKey] = useState(0);
  const [roomSlideDir, setRoomSlideDir] = useState<'left' | 'right'>('right');
  const currentRoom: HouseRoom | undefined = rooms[currentRoomIdx];
  const [roomDialogueLine, setRoomDialogueLine] = useState<string | null>(null);

  useEffect(() => {
    if (!countryId || isViewingFriendHouse) return;
    recordSeasonalCountryEntry();
  }, [countryId, isViewingFriendHouse, recordSeasonalCountryEntry]);

  const [showMicroEvent, setShowMicroEvent] = useState(false);
  const [microEventAura, setMicroEventAura] = useState<number>(5);
  const [microEventIsRare, setMicroEventIsRare] = useState(false);
  const [discoveryToast, setDiscoveryToast] = useState<string | null>(null);

  useEffect(() => {
    if (!currentRoom?.id || !countryId || isViewingFriendHouse) return;
    recordRoomVisit(countryId, currentRoom.id);
    const result = tryRoomMicroEvent(countryId, currentRoom.id);
    if (result.triggered) {
      setMicroEventAura(result.aura ?? 5);
      setMicroEventIsRare(result.isRare ?? false);
      setShowMicroEvent(true);
    }
  }, [countryId, currentRoom?.id, isViewingFriendHouse, recordRoomVisit, tryRoomMicroEvent]);

  useEffect(() => {
    if (!currentRoom || !countryId || isViewingFriendHouse) return;
    const key = `room_${countryId}_${currentRoom.id}`;
    if (storyBeatsShown.includes(key)) return;

    let line = getRoomEntryLine(countryId);
    const traitId = dominantTrait?.id;
    const roomNameLower = currentRoom.name.toLowerCase();
    if (traitId === 'foodie' && (roomNameLower.includes('kitchen') || roomNameLower.includes('dining'))) {
      line = "Visby can't wait to try the food here! 🍜";
    } else if (traitId === 'bookworm' && (roomNameLower.includes('study') || roomNameLower.includes('library'))) {
      line = "Visby is already reaching for a book! 📚";
    } else if (traitId === 'adventurer') {
      line = "Visby is excited to explore this place! 🗺️";
    }

    setRoomDialogueLine(line);
    markStoryBeatShown(key);
    triggerReaction('enter_home');
    const t = setTimeout(() => setRoomDialogueLine(null), 4000);
    return () => clearTimeout(t);
  }, [countryId, currentRoom?.id, isViewingFriendHouse, storyBeatsShown, markStoryBeatShown, dominantTrait, triggerReaction]);

  const [activeObject, setActiveObject] = useState<RoomObject | null>(null);
  const [interactedObjects, setInteractedObjects] = useState<Set<string>>(new Set());
  const [learningFact, setLearningFact] = useState<CountryFact | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [readFacts, setReadFacts] = useState<Set<string>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [showGamesModal, setShowGamesModal] = useState(false);
  const [showLocationsModal, setShowLocationsModal] = useState(false);
  const [showKnowledgeMap, setShowKnowledgeMap] = useState(false);
  const [visitedLocations, setVisitedLocations] = useState<Set<string>>(new Set());
  const locations = useMemo(() => getCountryLocations(countryId), [countryId]);
  const [editMode, setEditMode] = useState(false);
  const [selectedPlacedItem, setSelectedPlacedItem] = useState<string | null>(null);
  const [activeEditTab, setActiveEditTab] = useState<'furniture' | 'wallpaper' | 'flooring' | null>(null);
  const [activeFurnitureInteraction, setActiveFurnitureInteraction] = useState<{
    placed: PlacedFurniture;
    catalogItem: import('../../types').FurnitureItem;
  } | null>(null);
  const [showPlaceChatModal, setShowPlaceChatModal] = useState(false);
  const [presenceFriends, setPresenceFriends] = useState<Array<{ userId: string; username: string }>>([]);
  const [showCountryIntro, setShowCountryIntro] = useState(false);
  const [showMasteryCelebration, setShowMasteryCelebration] = useState(false);
  const introScale = useSharedValue(0.3);
  const introOpacity = useSharedValue(0);
  const visbyFlyY = useSharedValue(-200);
  const visbyFlyScale = useSharedValue(0.4);
  const introFlagRotate = useSharedValue(-15);

  const timersRef = useRef<NodeJS.Timeout[]>([]);
  useEffect(() => {
    return () => timersRef.current.forEach(clearTimeout);
  }, []);

  const [visbyMood, setVisbyMood] = useState<string>('curious');
  const [visbyReaction, setVisbyReaction] = useState<string | undefined>(undefined);
  const [reactionTrigger, setReactionTrigger] = useState<ReactionTrigger | null>(null);
  const [showRoomCelebration, setShowRoomCelebration] = useState(false);
  const [completedRoomIds, setCompletedRoomIds] = useState<Set<string>>(new Set());

  const roomEntranceScale = useSharedValue(0.95);
  const roomEntranceOpacity = useSharedValue(0.7);

  const triggerReaction = useCallback((trigger: ReactionTrigger) => {
    setReactionTrigger(null);
    requestAnimationFrame(() => setReactionTrigger(trigger));
  }, []);

  const setTempMood = useCallback((mood: string, durationMs = 3000) => {
    setVisbyMood(mood);
    const t = setTimeout(() => setVisbyMood('curious'), durationMs);
    timersRef.current.push(t);
  }, []);

  const house = isViewingFriendHouse ? undefined : userHouses.find(h => h.countryId === countryId);
  const friendRoomCustom = isViewingFriendHouse ? friendHouseData?.roomCustomizations?.[currentRoom?.id ?? ''] : undefined;
  const roomCustomization = friendRoomCustom || house?.roomCustomizations?.[currentRoom?.id ?? ''];
  const placedItems = useMemo(() => roomCustomization?.placedFurniture ?? [], [roomCustomization]);
  const lampInfo = useMemo(() => {
    for (const p of placedItems) {
      const cat = FURNITURE_CATALOG.find(f => f.id === p.furnitureId);
      if (cat && (/lamp|lantern/i.test(cat.id) || cat.interactionType === 'lamp')) {
        return { hasLamp: true, lampX: p.x, lampY: p.y };
      }
    }
    return { hasLamp: false, lampX: 50, lampY: 50 };
  }, [placedItems]);
  const effectiveWallColor = roomCustomization?.wallColor || currentRoom?.wallColor || '#FFF8F0';
  const effectiveFloorColor = roomCustomization?.floorColor || currentRoom?.floorColor || '#D4C5A0';

  const avatarX = useSharedValue(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2);
  const avatarDirection = useSharedValue<'left' | 'right'>('right');

  const multiplier = getStreakMultiplier();
  const aura = user?.aura ?? 0;
  const streak = user?.currentStreak ?? 0;

  const defaultAppearance = useMemo(() => visby?.appearance ?? {
    skinTone: colors.visby.skin.light,
    hairColor: colors.visby.hair.brown,
    hairStyle: 'default',
    eyeColor: '#4A90D9',
    eyeShape: 'round',
  }, [visby?.appearance]);

  const dominantTrait = useMemo(() => {
    const traits = calculateTraitLevels({
      bites: stamps?.length ?? 0,
      lessonsCompleted: 0,
      countriesVisited: user?.visitedCountries?.length ?? 0,
      chatMessages: 0,
      wordMatchGames: 0,
      gamesPlayed: 0,
      stampsCollected: stamps?.length ?? 0,
      averageNeedLevel: visby ? (visby.hunger + visby.happiness + visby.energy + visby.knowledge) / 4 : 50,
    });
    return getDominantTrait(traits);
  }, [stamps?.length, user?.visitedCountries?.length, visby]);

  const seasonalVisuals = useMemo(() => getActiveSeasonalVisuals(), []);

  useEffect(() => {
    if (presenceFriends.length > 0) setVisbyMood('happy');
  }, [presenceFriends.length]);

  useEffect(() => {
    if (isViewingFriendHouse) chargeSocialBattery(10);
  }, [isViewingFriendHouse, chargeSocialBattery]);

  useEffect(() => {
    if (!currentRoom?.id || !countryId || isViewingFriendHouse) return;
    enterRoom(countryId, currentRoom.id);

    const pollPresence = () => {
      syncPresenceInRoom(countryId, currentRoom.id).then(setPresenceFriends).catch(() => {});
    };
    pollPresence();
    const interval = setInterval(pollPresence, 15000);

    return () => {
      clearInterval(interval);
      leaveRoom();
    };
  }, [countryId, currentRoom?.id, isViewingFriendHouse, enterRoom, leaveRoom, syncPresenceInRoom]);

  const introScaleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: introScale.value }],
    opacity: introOpacity.value,
  }));
  const visbyFlyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: visbyFlyY.value }, { scale: visbyFlyScale.value }],
  }));
  const flagRotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${introFlagRotate.value}deg` }, { scale: introScale.value }],
  }));

  useEffect(() => {
    if (!countryId || isViewingFriendHouse || !country) return;
    const progress = getCountryProgress(countryId);
    if ((progress?.factsReadCount ?? 0) === 0) {
      setShowCountryIntro(true);
      introScale.value = withSpring(1, { damping: 12, stiffness: 100 });
      introOpacity.value = withTiming(1, { duration: 400 });
      visbyFlyY.value = withSpring(0, { damping: 10, stiffness: 80 });
      visbyFlyScale.value = withSpring(1, { damping: 8, stiffness: 90 });
      introFlagRotate.value = withSpring(0, { damping: 14, stiffness: 120 });
      const t = setTimeout(() => {
        introOpacity.value = withTiming(0, { duration: 500 });
        introScale.value = withTiming(1.2, { duration: 500 });
        setTimeout(() => setShowCountryIntro(false), 600);
      }, 2800);
      return () => clearTimeout(t);
    }
  }, [countryId, isViewingFriendHouse, country?.id, getCountryProgress]);

  const countryProgress = useMemo(() => getCountryProgress(countryId), [getCountryProgress, countryId]);
  const isPlaceComplete = useMemo(() => {
    const facts = country?.facts ?? [];
    return countryProgress.factsReadCount >= facts.length && countryProgress.quizCompleted;
  }, [country?.facts, countryProgress]);
  const isMastered = useMemo(
    () => isPlaceComplete && countryProgress.gamesPlayed > 0 && countryProgress.locationsVisited > 0,
    [isPlaceComplete, countryProgress],
  );

  const masteryKey = `mastery_${countryId}`;
  useEffect(() => {
    if (!isMastered || isViewingFriendHouse || storyBeatsShown.includes(masteryKey)) return;
    setShowMasteryCelebration(true);
    markStoryBeatShown(masteryKey);
    addAura(500);
  }, [isMastered, isViewingFriendHouse, masteryKey, storyBeatsShown, markStoryBeatShown, addAura]);

  const walkBob = useSharedValue(0);
  const idleBreathe = useSharedValue(1);

  useEffect(() => {
    idleBreathe.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 2000 }),
        withTiming(1.0, { duration: 2000 }),
      ),
      -1, true,
    );
  }, []);

  const idleBreatheStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: idleBreathe.value }],
  }));

  const walkLeftScale = useSharedValue(1);
  const walkRightScale = useSharedValue(1);

  const walkLeftBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: walkLeftScale.value }],
  }));
  const walkRightBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: walkRightScale.value }],
  }));

  const moveLeft = useCallback(() => {
    avatarDirection.value = 'left';
    avatarX.value = withSpring(Math.max(spacing.lg, avatarX.value - 28), { damping: 14, stiffness: 120 });
    walkBob.value = withSequence(
      withTiming(-3, { duration: 100 }),
      withTiming(2, { duration: 100 }),
      withTiming(-1, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    );
    walkLeftScale.value = withSequence(
      withSpring(0.88, { damping: 6, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const moveRight = useCallback(() => {
    avatarDirection.value = 'right';
    avatarX.value = withSpring(Math.min(SCREEN_WIDTH - AVATAR_SIZE - spacing.lg, avatarX.value + 28), { damping: 14, stiffness: 120 });
    walkBob.value = withSequence(
      withTiming(-3, { duration: 100 }),
      withTiming(2, { duration: 100 }),
      withTiming(-1, { duration: 100 }),
      withTiming(0, { duration: 100 }),
    );
    walkRightScale.value = withSequence(
      withSpring(0.88, { damping: 6, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const avatarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: avatarX.value },
      { translateY: walkBob.value },
      { scaleX: avatarDirection.value === 'left' ? -1 : 1 },
    ],
  }));

  const roomEntranceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: roomEntranceScale.value }],
    opacity: roomEntranceOpacity.value,
  }));

  const goToRoom = useCallback((idx: number) => {
    if (idx >= 0 && idx < rooms.length) {
      setRoomSlideDir(idx > currentRoomIdx ? 'right' : 'left');
      setCurrentRoomIdx(idx);
      setRoomTransitionKey((k) => k + 1);
      avatarX.value = withSpring(SCREEN_WIDTH / 2 - AVATAR_SIZE / 2, { damping: 14, stiffness: 120 });
      roomEntranceScale.value = 0.95;
      roomEntranceOpacity.value = 0.7;
      roomEntranceScale.value = withSpring(1, { damping: 14, stiffness: 140 });
      roomEntranceOpacity.value = withTiming(1, { duration: 350 });
    }
  }, [rooms.length, currentRoomIdx]);

  const handleObjectTap = useCallback((obj: RoomObject) => {
    if (!obj.interactive) return;
    setActiveObject(obj);
    if (!interactedObjects.has(obj.id)) {
      const newSet = new Set(interactedObjects);
      newSet.add(obj.id);
      setInteractedObjects(newSet);
      if (obj.auraReward) addAura(obj.auraReward);
      setTempMood('excited', 3000);
      setVisbyReaction('excited_jump');
      setTimeout(() => setVisbyReaction(undefined), 1500);

      const objects = currentRoom?.objects ?? [];
      const totalInt = objects.filter(o => o.interactive).length;
      const nowInteracted = objects.filter(o => o.interactive && newSet.has(o.id)).length;
      if (nowInteracted >= totalInt && totalInt > 0 && currentRoom && !completedRoomIds.has(currentRoom.id)) {
        setCompletedRoomIds(prev => new Set(prev).add(currentRoom.id));
        timersRef.current.push(setTimeout(() => {
          setShowRoomCelebration(true);
          addAura(25);
          setVisbyMood('proud');
          setVisbyReaction('love');
          triggerReaction('milestone');
        }, 800));
      }
    }
  }, [interactedObjects, addAura, currentRoom, completedRoomIds, setTempMood, triggerReaction]);

  const openFact = useCallback((fact: CountryFact) => {
    setLearningFact(fact);
    if (!readFacts.has(fact.id)) {
      setReadFacts((prev) => new Set(prev).add(fact.id));
      addAura(FACT_AURA_REWARD);
      markFactRead(countryId);
      addDiscovery(fact.title, countryId, 'fact');
      setDiscoveryToast(fact.title);
      setTimeout(() => setDiscoveryToast(null), 2200);
    }
  }, [readFacts, addAura, countryId, markFactRead, addDiscovery]);

  const nextFact = useCallback(() => {
    if (!country?.facts.length) return;
    const nextIdx = (factIndex + 1) % country.facts.length;
    setFactIndex(nextIdx);
    openFact(country.facts[nextIdx]);
  }, [country?.facts, factIndex, openFact]);

  const handleQuizComplete = useCallback((score: number, totalQuestions: number) => {
    const reward = score * QUIZ_AURA_PER_CORRECT;
    if (reward > 0) addAura(reward);
    markQuizCompleted(countryId);
    addDiscovery(`${country?.name ?? countryId} quiz`, countryId, 'quiz');
    setDiscoveryToast('Country quiz');
    timersRef.current.push(setTimeout(() => setDiscoveryToast(null), 2200));
  }, [addAura, markQuizCompleted, countryId, country?.name, addDiscovery]);

  const getQuizQuestions = useCallback(() => getCountryQuiz(countryId, 8), [countryId]);

  const handleVisitLocation = useCallback((location: ReturnType<typeof getCountryLocations>[0]) => {
    if (visitedLocations.has(location.id)) return;
    setVisitedLocations(prev => new Set(prev).add(location.id));
    addAura(location.learningPoints);
    const skillMap: Record<string, keyof import('../../types').SkillProgress> = {
      landmark: 'geography', food: 'cooking', nature: 'exploration', culture: 'culture', hidden_gem: 'exploration',
    };
    const skill = skillMap[location.category];
    if (skill) addSkillPoints(skill, 2);
  }, [visitedLocations, addAura, addSkillPoints]);

  const handleUseFurniture = useCallback((interactionType: FurnitureInteractionType, auraAmount: number) => {
    if (interactionType === 'table' || interactionType === 'stove') {
      feedVisby();
      setTempMood('happy', 4000);
      triggerReaction('feed');
    } else if (interactionType === 'bed') {
      restVisby();
      setTempMood('cozy', 4000);
      triggerReaction('rest');
    } else if (interactionType === 'toy') {
      playWithVisby();
      setTempMood('excited', 4000);
      triggerReaction('play');
    } else if (interactionType === 'bookshelf') {
      studyWithVisby();
      setTempMood('proud', 4000);
      triggerReaction('study');
    }
    addAura(Math.round(auraAmount * multiplier));
    setActiveFurnitureInteraction(null);
  }, [feedVisby, restVisby, playWithVisby, studyWithVisby, addAura, multiplier, setTempMood, triggerReaction]);

  const handleNavigateToGame = useCallback((gameKey: string) => {
    (navigation.getParent() as any)?.getParent()?.navigate(gameKey, { countryId });
  }, [navigation, countryId]);

  const handleSendChatMessage = useCallback((text: string) => {
    if (!currentRoom) return;
    addPlaceChatMessage(`room_${countryId}_${currentRoom.id}`, text);
  }, [addPlaceChatMessage, countryId, currentRoom]);

  const handlePlaceFurniture = useCallback((item: PlacedFurniture) => {
    if (!currentRoom) return;
    placeFurniture(countryId, currentRoom.id, item);
    triggerReaction('decorate_room');
  }, [placeFurniture, countryId, currentRoom, triggerReaction]);

  const handleUpdateWallColor = useCallback((color: string) => {
    if (currentRoom) updateRoomColors(countryId, currentRoom.id, color, undefined);
  }, [updateRoomColors, countryId, currentRoom]);

  const handleUpdateFloorColor = useCallback((color: string) => {
    if (currentRoom) updateRoomColors(countryId, currentRoom.id, undefined, color);
  }, [updateRoomColors, countryId, currentRoom]);

  const { totalInteractive, roomInteracted } = useMemo(() => {
    const objects = currentRoom?.objects ?? [];
    const total = objects.filter((o) => o.interactive).length;
    const interacted = objects.filter((o) => o.interactive && interactedObjects.has(o.id)).length;
    return { totalInteractive: total, roomInteracted: interacted };
  }, [currentRoom?.objects, interactedObjects]);

  const chatMessages = useMemo(
    () => currentRoom ? (getPlaceChatMessages(`room_${countryId}_${currentRoom.id}`) || []) : [],
    [getPlaceChatMessages, countryId, currentRoom],
  );

  if (!country) {
    return (
      <View style={styles.centered}>
        <Text>Country not found.</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const facts = country.facts;
  const atmosphere = getCountryAtmosphere(countryId);

  return (
    <View style={styles.container}>
      <LinearGradient colors={[...atmosphere.immersiveBg]} style={StyleSheet.absoluteFill} locations={[0, 0.5, 1]} />
      {showCountryIntro && country && (
        <Animated.View
          style={[styles.countryIntroOverlay, introScaleStyle, { pointerEvents: 'none' }]}
        >
          <LinearGradient
            colors={[country.accentColor + 'DD', '#1A0F3C', '#0F0826']}
            style={styles.countryIntroContent}
          >
            <FloatingParticles count={12} variant={getCountryParticleVariant(countryId).variant} opacity={0.6} speed="normal" />
            <Animated.View style={[styles.visbyFlyIn, visbyFlyStyle]}>
              <Text style={styles.visbyFlyEmoji}>🦊</Text>
              <Text style={styles.visbyFlyLabel}>Visby is flying to {country.name}!</Text>
            </Animated.View>
            <Animated.View style={[styles.countryIntroInner, flagRotateStyle]}>
              <Text style={styles.countryIntroFlag}>{country.flagEmoji}</Text>
            </Animated.View>
            <Animated.View style={introScaleStyle}>
              <Heading level={1} style={styles.countryIntroTitle}>{country.name}</Heading>
              <Text style={styles.countryIntroSub}>Welcome to {country.name}!</Text>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      )}
      <FloatingParticles
        count={6}
        variant={getCountryParticleVariant(countryId).variant}
        opacity={getCountryParticleVariant(countryId).opacity}
        speed={getCountryParticleVariant(countryId).speed}
        shape={atmosphere.particleShape}
      />
      {seasonalVisuals?.particleVariant && (
        <FloatingParticles
          count={4}
          variant={seasonalVisuals.particleVariant as any}
          opacity={0.4}
          speed="slow"
        />
      )}

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Icon name="chevronLeft" size={24} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              {!isViewingFriendHouse && country && (
                <NavBreadcrumb items={[
                  { label: 'World', onPress: () => navigation.navigate('CountryWorld') },
                  { label: country.name },
                ]} />
              )}
              <View style={{ position: 'relative' as const }}>
                <Text style={styles.flagTitle}>{country.flagEmoji} {roomTitle}</Text>
                <Tooltip
                  id="room_tap_objects"
                  text="Tap objects to discover fun facts!"
                />
              </View>
              {isOwner && <Caption style={styles.ownerTag}>Your House</Caption>}
              {isViewingFriendHouse && friend && (
                <Caption style={styles.ownerTag}>Visiting {friend.displayName}'s home</Caption>
              )}
              <Text style={styles.vibeCaption}>
                {isViewingFriendHouse ? `Visiting in ${country.name}` : `Walking through ${country.name} with your Visby`}
              </Text>
            </View>
            <View style={styles.auraChip}>
              <Text style={styles.auraChipText}>{aura}</Text>
            </View>
          </View>

          {streak > 0 && (
            <View style={styles.streakBanner}>
              <Text style={styles.streakText}>{streak}-day streak</Text>
              <View style={styles.multiplierBadge}>
                <Text style={styles.multiplierText}>{multiplier.toFixed(1)}x</Text>
              </View>
            </View>
          )}

          {isPlaceComplete && (
            <View style={styles.placeCompleteBanner}>
              <LinearGradient
                colors={[colors.success.honeydew, colors.reward.peachLight, colors.primary.wisteriaFaded]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
              <View style={styles.placeCompleteContent}>
                <Icon name="trophy" size={32} color={colors.reward.gold} />
                <View style={styles.placeCompleteText}>
                  <Text style={styles.placeCompleteTitle}>Place complete!</Text>
                  <Text style={styles.placeCompleteSub}>You've mastered {country.name}. Explore the next place.</Text>
                </View>
              </View>
            </View>
          )}

          {/* Room cards */}
          {rooms.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.roomCardsRow}>
              {rooms.map((room, idx) => {
                const isActive = idx === currentRoomIdx;
                const rCustom = house?.roomCustomizations?.[room.id];
                const roomWall = rCustom?.wallColor || room.wallColor;
                const roomObjs = room.objects ?? [];
                const roomTotalInt = roomObjs.filter(o => o.interactive).length;
                const roomDone = roomObjs.filter(o => o.interactive && interactedObjects.has(o.id)).length;
                const isRoomComplete = completedRoomIds.has(room.id) || (roomTotalInt > 0 && roomDone >= roomTotalInt);
                return (
                  <TouchableOpacity
                    key={room.id}
                    style={[
                      styles.roomCard,
                      isActive && styles.roomCardActive,
                      isRoomComplete && styles.roomCardComplete,
                    ]}
                    onPress={() => goToRoom(idx)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.roomCardSwatch, { backgroundColor: roomWall }]}>
                      {isRoomComplete && (
                        <View style={styles.roomCardTrophy}>
                          <Icon name="trophy" size={10} color="#FFD700" />
                        </View>
                      )}
                    </View>
                    <View style={styles.roomCardContent}>
                      <Icon name={room.icon as IconName} size={20} color={isActive ? colors.primary.wisteriaDark : colors.text.secondary} />
                      <Text style={[styles.roomCardLabel, isActive && styles.roomCardLabelActive]} numberOfLines={1}>{room.name}</Text>
                      {roomTotalInt > 0 && (
                        <Text style={styles.roomCardProgress}>{roomDone}/{roomTotalInt}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
              {/* Locked room expansion cards */}
              {isOwner && DEFAULT_ROOM_DEFINITIONS.filter(
                (r) => !r.isDefault && !getUnlockedRooms(countryId).includes(r.id)
              ).map((roomDef) => (
                <TouchableOpacity
                  key={roomDef.id}
                  style={[styles.roomCard, styles.roomCardLocked]}
                  onPress={() => {
                    const success = unlockRoom(countryId, roomDef.id);
                    if (!success) {
                      // Not enough Aura or already unlocked
                    }
                  }}
                  activeOpacity={0.85}
                >
                  <View style={[styles.roomCardSwatch, { backgroundColor: 'rgba(184,165,224,0.15)' }]} />
                  <View style={styles.roomCardContent}>
                    <Icon name="lock" size={16} color={colors.text.muted} />
                    <Text style={[styles.roomCardLabel, { color: colors.text.muted, fontSize: 11 }]} numberOfLines={1}>{roomDef.name}</Text>
                    <View style={styles.roomUnlockPrice}>
                      <Icon name="sparkles" size={9} color={colors.reward.gold} />
                      <Text style={{ fontSize: 9, fontWeight: '700', color: colors.reward.amber }}>{roomDef.unlockPrice}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {!currentRoom && country && (
            <View style={styles.noRoomsWrap}>
              <View style={[styles.noRoomsCard, { borderLeftColor: country.accentColor }]}>
                <Icon name="compass" size={32} color={country.accentColor} />
                <Text variant="h3" style={styles.noRoomsTitle}>Welcome to {country.name}</Text>
                <Text variant="body" color={colors.text.secondary} style={styles.noRoomsText}>
                  Explore festivals and places from around the world! Read the facts and take the quiz below to earn Aura.
                </Text>
              </View>
            </View>
          )}

          {/* Room Stage */}
          {currentRoom && (
            <View style={styles.roomStageWrap}>
              <Animated.View
                key={roomTransitionKey}
                entering={roomSlideDir === 'right' ? FadeInRight.duration(250) : FadeInLeft.duration(250)}
                style={[styles.roomStageFrame, roomEntranceStyle]}
              >
                {/* Window with dynamic sky, arch and inner shadow */}
                <View style={[styles.roomWindowStrip, { height: WINDOW_STRIP_HEIGHT }]}>
                  <DynamicWindow
                    width={SCREEN_WIDTH - spacing.md * 2}
                    height={WINDOW_STRIP_HEIGHT}
                    overrideSky={atmosphere.windowSky}
                  />
                  <View style={styles.windowCurtainLeft} />
                  <View style={styles.windowCurtainRight} />
                  <View style={styles.roomWindowArch} />
                  <View style={styles.windowReflection} />
                  <View style={styles.windowInnerShadow} />
                </View>

                {/* Light spill from window */}
                <View style={[styles.windowLightSpill, { pointerEvents: 'none' }]}>
                  <LinearGradient
                    colors={[colors.room.lightSpill, 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />
                </View>

                {/* Wall */}
                <LinearGradient
                  colors={[effectiveWallColor, effectiveWallColor, (country?.accentColor ?? colors.primary.wisteria) + '18']}
                  style={[styles.roomWall, { height: WALL_HEIGHT - WINDOW_STRIP_HEIGHT }]}
                  locations={[0, 0.7, 1]}
                >
                  {/* Wallpaper texture dots */}
                  <View style={[styles.wallTextureOverlay, { pointerEvents: 'none' }]}>
                    {Array.from({ length: TEXTURE_DOT_COUNT }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.wallTextureDot,
                          {
                            left: `${8 + ((i * 37) % 84)}%` as any,
                            top: `${10 + ((i * 53) % 80)}%` as any,
                            width: 2 + (i % 3),
                            height: 2 + (i % 3),
                            borderRadius: (2 + (i % 3)) / 2,
                          },
                        ]}
                      />
                    ))}
                  </View>

                  {/* Corner shadow vignettes */}
                  <View style={[styles.wallCornerLeft, { pointerEvents: 'none' }]}>
                    <LinearGradient
                      colors={[colors.room.cornerShadow, 'transparent']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>
                  <View style={[styles.wallCornerRight, { pointerEvents: 'none' }]}>
                    <LinearGradient
                      colors={[colors.room.cornerShadow, 'transparent']}
                      start={{ x: 1, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </View>

                  {/* Wainscoting panels */}
                  <View style={styles.wainscotingWrap}>
                    {[0, 1, 2, 3, 4].map(i => (
                      <View key={i} style={styles.wainscotPanel}>
                        <View style={styles.wainscotPanelInner} />
                      </View>
                    ))}
                  </View>
                  {/* Chair rail */}
                  <View style={styles.wainscotChairRail} />

                  <View style={styles.roomNameRow}>
                    <View style={styles.roomNameInner}>
                      <Text style={styles.roomNameText}>{currentRoom.name}</Text>
                      {isOwner && (
                        <TouchableOpacity
                          style={[styles.editToggleBtn, editMode && styles.editToggleBtnActive]}
                          onPress={() => { setEditMode(v => !v); setSelectedPlacedItem(null); setActiveEditTab(null); }}
                          activeOpacity={0.8}
                        >
                          <Icon name="edit" size={12} color={editMode ? '#FFFFFF' : colors.primary.wisteriaDark} />
                          <Text style={[styles.editToggleText, editMode && styles.editToggleTextActive]}>
                            {editMode ? 'Done' : 'Edit'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    {!editMode && totalInteractive > 0 && (
                      <View style={styles.roomProgressChip}>
                        <Text style={styles.roomProgressText}>{roomInteracted}/{totalInteractive}</Text>
                      </View>
                    )}
                  </View>

                  {roomDialogueLine && (
                    <Animated.View
                      entering={FadeInDown.springify().damping(14)}
                      exiting={FadeOut.duration(200)}
                      style={styles.roomDialogueBubble}
                    >
                      <Text style={styles.roomDialogueText}>Visby: "{roomDialogueLine}"</Text>
                      <View style={styles.dialogueBubbleTail} />
                    </Animated.View>
                  )}

                  {!isViewingFriendHouse && (
                    <View style={styles.othersHereBar}>
                      <Icon name="people" size={14} color={presenceFriends.length > 0 ? colors.primary.wisteriaDark : colors.text.muted} />
                      <Caption style={[styles.othersHereText, presenceFriends.length > 0 && { color: colors.primary.wisteriaDark }]}>
                        {presenceFriends.length > 0
                          ? `${presenceFriends.map(f => f.username).join(', ')} here!`
                          : 'No friends in this room right now'}
                      </Caption>
                    </View>
                  )}

                  {/* Room tint overlay for time-of-day ambiance */}
                  <RoomTintOverlay hasLamp={lampInfo.hasLamp} lampX={lampInfo.lampX} lampY={lampInfo.lampY} />

                  {/* Objects layer */}
                  <View style={[styles.objectsLayer, { height: (WALL_HEIGHT - WINDOW_STRIP_HEIGHT) - 40 }]}>
                    {editMode && (
                      <GridOverlay
                        width={SCREEN_WIDTH - spacing.md * 2}
                        height={(WALL_HEIGHT - WINDOW_STRIP_HEIGHT) - 40}
                        visible={editMode}
                      />
                    )}
                    {currentRoom.objects.map((obj) => {
                      const wasInteracted = interactedObjects.has(obj.id);
                      const isInteractive = obj.interactive && !editMode;
                      return (
                        <TouchableOpacity
                          key={obj.id}
                          style={[
                            styles.roomObject,
                            isInteractive && styles.roomObjectInteractive,
                            wasInteracted && styles.roomObjectDone,
                            { left: `${obj.x}%` as any, top: `${obj.y}%` as any, zIndex: Math.round(obj.y) },
                          ]}
                          onPress={() => {
                            if (!isInteractive) return;
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            handleObjectTap(obj);
                          }}
                          activeOpacity={isInteractive ? 0.7 : 1}
                          disabled={!isInteractive}
                          hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                        >
                          {isInteractive && !wasInteracted ? (
                            <BreathingPulse>
                              <View style={[styles.roomObjectIconWrap, styles.roomObjectIconWrapGlow]}>
                                <Icon name={obj.icon as IconName} size={34} color={colors.text.primary} />
                              </View>
                            </BreathingPulse>
                          ) : (
                            <View style={styles.roomObjectIconWrap}>
                              <Icon name={obj.icon as IconName} size={34} color={wasInteracted ? colors.success.emerald : colors.text.primary} />
                            </View>
                          )}
                          <Text style={[styles.objectLabel, wasInteracted && styles.objectLabelDone]} numberOfLines={2}>{obj.label}</Text>
                          {isInteractive && !wasInteracted && <View style={styles.interactiveDot} />}
                          {isInteractive && wasInteracted && <Icon name="check" size={16} color={colors.success.emerald} style={styles.objectCheck} />}
                          {isInteractive && !wasInteracted && (
                            <View style={styles.objectSparkleHint}>
                              <Icon name="sparkles" size={10} color={colors.reward.gold} />
                            </View>
                          )}
                        </TouchableOpacity>
                      );
                    })}

                    {placedItems.map((placed: PlacedFurniture) => {
                      const catalogItem = FURNITURE_MAP.get(placed.furnitureId);
                      if (!catalogItem) return null;
                      const canInteract = !editMode && catalogItem.interactionType;
                      const animType = getAnimTypeForInteraction(catalogItem.interactionType);

                      const furnitureContent = (
                        <TouchableOpacity
                          key={placed.id}
                          style={[
                            styles.placedFurnitureItem,
                            !editMode && { left: `${placed.x}%` as any, top: `${placed.y}%` as any },
                            selectedPlacedItem === placed.id && styles.placedFurnitureItemSelected,
                            canInteract && styles.placedFurnitureItemInteractive,
                            { zIndex: Math.round(placed.y) },
                          ]}
                          onPress={() => {
                            if (editMode) {
                              setSelectedPlacedItem(selectedPlacedItem === placed.id ? null : placed.id);
                            } else if (catalogItem.interactionType) {
                              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                              setActiveFurnitureInteraction({ placed, catalogItem });
                            }
                          }}
                          activeOpacity={editMode || canInteract ? 0.7 : 1}
                          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                          <FurnitureVisual
                            item={catalogItem}
                            interactionType={catalogItem.interactionType}
                            icon={catalogItem.icon as IconName}
                            size={catalogItem.interactionType ? 'large' : 'medium'}
                            showHint
                            glow={!!canInteract}
                            glowColor={country?.accentColor || colors.primary.wisteria}
                          />
                          {animType && activeFurnitureInteraction?.placed.id === placed.id && (
                            <FurnitureMicroAnim type={animType} visible size={100} />
                          )}
                          {animType && activeFurnitureInteraction?.placed.id !== placed.id && (
                            <View style={{ opacity: 0.35 }}>
                              <FurnitureMicroAnim type={animType} visible size={60} />
                            </View>
                          )}
                          <View style={styles.placedFurnitureShadow} />
                          <Text style={styles.placedFurnitureLabel} numberOfLines={1}>{catalogItem.name}</Text>
                          {canInteract && (
                            <View style={styles.useFurnitureBadge}>
                              <Icon name="sparkles" size={11} color={colors.primary.wisteriaDark} />
                              <Text style={styles.useFurnitureBadgeText}>Use</Text>
                            </View>
                          )}
                          {editMode && selectedPlacedItem === placed.id && (
                            <View style={styles.placedFurniturePopup}>
                              <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => { removePlacedFurniture(countryId, currentRoom.id, placed.id); setSelectedPlacedItem(null); }}
                              >
                                <Icon name="close" size={12} color="#FFFFFF" />
                                <Text style={styles.removeBtnText}>Remove</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </TouchableOpacity>
                      );

                      if (editMode) {
                        return (
                          <View key={placed.id} style={{ position: 'absolute', left: `${placed.x}%` as any, top: `${placed.y}%` as any }}>
                            <DraggableFurniture
                              initialX={placed.x}
                              initialY={placed.y}
                              containerWidth={SCREEN_WIDTH - spacing.md * 2}
                              containerHeight={(WALL_HEIGHT - WINDOW_STRIP_HEIGHT) - 40}
                              isEditMode={editMode}
                              onPositionChange={(newX, newY) => {
                                removePlacedFurniture(countryId, currentRoom.id, placed.id);
                                placeFurniture(countryId, currentRoom.id, { ...placed, x: newX, y: newY });
                              }}
                            >
                              {furnitureContent}
                            </DraggableFurniture>
                          </View>
                        );
                      }
                      return furnitureContent;
                    })}
                  </View>
                </LinearGradient>

                {/* Baseboard with shadow */}
                <View style={styles.baseboardShadow} />
                <View style={[styles.baseboard, { backgroundColor: effectiveFloorColor }]} />

                {/* Floor */}
                <LinearGradient
                  colors={[effectiveFloorColor, effectiveFloorColor, (country?.accentColor ?? '#000') + '08']}
                  style={styles.roomFloor}
                  locations={[0, 0.6, 1]}
                >
                  {/* Floor planks with stagger and knots */}
                  <View style={styles.floorPlanks}>
                    {[0, 1, 2, 3, 4, 5, 6, 7].map(i => {
                      const hasKnot = KNOT_POSITIONS_CR.find(k => k.plank === i);
                      const isStaggered = i % 2 === 1;
                      return (
                        <View key={i} style={styles.floorPlank}>
                          {isStaggered && <View style={styles.floorPlankStagger} />}
                          <View style={[styles.floorGrain, { top: '30%' }]} />
                          <View style={[styles.floorGrain, { top: '65%', opacity: 0.03 }]} />
                          {hasKnot && (
                            <View style={[styles.floorKnot, { left: hasKnot.left as any, top: hasKnot.top as any }]} />
                          )}
                        </View>
                      );
                    })}
                  </View>
                  {/* Decorative rug with fringe and country accent */}
                  <View style={styles.areaRugWrap}>
                    <View style={styles.areaRugFringeLeft}>
                      {Array.from({ length: FRINGE_COUNT_CR }).map((_, i) => (
                        <View key={i} style={[styles.areaRugFringe, { height: 4 + (i % 3) }]} />
                      ))}
                    </View>
                    <View style={styles.areaRug}>
                      <View style={[styles.areaRugBorder, { borderColor: (country?.accentColor ?? colors.room.rugBorder) + '40' }]} />
                      <View style={styles.areaRugInnerBorder} />
                      <View style={styles.areaRugCenter}>
                        <View style={[styles.areaRugDiamond, { backgroundColor: (country?.accentColor ?? colors.room.rugPattern) + '20' }]} />
                      </View>
                    </View>
                    <View style={styles.areaRugFringeRight}>
                      {Array.from({ length: FRINGE_COUNT_CR }).map((_, i) => (
                        <View key={i} style={[styles.areaRugFringe, { height: 4 + (i % 3) }]} />
                      ))}
                    </View>
                  </View>

                  {!editMode && (
                    <Animated.View style={[styles.avatarContainer, avatarStyle]}>
                      <View style={styles.visbyShadow}>
                        <LinearGradient
                          colors={['rgba(0,0,0,0.12)', 'rgba(0,0,0,0.04)', 'transparent']}
                          style={StyleSheet.absoluteFill}
                          start={{ x: 0.5, y: 0 }}
                          end={{ x: 0.5, y: 1 }}
                        />
                      </View>
                      <Animated.View style={[styles.visbyCompanionWrap, idleBreatheStyle]}>
                        <VisbyReactions
                          trigger={reactionTrigger}
                          onComplete={() => setReactionTrigger(null)}
                        />
                        <VisbyCharacter
                          appearance={defaultAppearance}
                          equipped={visby?.equipped}
                          mood={visbyMood as any}
                          reaction={visbyReaction as any}
                          size={AVATAR_SIZE}
                          animated
                        />
                        <View style={styles.visbyCompanionLabel}>
                          <Text style={styles.visbyCompanionText}>Your Visby</Text>
                        </View>
                      </Animated.View>
                    </Animated.View>
                  )}

                  {editMode ? (
                    <View style={styles.editToolbar}>
                      {(['furniture', 'wallpaper', 'flooring'] as const).map((tab) => (
                        <TouchableOpacity
                          key={tab}
                          style={[styles.editToolbarBtn, activeEditTab === tab && styles.editToolbarBtnActive]}
                          onPress={() => setActiveEditTab(tab)}
                          activeOpacity={0.8}
                        >
                          <Icon
                            name={tab === 'furniture' ? 'home' : tab === 'wallpaper' ? 'edit' : 'culture'}
                            size={18}
                            color={activeEditTab === tab ? '#FFFFFF' : colors.primary.wisteriaDark}
                          />
                          <Text style={[styles.editToolbarLabel, activeEditTab === tab && styles.editToolbarLabelActive]}>
                            {tab === 'furniture' ? 'Furniture' : tab === 'wallpaper' ? 'Wall' : 'Floor'}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.walkControls}>
                      <TouchableOpacity onPress={moveLeft} activeOpacity={1}>
                        <Animated.View style={[styles.walkBtn, walkLeftBtnStyle]}>
                          <Icon name="chevronLeft" size={26} color={colors.primary.wisteriaDark} />
                        </Animated.View>
                      </TouchableOpacity>
                      <Text style={styles.walkLabel}>Walk</Text>
                      <TouchableOpacity onPress={moveRight} activeOpacity={1}>
                        <Animated.View style={[styles.walkBtn, walkRightBtnStyle]}>
                          <Icon name="chevronRight" size={26} color={colors.primary.wisteriaDark} />
                        </Animated.View>
                      </TouchableOpacity>
                    </View>
                  )}
                </LinearGradient>

                {currentRoomIdx > 0 && (
                  <TouchableOpacity style={styles.roomNavLeft} onPress={() => goToRoom(currentRoomIdx - 1)}>
                    <View style={styles.doorCard}>
                      <Icon name="chevronLeft" size={18} color={colors.primary.wisteriaDark} />
                      <Text style={styles.doorLabel} numberOfLines={1}>{rooms[currentRoomIdx - 1].name}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                {currentRoomIdx < rooms.length - 1 && (
                  <TouchableOpacity style={styles.roomNavRight} onPress={() => goToRoom(currentRoomIdx + 1)}>
                    <View style={styles.doorCard}>
                      <Text style={styles.doorLabel} numberOfLines={1}>{rooms[currentRoomIdx + 1].name}</Text>
                      <Icon name="chevronRight" size={18} color={colors.primary.wisteriaDark} />
                    </View>
                  </TouchableOpacity>
                )}
              </Animated.View>
            </View>
          )}

          {/* Quick Actions */}
          <View style={styles.actionsWrap}>
            <TouchableOpacity style={styles.heroQuizCard} onPress={() => setShowQuiz(true)} activeOpacity={0.9}>
              <LinearGradient
                colors={[colors.primary.wisteriaFaded, colors.surface.lavender, colors.calm.skyLight]}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              />
              <View style={styles.heroQuizInner}>
                <View style={styles.heroQuizIconWrap}>
                  <Icon name="quiz" size={32} color={colors.primary.wisteriaDark} />
                </View>
                <View style={styles.heroQuizText}>
                  <Text style={styles.heroQuizLabel}>Take the quiz</Text>
                  <Text style={styles.heroQuizSub}>+{QUIZ_AURA_PER_CORRECT} Aura per correct answer</Text>
                </View>
                <Icon name="chevronRight" size={22} color={colors.primary.wisteriaDark} />
              </View>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.actionsChipsRow}>
              <TouchableOpacity style={styles.actionChip} onPress={() => navigation.navigate('CountryMap', { countryId })}>
                <Icon name="compass" size={18} color={colors.primary.wisteriaDark} />
                <Text style={styles.actionChipLabel}>Map</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip} onPress={() => setShowGamesModal(true)}>
                <Icon name="sparkles" size={18} color={colors.reward.gold} />
                <Text style={styles.actionChipLabel}>Mini-Games</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip} onPress={() => { if (facts.length > 0) { setFactIndex(0); openFact(facts[0]); } }}>
                <Icon name="book" size={18} color={colors.calm.ocean} />
                <Text style={styles.actionChipLabel}>Facts ({readFacts.size}/{facts.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionChip} onPress={() => setShowKnowledgeMap(true)}>
                <Icon name="brain" size={18} color={colors.primary.wisteria} />
                <Text style={styles.actionChipLabel}>What I Know</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionChip}
                onPress={() => {
                  if (isViewingFriendHouse) navigation.goBack();
                  else if (isOwner) setEditMode(true);
                  else navigation.navigate('CountryWorld');
                }}
              >
                <Icon
                  name={isViewingFriendHouse ? 'chevronLeft' : isOwner ? 'edit' : 'home'}
                  size={18}
                  color={isViewingFriendHouse ? colors.text.secondary : isOwner ? colors.success.emerald : colors.reward.peachDark}
                />
                <Text style={styles.actionChipLabel}>
                  {isViewingFriendHouse ? 'Leave' : isOwner ? 'Decorate' : 'Get House'}
                </Text>
              </TouchableOpacity>
              {locations.length > 0 && (
                <TouchableOpacity style={styles.actionChip} onPress={() => setShowLocationsModal(true)}>
                  <Icon name="landmark" size={18} color={colors.reward.peachDark} />
                  <Text style={styles.actionChipLabel}>Stops ({visitedLocations.size}/{locations.length})</Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            {!isViewingFriendHouse && country && (() => {
              const progress = getCountryStampProgress(stamps, countryId);
              if (!progress || progress.completed) return null;
              return (
                <TouchableOpacity
                  style={[styles.collectionGoalCard, { borderLeftColor: country.accentColor }]}
                  onPress={() => (navigation.getParent() as any)?.getParent()?.navigate('Learn')}
                  activeOpacity={0.85}
                >
                  <Icon name="book" size={20} color={country.accentColor} />
                  <View style={styles.collectionGoalText}>
                    <Text variant="bodySmall" style={styles.collectionGoalTitle}>
                      Keep learning about {country.name} to earn more stamps!
                    </Text>
                    <Caption style={styles.collectionGoalSub}>{progress.current}/{progress.target} stamps earned</Caption>
                  </View>
                  <Icon name="chevronRight" size={18} color={colors.text.muted} />
                </TouchableOpacity>
              );
            })()}

            <View style={styles.liveStrip}>
              <View style={styles.whosHereRow}>
                <Icon name="people" size={14} color={colors.primary.wisteriaDark} />
                <Caption style={styles.whosHereLabel}>Who's here: </Caption>
                <View style={styles.whosHereYouChip}>
                  <Text style={styles.whosHereYouText}>{user?.username || 'You'}</Text>
                </View>
                {presenceFriends.map(f => (
                  <View key={f.userId} style={styles.whosHereYouChip}>
                    <Text style={styles.whosHereYouText}>{f.username}</Text>
                  </View>
                ))}
                {presenceFriends.length === 0 && (
                  <Caption style={styles.liveStripText}> · When friends are in this room, they'll appear here</Caption>
                )}
              </View>
              {chatMode !== 'off' && (
                <TouchableOpacity style={styles.chatInRoomBtn} onPress={() => setShowPlaceChatModal(true)} activeOpacity={0.8}>
                  <Icon name="chat" size={16} color={colors.primary.wisteriaDark} />
                  <Text style={styles.chatInRoomBtnText}>Chat</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Fun Facts */}
          <View style={styles.factsSection}>
            <Text style={styles.sectionTitle}>Fun facts about {country.name}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.factsScroll}>
              {facts.map((fact, index) => {
                const isRead = readFacts.has(fact.id);
                return (
                  <TouchableOpacity
                    key={fact.id}
                    style={[styles.factChip, { borderColor: (country?.accentColor ?? colors.primary.wisteria) + '60' }, isRead && styles.factChipRead]}
                    onPress={() => { setFactIndex(index); openFact(fact); }}
                  >
                    <Icon name={fact.icon as any} size={18} color={colors.primary.wisteriaDark} />
                    <Text variant="caption" numberOfLines={1} style={isRead ? styles.factTextRead : undefined}>{fact.title}</Text>
                    {isRead && <Icon name="check" size={14} color={colors.success.emerald} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Story Arc + Journey Tracker */}
          {currentRoom && (
            <View style={styles.journeySection}>
              <View style={styles.storyArcRow}>
                <Icon name="compass" size={18} color={country.accentColor} />
                <Text style={styles.storyArcText}>
                  Discovering {country.name} — Room {currentRoomIdx + 1}/{rooms.length}
                </Text>
              </View>
              <View style={styles.storyArcBar}>
                <View style={[styles.storyArcFill, { width: `${((currentRoomIdx + 1) / Math.max(rooms.length, 1)) * 100}%`, backgroundColor: country.accentColor }]} />
              </View>

              <Text style={styles.journeyTitle}>
                {completedRoomIds.has(currentRoom.id) || (totalInteractive > 0 && roomInteracted >= totalInteractive)
                  ? `All discoveries made! Try the quiz next.`
                  : `Explore ${currentRoom.name} — ${roomInteracted}/${totalInteractive} discoveries`}
              </Text>
              <View style={styles.journeyHints}>
                {(() => {
                  const hints: { icon: IconName; text: string; action?: () => void }[] = [];
                  const undiscovered = currentRoom.objects.filter(o => o.interactive && !interactedObjects.has(o.id));
                  if (undiscovered.length > 0) {
                    hints.push({
                      icon: 'sparkles',
                      text: `Tap ${undiscovered[0].label} to discover something new`,
                      action: () => handleObjectTap(undiscovered[0]),
                    });
                  }
                  if (undiscovered.length > 1) {
                    hints.push({ icon: 'compass', text: `${undiscovered.length} more objects to discover in this room` });
                  }
                  if (hints.length === 0) {
                    hints.push({ icon: 'trophy', text: 'Amazing! You\'ve explored everything here.' });
                  }
                  return hints.slice(0, 3).map((hint, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.journeyHintRow}
                      onPress={hint.action}
                      activeOpacity={hint.action ? 0.7 : 1}
                      disabled={!hint.action}
                    >
                      <Icon name={hint.icon} size={16} color={colors.reward.gold} />
                      <Text style={styles.journeyHintText}>{hint.text}</Text>
                      {hint.action && <Icon name="chevronRight" size={14} color={colors.text.muted} />}
                    </TouchableOpacity>
                  ));
                })()}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Conditionally rendered modals */}
      {showPlaceChatModal && currentRoom && (
        <PlaceChatModal
          visible={showPlaceChatModal}
          onClose={() => setShowPlaceChatModal(false)}
          roomName={currentRoom.name}
          channelKey={`room_${countryId}_${currentRoom.id}`}
          messages={chatMessages}
          userId={user?.id ?? ''}
          onSendMessage={handleSendChatMessage}
          countryId={countryId}
        />
      )}

      {activeObject && (
        <ObjectDetailModal
          object={activeObject}
          multiplier={multiplier}
          onClose={() => setActiveObject(null)}
        />
      )}

      {activeFurnitureInteraction && (
        <FurnitureInteractionModal
          interaction={activeFurnitureInteraction}
          multiplier={multiplier}
          streak={streak}
          onUse={handleUseFurniture}
          onClose={() => setActiveFurnitureInteraction(null)}
        />
      )}

      {learningFact && (
        <RoomFactModal
          visible={!!learningFact}
          fact={learningFact}
          countryId={countryId}
          auraReward={FACT_AURA_REWARD}
          hasMultipleFacts={facts.length > 1}
          onNextFact={nextFact}
          onClose={() => setLearningFact(null)}
        />
      )}

      {showQuiz && (
        <RoomQuizModal
          visible={showQuiz}
          onClose={() => setShowQuiz(false)}
          countryId={countryId}
          countryName={country.name}
          streakMultiplier={multiplier}
          streak={streak}
          isPlaceComplete={isPlaceComplete}
          getQuestions={getQuizQuestions}
          onComplete={handleQuizComplete}
        />
      )}

      {showGamesModal && (
        <GamesModal
          visible={showGamesModal}
          onClose={() => setShowGamesModal(false)}
          countryId={countryId}
          onNavigateToGame={handleNavigateToGame}
        />
      )}

      {showMicroEvent && (
        <MicroEventModal
          visible={showMicroEvent}
          aura={microEventAura}
          isRare={microEventIsRare}
          onClose={() => setShowMicroEvent(false)}
        />
      )}

      {activeEditTab && currentRoom && (
        <FurniturePanel
          visible={!!activeEditTab}
          panelType={activeEditTab}
          onClose={() => setActiveEditTab(null)}
          visitedCountries={user?.visitedCountries ?? []}
          ownedFurniture={ownedFurniture}
          onBuyFurniture={buyFurniture}
          onPlaceFurniture={handlePlaceFurniture}
          onUpdateWallColor={handleUpdateWallColor}
          onUpdateFloorColor={handleUpdateFloorColor}
          currentWallColor={effectiveWallColor}
          currentFloorColor={effectiveFloorColor}
          roomId={currentRoom.id}
        />
      )}

      {showLocationsModal && (
        <LocationsModal
          visible={showLocationsModal}
          onClose={() => setShowLocationsModal(false)}
          locations={locations}
          visitedLocations={visitedLocations}
          onVisitLocation={handleVisitLocation}
        />
      )}

      {showKnowledgeMap && (
        <Modal visible={showKnowledgeMap} transparent animationType="slide">
          <Pressable style={styles.knowledgeOverlay} onPress={() => setShowKnowledgeMap(false)}>
            <Pressable style={styles.knowledgeCard} onPress={(e) => e.stopPropagation()}>
              <LinearGradient colors={[colors.surface.lavender, colors.base.cream]} style={StyleSheet.absoluteFill} />
              <View style={styles.knowledgeHeader}>
                <Heading level={2}>What I Know</Heading>
                <Caption>{country?.name}</Caption>
              </View>
              <ScrollView style={styles.knowledgeScroll} showsVerticalScrollIndicator={false}>
                {[
                  { label: 'Facts', icon: 'book' as const, color: colors.calm.ocean, count: readFacts.size, total: facts.length },
                  { label: 'Quiz', icon: 'quiz' as const, color: colors.primary.wisteriaDark, count: countryProgress.quizCompleted ? 1 : 0, total: 1 },
                  { label: 'Locations', icon: 'compass' as const, color: colors.success.emerald, count: visitedLocations.size, total: locations.length },
                  { label: 'Myths', icon: 'sparkles' as const, color: colors.primary.wisteria, count: 0, total: getMythsForCountry(countryId).length },
                  { label: 'Nature', icon: 'nature' as const, color: '#4CAF50', count: 0, total: getNatureForCountry(countryId).length },
                  { label: 'History', icon: 'globe' as const, color: '#FF9800', count: 0, total: getHistoryForCountry(countryId).length },
                  { label: 'Phrases', icon: 'language' as const, color: '#42A5F5', count: 0, total: getPhrasesForCountry(countryId).length },
                ].map((cat) => {
                  const pct = cat.total > 0 ? Math.round((cat.count / cat.total) * 100) : 0;
                  return (
                    <View key={cat.label} style={styles.knowledgeRow}>
                      <View style={[styles.knowledgeIconWrap, { backgroundColor: cat.color + '15' }]}>
                        <Icon name={cat.icon} size={20} color={cat.color} />
                      </View>
                      <View style={styles.knowledgeInfo}>
                        <Text style={styles.knowledgeLabel}>{cat.label}</Text>
                        <View style={styles.knowledgeBarTrack}>
                          <View style={[styles.knowledgeBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                        </View>
                      </View>
                      <Text style={[styles.knowledgePct, { color: cat.color }]}>{pct}%</Text>
                    </View>
                  );
                })}
                {getMythsForCountry(countryId).length === 0 && getNatureForCountry(countryId).length === 0 && (
                  <View style={styles.knowledgeEmpty}>
                    <Icon name="sparkles" size={24} color={colors.text.muted} />
                    <Caption>More content is being added for this country!</Caption>
                  </View>
                )}
              </ScrollView>
              <TouchableOpacity style={styles.knowledgeCloseBtn} onPress={() => setShowKnowledgeMap(false)} accessibilityRole="button" accessibilityLabel="Close">
                <Text style={styles.knowledgeCloseText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}

      {discoveryToast && (
        <View style={[styles.discoveryToast, { pointerEvents: 'none' }]}>
          <View style={styles.discoveryToastInner}>
            <Icon name="sparkles" size={20} color={colors.reward.gold} />
            <Text variant="body" style={styles.discoveryToastText}>Discovery! {discoveryToast}</Text>
          </View>
        </View>
      )}

      {showRoomCelebration && currentRoom && (
        <AchievementCeremony
          icon="trophy"
          title="Room Complete!"
          subtitle={`${currentRoom.name} fully explored`}
          auraReward={25}
          onDismiss={() => setShowRoomCelebration(false)}
        />
      )}

      {showMasteryCelebration && (
        <Modal visible={showMasteryCelebration} transparent animationType="fade">
          <View style={styles.masteryOverlay}>
            <LinearGradient
              colors={['#FFD700CC', '#FFA000CC', '#FF6F00CC']}
              style={styles.masteryGradient}
            >
              <FloatingParticles count={20} variant="sparkle" opacity={0.6} speed="normal" />
              <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.masteryContent}>
                <View style={styles.masteryBadge}>
                  <Icon name="trophy" size={56} color="#FFD700" />
                </View>
                <Text style={styles.masteryFlag}>{country.flagEmoji}</Text>
                <Heading level={1} style={styles.masteryTitle}>Country Master!</Heading>
                <Text style={styles.masterySub}>
                  You've mastered {country.name}! Every fact read, quiz conquered, game played, and location explored.
                </Text>
                <View style={styles.masteryReward}>
                  <Icon name="sparkles" size={20} color="#FFD700" />
                  <Text style={styles.masteryRewardText}>+500 Aura Bonus</Text>
                </View>
                <View style={styles.masteryStats}>
                  <View style={styles.masteryStat}>
                    <Icon name="book" size={16} color="#FFF" />
                    <Text style={styles.masteryStatText}>{facts.length} Facts</Text>
                  </View>
                  <View style={styles.masteryStat}>
                    <Icon name="quiz" size={16} color="#FFF" />
                    <Text style={styles.masteryStatText}>Quiz Done</Text>
                  </View>
                  <View style={styles.masteryStat}>
                    <Icon name="game" size={16} color="#FFF" />
                    <Text style={styles.masteryStatText}>Games Played</Text>
                  </View>
                  <View style={styles.masteryStat}>
                    <Icon name="compass" size={16} color="#FFF" />
                    <Text style={styles.masteryStatText}>Places Visited</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.masteryContinueBtn} onPress={() => setShowMasteryCelebration(false)}>
                  <Text style={styles.masteryContinueText}>Continue Exploring</Text>
                </TouchableOpacity>
              </Animated.View>
            </LinearGradient>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  countryIntroOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  countryIntroContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  visbyFlyIn: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  visbyFlyEmoji: {
    fontSize: 48,
  },
  visbyFlyLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
  },
  countryIntroInner: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  countryIntroFlag: {
    fontSize: 100,
  },
  countryIntroTitle: {
    fontSize: 32,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  countryIntroSub: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  scrollContent: { paddingBottom: spacing.xxl * 3 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn: { padding: spacing.xs },
  headerCenter: { alignItems: 'center', flex: 1 },
  flagTitle: { fontSize: 20, fontFamily: 'Baloo2-SemiBold', color: colors.text.primary },
  ownerTag: { color: colors.success.emerald, fontFamily: 'Nunito-Bold', fontSize: 12, marginTop: 2 },
  vibeCaption: { fontFamily: 'Nunito-Medium', fontSize: 11, color: colors.text.muted, marginTop: 2 },
  auraChip: {
    backgroundColor: colors.reward.peachLight, paddingHorizontal: spacing.sm,
    paddingVertical: 6, borderRadius: 18, borderWidth: 1, borderColor: colors.reward.peachDark + '40',
  },
  auraChipText: { fontFamily: 'Baloo2-SemiBold', fontSize: 14, color: colors.reward.gold },

  streakBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: spacing.xs, paddingVertical: 6, paddingHorizontal: spacing.md,
    backgroundColor: colors.status.streakBg, borderRadius: 14, borderWidth: 1, borderColor: colors.status.streak + '40',
  },
  streakText: { fontFamily: 'Nunito-Bold', fontSize: 14, color: colors.status.streak },
  multiplierBadge: { backgroundColor: colors.reward.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  multiplierText: { fontFamily: 'Baloo2-Bold', fontSize: 12, color: colors.text.primary },

  placeCompleteBanner: {
    marginHorizontal: spacing.lg, marginBottom: spacing.sm, borderRadius: 20,
    overflow: 'hidden', borderWidth: 1, borderColor: colors.success.emerald + '40', minHeight: 64, justifyContent: 'center',
  },
  placeCompleteContent: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm },
  placeCompleteText: { flex: 1 },
  placeCompleteTitle: { fontFamily: 'Baloo2-Bold', fontSize: 16, color: colors.text.primary },
  placeCompleteSub: { fontFamily: 'Nunito-Medium', fontSize: 12, color: colors.text.secondary, marginTop: 2 },

  roomCardsRow: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.sm },
  roomCard: {
    width: 96, borderRadius: 16, overflow: 'hidden', backgroundColor: colors.surface.card,
    borderWidth: 2, borderColor: 'transparent',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 6px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 }),
  },
  roomCardActive: {
    borderColor: colors.primary.wisteria,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(184,165,224,0.4)' }
      : { shadowColor: colors.primary.wisteria, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 }),
  },
  roomCardSwatch: { height: 36, width: '100%' },
  roomCardContent: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 8 },
  roomCardLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, flex: 1 },
  roomCardLabelActive: { color: colors.primary.wisteriaDark, fontFamily: 'Nunito-Bold' },
  roomCardComplete: {
    borderColor: '#FFD700',
    borderWidth: 1.5,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 0px 8px rgba(255,215,0,0.25)' }
      : { shadowColor: '#FFD700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.25, shadowRadius: 8 }),
  },
  roomCardTrophy: {
    position: 'absolute', top: 2, right: 2,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: 'rgba(255,215,0,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  roomCardProgress: {
    fontSize: 9, fontFamily: 'Nunito-SemiBold',
    color: colors.text.muted, marginTop: 1,
  },
  roomCardLocked: { opacity: 0.7, borderStyle: 'dashed' as any, borderWidth: 1.5, borderColor: 'rgba(184,165,224,0.3)' },
  roomUnlockPrice: { flexDirection: 'row', alignItems: 'center', gap: 2 },

  noRoomsWrap: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  noRoomsCard: {
    flexDirection: 'column', alignItems: 'center', padding: spacing.lg,
    borderRadius: 20, backgroundColor: colors.surface.card, borderLeftWidth: 6, gap: spacing.sm,
  },
  noRoomsTitle: { textAlign: 'center' },
  noRoomsText: { textAlign: 'center', paddingHorizontal: spacing.sm },

  roomStageWrap: { marginHorizontal: spacing.md, marginBottom: spacing.sm },
  roomStageFrame: {
    borderRadius: 24, overflow: 'hidden', minHeight: ROOM_HEIGHT, position: 'relative',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 16px rgba(0,0,0,0.14)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 16, elevation: 8 }),
  },
  roomWall: { paddingTop: spacing.xs },
  roomWindowStrip: {
    width: '100%', borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    overflow: 'hidden', justifyContent: 'flex-end', alignItems: 'center',
    position: 'relative',
  },
  windowCurtainLeft: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 20,
    backgroundColor: colors.room.curtain, borderTopRightRadius: 8, zIndex: 2,
  },
  windowCurtainRight: {
    position: 'absolute', right: 0, top: 0, bottom: 0, width: 20,
    backgroundColor: colors.room.curtain, borderTopLeftRadius: 8, zIndex: 2,
  },
  roomWindowArch: {
    width: '65%', height: 14, borderTopLeftRadius: 999, borderTopRightRadius: 999,
    backgroundColor: colors.overlay.softBlack,
  },
  windowReflection: {
    position: 'absolute', top: 10, left: '20%', width: '25%', height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: 1,
    transform: [{ rotate: '-6deg' }], zIndex: 1,
  },
  windowInnerShadow: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  windowLightSpill: {
    position: 'absolute', top: WINDOW_STRIP_HEIGHT, left: '18%', right: '18%', height: 36,
    borderRadius: 18, opacity: 0.6, zIndex: 1,
  },
  wallTextureOverlay: {
    ...StyleSheet.absoluteFillObject, zIndex: 1,
  },
  wallTextureDot: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.035)',
  },
  wallCornerLeft: {
    position: 'absolute', top: 0, left: 0, width: 44, height: 50, zIndex: 1,
  },
  wallCornerRight: {
    position: 'absolute', top: 0, right: 0, width: 44, height: 50, zIndex: 1,
  },
  wainscotingWrap: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%',
    flexDirection: 'row', paddingHorizontal: 8, gap: 5,
  },
  wainscotPanel: {
    flex: 1, borderRadius: 3, borderWidth: 1,
    borderColor: colors.room.wainscot, backgroundColor: 'rgba(255,255,255,0.08)', padding: 3,
  },
  wainscotPanelInner: {
    flex: 1, borderRadius: 2, borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.04)', backgroundColor: 'rgba(255,255,255,0.05)',
  },
  wainscotChairRail: {
    position: 'absolute', bottom: '35%', left: 0, right: 0, height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 1,
  },
  baseboardShadow: {
    height: 3, width: '100%', backgroundColor: colors.room.molding,
  },
  baseboard: { height: 8, width: '100%' },
  roomFloor: {
    height: FLOOR_HEIGHT, width: '100%', position: 'relative',
    justifyContent: 'center', alignItems: 'center',
    ...(Platform.OS === 'web' ? { perspective: '600px' } : {}),
  },
  floorPlanks: {
    ...StyleSheet.absoluteFillObject, flexDirection: 'column',
  },
  floorPlank: {
    flex: 1, borderBottomWidth: 1, borderBottomColor: colors.room.plankGap,
    position: 'relative', overflow: 'hidden',
  },
  floorPlankStagger: {
    position: 'absolute', left: 0, top: 0, bottom: 0, width: '28%',
    backgroundColor: 'rgba(0, 0, 0, 0.012)',
    borderRightWidth: 1, borderRightColor: colors.room.plankGap,
  },
  floorGrain: {
    position: 'absolute', left: '8%', right: '8%', height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: 1,
  },
  floorKnot: {
    position: 'absolute', width: 5, height: 5, borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.055)',
    borderWidth: 0.5, borderColor: 'rgba(0, 0, 0, 0.035)',
  },
  areaRugWrap: {
    position: 'absolute', alignSelf: 'center', top: '25%',
    flexDirection: 'row', alignItems: 'center',
  },
  areaRugFringeLeft: {
    flexDirection: 'column', gap: 1, marginRight: -1,
  },
  areaRugFringeRight: {
    flexDirection: 'column', gap: 1, marginLeft: -1,
  },
  areaRugFringe: {
    width: 5, backgroundColor: 'rgba(140, 95, 65, 0.2)', borderRadius: 1,
  },
  areaRug: {
    width: 150, height: 68, borderRadius: 4,
    backgroundColor: colors.room.rugPrimary, position: 'relative',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 3px rgba(0,0,0,0.06)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 }),
  },
  areaRugBorder: {
    ...StyleSheet.absoluteFillObject, borderRadius: 4,
    borderWidth: 3,
  },
  areaRugInnerBorder: {
    position: 'absolute', top: 7, left: 7, right: 7, bottom: 7,
    borderRadius: 2, borderWidth: 1, borderColor: 'rgba(160, 120, 80, 0.12)',
  },
  areaRugCenter: {
    position: 'absolute', alignSelf: 'center', top: 14, width: 110, height: 40,
    borderRadius: 2, backgroundColor: colors.room.rugCenter,
    alignItems: 'center', justifyContent: 'center',
  },
  areaRugDiamond: {
    width: 14, height: 14, borderRadius: 2,
    transform: [{ rotate: '45deg' }],
  },

  roomNameRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
  },
  roomNameInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roomNameText: { fontFamily: 'Baloo2-SemiBold', fontSize: 17, color: colors.text.primary },
  roomProgressChip: {
    backgroundColor: colors.success.honeydew, paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: colors.success.emerald + '40',
  },
  roomProgressText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.success.emerald },
  editToggleBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginLeft: spacing.sm, paddingVertical: 4, paddingHorizontal: 10,
    borderRadius: 14, borderWidth: 1.5,
    borderColor: colors.primary.wisteria, backgroundColor: 'rgba(184, 165, 224, 0.1)',
  },
  editToggleBtnActive: { backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark },
  editToggleText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark },
  editToggleTextActive: { color: '#FFFFFF' },
  roomDialogueBubble: {
    alignSelf: 'center', maxWidth: '90%', marginTop: spacing.xs,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 16,
    borderWidth: 1, borderColor: colors.primary.wisteria + '40',
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }),
  },
  dialogueBubbleTail: {
    position: 'absolute', bottom: -6, alignSelf: 'center',
    width: 12, height: 12, backgroundColor: 'rgba(255,255,255,0.95)',
    transform: [{ rotate: '45deg' }], borderRadius: 2,
    borderRightWidth: 1, borderBottomWidth: 1,
    borderColor: colors.primary.wisteria + '40',
  },
  roomDialogueText: {
    fontFamily: 'Nunito-Regular', fontSize: 13, color: colors.text.primary,
    textAlign: 'center', fontStyle: 'italic',
  },
  othersHereBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, marginTop: spacing.xs, paddingVertical: 4,
  },
  othersHereText: { color: colors.text.muted, fontSize: 12 },

  objectsLayer: { position: 'relative', marginTop: spacing.xs },
  roomObject: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -36 }, { translateY: -24 }], minWidth: 72,
  },
  roomObjectInteractive: {},
  roomObjectDone: {},
  roomObjectIconWrap: {
    width: 66, height: 66, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center',
    marginBottom: 4, borderWidth: 1.5, borderColor: colors.shadow.light,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 4px 12px rgba(0,0,0,0.12)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 }),
  },
  roomObjectIconWrapGlow: {
    borderColor: colors.primary.wisteria + '70',
    borderWidth: 2.5,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 0px 16px rgba(184,165,224,0.5)' }
      : { shadowColor: colors.primary.wisteria, shadowOpacity: 0.4, shadowRadius: 14, elevation: 6 }),
  },
  objectLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 12, color: colors.text.secondary, textAlign: 'center', maxWidth: 88 },
  objectLabelDone: { color: colors.success.emerald },
  objectCheck: { position: 'absolute', top: -4, right: -4 },
  interactiveDot: {
    position: 'absolute', top: -2, right: -2, width: 12, height: 12, borderRadius: 6,
    backgroundColor: colors.reward.gold, borderWidth: 2, borderColor: '#FFFFFF',
  },
  objectSparkleHint: {
    position: 'absolute', bottom: -2, left: -2,
  },

  avatarContainer: {
    position: 'absolute', left: spacing.lg, bottom: 4,
    width: AVATAR_SIZE, height: AVATAR_SIZE + 24, alignItems: 'center',
  },
  visbyShadow: {
    position: 'absolute', bottom: 18, left: (AVATAR_SIZE - 52) / 2,
    width: 52, height: 16, borderRadius: 26, overflow: 'hidden',
  },
  visbyCompanionWrap: { alignItems: 'center' },
  visbyCompanionLabel: {
    marginTop: 4, paddingHorizontal: 10, paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12,
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  visbyCompanionText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark },

  walkControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  walkBtn: {
    padding: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20,
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  walkLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.muted },

  editToolbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingHorizontal: spacing.sm },
  editToolbarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1.5, borderColor: 'transparent',
  },
  editToolbarBtnActive: { backgroundColor: colors.primary.wisteria, borderColor: colors.primary.wisteriaDark },
  editToolbarLabel: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark },
  editToolbarLabelActive: { color: '#FFFFFF' },

  roomNavLeft: { position: 'absolute', left: 6, top: '38%' as any, zIndex: 10 },
  roomNavRight: { position: 'absolute', right: 6, top: '38%' as any, zIndex: 10 },
  doorCard: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.95)', paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 16, borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 4px rgba(0,0,0,0.08)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 3 }),
  },
  doorLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, maxWidth: 64 },

  placedFurnitureItem: {
    position: 'absolute', alignItems: 'center',
    transform: [{ translateX: -50 }, { translateY: -30 }], padding: 4, borderRadius: 14,
  },
  placedFurnitureItemSelected: {
    backgroundColor: 'rgba(184, 165, 224, 0.25)',
    borderWidth: 2, borderColor: colors.primary.wisteria, borderStyle: 'dashed' as any,
  },
  placedFurnitureItemInteractive: { padding: 4 },
  placedFurnitureShadow: {
    width: 60, height: 8, borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.08)', marginTop: -2,
  },
  useFurnitureBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4,
    paddingHorizontal: 10, paddingVertical: 4, backgroundColor: colors.primary.wisteriaFaded,
    borderRadius: 12, borderWidth: 1, borderColor: colors.primary.wisteria + '50',
  },
  useFurnitureBadgeText: { fontFamily: 'Nunito-Bold', fontSize: 11, color: colors.primary.wisteriaDark },
  placedFurnitureLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 11, color: colors.text.secondary, textAlign: 'center', maxWidth: 90 },
  placedFurniturePopup: { position: 'absolute', top: -32, alignSelf: 'center', zIndex: 20 },
  removeBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E53935', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 1px 3px rgba(0,0,0,0.2)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 }),
  },
  removeBtnText: { fontFamily: 'Nunito-Bold', fontSize: 10, color: '#FFFFFF' },

  actionsWrap: { paddingHorizontal: spacing.lg, marginTop: spacing.lg, gap: spacing.sm },
  heroQuizCard: {
    borderRadius: 20, overflow: 'hidden', borderWidth: 1,
    borderColor: colors.primary.wisteriaFaded, minHeight: 72, justifyContent: 'center',
  },
  heroQuizInner: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg, gap: spacing.md,
  },
  heroQuizIconWrap: {
    width: 48, height: 48, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)', justifyContent: 'center', alignItems: 'center',
  },
  heroQuizText: { flex: 1 },
  heroQuizLabel: { fontFamily: 'Baloo2-SemiBold', fontSize: 17, color: colors.text.primary },
  heroQuizSub: { fontFamily: 'Nunito-Medium', fontSize: 13, color: colors.text.secondary, marginTop: 2 },
  actionsChipsRow: { flexDirection: 'row', gap: spacing.sm, paddingVertical: spacing.xs },
  actionChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, paddingHorizontal: 14,
    backgroundColor: colors.surface.card, borderRadius: 16, borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  actionChipLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary },
  collectionGoalCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginTop: spacing.sm,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card, borderRadius: 12, borderLeftWidth: 4,
  },
  collectionGoalText: { flex: 1 },
  collectionGoalTitle: { fontFamily: 'Nunito-SemiBold', color: colors.text.primary },
  collectionGoalSub: { marginTop: 2, color: colors.text.muted },
  liveStrip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    gap: spacing.sm, marginTop: spacing.xs, paddingHorizontal: spacing.lg, flexWrap: 'wrap',
  },
  whosHereRow: { flexDirection: 'row', alignItems: 'center', flex: 1, flexWrap: 'wrap' },
  whosHereLabel: { color: colors.text.muted },
  whosHereYouChip: { backgroundColor: colors.primary.wisteriaFaded, paddingVertical: 2, paddingHorizontal: 8, borderRadius: 10 },
  whosHereYouText: { fontSize: 12, fontFamily: 'Nunito-SemiBold', color: colors.primary.wisteriaDark },
  liveStripText: { color: colors.text.muted, flex: 1 },
  chatInRoomBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12,
    backgroundColor: colors.primary.wisteriaFaded, borderRadius: 14,
  },
  chatInRoomBtnText: { fontSize: 13, fontFamily: 'Nunito-SemiBold', color: colors.primary.wisteriaDark },

  factsSection: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  sectionTitle: { fontFamily: 'Baloo2-Bold', fontSize: 16, color: colors.text.primary, marginBottom: 8 },
  factsScroll: { gap: spacing.sm, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  factChip: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs,
    paddingVertical: 10, paddingHorizontal: 14, borderRadius: 20, borderWidth: 2, backgroundColor: colors.surface.cardWarm,
  },
  factChipRead: { backgroundColor: colors.success.honeydew, borderColor: colors.success.emerald + '50', borderStyle: 'dashed' as any },
  factTextRead: { color: colors.text.muted },
  journeySection: {
    marginHorizontal: spacing.lg, marginTop: spacing.sm, marginBottom: spacing.xl,
    padding: spacing.lg, backgroundColor: colors.surface.lavender, borderRadius: 20,
    borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  storyArcRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginBottom: spacing.xs,
  },
  storyArcText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.secondary },
  storyArcBar: {
    height: 4, borderRadius: 2, backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: spacing.md,
  },
  storyArcFill: { height: '100%', borderRadius: 2, minWidth: 4 },
  journeyTitle: { fontFamily: 'Baloo2-Bold', fontSize: 16, color: colors.text.primary, marginBottom: spacing.sm },
  journeyHints: { gap: spacing.xs },
  journeyHintRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    backgroundColor: colors.surface.card, borderRadius: 14, borderWidth: 1, borderColor: colors.primary.wisteriaFaded,
  },
  journeyHintText: { fontFamily: 'Nunito-SemiBold', fontSize: 13, color: colors.text.primary, flex: 1 },

  discoveryToast: {
    position: 'absolute', top: spacing.xl + 50, left: spacing.lg, right: spacing.lg,
    alignItems: 'center', zIndex: 100,
  },
  discoveryToastInner: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.base.cream, paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
    borderRadius: 16,
    ...(Platform.OS === 'web'
      ? { boxShadow: '0px 2px 8px rgba(0,0,0,0.15)' }
      : { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 }),
  },
  discoveryToastText: { fontFamily: 'Nunito-Bold', color: colors.primary.wisteriaDark },

  knowledgeOverlay: {
    flex: 1, backgroundColor: colors.overlay.modal,
    justifyContent: 'center', alignItems: 'center', padding: spacing.lg,
  },
  knowledgeCard: {
    maxWidth: 380, width: '100%', borderRadius: 24, overflow: 'hidden',
    maxHeight: '80%',
  },
  knowledgeHeader: {
    alignItems: 'center', paddingTop: spacing.xl, paddingBottom: spacing.md,
  },
  knowledgeScroll: { paddingHorizontal: spacing.xl },
  knowledgeRow: {
    flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm,
  },
  knowledgeIconWrap: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  knowledgeInfo: { flex: 1 },
  knowledgeLabel: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.primary, marginBottom: 4 },
  knowledgeBarTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(0,0,0,0.06)', overflow: 'hidden' },
  knowledgeBarFill: { height: '100%', borderRadius: 3, minWidth: 2 },
  knowledgePct: { fontFamily: 'Nunito-Bold', fontSize: 14, minWidth: 40, textAlign: 'right' },
  knowledgeEmpty: {
    alignItems: 'center', paddingVertical: spacing.lg, gap: spacing.sm,
  },
  knowledgeCloseBtn: {
    alignSelf: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  knowledgeCloseText: { fontFamily: 'Nunito-SemiBold', fontSize: 14, color: colors.text.secondary },

  masteryOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  masteryGradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  masteryContent: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  masteryBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  masteryFlag: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  masteryTitle: {
    fontSize: 34,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  masterySub: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.lg,
    maxWidth: 300,
  },
  masteryReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: spacing.lg,
  },
  masteryRewardText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#FFD700',
  },
  masteryStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  masteryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  masteryStatText: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 12,
    color: '#FFF',
  },
  masteryContinueBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 24,
  },
  masteryContinueText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#FF8F00',
  },
});

export default CountryRoomScreen;
