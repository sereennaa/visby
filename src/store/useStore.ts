// Zustand Store - Global State Management
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Visby, Stamp, Bite, UserBadge, LocationData, UserLessonProgress, UserHouse, VisbyNeeds } from '../types';
import { LEVEL_THRESHOLDS, AURA_REWARDS } from '../config/constants';
import { checkNewBadges, BadgeCheckContext } from '../services/badges';

export const DEFAULT_NEEDS: VisbyNeeds = {
  hunger: 80,
  happiness: 80,
  energy: 80,
  knowledge: 50,
  lastUpdated: new Date().toISOString(),
};

const DECAY_RATES = {
  hunger: 2.0,     // per hour
  happiness: 1.5,
  energy: 1.0,
  knowledge: 0.5,
};

function calculateDecay(needs: VisbyNeeds): VisbyNeeds {
  const now = Date.now();
  const last = new Date(needs.lastUpdated).getTime();
  const hoursElapsed = Math.min(24, (now - last) / (1000 * 60 * 60));
  if (hoursElapsed < 0.01) return needs;
  return {
    hunger: Math.max(0, Math.round(needs.hunger - DECAY_RATES.hunger * hoursElapsed)),
    happiness: Math.max(0, Math.round(needs.happiness - DECAY_RATES.happiness * hoursElapsed)),
    energy: Math.max(0, Math.round(needs.energy - DECAY_RATES.energy * hoursElapsed)),
    knowledge: Math.max(0, Math.round(needs.knowledge - DECAY_RATES.knowledge * hoursElapsed)),
    lastUpdated: new Date().toISOString(),
  };
}

function deriveVisbyMood(needs: VisbyNeeds): import('../types').VisbyMood {
  if (needs.hunger === 0 || needs.happiness === 0 || needs.energy === 0 || needs.knowledge === 0) return 'sick';
  const min = Math.min(needs.hunger, needs.happiness, needs.energy, needs.knowledge);
  if (min > 70) return 'excited';
  if (min > 50) return 'happy';
  if (needs.energy < 30) return 'sleepy';
  if (needs.hunger < 30) return 'hungry';
  if (needs.happiness < 30) return 'bored';
  if (needs.knowledge < 30) return 'confused';
  return 'happy';
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

  // Settings
  settings: {
    notifications: boolean;
    locationTracking: boolean;
    privateProfile: boolean;
  };
  
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
  addStamp: (stamp: Stamp) => void;
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

  // Actions - Houses
  setUserHouses: (houses: UserHouse[]) => void;
  addUserHouse: (house: UserHouse) => void;
  
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

  // Actions - Settings
  updateSettings: (settings: Partial<AppStore['settings']>) => void;
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
      settings: {
        notifications: true,
        locationTracking: true,
        privateProfile: false,
      },

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
      }),
      
      // Visby Actions
      setVisby: (visby) => set({ visby }),
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
      addStamp: (stamp) => {
        set((state) => ({ stamps: [...state.stamps, stamp] }));
        get().playWithVisby();
        get().checkAndAwardBadges();
      },
      setBites: (bites) => set({ bites }),
      addBite: (bite) => {
        set((state) => ({ bites: [...state.bites, bite] }));
        get().feedVisby();
        get().checkAndAwardBadges();
      },
      setBadges: (badges) => set({ badges }),
      addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
      
      // Progression Actions
      addAura: (amount) => {
        const { user } = get();
        if (user) {
          const multiplier = Math.min(3.0, 1.0 + (user.currentStreak * 0.1));
          const boosted = Math.round(amount * multiplier);
          const newTotalAura = user.totalAuraEarned + boosted;
          const newLevel = [...LEVEL_THRESHOLDS]
            .reverse()
            .find((t) => newTotalAura >= t.aura)?.level ?? 1;
          set({
            user: {
              ...user,
              aura: user.aura + boosted,
              totalAuraEarned: newTotalAura,
              level: newLevel,
            },
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
        const { user } = get();
        if (!user) return;

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (user.lastCheckIn) {
          const last = new Date(user.lastCheckIn);
          const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());
          const diffDays = Math.round((today.getTime() - lastDay.getTime()) / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return;

          const newStreak = diffDays === 1 ? user.currentStreak + 1 : 1;

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
        } else {
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

      // Houses Actions
      setUserHouses: (userHouses) => set({ userHouses }),
      addUserHouse: (house) => {
        set((state) => ({ userHouses: [...state.userHouses, house] }));
        get().checkAndAwardBadges();
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
        const needs = visby.needs || DEFAULT_NEEDS;
        const updated = calculateDecay(needs);
        const mood = deriveVisbyMood(updated);
        set({ visby: { ...visby, needs: updated, currentMood: mood } });
      },
      feedVisby: () => {
        const { visby, user } = get();
        if (!visby) return;
        const needs = visby.needs || DEFAULT_NEEDS;
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
        const needs = visby.needs || DEFAULT_NEEDS;
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
        const needs = visby.needs || DEFAULT_NEEDS;
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
        const needs = visby.needs || DEFAULT_NEEDS;
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

      // Settings Actions
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
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
        settings: state.settings,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useStore;
