
import { createSupabaseServerClient } from './supabase/server';

// Note: We are using the server client here because these functions are intended
// to be used in Server Components and Route Handlers. For client-side data
// fetching, you would typically use the browser client.

const supabase = createSupabaseServerClient();

// ==========================================
// WATCHLIST OPERATIONS
// ==========================================

export async function getWatchlist(userId: string) {
    const { data, error } = await supabase
        .from('watchlists')
        .select('*')
        .eq('user_id', userId)
        .order('added_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function addToWatchlist(userId: string, item: { tmdb_id: string; media_type: 'movie' | 'tv'; title: string; poster_path?: string }) {
    const { data, error } = await supabase
        .from('watchlists')
        .insert([{ ...item, user_id: userId }])
        .select();

    if (error) throw new Error(error.message);
    return data;
}

export async function removeFromWatchlist(userId: string, tmdbId: string) {
    const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', userId)
        .eq('tmdb_id', tmdbId);

    if (error) throw new Error(error.message);
    return { success: true };
}

// ==========================================
// CONTINUE WATCHING OPERATIONS
// ==========================================

export async function getContinueWatching(userId: string) {
    const { data, error } = await supabase
        .from('continue_watching')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
}

export async function updatePlaybackProgress(userId: string, progress: { tmdb_id: string; media_type: 'movie' | 'tv'; title: string; poster_path?: string; progress_seconds: number; duration_seconds: number; season_number?: number; episode_number?: number, episode_title?: string; }) {
    // The 'upsert' operation will create a new record if one doesn't exist, 
    // or update it if it does.
    const { data, error } = await supabase
        .from('continue_watching')
        .upsert({ ...progress, user_id: userId }, { onConflict: 'user_id,tmdb_id,media_type' })
        .select();

    if (error) throw new Error(error.message);
    return data;
}

// ==========================================
// PROFILE OPERATIONS
// ==========================================

export async function getProfile(userId: string) {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // .single() expects only one row and will error otherwise

    if (error) throw new Error(error.message);
    return data;
}

export async function updateProfile(userId: string, profileData: { username?: string; avatar_url?: string; }) {
    const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select();
        
    if (error) throw new Error(error.message);
    return data;
}
