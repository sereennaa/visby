/**
 * In-App Purchase service.
 * Wraps expo-in-app-purchases (or RevenueCat when added).
 * Provides Aura packs and membership subscriptions.
 */

import { useStore } from '../store/useStore';
import { analyticsService } from './analytics';

// ─── PRODUCT DEFINITIONS ───

export interface AuraPack {
  id: string;
  name: string;
  auraAmount: number;
  price: string;
  productId: string;
  popular?: boolean;
  bestValue?: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  productId: string;
  perks: string[];
  interval: 'month' | 'year';
}

export const AURA_PACKS: AuraPack[] = [
  { id: 'aura_100', name: 'Starter Pack', auraAmount: 100, price: '$0.99', productId: 'com.visby.aura.100' },
  { id: 'aura_500', name: 'Explorer Pack', auraAmount: 500, price: '$3.99', productId: 'com.visby.aura.500', popular: true },
  { id: 'aura_1200', name: 'Adventurer Pack', auraAmount: 1200, price: '$7.99', productId: 'com.visby.aura.1200' },
  { id: 'aura_3000', name: 'Legend Pack', auraAmount: 3000, price: '$14.99', productId: 'com.visby.aura.3000', bestValue: true },
];

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    id: 'plus_monthly',
    name: 'Visby Plus',
    price: '$4.99/mo',
    productId: 'com.visby.plus.monthly',
    interval: 'month',
    perks: [
      'Exclusive cosmetics each month',
      '2x streak freeze per month',
      'Double daily bonus Aura',
      'Ad-free experience',
    ],
  },
  {
    id: 'plus_yearly',
    name: 'Visby Plus (Annual)',
    price: '$39.99/yr',
    productId: 'com.visby.plus.yearly',
    interval: 'year',
    perks: [
      'Everything in monthly, plus:',
      'Exclusive annual cosmetic set',
      '500 bonus Aura on sign-up',
      'Early access to new countries',
    ],
  },
  {
    id: 'premium_monthly',
    name: 'Visby Premium',
    price: '$9.99/mo',
    productId: 'com.visby.premium.monthly',
    interval: 'month',
    perks: [
      'Everything in Plus, plus:',
      'AI-powered Visby chat',
      'Unlimited streak freezes',
      'Exclusive Premium cosmetics',
      'Priority feature requests',
    ],
  },
];

// ─── PURCHASE SERVICE ───

let initialized = false;

export const purchaseService = {
  async initialize(): Promise<void> {
    if (initialized) return;
    // When RevenueCat or expo-in-app-purchases is added:
    // await Purchases.configure({ apiKey: REVENUE_CAT_KEY });
    initialized = true;
  },

  async purchaseAuraPack(pack: AuraPack): Promise<{ success: boolean; error?: string }> {
    try {
      // When IAP is wired:
      // const result = await Purchases.purchaseProduct(pack.productId);
      // if (!result.success) return { success: false, error: 'Purchase cancelled' };

      // For now, grant Aura directly (demo mode)
      useStore.getState().addAura(pack.auraAmount);
      analyticsService.trackPurchase(pack.id, pack.auraAmount);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Purchase failed' };
    }
  },

  async purchaseMembership(tier: MembershipTier): Promise<{ success: boolean; error?: string }> {
    try {
      // When IAP is wired:
      // const result = await Purchases.purchaseProduct(tier.productId);
      // Store membership status in user profile
      analyticsService.trackPurchase(tier.id, 0);
      return { success: false, error: 'Membership coming soon!' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Purchase failed' };
    }
  },

  async restorePurchases(): Promise<{ success: boolean; restored: string[] }> {
    try {
      // When IAP is wired:
      // const result = await Purchases.restoreTransactions();
      return { success: true, restored: [] };
    } catch {
      return { success: false, restored: [] };
    }
  },

  getAuraPacks(): AuraPack[] {
    return AURA_PACKS;
  },

  getMembershipTiers(): MembershipTier[] {
    return MEMBERSHIP_TIERS;
  },
};
