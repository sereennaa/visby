// Zustand Store - Global State Management
import { create } from 'zustand';
import { User, Visby, Stamp, Bite, UserBadge, LocationData, UserLessonProgress } from '../types';

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
  incrementStreak: () => void;
  
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
      set({
        user: {
          ...user,
          aura: user.aura + amount,
          totalAuraEarned: user.totalAuraEarned + amount,
        },
      });
    }
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
}));

export default useStore;
