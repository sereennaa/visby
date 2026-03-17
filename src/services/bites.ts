import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Bite } from '../types';

interface BiteRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cuisine: string;
  category: string;
  city: string | null;
  country: string | null;
  restaurant_name: string | null;
  photo_url: string | null;
  rating: number;
  notes: string | null;
  is_made_at_home: boolean;
  recipe: any | null;
  collected_at: string;
  is_public: boolean;
  likes: number;
  tags: string[];
}

function mapRowToBite(row: BiteRow): Bite {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    description: row.description ?? '',
    cuisine: row.cuisine,
    category: (row.category as Bite['category']) ?? 'main_dish',
    city: row.city ?? undefined,
    country: row.country ?? undefined,
    restaurantName: row.restaurant_name ?? undefined,
    photoUrl: row.photo_url ?? '',
    rating: row.rating ?? 3,
    notes: row.notes ?? undefined,
    isMadeAtHome: row.is_made_at_home ?? false,
    recipe: row.recipe ?? undefined,
    collectedAt: new Date(row.collected_at),
    isPublic: row.is_public ?? true,
    likes: row.likes ?? 0,
    tags: row.tags ?? [],
  };
}

function biteToRow(bite: Bite): Omit<BiteRow, 'id'> & { id?: string } {
  return {
    ...(bite.id && !bite.id.startsWith('bite_') ? { id: bite.id } : {}),
    user_id: bite.userId,
    name: bite.name,
    description: bite.description || null,
    cuisine: bite.cuisine,
    category: bite.category,
    city: bite.city || null,
    country: bite.country || null,
    restaurant_name: bite.restaurantName || null,
    photo_url: bite.photoUrl || null,
    rating: bite.rating,
    notes: bite.notes || null,
    is_made_at_home: bite.isMadeAtHome ?? false,
    recipe: bite.recipe || null,
    collected_at: bite.collectedAt instanceof Date ? bite.collectedAt.toISOString() : new Date(bite.collectedAt).toISOString(),
    is_public: bite.isPublic ?? true,
    likes: bite.likes ?? 0,
    tags: bite.tags ?? [],
  };
}

export const bitesService = {
  async getUserBites(userId: string): Promise<Bite[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('bites')
      .select('*')
      .eq('user_id', userId)
      .order('collected_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => mapRowToBite(row as BiteRow));
  },

  async insertBite(bite: Bite): Promise<Bite> {
    if (!isSupabaseConfigured) return bite;

    const row = biteToRow(bite);
    const insertPayload = { ...row };
    if ((insertPayload as any).id?.startsWith('bite_')) delete (insertPayload as any).id;

    const { data, error } = await supabase
      .from('bites')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw error;
    return mapRowToBite(data as BiteRow);
  },
};

export default bitesService;
