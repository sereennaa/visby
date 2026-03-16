// Zustand Store - Global State Management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Visby, Stamp, Bite, UserBadge, LocationData, UserLessonProgress, UserHouse, VisbyNeeds, PlacedFurniture, RoomCustomization, VisbyGrowthStage, SkillProgress, Friend, FriendRequest, VisbyChatMessage, VisbyMemory, DailyMission, DailyMissionType, TreasureHuntProgress, PlaceChatMessage, Discovery } from '../types';
import { LEVEL_THRESHOLDS, AURA_REWARDS } from '../config/constants';
import { QUEST_DEFINITIONS, getQuestById, getSeasonalExplorerQuest, type QuestDefinition } from '../config/quests';
import { getCurrentSeasonKey } from '../config/worldCalendar';
import { STORY_CHAPTERS, getChapterUnlockCurrent, type StoryChapter } from '../config/storyChapters';

const DAILY_MISSION_BONUS_AURA = 25;
const SURPRISE_AURA_MIN = 5;
const SURPRISE_AURA_MAX = 15;
const SURPRISE_CHANCE = 0.18; // 18% on eligible open

const DAILY_MISSION_POOL: DailyMission[] = [
  { type: 'collect_stamp', label: 'Collect 1 stamp', target: 1 },
  { type: 'add_bite', label: 'Log 1 bite', target: 1 },
  { type: 'play_minigame', label: 'Play 1 mini-game', target: 1 },
  { type: 'chat_with_visby', label: 'Chat with Visby', target: 1 },
  { type: 'read_facts', label: 'Read 2 country facts', target: 2 },
  { type: 'complete_lesson', label: 'Complete 1 lesson', target: 1 },
];

function todayDateKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getISOWeekKey(): string {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1);
  const days = Math.floor((d.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  const week = Math.ceil((days + start.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`;
}
import { checkNewBadges, BadgeCheckContext } from '../services/badges';
import { stampsService } from '../services/stamps';
import { showToast } from './useToast';
import { COUNTRY_SOUVENIRS } from '../config/cosmetics';

export const DEFAULT_SKILLS: SkillProgress = {
  language: 0,
  geography: 0,
  culture: 0,
  history: 0,
  cooking: 0,
  exploration: 0,
};

export const DEFAULT_NEEDS: VisbyNeeds = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  knowledge: 50,
  socialBattery: 80,
  lastUpdated: new Date().toISOString(),
};

const DECAY_RATES = {
  hunger: 2.0,
  happiness: 1.5,
  energy: 1.0,
  knowledge: 0.5,
  socialBattery: 1.2,
};

function calculateDecay(needs: VisbyNeeds): VisbyNeeds {
  const merged = { ...DEFAULT_NEEDS, ...needs };
  const now = Date.now();
  const last = new Date(merged.lastUpdated).getTime();
  const hoursElapsed = Math.min(24, (now - last) / (1000 * 60 * 60));
  if (hoursElapsed < 0.01) return merged;
  return {
    hunger: Math.max(0, Math.round(merged.hunger - DECAY_RATES.hunger * hoursElapsed)),
    happiness: Math.max(0, Math.round(merged.happiness - DECAY_RATES.happiness * hoursElapsed)),
    energy: Math.max(0, Math.round(merged.energy - DECAY_RATES.energy * hoursElapsed)),
    knowledge: Math.max(0, Math.round(merged.knowledge - DECAY_RATES.knowledge * hoursElapsed)),
    socialBattery: Math.max(0, Math.round((merged.socialBattery ?? DEFAULT_NEEDS.socialBattery) - DECAY_RATES.socialBattery * hoursElapsed)),
    lastUpdated: new Date().toISOString(),
  };
}

function deriveVisbyMood(needs: VisbyNeeds): import('../types').VisbyMood {
  const social = needs.socialBattery ?? DEFAULT_NEEDS.socialBattery;
  if (needs.hunger === 0 || needs.happiness === 0 || needs.energy === 0 || needs.knowledge === 0 || social === 0) return 'sick';
  const min = Math.min(needs.hunger, needs.happiness, needs.energy, needs.knowledge, social);
  if (min > 70) return 'excited';
  if (min > 50) return 'happy';
  if (social < 25) return 'lonely';
  if (needs.energy < 30) return 'sleepy';
  if (needs.hunger < 30) return 'hungry';
  if (needs.happiness < 30) return 'bored';
  if (needs.knowledge < 30) return 'confused';
  return 'happy';
}

export function getGrowthStage(totalCarePoints: number): VisbyGrowthStage {
  if (totalCarePoints <= 0) return 'egg';
  if (totalCarePoints < 50) return 'baby';
  if (totalCarePoints < 200) return 'kid';
  if (totalCarePoints < 500) return 'teen';
  return 'adult';
}

interface AppStore {
  // Auth State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Visby Avatar
  visby: Visby | null;
  
  // Collections
  stamps: Stamp[];
  bites: Bite[];
  badges: UserBadge[];
  
  // Learning
  lessonProgress: UserLessonProgress[];
  
  // Location
  currentLocation: LocationData | null;

  // Houses (countries kid has bought a house in)
  userHouses: UserHouse[];

  /** Per-country learning completion: facts read, quiz done, games played (for "place complete" / next level) */
  countryProgress: Record<string, { factsReadCount: number; quizCompleted: boolean; gamesPlayedCount: number }>;

  /** Per-country treasure hunt: completed room IDs (and optionally location IDs) */
  treasureHuntProgress: TreasureHuntProgress;

  /** Discovery log: facts and quizzes learned in country rooms */
  discoveryLog: Discovery[];
  /** Room visit count for micro-events (key = countryId_roomId) */
  roomVisitCount: Record<string, number>;
  /** Micro-event already shown for this room (key = countryId_roomId) */
  roomMicroEventShown: Record<string, boolean>;

  // Friends (Club Penguin–style)
  friends: Friend[];
  friendRequests: FriendRequest[];

  // Visby social / check-in chat
  visbyChatMessages: VisbyChatMessage[];
  visbyMemories: VisbyMemory[];
  lastVisbyCheckInAt: string | null; // ISO date of last daily check-in modal

  // Daily mission & surprise (Phase 1: Make It Stick)
  dailyMission: DailyMission | null;
  dailyMissionDateKey: string; // 'YYYY-MM-DD'
  dailyMissionCompletedAt: string | null; // ISO when completed today
  dailyMissionProgress: number;
  lastSurpriseDateKey: string; // 'YYYY-MM-DD' — at most one surprise per day

  // Adventure of the day (visit + read 2 facts + play 1 game)
  adventureDateKey: string;
  adventureVisitDone: boolean;
  adventureFactsCount: number;
  adventureGameDone: boolean;
  adventureCompletedAt: string | null;

  // Place chat (Phase 2: Club Penguin–style room chat)
  placeChatMessages: Record<string, PlaceChatMessage[]>; // key = e.g. room_jp_living

  // Streak freeze (Phase 1: one per month, use when you miss a day)
  streakFreezesRemaining: number;
  lastFreezeGrantMonth: string; // 'YYYY-MM'
  pendingStreakFreezeOffer: boolean; // true when we should show "Use a freeze?" modal

  // Story beats (milestone messages from Visby)
  storyBeatsShown: string[]; // e.g. ['first_country', 'first_lesson']

  // World calendar: seasonal quest progress (resets each season)
  lastSeasonKey: string;
  seasonalVisitCountThisSeason: number;
  seasonalQuestCompletedSeasonKey: string | null;

  // Quest chains (multi-step challenges)
  questProgress: Record<string, { completedAt: string | null }>;

  // Leaderboard: weekly Aura (reset each week)
  userWeeklyAura: number;
  lastWeeklyResetDateKey: string; // 'YYYY-Www' ISO week

  // Settings
  settings: {
    notifications: boolean;
    locationTracking: boolean;
    privateProfile: boolean;
    soundEffects: boolean;
    /** 0 = off, 10/15/20 = minutes before "Visby is resting" prompt */
    sessionTimerMinutes: 0 | 10 | 15 | 20;
    /** When true, Home shows only Adventure of the day (single-goal focus). */
    focusMode: boolean;
    /** Fewer particles, no auto sounds except rewards. */
    quieterMode: boolean;
    /** Optional ambient sound in home/country rooms (placeholder for future). */
    ambientSound: boolean;
  };
  /** When session timer is used, timestamp of session start or last rest dismiss. */
  sessionStartedAt: number | null;
  
  // Actions - Auth
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  
  // Actions - Visby
  setVisby: (visby: Visby | null) => void;
  updateVisbyAppearance: (appearance: Partial<Visby['appearance']>) => void;
  equipCosmetic: (slot: keyof Visby['equipped'], cosmeticId: string | undefined) => void;
  setVisbyMood: (mood: Visby['currentMood']) => void;
  
  // Actions - Collections
  setStamps: (stamps: Stamp[]) => void;
  addStamp: (stamp: Stamp) => Promise<Stamp | null>;
  setBites: (bites: Bite[]) => void;
  addBite: (bite: Bite) => void;
  setBadges: (badges: UserBadge[]) => void;
  addBadge: (badge: UserBadge) => void;
  
  // Actions - Progression
  addAura: (amount: number) => void;
  spendAura: (amount: number) => boolean;
  incrementStreak: () => void;
  dailyCheckIn: () => void;
  getStreakMultiplier: () => number;
  incrementCountriesVisited: () => void;

  // Actions - Houses & Country Visits
  setUserHouses: (houses: UserHouse[]) => void;
  addUserHouse: (house: UserHouse) => void;
  /** Record first visit to a country. Returns souvenir cosmetic ID if one was granted. */
  visitCountry: (countryId: string) => string | null;
  getCountryProgress: (countryId: string) => { factsReadCount: number; quizCompleted: boolean; gamesPlayedCount: number };
  markFactRead: (countryId: string) => void;
  markQuizCompleted: (countryId: string) => void;
  markGamePlayed: (countryId: string) => void;

  /** Add a discovery (fact or quiz) to the log; call when user reads a fact or completes quiz in a room. */
  addDiscovery: (title: string, countryId: string, type: 'fact' | 'quiz') => void;
  getDiscoveryLog: () => Discovery[];
  /** Call when user enters a country room; increments visit count. */
  recordRoomVisit: (countryId: string, roomId: string) => void;
  /** If this is 3rd+ visit and micro-event not yet shown, show it (add Aura, return true). */
  tryRoomMicroEvent: (countryId: string, roomId: string) => boolean;

  // Actions - Friends
  sendFriendRequest: (toUsername: string) => { success: boolean; error?: string };
  acceptFriendRequest: (requestId: string) => void;
  rejectFriendRequest: (requestId: string) => void;
  removeFriend: (friendUserId: string) => void;
  updateFriendProfile: (friendUserId: string, data: Partial<Pick<Friend, 'level' | 'aura' | 'badgesCount' | 'houseCountryIds'>>) => void;

  // Actions - Visby social battery & chat
  chargeSocialBattery: (amount: number) => void;
  addVisbyChatMessage: (role: 'user' | 'visby', text: string) => void;
  addVisbyMemory: (summary: string) => void;
  setLastVisbyCheckInAt: () => void;
  shouldShowVisbyCheckIn: () => boolean;
  getVisbyMemories: () => VisbyMemory[];
  getVisbyChatMessages: () => VisbyChatMessage[];

  // Actions - Daily mission & surprise
  getDailyMission: () => DailyMission | null;
  checkDailyMissionCompletion: (type: DailyMissionType, amount?: number) => boolean; // returns true if mission just completed
  trySurprise: () => { granted: boolean; aura?: number }; // maybe grant surprise Aura once per day

  // Adventure of the day
  getAdventureOfTheDay: () => {
    step1: boolean;
    step2: boolean;
    step3: boolean;
    completed: boolean;
    rewardAura: number;
  };
  setAdventureGamePlayed: () => void;
  awardAdventureIfCompleted: () => boolean; // returns true if just awarded

  // Actions - Place chat
  addPlaceChatMessage: (placeKey: string, message: string) => void;
  getPlaceChatMessages: (placeKey: string) => PlaceChatMessage[];

  // Actions - Streak freeze
  useStreakFreeze: () => boolean; // returns true if freeze was used
  declineStreakFreezeOffer: () => void;

  markStoryBeatShown: (id: string) => void;

  // Actions - Quests
  getQuestProgress: (questId: string) => { current: number; target: number; completed: boolean; definition: QuestDefinition } | null;
  checkQuests: () => void;
  /** Call when user enters any country room (for seasonal "visit a country this season" quest). */
  recordSeasonalCountryEntry: () => void;

  /** First story chapter that is unlocked but not yet shown (for ProgressionOverlay). */
  getNextChapterToShow: () => StoryChapter | null;

  getWeeklyAura: () => number; // current user's Aura earned this week (resets by week)

  // Actions - Learning
  setLessonProgress: (progress: UserLessonProgress[]) => void;
  updateLessonProgress: (lessonId: string, progress: Partial<UserLessonProgress>) => void;
  completeLessonToday: () => void;
  getLessonsCompletedToday: () => number;
  
  // Actions - Location
  setLocation: (location: LocationData | null) => void;

  // Actions - Badges
  checkAndAwardBadges: (extra?: { quizPerfect?: boolean }) => void;

  // Actions - Visby Needs
  updateVisbyNeeds: () => void;
  feedVisby: () => void;
  playWithVisby: () => void;
  restVisby: () => void;
  studyWithVisby: () => void;
  getVisbyNeeds: () => VisbyNeeds;
  getVisbyMood: () => import('../types').VisbyMood;

  // Actions - Furniture & Room Decoration
  ownedFurniture: string[];
  buyFurniture: (furnitureId: string, price: number) => boolean;
  placeFurniture: (countryId: string, roomId: string, item: PlacedFurniture) => void;
  removePlacedFurniture: (countryId: string, roomId: string, placedId: string) => void;
  updateRoomColors: (countryId: string, roomId: string, wallColor?: string, floorColor?: string) => void;

  // Actions - Game Stats
  incrementGameStat: (stat: 'gamesPlayed' | 'perfectCookingGames' | 'perfectWordMatches' | 'treasureHuntsCompleted') => void;

  getTreasureHuntProgress: (countryId: string) => { completedRoomIds: string[]; completedLocationIds: string[] };
  completeTreasureHuntRoom: (countryId: string, roomId: string) => void;
  completeTreasureHuntLocation: (countryId: string, locationId: string) => void;

  // Actions - Skills
  addSkillPoints: (skill: keyof SkillProgress, amount: number) => void;

  // Actions - Growth
  getGrowthStage: () => VisbyGrowthStage;

  // Actions - Settings
  updateSettings: (settings: Partial<AppStore['settings']>) => void;
  /** Call when user dismisses "Visby is resting" to start a new session. */
  setSessionStartedNow: () => void;
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: true,
      visby: null,
      stamps: [],
      bites: [],
      badges: [],
      lessonProgress: [],
      currentLocation: null,
      userHouses: [],
      ownedFurniture: [],
      countryProgress: {},
      treasureHuntProgress: {},
      discoveryLog: [],
      roomVisitCount: {},
      roomMicroEventShown: {},
      friends: [],
      friendRequests: [],
      visbyChatMessages: [],
      visbyMemories: [],
      lastVisbyCheckInAt: null,
      dailyMission: null,
      dailyMissionDateKey: '',
      dailyMissionCompletedAt: null,
      dailyMissionProgress: 0,
      lastSurpriseDateKey: '',
      adventureDateKey: '',
      adventureVisitDone: false,
      adventureFactsCount: 0,
      adventureGameDone: false,
      adventureCompletedAt: null,
      placeChatMessages: {},
      streakFreezesRemaining: 1,
      lastFreezeGrantMonth: '',
      pendingStreakFreezeOffer: false,
      storyBeatsShown: [],
      lastSeasonKey: '',
      seasonalVisitCountThisSeason: 0,
      seasonalQuestCompletedSeasonKey: null,
      questProgress: {},
      userWeeklyAura: 0,
      lastWeeklyResetDateKey: '',
      settings: {
        notifications: true,
        locationTracking: true,
        privateProfile: false,
        soundEffects: true,
        sessionTimerMinutes: 0,
        focusMode: false,
        quieterMode: false,
        ambientSound: false,
      },
      sessionStartedAt: null,

      // Auth Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({
        user: null,
        isAuthenticated: false,
        visby: null,
        stamps: [],
        bites: [],
        badges: [],
        lessonProgress: [],
        userHouses: [],
      countryProgress: {},
      treasureHuntProgress: {},
      discoveryLog: [],
      roomVisitCount: {},
      roomMicroEventShown: {},
      lastSeasonKey: '',
        seasonalVisitCountThisSeason: 0,
        seasonalQuestCompletedSeasonKey: null,
        adventureDateKey: '',
        adventureVisitDone: false,
        adventureFactsCount: 0,
        adventureGameDone: false,
        adventureCompletedAt: null,
        friends: [],
        friendRequests: [],
        visbyChatMessages: [],
        visbyMemories: [],
        lastVisbyCheckInAt: null,
        dailyMission: null,
        dailyMissionDateKey: '',
        dailyMissionCompletedAt: null,
        dailyMissionProgress: 0,
        lastSurpriseDateKey: '',
        placeChatMessages: {},
        streakFreezesRemaining: 1,
        lastFreezeGrantMonth: '',
        pendingStreakFreezeOffer: false,
        storyBeatsShown: [],
        questProgress: {},
        userWeeklyAura: 0,
        lastWeeklyResetDateKey: '',
      }),
      
      getCountryProgress: (countryId) => {
        const progress = get().countryProgress[countryId];
        return progress || { factsReadCount: 0, quizCompleted: false, gamesPlayedCount: 0 };
      },
      markFactRead: (countryId) => {
        const { countryProgress, adventureDateKey, adventureFactsCount } = get();
        const today = todayDateKey();
        const current = countryProgress[countryId] || { factsReadCount: 0, quizCompleted: false, gamesPlayedCount: 0 };
        set({
          countryProgress: {
            ...countryProgress,
            [countryId]: { ...current, factsReadCount: Math.min((current.factsReadCount || 0) + 1, 999) },
          },
        });
        if (adventureDateKey === today) {
          set({ adventureFactsCount: Math.min(2, adventureFactsCount + 1) });
        } else {
          set({
            adventureDateKey: today,
            adventureVisitDone: false,
            adventureFactsCount: 1,
            adventureGameDone: false,
            adventureCompletedAt: null,
          });
        }
        get().checkDailyMissionCompletion('read_facts', 1);
        get().awardAdventureIfCompleted();
      },
      markQuizCompleted: (countryId) => {
        const { countryProgress } = get();
        const current = countryProgress[countryId] || { factsReadCount: 0, quizCompleted: false, gamesPlayedCount: 0 };
        set({
          countryProgress: {
            ...countryProgress,
            [countryId]: { ...current, quizCompleted: true },
          },
        });
      },
      markGamePlayed: (countryId) => {
        const { countryProgress } = get();
        const current = countryProgress[countryId] || { factsReadCount: 0, quizCompleted: false, gamesPlayedCount: 0 };
        set({
          countryProgress: {
            ...countryProgress,
            [countryId]: { ...current, gamesPlayedCount: (current.gamesPlayedCount || 0) + 1 },
          },
        });
      },

      addDiscovery: (title, countryId, type) => {
        const { discoveryLog } = get();
        const entry: Discovery = {
          id: `disc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          title: title.slice(0, 120),
          countryId,
          learnedAt: new Date().toISOString(),
          type,
        };
        set({ discoveryLog: [entry, ...discoveryLog].slice(0, 100) });
      },
      getDiscoveryLog: () => get().discoveryLog,
      recordRoomVisit: (countryId, roomId) => {
        const key = `${countryId}_${roomId}`;
        const { roomVisitCount } = get();
        const count = (roomVisitCount[key] ?? 0) + 1;
        set({ roomVisitCount: { ...roomVisitCount, [key]: count } });
      },
      tryRoomMicroEvent: (countryId, roomId) => {
        const key = `${countryId}_${roomId}`;
        const state = get();
        const count = state.roomVisitCount[key] ?? 0;
        const shown = state.roomMicroEventShown[key] ?? false;
        if (count < 3 || shown) return false;
        set({
          roomMicroEventShown: { ...state.roomMicroEventShown, [key]: true },
        });
        get().addAura(5);
        return true;
      },

      // Friends Actions (works with local/demo; backend can sync later)
      sendFriendRequest: (toUsername) => {
        const { user, friends, friendRequests } = get();
        if (!user) return { success: false, error: 'Not logged in' };
        const normalized = toUsername.trim().toLowerCase();
        if (normalized === user.username.trim().toLowerCase()) return { success: false, error: "You can't add yourself" };
        if (friends.some((f) => f.username.toLowerCase() === normalized)) return { success: false, error: 'Already friends' };
        if (friendRequests.some((r) => r.fromUserId === user.id && r.toUserId === `demo_${normalized}`)) return { success: false, error: 'Request already sent' };
        const requestId = `fr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const now = new Date();
        const outgoing: FriendRequest = {
          id: requestId,
          fromUserId: user.id,
          fromUsername: user.username,
          fromDisplayName: user.displayName,
          toUserId: `demo_${normalized}`,
          status: 'pending',
          createdAt: now,
        };
        const incoming: FriendRequest = {
          id: `fr_in_${requestId}`,
          fromUserId: `demo_${normalized}`,
          fromUsername: toUsername.trim(),
          fromDisplayName: toUsername.trim(),
          toUserId: user.id,
          status: 'pending',
          createdAt: now,
        };
        set({ friendRequests: [...friendRequests, outgoing, incoming] });
        return { success: true };
      },
      acceptFriendRequest: (requestId) => {
        const { user, friendRequests, friends } = get();
        const req = friendRequests.find((r) => r.id === requestId && r.toUserId === user?.id);
        if (!user || !req) return;
        const newFriend: Friend = {
          userId: req.fromUserId,
          username: req.fromUsername,
          displayName: req.fromDisplayName,
          level: 1,
          aura: 0,
          badgesCount: 0,
          houseCountryIds: ['jp', 'fr'],
          addedAt: new Date(),
        };
        set({
          friends: [...friends, newFriend],
          friendRequests: friendRequests.filter(
            (r) => r.id !== requestId && !(r.fromUserId === user.id && r.toUserId === req.fromUserId)
          ),
        });
      },
      rejectFriendRequest: (requestId) => {
        const { user, friendRequests } = get();
        if (!user) return;
        const req = friendRequests.find((r) => r.id === requestId && r.toUserId === user.id);
        if (!req) return;
        set({
          friendRequests: friendRequests.filter(
            (r) => r.id !== requestId && !(r.fromUserId === user.id && r.toUserId === req.fromUserId)
          ),
        });
      },
      removeFriend: (friendUserId) => {
        set((state) => ({ friends: state.friends.filter((f) => f.userId !== friendUserId) }));
      },
      updateFriendProfile: (friendUserId, data) => {
        set((state) => ({
          friends: state.friends.map((f) => (f.userId === friendUserId ? { ...f, ...data } : f)),
        }));
      },

      // Visby social battery & check-in chat
      chargeSocialBattery: (amount) => {
        const { visby } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = {
          ...needs,
          socialBattery: Math.min(100, (needs.socialBattery ?? DEFAULT_NEEDS.socialBattery) + amount),
          lastUpdated: new Date().toISOString(),
        };
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
      },
      addVisbyChatMessage: (role, text) => {
        const { visbyChatMessages } = get();
        const msg: VisbyChatMessage = {
          id: `vcm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          role,
          text,
          createdAt: new Date().toISOString(),
        };
        set({ visbyChatMessages: [...visbyChatMessages, msg] });
      },
      addVisbyMemory: (summary) => {
        const { visbyMemories } = get();
        const trimmed = summary.trim().slice(0, 200);
        if (!trimmed) return;
        const memory: VisbyMemory = {
          id: `vm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          summary: trimmed,
          createdAt: new Date().toISOString(),
        };
        set({ visbyMemories: [...visbyMemories, memory].slice(-30) });
      },
      setLastVisbyCheckInAt: () => {
        set({ lastVisbyCheckInAt: new Date().toISOString() });
      },
      shouldShowVisbyCheckIn: () => {
        const { lastVisbyCheckInAt } = get();
        if (!lastVisbyCheckInAt) return true;
        const last = new Date(lastVisbyCheckInAt);
        const today = new Date();
        return last.getDate() !== today.getDate() || last.getFullYear() !== today.getFullYear() || last.getMonth() !== today.getMonth();
      },
      getVisbyMemories: () => get().visbyMemories,
      getVisbyChatMessages: () => get().visbyChatMessages,

      getDailyMission: () => {
        const today = todayDateKey();
        const { dailyMission, dailyMissionDateKey, dailyMissionCompletedAt, dailyMissionProgress } = get();
        if (dailyMissionDateKey !== today) {
          const mission = DAILY_MISSION_POOL[Math.floor(Math.random() * DAILY_MISSION_POOL.length)];
          set({
            dailyMission: mission,
            dailyMissionDateKey: today,
            dailyMissionCompletedAt: null,
            dailyMissionProgress: 0,
          });
          return mission;
        }
        return dailyMission;
      },
      checkDailyMissionCompletion: (type, amount = 1) => {
        const { dailyMission, dailyMissionDateKey, dailyMissionCompletedAt, dailyMissionProgress } = get();
        const today = todayDateKey();
        if (dailyMissionDateKey !== today || !dailyMission || dailyMissionCompletedAt || dailyMission.type !== type) return false;
        const newProgress = dailyMissionProgress + amount;
        set({ dailyMissionProgress: newProgress });
        if (newProgress < dailyMission.target) return false;
        set({
          dailyMissionCompletedAt: new Date().toISOString(),
        });
        get().addAura(DAILY_MISSION_BONUS_AURA);
        import('../services/sound').then((m) => m.soundService.playMissionComplete()).catch(() => {});
        return true;
      },
          trySurprise: () => {
        const today = todayDateKey();
        const { lastSurpriseDateKey } = get();
        if (lastSurpriseDateKey === today) return { granted: false };
        if (Math.random() > SURPRISE_CHANCE) return { granted: false };
        const aura = SURPRISE_AURA_MIN + Math.floor(Math.random() * (SURPRISE_AURA_MAX - SURPRISE_AURA_MIN + 1));
        set({ lastSurpriseDateKey: today });
        get().addAura(aura);
        return { granted: true, aura };
      },

      getAdventureOfTheDay: () => {
        const today = todayDateKey();
        const state = get();
        if (state.adventureDateKey !== today) {
          set({
            adventureDateKey: today,
            adventureVisitDone: false,
            adventureFactsCount: 0,
            adventureGameDone: false,
            adventureCompletedAt: null,
          });
          return {
            step1: false,
            step2: false,
            step3: false,
            completed: false,
            rewardAura: 60,
          };
        }
        const step1 = state.adventureVisitDone;
        const step2 = state.adventureFactsCount >= 2;
        const step3 = state.adventureGameDone;
        const completed = step1 && step2 && step3;
        return { step1, step2, step3, completed, rewardAura: 60 };
      },
      setAdventureGamePlayed: () => {
        const today = todayDateKey();
        const state = get();
        if (state.adventureDateKey !== today) {
          set({
            adventureDateKey: today,
            adventureVisitDone: false,
            adventureFactsCount: 0,
            adventureGameDone: true,
          });
        } else {
          set({ adventureGameDone: true });
        }
        get().awardAdventureIfCompleted();
      },
      awardAdventureIfCompleted: () => {
        const today = todayDateKey();
        const state = get();
        if (state.adventureDateKey !== today || state.adventureCompletedAt) return false;
        const step1 = state.adventureVisitDone;
        const step2 = state.adventureFactsCount >= 2;
        const step3 = state.adventureGameDone;
        if (!step1 || !step2 || !step3) return false;
        set({ adventureCompletedAt: new Date().toISOString() });
        get().addAura(60);
        import('../services/sound').then((m) => m.soundService.playMissionComplete()).catch(() => {});
        return true;
      },

      getNextChapterToShow: () => {
        const state = get();
        const user = state.user;
        const context = {
          countriesVisited: user?.visitedCountries?.length ?? 0,
          lessonsCompleted: state.lessonProgress.filter((p) => p.completed).length,
          stampsCount: state.stamps.length,
          badgesCount: state.badges.length,
        };
        for (const chapter of STORY_CHAPTERS) {
          if (state.storyBeatsShown.includes(chapter.storyBeatId)) continue;
          const current = getChapterUnlockCurrent(chapter.unlock.type, context);
          if (current >= chapter.unlock.value) return chapter;
        }
        return null;
      },

      addPlaceChatMessage: (placeKey, message) => {
        const { user, placeChatMessages } = get();
        if (!user || !message.trim()) return;
        const trimmed = message.trim().slice(0, 300);
        const msg: PlaceChatMessage = {
          id: `pcm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          userId: user.id,
          username: user.username,
          message: trimmed,
          createdAt: new Date(),
        };
        const list = placeChatMessages[placeKey] || [];
        const next = [...list, msg].slice(-50);
        set({ placeChatMessages: { ...placeChatMessages, [placeKey]: next } });
        get().chargeSocialBattery(8);
      },
      getPlaceChatMessages: (placeKey) => get().placeChatMessages[placeKey] || [],

      useStreakFreeze: () => {
        const { user, pendingStreakFreezeOffer, streakFreezesRemaining } = get();
        if (!user || !pendingStreakFreezeOffer || streakFreezesRemaining <= 0) return false;
        set({
          pendingStreakFreezeOffer: false,
          streakFreezesRemaining: streakFreezesRemaining - 1,
          user: {
            ...user,
            lastCheckIn: new Date(),
            aura: user.aura + 10,
            totalAuraEarned: user.totalAuraEarned + 10,
          },
        });
        return true;
      },
      declineStreakFreezeOffer: () => {
        const { user, pendingStreakFreezeOffer } = get();
        if (!user || !pendingStreakFreezeOffer) return;
        set({
          pendingStreakFreezeOffer: false,
          user: {
            ...user,
            currentStreak: 1,
            lastCheckIn: new Date(),
            aura: user.aura + 10,
            totalAuraEarned: user.totalAuraEarned + 10,
          },
        });
      },

      markStoryBeatShown: (id) => {
        const { storyBeatsShown } = get();
        if (storyBeatsShown.includes(id)) return;
        set({ storyBeatsShown: [...storyBeatsShown, id] });
      },

      getQuestProgress: (questId) => {
        const state = get();
        const seasonKey = getCurrentSeasonKey();
        if (state.lastSeasonKey !== seasonKey) {
          set({
            lastSeasonKey: seasonKey,
            seasonalVisitCountThisSeason: 0,
          });
        }
        const def = questId === 'seasonal_explorer' ? getSeasonalExplorerQuest() : getQuestById(questId);
        if (!def) return null;
        const completedAt = state.questProgress[questId]?.completedAt ?? null;
        let current = 0;
        if (def.progressType === 'lessons_completed') {
          current = state.lessonProgress.filter((p) => p.completed).length;
        } else if (def.progressType === 'stamp_countries') {
          current = new Set(state.stamps.map((s) => s.country)).size;
        } else if (def.progressType === 'seasonal_visit') {
          current = get().seasonalVisitCountThisSeason;
        } else if (def.progressType === 'first_country') {
          current = state.user?.visitedCountries?.length ?? 0;
        } else if (def.progressType === 'facts_read_total') {
          current = Object.values(state.countryProgress).reduce((sum, p) => sum + (p?.factsReadCount ?? 0), 0);
        }
        const completed = def.progressType === 'seasonal_visit'
          ? (state.seasonalQuestCompletedSeasonKey === seasonKey)
          : !!completedAt;
        return {
          current,
          target: def.target,
          completed,
          definition: def,
        };
      },
      checkQuests: () => {
        const state = get();
        const seasonKey = getCurrentSeasonKey();
        QUEST_DEFINITIONS.forEach((def) => {
          if (def.progressType === 'seasonal_visit') {
            if (state.seasonalQuestCompletedSeasonKey === seasonKey) return;
            const current = state.seasonalVisitCountThisSeason;
            if (current >= def.target) {
              set((s) => ({
                seasonalQuestCompletedSeasonKey: seasonKey,
                questProgress: {
                  ...s.questProgress,
                  [def.id]: { completedAt: new Date().toISOString() },
                },
              }));
              get().addAura(def.rewardAura);
            }
            return;
          }
          const existing = state.questProgress[def.id]?.completedAt;
          if (existing) return;
          let current = 0;
          if (def.progressType === 'lessons_completed') {
            current = state.lessonProgress.filter((p) => p.completed).length;
          } else if (def.progressType === 'stamp_countries') {
            current = new Set(state.stamps.map((s) => s.country)).size;
          } else if (def.progressType === 'first_country') {
            current = state.user?.visitedCountries?.length ?? 0;
          } else if (def.progressType === 'facts_read_total') {
            current = Object.values(state.countryProgress).reduce((sum, p) => sum + (p?.factsReadCount ?? 0), 0);
          }
          if (current >= def.target) {
            set((s) => ({
              questProgress: {
                ...s.questProgress,
                [def.id]: { completedAt: new Date().toISOString() },
              },
            }));
            get().addAura(def.rewardAura);
          }
        });
      },
      recordSeasonalCountryEntry: () => {
        const state = get();
        const seasonKey = getCurrentSeasonKey();
        const today = todayDateKey();
        const updates: Record<string, unknown> = {};
        if (state.lastSeasonKey !== seasonKey) {
          updates.lastSeasonKey = seasonKey;
          updates.seasonalVisitCountThisSeason = 1;
        } else {
          updates.seasonalVisitCountThisSeason = Math.min(99, state.seasonalVisitCountThisSeason + 1);
        }
        if (state.adventureDateKey !== today) {
          updates.adventureDateKey = today;
          updates.adventureVisitDone = true;
          updates.adventureFactsCount = 0;
          updates.adventureGameDone = false;
          updates.adventureCompletedAt = null;
        } else {
          updates.adventureVisitDone = true;
        }
        set(updates);
        get().checkQuests();
        get().awardAdventureIfCompleted();
      },
      getWeeklyAura: () => {
        const weekKey = getISOWeekKey();
        const state = get();
        if (state.lastWeeklyResetDateKey !== weekKey) {
          set({ userWeeklyAura: 0, lastWeeklyResetDateKey: weekKey });
          return 0;
        }
        return state.userWeeklyAura ?? 0;
      },

      // Visby Actions
      setVisby: (visby) => {
        if (!visby) {
          set({ visby: null });
          return;
        }
        const starters = ['default_tunic', 'default_boots', 'default_backpack', 'viking_helmet'];
        const owned = visby.ownedCosmetics ?? [];
        const merged = [...new Set([...starters, ...owned])];
        const needsMerge = starters.some((id) => !owned.includes(id));
        set({
          visby: needsMerge
            ? { ...visby, ownedCosmetics: merged }
            : visby,
        });
      },
      updateVisbyAppearance: (appearance) => {
        const { visby } = get();
        if (visby) {
          set({
            visby: {
              ...visby,
              appearance: { ...visby.appearance, ...appearance },
            },
          });
        }
      },
      equipCosmetic: (slot, cosmeticId) => {
        const { visby } = get();
        if (visby) {
          set({
            visby: {
              ...visby,
              equipped: { ...visby.equipped, [slot]: cosmeticId },
            },
          });
        }
      },
      setVisbyMood: (mood) => {
        const { visby } = get();
        if (visby) {
          set({ visby: { ...visby, currentMood: mood } });
        }
      },
      
      // Collection Actions
      setStamps: (stamps) => set({ stamps }),
      addStamp: async (stamp) => {
        try {
          const saved = await stampsService.insertStamp(stamp);
          set((state) => ({ stamps: [saved, ...state.stamps] }));
          get().playWithVisby();
          get().checkAndAwardBadges();
          get().checkDailyMissionCompletion('collect_stamp', 1);
          get().checkQuests();
          return saved;
        } catch (e) {
          if (__DEV__) console.error('Failed to save stamp', e);
          showToast('Could not save stamp. Try again.', 'error');
          return null;
        }
      },
      setBites: (bites) => set({ bites }),
      addBite: (bite) => {
        set((state) => ({ bites: [...state.bites, bite] }));
        get().feedVisby();
        get().checkAndAwardBadges();
        get().checkDailyMissionCompletion('add_bite', 1);
      },
      setBadges: (badges) => set({ badges }),
      addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
      
      // Progression Actions
      addAura: (amount) => {
        const state = get();
        const { user } = state;
        if (user) {
          const multiplier = Math.min(3.0, 1.0 + (user.currentStreak * 0.1));
          const boosted = Math.round(amount * multiplier);
          const newTotalAura = user.totalAuraEarned + boosted;
          const newLevel = [...LEVEL_THRESHOLDS]
            .reverse()
            .find((t) => newTotalAura >= t.aura)?.level ?? 1;
          const weekKey = getISOWeekKey();
          const weeklyReset = state.lastWeeklyResetDateKey !== weekKey;
          const newWeeklyAura = weeklyReset ? boosted : (state.userWeeklyAura ?? 0) + boosted;
          set({
            user: {
              ...user,
              aura: user.aura + boosted,
              totalAuraEarned: newTotalAura,
              level: newLevel,
            },
            ...(weeklyReset ? { userWeeklyAura: newWeeklyAura, lastWeeklyResetDateKey: weekKey } : { userWeeklyAura: newWeeklyAura }),
          });
        }
      },
      spendAura: (amount) => {
        const { user } = get();
        if (!user || user.aura < amount) return false;
        set({
          user: {
            ...user,
            aura: user.aura - amount,
          },
        });
        return true;
      },
      incrementStreak: () => {
        const { user } = get();
        if (user) {
          const newStreak = user.currentStreak + 1;
          set({
            user: {
              ...user,
              currentStreak: newStreak,
              longestStreak: Math.max(newStreak, user.longestStreak),
              lastCheckIn: new Date(),
            },
          });
        }
      },
      dailyCheckIn: () => {
        const { user, streakFreezesRemaining, lastFreezeGrantMonth } = get();
        if (!user) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const grantFreezeForMonth = () => {
          if (lastFreezeGrantMonth === monthKey) return;
          set({
            lastFreezeGrantMonth: monthKey,
            streakFreezesRemaining: Math.min(2, get().streakFreezesRemaining + 1),
          });
        };

        if (user.lastCheckIn) {
          const last = new Date(user.lastCheckIn);
          const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
          const diffDays = Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return;

          grantFreezeForMonth();

          if (diffDays === 1) {
            const newStreak = user.currentStreak + 1;
            set({
              user: {
                ...user,
                currentStreak: newStreak,
                longestStreak: Math.max(newStreak, user.longestStreak),
                lastCheckIn: now,
                aura: user.aura + 10,
                totalAuraEarned: user.totalAuraEarned + 10,
              },
            });
            return;
          }

          if (diffDays > 1 && get().streakFreezesRemaining > 0) {
            set({ pendingStreakFreezeOffer: true });
            return;
          }

          set({
            user: {
              ...user,
              currentStreak: 1,
              longestStreak: user.longestStreak,
              lastCheckIn: now,
              aura: user.aura + 10,
              totalAuraEarned: user.totalAuraEarned + 10,
            },
          });
        } else {
          grantFreezeForMonth();
          set({
            user: {
              ...user,
              currentStreak: 1,
              longestStreak: Math.max(1, user.longestStreak),
              lastCheckIn: now,
              aura: user.aura + 10,
              totalAuraEarned: user.totalAuraEarned + 10,
            },
          });
        }

        // Partially restore Visby's energy on daily check-in
        const { visby } = get();
        if (visby) {
          const needs = visby.needs || DEFAULT_NEEDS;
          const updated = {
            ...needs,
            energy: Math.min(100, needs.energy + 10),
            lastUpdated: new Date().toISOString(),
          };
          const mood = deriveVisbyMood(updated);
          set({ visby: { ...visby, needs: updated, currentMood: mood } });
        }

        get().checkAndAwardBadges();
      },
      getStreakMultiplier: () => {
        const { user } = get();
        return Math.min(3.0, 1.0 + ((user?.currentStreak || 0) * 0.1));
      },
      incrementCountriesVisited: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              countriesVisited: user.countriesVisited + 1,
            },
          });
        }
      },
      
      // Learning Actions
      setLessonProgress: (lessonProgress) => set({ lessonProgress }),
      updateLessonProgress: (lessonId, progress) => {
        const { lessonProgress } = get();
        const index = lessonProgress.findIndex((p) => p.lessonId === lessonId);
        if (index >= 0) {
          const updated = [...lessonProgress];
          updated[index] = { ...updated[index], ...progress };
          set({ lessonProgress: updated });
        } else {
          set({
            lessonProgress: [
              ...lessonProgress,
              { id: `${Date.now()}`, lessonId, userId: '', ...progress } as UserLessonProgress,
            ],
          });
        }
        if (progress.completed) get().checkQuests();
      },
      completeLessonToday: () => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              lessonsCompletedToday: (user.lessonsCompletedToday || 0) + 1,
              lastLessonDate: new Date().toDateString(),
            },
          });
        }
      },
      getLessonsCompletedToday: () => {
        const { user } = get();
        if (!user) return 0;
        if (user.lastLessonDate === new Date().toDateString()) {
          return user.lessonsCompletedToday || 0;
        }
        return 0;
      },
      
      // Location Actions
      setLocation: (currentLocation) => set({ currentLocation }),

      // Houses & Country Visit Actions
      setUserHouses: (userHouses) => set({ userHouses }),
      addUserHouse: (house) => {
        set((state) => ({ userHouses: [...state.userHouses, house] }));
        get().checkAndAwardBadges();
      },
      visitCountry: (countryId) => {
        const { user, visby } = get();
        if (!user || !visby) return null;

        const visited = user.visitedCountries || [];
        if (visited.includes(countryId)) return null;

        set({
          user: {
            ...user,
            visitedCountries: [...visited, countryId],
          },
        });

        get().recordSeasonalCountryEntry();

        const souvenir = COUNTRY_SOUVENIRS[countryId];
        if (souvenir && !visby.ownedCosmetics.includes(souvenir.cosmeticId)) {
          const currentVisby = get().visby!;
          set({
            visby: {
              ...currentVisby,
              ownedCosmetics: [...currentVisby.ownedCosmetics, souvenir.cosmeticId],
            },
          });
          return souvenir.cosmeticId;
        }
        return null;
      },

      // Badge Actions
      checkAndAwardBadges: (extra) => {
        const { user, stamps, bites, badges, lessonProgress, userHouses, visby } = get();

        const uniqueCuisines = new Set(bites.map((b) => b.cuisine));
        const context: BadgeCheckContext = {
          stamps: stamps.length,
          bites: bites.length,
          countriesVisited: user?.countriesVisited ?? 0,
          totalAuraEarned: user?.totalAuraEarned ?? 0,
          currentStreak: user?.currentStreak ?? 0,
          longestStreak: user?.longestStreak ?? 0,
          lessonsCompleted: lessonProgress.filter((lp) => lp.completed).length,
          housesOwned: userHouses.length,
          cosmeticsOwned: visby?.ownedCosmetics.length ?? 0,
          cuisinesCount: uniqueCuisines.size,
          quizPerfect: extra?.quizPerfect ?? false,
          earnedBadgeIds: badges.map((b) => b.badgeId),
          gamesPlayed: user?.gamesPlayed ?? 0,
          perfectCookingGames: user?.perfectCookingGames ?? 0,
          perfectWordMatches: user?.perfectWordMatches ?? 0,
          treasureHuntsCompleted: user?.treasureHuntsCompleted ?? 0,
        };

        const newBadges = checkNewBadges(context);

        const RARITY_AURA: Record<string, number> = {
          common: AURA_REWARDS.BADGE_COMMON,
          uncommon: AURA_REWARDS.BADGE_UNCOMMON,
          rare: AURA_REWARDS.BADGE_RARE,
          epic: AURA_REWARDS.BADGE_EPIC,
          legendary: AURA_REWARDS.BADGE_LEGENDARY,
        };

        for (const badge of newBadges) {
          const userBadge: UserBadge = {
            id: `badge_${badge.id}_${Date.now()}`,
            userId: user?.id ?? '',
            badgeId: badge.id,
            earnedAt: new Date(),
            progress: 100,
            isNew: true,
          };
          set((s) => ({ badges: [...s.badges, userBadge] }));
          get().addAura(RARITY_AURA[badge.rarity] ?? 0);
        }
      },

      // Visby Needs Actions
      updateVisbyNeeds: () => {
        const { visby } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = calculateDecay(needs);
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
      },
      feedVisby: () => {
        const { visby, user } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = {
          ...needs,
          hunger: Math.min(100, needs.hunger + 25),
          lastUpdated: new Date().toISOString(),
        };
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
        if (user) set({ user: { ...user, totalCarePoints: (user.totalCarePoints || 0) + 1 } });
      },
      playWithVisby: () => {
        const { visby, user } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = {
          ...needs,
          happiness: Math.min(100, needs.happiness + 20),
          energy: Math.max(0, needs.energy - 5),
          lastUpdated: new Date().toISOString(),
        };
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
        if (user) set({ user: { ...user, totalCarePoints: (user.totalCarePoints || 0) + 1 } });
      },
      restVisby: () => {
        const { visby, user } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = {
          ...needs,
          energy: Math.min(100, needs.energy + 30),
          lastUpdated: new Date().toISOString(),
        };
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
        if (user) set({ user: { ...user, totalCarePoints: (user.totalCarePoints || 0) + 1 } });
      },
      studyWithVisby: () => {
        const { visby, user } = get();
        if (!visby) return;
        const needs = { ...DEFAULT_NEEDS, ...(visby.needs || {}) };
        const updated = {
          ...needs,
          knowledge: Math.min(100, needs.knowledge + 20),
          energy: Math.max(0, needs.energy - 3),
          lastUpdated: new Date().toISOString(),
        };
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
        if (user) set({ user: { ...user, totalCarePoints: (user.totalCarePoints || 0) + 1 } });
      },
      getVisbyNeeds: () => {
        const { visby } = get();
        if (!visby?.needs) return DEFAULT_NEEDS;
        return calculateDecay(visby.needs);
      },
      getVisbyMood: () => {
        return deriveVisbyMood(get().getVisbyNeeds());
      },

      // Furniture & Room Decoration Actions
      buyFurniture: (furnitureId, price) => {
        const { user, ownedFurniture } = get();
        if (!user || user.aura < price) return false;
        set({
          ownedFurniture: [...ownedFurniture, furnitureId],
          user: { ...user, aura: user.aura - price },
        });
        return true;
      },
      placeFurniture: (countryId, roomId, item) => {
        const { userHouses } = get();
        const idx = userHouses.findIndex(h => h.countryId === countryId);
        if (idx < 0) return;
        const house = { ...userHouses[idx] };
        const customizations = { ...(house.roomCustomizations || {}) };
        const room: RoomCustomization = { ...(customizations[roomId] || { placedFurniture: [] }) };
        room.placedFurniture = [...room.placedFurniture, item];
        customizations[roomId] = room;
        house.roomCustomizations = customizations;
        const updated = [...userHouses];
        updated[idx] = house;
        set({ userHouses: updated });
      },
      removePlacedFurniture: (countryId, roomId, placedId) => {
        const { userHouses } = get();
        const idx = userHouses.findIndex(h => h.countryId === countryId);
        if (idx < 0) return;
        const house = { ...userHouses[idx] };
        const customizations = { ...(house.roomCustomizations || {}) };
        const room: RoomCustomization = { ...(customizations[roomId] || { placedFurniture: [] }) };
        room.placedFurniture = room.placedFurniture.filter(f => f.id !== placedId);
        customizations[roomId] = room;
        house.roomCustomizations = customizations;
        const updated = [...userHouses];
        updated[idx] = house;
        set({ userHouses: updated });
      },
      updateRoomColors: (countryId, roomId, wallColor, floorColor) => {
        const { userHouses } = get();
        const idx = userHouses.findIndex(h => h.countryId === countryId);
        if (idx < 0) return;
        const house = { ...userHouses[idx] };
        const customizations = { ...(house.roomCustomizations || {}) };
        const room: RoomCustomization = { ...(customizations[roomId] || { placedFurniture: [] }) };
        if (wallColor) room.wallColor = wallColor;
        if (floorColor) room.floorColor = floorColor;
        customizations[roomId] = room;
        house.roomCustomizations = customizations;
        const updated = [...userHouses];
        updated[idx] = house;
        set({ userHouses: updated });
      },

      // Game Stats
      incrementGameStat: (stat) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, [stat]: (user[stat] || 0) + 1 } });
        get().checkAndAwardBadges();
      },

      getTreasureHuntProgress: (countryId) => {
        const progress = get().treasureHuntProgress[countryId];
        return {
          completedRoomIds: progress?.completedRoomIds ?? [],
          completedLocationIds: progress?.completedLocationIds ?? [],
        };
      },
      completeTreasureHuntRoom: (countryId, roomId) => {
        const { treasureHuntProgress } = get();
        const current = treasureHuntProgress[countryId] ?? { completedRoomIds: [], completedLocationIds: [] };
        if (current.completedRoomIds.includes(roomId)) return;
        set({
          treasureHuntProgress: {
            ...treasureHuntProgress,
            [countryId]: {
              ...current,
              completedRoomIds: [...current.completedRoomIds, roomId],
            },
          },
        });
      },
      completeTreasureHuntLocation: (countryId, locationId) => {
        const { treasureHuntProgress } = get();
        const current = treasureHuntProgress[countryId] ?? { completedRoomIds: [], completedLocationIds: [] };
        const ids = current.completedLocationIds ?? [];
        if (ids.includes(locationId)) return;
        set({
          treasureHuntProgress: {
            ...treasureHuntProgress,
            [countryId]: {
              ...current,
              completedLocationIds: [...ids, locationId],
            },
          },
        });
      },

      // Growth Stage
      getGrowthStage: () => {
        const { user } = get();
        return getGrowthStage(user?.totalCarePoints || 0);
      },

      // Skills Actions
      addSkillPoints: (skill, amount) => {
        const { user } = get();
        if (!user) return;
        const skills = user.skills || DEFAULT_SKILLS;
        set({
          user: {
            ...user,
            skills: {
              ...skills,
              [skill]: Math.min(100, (skills[skill] || 0) + amount),
            },
          },
        });
      },

      // Settings Actions
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      setSessionStartedNow: () => set({ sessionStartedAt: Date.now() }),
    }),
    {
      name: 'visby-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        visby: state.visby,
        stamps: state.stamps,
        bites: state.bites,
        badges: state.badges,
        lessonProgress: state.lessonProgress,
        userHouses: state.userHouses,
        ownedFurniture: state.ownedFurniture,
        countryProgress: state.countryProgress,
        treasureHuntProgress: state.treasureHuntProgress,
        discoveryLog: state.discoveryLog,
        roomVisitCount: state.roomVisitCount,
        roomMicroEventShown: state.roomMicroEventShown,
        friends: state.friends,
        friendRequests: state.friendRequests,
        visbyChatMessages: state.visbyChatMessages,
        visbyMemories: state.visbyMemories,
        lastVisbyCheckInAt: state.lastVisbyCheckInAt,
        dailyMission: state.dailyMission,
        dailyMissionDateKey: state.dailyMissionDateKey,
        dailyMissionCompletedAt: state.dailyMissionCompletedAt,
        dailyMissionProgress: state.dailyMissionProgress,
        lastSurpriseDateKey: state.lastSurpriseDateKey,
        placeChatMessages: state.placeChatMessages,
        streakFreezesRemaining: state.streakFreezesRemaining,
        lastFreezeGrantMonth: state.lastFreezeGrantMonth,
        pendingStreakFreezeOffer: state.pendingStreakFreezeOffer,
        storyBeatsShown: state.storyBeatsShown,
        lastSeasonKey: state.lastSeasonKey,
        seasonalVisitCountThisSeason: state.seasonalVisitCountThisSeason,
        seasonalQuestCompletedSeasonKey: state.seasonalQuestCompletedSeasonKey,
        adventureDateKey: state.adventureDateKey,
        adventureVisitDone: state.adventureVisitDone,
        adventureFactsCount: state.adventureFactsCount,
        adventureGameDone: state.adventureGameDone,
        adventureCompletedAt: state.adventureCompletedAt,
        questProgress: state.questProgress,
        userWeeklyAura: state.userWeeklyAura,
        lastWeeklyResetDateKey: state.lastWeeklyResetDateKey,
        settings: state.settings,
        sessionStartedAt: state.sessionStartedAt,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;
