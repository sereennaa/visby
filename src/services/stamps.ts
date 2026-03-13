import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Stamp } from '../types';

export const stampsService = {
  async getUserStamps(userId: string): Promise<Stamp[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .eq('userId', userId)
      .order('collectedAt', { ascending: false });

    if (error) throw error;
    return data || [];
  },
};

export default stampsService;
