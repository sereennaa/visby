import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Stamp } from '../types';

/** DB row (snake_case) as returned by Supabase */
interface StampRow {
  id: string;
  user_id: string;
  type: string;
  location_id: string;
  location_name: string;
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  collected_at: string;
  photo_url: string | null;
  notes: string | null;
  is_fast_travel: boolean;
  aura_spent: number | null;
  is_public: boolean;
  likes: number;
}

function mapRowToStamp(row: StampRow): Stamp {
  return {
    id: row.id,
    userId: row.user_id,
    type: row.type as Stamp['type'],
    locationId: row.location_id ?? '',
    locationName: row.location_name,
    city: row.city ?? '',
    country: row.country ?? '',
    countryCode: row.country_code ?? '',
    latitude: Number(row.latitude),
    longitude: Number(row.longitude),
    collectedAt: new Date(row.collected_at),
    photoUrl: row.photo_url ?? undefined,
    notes: row.notes ?? undefined,
    isFastTravel: row.is_fast_travel ?? false,
    auraSpent: row.aura_spent ?? undefined,
    isPublic: row.is_public ?? true,
    likes: row.likes ?? 0,
  };
}

function stampToRow(stamp: Stamp): Omit<StampRow, 'id'> & { id?: string } {
  return {
    ...(stamp.id && !stamp.id.startsWith('stamp_') ? { id: stamp.id } : {}),
    user_id: stamp.userId,
    type: stamp.type,
    location_id: stamp.locationId,
    location_name: stamp.locationName,
    city: stamp.city,
    country: stamp.country,
    country_code: stamp.countryCode,
    latitude: stamp.latitude,
    longitude: stamp.longitude,
    collected_at: stamp.collectedAt instanceof Date ? stamp.collectedAt.toISOString() : new Date(stamp.collectedAt).toISOString(),
    photo_url: stamp.photoUrl ?? null,
    notes: stamp.notes ?? null,
    is_fast_travel: stamp.isFastTravel ?? false,
    aura_spent: stamp.auraSpent ?? null,
    is_public: stamp.isPublic ?? true,
    likes: stamp.likes ?? 0,
  };
}

export const stampsService = {
  async getUserStamps(userId: string): Promise<Stamp[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('stamps')
      .select('*')
      .eq('user_id', userId)
      .order('collected_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => mapRowToStamp(row as StampRow));
  },

  async insertStamp(stamp: Stamp): Promise<Stamp> {
    if (!isSupabaseConfigured) {
      // Offline / no backend: return as-is so local state still updates
      return stamp;
    }

    const row = stampToRow(stamp);
    // Don't send client-generated temp ids; let DB generate UUID
    const insertPayload = { ...row };
    if (insertPayload.id?.startsWith('stamp_')) delete (insertPayload as { id?: string }).id;

    const { data, error } = await supabase
      .from('stamps')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return mapRowToStamp(data as StampRow);
  },
};

export default stampsService;
