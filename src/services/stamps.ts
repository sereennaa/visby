import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Stamp, StampType, LocationData } from '../types';
import { AURA_REWARDS, STAMP_TYPES_INFO } from '../config/constants';

export const stampsService = {
  // Get all stamps for a user
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

  // Collect a new stamp (physical presence)
  async collectStamp(
    userId: string,
    locationName: string,
    type: StampType,
    location: LocationData,
    photoUrl?: string,
    notes?: string
  ): Promise<Stamp> {
    const newStamp: Stamp = {
      id: `stamp_${Date.now()}`,
      userId,
      type,
      locationId: `loc_${Date.now()}`,
      locationName,
      city: location.city || 'Unknown City',
      country: location.country || 'Unknown Country',
      countryCode: location.countryCode || 'XX',
      latitude: location.latitude,
      longitude: location.longitude,
      collectedAt: new Date(),
      photoUrl,
      notes,
      isFastTravel: false,
      isPublic: true,
      likes: 0,
    } as Stamp;

    if (!isSupabaseConfigured) return newStamp;

    const { data, error } = await supabase
      .from('stamps')
      .insert(newStamp)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Fast travel to a location (spend Aura, no physical stamp)
  async fastTravel(
    userId: string,
    locationName: string,
    type: StampType,
    latitude: number,
    longitude: number,
    city: string,
    country: string,
    auraCost: number
  ): Promise<Stamp> {
    const newStamp: Stamp = {
      id: `stamp_${Date.now()}`,
      userId,
      type,
      locationId: `loc_${Date.now()}`,
      locationName,
      city,
      country,
      countryCode: 'XX',
      latitude,
      longitude,
      collectedAt: new Date(),
      isFastTravel: true,
      auraSpent: auraCost,
      isPublic: false,
      likes: 0,
    } as Stamp;

    if (!isSupabaseConfigured) return newStamp;

    const { data, error } = await supabase
      .from('stamps')
      .insert(newStamp)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get aura reward for stamp type
  getAuraReward(type: StampType): number {
    const rewards: Record<StampType, number> = {
      city: AURA_REWARDS.STAMP_CITY,
      country: AURA_REWARDS.STAMP_COUNTRY,
      landmark: AURA_REWARDS.STAMP_LANDMARK,
      park: AURA_REWARDS.STAMP_PARK,
      beach: AURA_REWARDS.STAMP_BEACH,
      mountain: AURA_REWARDS.STAMP_MOUNTAIN,
      museum: AURA_REWARDS.STAMP_MUSEUM,
      restaurant: AURA_REWARDS.STAMP_RESTAURANT,
      cafe: AURA_REWARDS.STAMP_CAFE,
      market: AURA_REWARDS.STAMP_MARKET,
      temple: AURA_REWARDS.STAMP_LANDMARK,
      castle: AURA_REWARDS.STAMP_LANDMARK,
      monument: AURA_REWARDS.STAMP_LANDMARK,
      nature: AURA_REWARDS.STAMP_PARK,
      hidden_gem: AURA_REWARDS.STAMP_HIDDEN_GEM,
    };
    return rewards[type] || 25;
  },

  // Get stamp type info
  getTypeInfo(type: StampType) {
    return STAMP_TYPES_INFO[type] || { label: type, icon: 'stamp', color: '#9B89D0' };
  },

  // Count stamps by type
  countByType(stamps: Stamp[], type: StampType): number {
    return stamps.filter((s) => s.type === type).length;
  },

  // Get unique countries
  getUniqueCountries(stamps: Stamp[]): string[] {
    return [...new Set(stamps.map((s) => s.country))];
  },

  // Get unique cities
  getUniqueCities(stamps: Stamp[]): string[] {
    return [...new Set(stamps.map((s) => s.city))];
  },

  // Delete a stamp
  async deleteStamp(stampId: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('stamps')
      .delete()
      .eq('id', stampId);

    if (error) throw error;
  },

  async updateStamp(stampId: string, updates: Partial<Stamp>) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('stamps')
      .update(updates)
      .eq('id', stampId);

    if (error) throw error;
  },
};

export default stampsService;
