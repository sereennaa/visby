import { supabase, isSupabaseConfigured } from '../config/supabase';
import { User, Visby, VisbyAppearance } from '../types';
import { colors } from '../theme/colors';

const DEFAULT_VISBY_APPEARANCE: VisbyAppearance = {
  skinTone: '#FFBA6B',
  hairColor: '#A67B5B',
  hairStyle: 'default',
  eyeColor: '#3A2010',
  eyeShape: 'round',
};

// In-memory store for demo mode
let demoUsers: Map<string, { user: User; password: string; visby: Visby }> = new Map();

function createDemoUser(email: string, password: string, username: string): { user: User; visby: Visby } {
  const id = `demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const visbyId = `visby_${id}`;

  const user: User = {
    id,
    email,
    username,
    displayName: username,
    visbyId,
    createdAt: new Date(),
    lastActive: new Date(),
    level: 1,
    aura: 200,
    totalAuraEarned: 200,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: new Date(),
    stampsCollected: 0,
    bitesCollected: 0,
    badgesEarned: 0,
    countriesVisited: 0,
    citiesVisited: 0,
    settings: {
      notifications: true,
      locationTracking: true,
      privateProfile: false,
      language: 'en',
      measurementUnit: 'metric',
    },
  };

  const visby: Visby = {
    id: visbyId,
    userId: id,
    name: `${username}'s Visby`,
    createdAt: new Date(),
    appearance: DEFAULT_VISBY_APPEARANCE,
    equipped: { hat: 'viking_helmet' },
    ownedCosmetics: ['default_tunic', 'default_boots', 'default_backpack', 'viking_helmet'],
    currentMood: 'happy',
  };

  demoUsers.set(email.toLowerCase(), { user, password, visby });
  return { user, visby };
}

export const authService = {
  async signUp(email: string, password: string, username: string) {
    if (!isSupabaseConfigured) {
      // Demo mode: create user in memory
      const existing = demoUsers.get(email.toLowerCase());
      if (existing) {
        throw new Error('An account with this email already exists.');
      }
      await new Promise((r) => setTimeout(r, 500));
      return createDemoUser(email, password, username);
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    const newUser: Partial<User> = {
      id: authData.user.id,
      email,
      username,
      displayName: username,
      createdAt: new Date(),
      lastActive: new Date(),
      level: 1,
      aura: 200,
      totalAuraEarned: 200,
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: new Date(),
      stampsCollected: 0,
      bitesCollected: 0,
      badgesEarned: 0,
      countriesVisited: 0,
      citiesVisited: 0,
      settings: {
        notifications: true,
        locationTracking: true,
        privateProfile: false,
        language: 'en',
        measurementUnit: 'metric',
      },
    };

    const { error: profileError } = await supabase
      .from('users')
      .insert(newUser);

    if (profileError) throw profileError;

    const newVisby: Partial<Visby> = {
      id: `visby_${authData.user.id}`,
      userId: authData.user.id,
      name: `${username}'s Visby`,
      createdAt: new Date(),
      appearance: DEFAULT_VISBY_APPEARANCE,
      equipped: {},
      ownedCosmetics: ['default_tunic', 'default_boots', 'default_backpack'],
      currentMood: 'happy',
    };

    const { error: visbyError } = await supabase
      .from('visbies')
      .insert(newVisby);

    if (visbyError) throw visbyError;

    return { user: newUser as User, visby: newVisby as Visby };
  },

  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      // Demo mode: look up in-memory user
      const entry = demoUsers.get(email.toLowerCase());
      if (!entry || entry.password !== password) {
        throw new Error('Invalid email or password.');
      }
      await new Promise((r) => setTimeout(r, 500));
      return { user: entry.user, session: { user: entry.user } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  async getUserProfile(userId: string): Promise<User | null> {
    if (!isSupabaseConfigured) {
      for (const entry of demoUsers.values()) {
        if (entry.user.id === userId) return entry.user;
      }
      return null;
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (__DEV__) console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  },

  async getVisby(userId: string): Promise<Visby | null> {
    if (!isSupabaseConfigured) {
      for (const entry of demoUsers.values()) {
        if (entry.user.id === userId) return entry.visby;
      }
      return null;
    }

    const { data, error } = await supabase
      .from('visbies')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      if (__DEV__) console.error('Error fetching visby:', error);
      return null;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<User>) {
    if (!isSupabaseConfigured) {
      for (const entry of demoUsers.values()) {
        if (entry.user.id === userId) {
          Object.assign(entry.user, updates, { lastActive: new Date() });
          return;
        }
      }
      return;
    }

    const { error } = await supabase
      .from('users')
      .update({ ...updates, lastActive: new Date() })
      .eq('id', userId);

    if (error) throw error;
  },

  async updateVisby(visbyId: string, updates: Partial<Visby>) {
    if (!isSupabaseConfigured) {
      for (const entry of demoUsers.values()) {
        if (entry.visby.id === visbyId) {
          Object.assign(entry.visby, updates);
          return;
        }
      }
      return;
    }

    const { error } = await supabase
      .from('visbies')
      .update(updates)
      .eq('id', visbyId);

    if (error) throw error;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  async resetPassword(email: string) {
    if (!isSupabaseConfigured) {
      await new Promise((r) => setTimeout(r, 500));
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};

export default authService;
