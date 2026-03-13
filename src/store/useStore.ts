// Zustand Store - Global State Management
import { create } from 'zustand';
import { User, Visby, Stamp, Bite, UserBadge, LocationData, UserLessonProgress, UserHouse } from '../types';
import { LEVEL_THRESHOLDS } from '../config/constants';

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
  
  // Actions - Auth
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  
  // Actions - Visby
  setVisby: (visby: Visby | null) => void;
  updateVisbyAppearance: (appearance: Partial<Visby['appearance']>) => void;
  equipCosmetic: (slot: keyof Visby['equipped'], cosmeticId: string | undefined) => void;
  
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
  
  // Actions - Location
  setLocation: (location: LocationData | null) => void;
}

export const useStore = create<AppStore>((set, get) => ({
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
  
  // Collection Actions
  setStamps: (stamps) => set({ stamps }),
  addStamp: (stamp) => set((state) => ({ stamps: [...state.stamps, stamp] })),
  setBites: (bites) => set({ bites }),
  addBite: (bite) => set((state) => ({ bites: [...state.bites, bite] })),
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

      let newStreak: number;
      if (diffDays === 1) {
        newStreak = user.currentStreak + 1;
      } else {
        newStreak = 1;
      }

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
  
  // Location Actions
  setLocation: (currentLocation) => set({ currentLocation }),

  // Houses Actions
  setUserHouses: (userHouses) => set({ userHouses }),
  addUserHouse: (house) => set((state) => ({ userHouses: [...state.userHouses, house] })),
}));

export default useStore;
