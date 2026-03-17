/**
 * Social sync service — wires friends, presence, and place chat to Supabase.
 * Falls back gracefully to local-only when Supabase is not configured.
 */

import { supabase, isSupabaseConfigured } from '../config/supabase';
import type { Friend, FriendRequest, PlaceChatMessage, PresencePlace } from '../types';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isRealSupabaseUser(userId: string): boolean {
  return UUID_RE.test(userId);
}

// ─── FRIENDS ───

export async function sendFriendRequestRemote(
  fromUserId: string,
  fromUsername: string,
  fromDisplayName: string,
  toUsername: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(fromUserId)) return { success: false, error: 'Backend not configured' };

  try {
    const { data: targetUser, error: lookupErr } = await supabase
      .from('users')
      .select('id')
      .eq('username', toUsername)
      .single();

    if (lookupErr || !targetUser) return { success: false, error: 'User not found' };

    const { error } = await supabase.from('friend_requests').insert({
      from_user_id: fromUserId,
      from_username: fromUsername,
      from_display_name: fromDisplayName,
      to_user_id: targetUser.id,
      status: 'pending',
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

export async function acceptFriendRequestRemote(requestId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(requestId)) return false;
  try {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);
    return !error;
  } catch {
    return false;
  }
}

export async function rejectFriendRequestRemote(requestId: string): Promise<boolean> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(requestId)) return false;
  try {
    const { error } = await supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
    return !error;
  } catch {
    return false;
  }
}

export async function fetchFriends(userId: string): Promise<Friend[]> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(userId)) return [];
  try {
    const { data, error } = await supabase
      .from('friends')
      .select('*')
      .or(`user_id_a.eq.${userId},user_id_b.eq.${userId}`);

    if (error || !data) return [];

    return data.map((row: any) => {
      const isA = row.user_id_a === userId;
      return {
        userId: isA ? row.user_id_b : row.user_id_a,
        username: isA ? row.username_b : row.username_a,
        displayName: isA ? row.display_name_b : row.display_name_a,
        level: isA ? row.level_b : row.level_a,
        addedAt: new Date(row.created_at),
      };
    });
  } catch {
    return [];
  }
}

export async function fetchPendingRequests(userId: string): Promise<FriendRequest[]> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(userId)) return [];
  try {
    const { data, error } = await supabase
      .from('friend_requests')
      .select('*')
      .eq('to_user_id', userId)
      .eq('status', 'pending');

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      fromUserId: row.from_user_id,
      fromUsername: row.from_username,
      fromDisplayName: row.from_display_name,
      toUserId: row.to_user_id,
      status: row.status,
      createdAt: new Date(row.created_at),
    }));
  } catch {
    return [];
  }
}

// ─── PRESENCE ───

export async function upsertPresence(
  userId: string,
  username: string,
  place: PresencePlace,
): Promise<void> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(userId)) return;
  try {
    await supabase.from('presence').upsert({
      user_id: userId,
      username,
      place_type: place.type,
      country_id: place.countryId || null,
      room_id: place.roomId || null,
      pin_id: place.pinId || null,
      label: place.label || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch {
    // silently fail
  }
}

export async function fetchPresenceInRoom(
  countryId: string,
  roomId: string,
  excludeUserId: string,
): Promise<Array<{ userId: string; username: string }>> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(excludeUserId)) return [];
  try {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data, error } = await supabase
      .from('presence')
      .select('user_id, username')
      .eq('country_id', countryId)
      .eq('room_id', roomId)
      .neq('user_id', excludeUserId)
      .gte('updated_at', fiveMinAgo);

    if (error || !data) return [];
    return data.map((r: any) => ({ userId: r.user_id, username: r.username }));
  } catch {
    return [];
  }
}

export async function clearPresence(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(userId)) return;
  try {
    await supabase.from('presence').delete().eq('user_id', userId);
  } catch {
    // silently fail
  }
}

// ─── PLACE CHAT ───

export async function sendPlaceChatMessageRemote(
  channelKey: string,
  userId: string,
  username: string,
  message: string,
): Promise<PlaceChatMessage | null> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(userId)) return null;
  try {
    const { data, error } = await supabase
      .from('place_chat_messages')
      .insert({
        channel_key: channelKey,
        user_id: userId,
        username,
        message,
      })
      .select()
      .single();

    if (error || !data) return null;
    return {
      id: data.id,
      userId: data.user_id,
      username: data.username,
      message: data.message,
      createdAt: new Date(data.created_at),
    };
  } catch {
    return null;
  }
}

export async function fetchPlaceChatMessages(
  channelKey: string,
  limit: number = 30,
): Promise<PlaceChatMessage[]> {
  if (!isSupabaseConfigured) return [];
  try {
    const { data, error } = await supabase
      .from('place_chat_messages')
      .select('*')
      .eq('channel_key', channelKey)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.reverse().map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      username: row.username,
      message: row.message,
      createdAt: new Date(row.created_at),
    }));
  } catch {
    return [];
  }
}

/** Fetch a user's house data (room customizations + Visby appearance) for visiting */
export async function fetchUserHouse(
  userId: string,
): Promise<{ roomCustomizations: Record<string, any>; visbyAppearance: any } | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data: houseData, error: houseErr } = await supabase
      .from('user_houses')
      .select('room_customizations')
      .eq('user_id', userId)
      .single();

    const { data: profileData, error: profileErr } = await supabase
      .from('users')
      .select('visby_appearance')
      .eq('id', userId)
      .single();

    if ((houseErr && profileErr) || (!houseData && !profileData)) return null;

    return {
      roomCustomizations: houseData?.room_customizations ?? {},
      visbyAppearance: profileData?.visby_appearance ?? null,
    };
  } catch {
    return null;
  }
}

/** Fetch a friend's Visby appearance for display */
export async function fetchFriendVisbyAppearance(
  userId: string,
): Promise<any | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('visby_appearance, visby_equipped')
      .eq('id', userId)
      .single();

    if (error || !data) return null;
    return {
      appearance: data.visby_appearance ?? null,
      equipped: data.visby_equipped ?? null,
    };
  } catch {
    return null;
  }
}

/** Report a chat message for moderation review */
export async function reportMessageRemote(
  reporterId: string,
  messageId: string,
  reason: string,
): Promise<boolean> {
  if (!isSupabaseConfigured || !isRealSupabaseUser(reporterId)) return false;
  try {
    const { error } = await supabase.from('reports').insert({
      reporter_id: reporterId,
      message_id: messageId,
      reason,
      created_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
}

/** Subscribe to real-time place chat messages using Supabase Realtime */
export function subscribePlaceChat(
  channelKey: string,
  onMessage: (msg: PlaceChatMessage) => void,
): { unsubscribe: () => void } {
  if (!isSupabaseConfigured) return { unsubscribe: () => {} };

  const channel = supabase
    .channel(`place_chat:${channelKey}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'place_chat_messages',
        filter: `channel_key=eq.${channelKey}`,
      },
      (payload: any) => {
        const row = payload.new;
        onMessage({
          id: row.id,
          userId: row.user_id,
          username: row.username,
          message: row.message,
          createdAt: new Date(row.created_at),
        });
      },
    )
    .subscribe();

  return {
    unsubscribe: () => {
      supabase.removeChannel(channel);
    },
  };
}
