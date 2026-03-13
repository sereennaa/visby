// Authentication Service using Supabase
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { User, Visby, VisbyAppearance } from '../types';
import { colors } from '../theme/colors';

// Default Visby appearance for new users
const DEFAULT_VISBY_APPEARANCE: VisbyAppearance = {
  skinTone: colors.visby.skin.light,
  hairColor: colors.visby.hair.brown,
  hairStyle: 'default',
  eyeColor: '#4A90D9',
  eyeShape: 'round',
};

export const authService = {
  // Sign up with email
  async signUp(email: string, password: string, username: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned');

    // Create user profile
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

    // Create default Visby avatar
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

  // Sign in with email
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase not configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY environment variables.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut() {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession() {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  },

  // Get user's Visby
  async getVisby(userId: string): Promise<Visby | null> {
    const { data, error } = await supabase
      .from('visbies')
      .select('*')
      .eq('userId', userId)
      .single();

    if (error) {
      console.error('Error fetching visby:', error);
      return null;
    }
    return data;
  },

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update({ ...updates, lastActive: new Date() })
      .eq('id', userId);

    if (error) throw error;
  },

  // Update Visby
  async updateVisby(visbyId: string, updates: Partial<Visby>) {
    const { error } = await supabase
      .from('visbies')
      .update(updates)
      .eq('id', visbyId);

    if (error) throw error;
  },

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Password reset
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};

export default authService;
