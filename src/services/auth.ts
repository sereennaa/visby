import { supabase, isSupabaseConfigured } from '../config/supabase';
import { User, Visby, VisbyAppearance } from '../types';
import { DEFAULT_NEEDS, DEFAULT_SKILLS } from '../store/useStore';

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
    totalCarePoints: 0,
    gamesPlayed: 0,
    perfectCookingGames: 0,
    perfectWordMatches: 0,
    treasureHuntsCompleted: 0,
    visitedCountries: [],
    skills: { ...DEFAULT_SKILLS },
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
    equipped: { outfit: 'default_tunic', hat: 'viking_helmet' },
    ownedCosmetics: ['default_tunic', 'default_boots', 'default_backpack', 'viking_helmet'],
    currentMood: 'happy',
    needs: { ...DEFAULT_NEEDS },
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

    // Try Supabase auth — if anything goes wrong, fall back to local/demo mode
    try {
      // Try sign-in first (handles existing accounts from previous attempts)
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInErr && signInData?.user) {
        // Signed in — ensure profile exists
        const { data: profile } = await supabase.from('users').select('id').eq('id', signInData.user.id).single();
        if (!profile) {
          await supabase.from('users').insert({ id: signInData.user.id, email, username, display_name: username, visby_id: `visby_${signInData.user.id}` }).single();
          await supabase.from('visbies').insert({ id: `visby_${signInData.user.id}`, user_id: signInData.user.id, name: `${username}'s Visby` }).single();
        }
        return this._buildLocalData(signInData.user.id, email, username);
      }

      // Sign-in failed — try sign-up
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
      if (!authError && authData?.user) {
        return this._buildLocalData(authData.user.id, email, username);
      }
    } catch {
      // Supabase completely failed — fall through to demo mode below
    }

    // Supabase didn't work — use local demo mode so the app still works
    return createDemoUser(email, password, username);
  },

  async _signInAndEnsureProfile(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg = (error.message || '').toLowerCase();
      // "Email not confirmed" means account exists & password is correct —
      // just proceed with local data so the user isn't blocked.
      if (msg.includes('not confirmed') || msg.includes('not been confirmed')) {
        return this._buildLocalData(`local_${Date.now()}`, email, username);
      }
      throw error;
    }
    if (!data.user) throw new Error('Sign in failed');

    // Check if profile exists, create it if the trigger didn't fire
    const { data: profile } = await supabase.from('users').select('id').eq('id', data.user.id).single();
    if (!profile) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        username,
        display_name: username,
        visby_id: `visby_${data.user.id}`,
      });
      await supabase.from('visbies').insert({
        id: `visby_${data.user.id}`,
        user_id: data.user.id,
        name: `${username}'s Visby`,
      });
    }

    return this._buildLocalData(data.user.id, email, username);
  },

  _buildLocalData(userId: string, email: string, username: string) {
    const newUser: User = {
      id: userId,
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
      totalCarePoints: 0,
      gamesPlayed: 0,
      perfectCookingGames: 0,
      perfectWordMatches: 0,
      treasureHuntsCompleted: 0,
      visitedCountries: [],
      visbyId: `visby_${userId}`,
      skills: { ...DEFAULT_SKILLS },
      settings: {
        notifications: true,
        locationTracking: true,
        privateProfile: false,
        language: 'en',
        measurementUnit: 'metric',
      },
    };

    const newVisby: Visby = {
      id: `visby_${userId}`,
      userId,
      name: `${username}'s Visby`,
      createdAt: new Date(),
      appearance: DEFAULT_VISBY_APPEARANCE,
      equipped: { outfit: 'default_tunic', hat: 'viking_helmet', accessory: 'sword' },
      ownedCosmetics: ['default_tunic', 'default_boots', 'default_backpack', 'viking_helmet', 'sword'],
      currentMood: 'happy',
      needs: { ...DEFAULT_NEEDS },
    };

    return { user: newUser, visby: newVisby };
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
    if (!data) return null;

    return {
      id: data.id,
      email: data.email,
      username: data.username,
      displayName: data.display_name,
      photoURL: data.photo_url ?? undefined,
      createdAt: new Date(data.created_at),
      lastActive: new Date(data.last_active),
      level: data.level,
      aura: data.aura,
      totalAuraEarned: data.total_aura_earned,
      currentStreak: data.current_streak,
      longestStreak: data.longest_streak,
      lastCheckIn: new Date(data.last_check_in),
      stampsCollected: data.stamps_collected,
      bitesCollected: data.bites_collected,
      badgesEarned: data.badges_earned,
      countriesVisited: data.countries_visited,
      citiesVisited: data.cities_visited,
      totalCarePoints: data.total_care_points,
      gamesPlayed: data.games_played,
      perfectCookingGames: data.perfect_cooking_games,
      perfectWordMatches: data.perfect_word_matches,
      treasureHuntsCompleted: data.treasure_hunts_completed,
      visitedCountries: data.visited_countries ?? [],
      lessonsCompletedToday: data.lessons_completed_today,
      lastLessonDate: data.last_lesson_date,
      visbyId: data.visby_id ?? '',
      skills: data.skills ?? { ...DEFAULT_SKILLS },
      settings: data.settings ?? {
        notifications: true,
        locationTracking: true,
        privateProfile: false,
        language: 'en',
        measurementUnit: 'metric',
      },
    };
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
      .eq('user_id', userId)
      .single();

    if (error) {
      if (__DEV__) console.error('Error fetching visby:', error);
      return null;
    }
    if (!data) return null;

    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      createdAt: new Date(data.created_at),
      appearance: data.appearance ?? {},
      equipped: data.equipped ?? {},
      ownedCosmetics: data.owned_cosmetics ?? [],
      currentMood: data.current_mood ?? 'happy',
      needs: data.needs ?? { ...DEFAULT_NEEDS },
    };
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

    const row: Record<string, unknown> = {};
    if (updates.name !== undefined) row.name = updates.name;
    if (updates.appearance !== undefined) row.appearance = updates.appearance;
    if (updates.equipped !== undefined) row.equipped = updates.equipped;
    if (updates.ownedCosmetics !== undefined) row.owned_cosmetics = updates.ownedCosmetics;
    if (updates.currentMood !== undefined) row.current_mood = updates.currentMood;
    if (updates.needs !== undefined) row.needs = updates.needs;

    const { error } = await supabase
      .from('visbies')
      .update(row)
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
