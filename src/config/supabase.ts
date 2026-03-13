// Supabase Configuration
// FREE TIER: 500MB database, 1GB storage, unlimited API calls
// Create your project at: https://supabase.com

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get these from your Supabase project dashboard:
// Settings > API > Project URL and anon/public key
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is properly configured
export const isSupabaseConfigured = 
  SUPABASE_URL.length > 0 && 
  SUPABASE_ANON_KEY.length > 0 && 
  !SUPABASE_URL.includes('your-project');

// Create client only if configured, otherwise create a dummy that won't make requests
export const supabase: SupabaseClient = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });

export default supabase;
