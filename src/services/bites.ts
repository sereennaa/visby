import { supabase, isSupabaseConfigured } from '../config/supabase';
import { Bite, BiteCategory, Recipe } from '../types';
import { AURA_REWARDS, BITE_CATEGORIES_INFO } from '../config/constants';

export const bitesService = {
  // Get all bites for a user
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

  // Add a new bite
  async addBite(
    userId: string,
    name: string,
    description: string,
    category: BiteCategory,
    cuisine: string,
    photoUrl: string,
    rating: number,
    options?: {
      city?: string;
      country?: string;
      restaurantName?: string;
      isMadeAtHome?: boolean;
      notes?: string;
      recipe?: Recipe;
      tags?: string[];
    }
  ): Promise<Bite> {
    const newBite: Partial<Bite> = {
      id: `bite_${Date.now()}`,
      userId,
      name,
      description,
      cuisine,
      category,
      photoUrl,
      rating,
      city: options?.city,
      country: options?.country,
      restaurantName: options?.restaurantName,
      isMadeAtHome: options?.isMadeAtHome || false,
      notes: options?.notes,
      recipe: options?.recipe,
      collectedAt: new Date(),
      isPublic: true,
      likes: 0,
      tags: options?.tags || [],
    };

    if (!isSupabaseConfigured) return newBite as Bite;

    const { data, error } = await supabase
      .from('bites')
      .insert(newBite)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get aura reward for bite
  getAuraReward(hasRecipe: boolean, isFirstInCuisine: boolean): number {
    let reward = AURA_REWARDS.BITE_UPLOAD;
    if (hasRecipe) reward = AURA_REWARDS.BITE_WITH_RECIPE;
    if (isFirstInCuisine) reward += AURA_REWARDS.BITE_FIRST_IN_CUISINE;
    return reward;
  },

  // Get category info
  getCategoryInfo(category: BiteCategory) {
    return BITE_CATEGORIES_INFO[category] || { label: category, icon: 'food' };
  },

  // Check if cuisine is new for user
  isNewCuisine(bites: Bite[], cuisine: string): boolean {
    return !bites.some((b) => b.cuisine.toLowerCase() === cuisine.toLowerCase());
  },

  // Get unique cuisines
  getUniqueCuisines(bites: Bite[]): string[] {
    return [...new Set(bites.map((b) => b.cuisine))];
  },

  // Count bites by category
  countByCategory(bites: Bite[], category: BiteCategory): number {
    return bites.filter((b) => b.category === category).length;
  },

  // Get average rating
  getAverageRating(bites: Bite[]): number {
    if (bites.length === 0) return 0;
    const total = bites.reduce((sum, b) => sum + b.rating, 0);
    return total / bites.length;
  },

  // Delete a bite
  async deleteBite(biteId: string) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('bites')
      .delete()
      .eq('id', biteId);

    if (error) throw error;
  },

  async updateBite(biteId: string, updates: Partial<Bite>) {
    if (!isSupabaseConfigured) return;
    const { error } = await supabase
      .from('bites')
      .update(updates)
      .eq('id', biteId);

    if (error) throw error;
  },
};

export default bitesService;
