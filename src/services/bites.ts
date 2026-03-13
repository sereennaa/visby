import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Bite } from '../types';

export const bitesService = {
  async getUserBites(userId: string): Promise<Bite[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('bites')
      .select('*')
      .eq('userId', userId)
      .order('collectedAt', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

export default bitesService;
