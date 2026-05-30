import { supabase } from './supabaseClient';
import { isSupabaseConfigured } from '../config/supabase';
import { TIRTHANKARS, Tirthankar } from '../data/tirthankars';
import { TIRTHS, Tirth } from '../data/tirths';
import { REELS_DATA, ReelData } from '../data/reels';
import { CHANTS_DATA, Chant } from '../data/chants';
import { WISDOM_DATA, WisdomQuote } from '../data/wisdom';

// ── Snake-Case Mapping Helpers ──

const mapDbTirthankarToFrontend = (db: any): Tirthankar => ({
  id: db.id,
  name: db.name,
  nameGujarati: db.name_gujarati,
  symbol: db.symbol,
  symbolEmoji: db.symbol_emoji,
  color: db.color,
  colorHex: db.color_hex,
  height: db.height,
  lifespan: db.lifespan,
  yaksha: db.yaksha,
  yakshini: db.yakshini,
  birthPlace: db.birth_place,
  nirvanaPlace: db.nirvana_place,
  dikshaPlace: db.diksha_place,
  kevalgyanPlace: db.kevalgyan_place,
  teachings: db.teachings || [],
  significance: db.significance,
  famousTirths: db.famous_tirths || [],
  panchKalyanak: {
    garbha: db.panch_kalyanak?.garbha || '',
    janma: db.panch_kalyanak?.janma || '',
    diksha: db.panch_kalyanak?.diksha || '',
    kevalgyan: db.panch_kalyanak?.kevalgyan || '',
    nirvana: db.panch_kalyanak?.nirvana || '',
  },
});

const mapDbTirthToFrontend = (db: any): Tirth => ({
  id: db.id,
  name: db.name,
  tirthankarId: db.tirthankar_id,
  location: db.location,
  nearestCity: db.nearest_city,
  state: db.state,
  history: db.history,
  mahima: db.mahima,
  howToReach: {
    road: db.how_to_reach?.road || '',
    rail: db.how_to_reach?.rail || '',
    air: db.how_to_reach?.air || '',
  },
  bestTimeToVisit: db.best_time_to_visit,
  hasVRDarshan: db.has_vr_darshan,
  vrDarshanUrl: db.vr_darshan_url || undefined,
  gallery: db.gallery || [],
});

const mapDbReelToFrontend = (db: any): ReelData => ({
  id: db.id,
  uri: db.video_url,
  user: db.user_name,
  avatar: db.avatar_url,
  description: db.description,
  likes: db.likes || '0',
  comments: db.comments || '0',
  shares: db.shares || '0',
  music: db.music || 'Original Audio',
});

const mapDbChantToFrontend = (db: any): Chant => ({
  id: db.id,
  title: db.title,
  subtitle: db.subtitle,
  lyrics: db.lyrics,
  translation: db.translation || [],
  audioUrl: db.audio_url || '',
  durationSec: db.duration_sec || 30,
  significance: db.significance || '',
  category: db.category || 'Mantra',
  accentColor: db.accent_color || '#C8960C',
});

const mapDbWisdomToFrontend = (db: any): WisdomQuote => ({
  id: db.id,
  text: db.text,
  author: db.author,
  source: db.source || '',
  explanation: db.explanation || '',
  themeColor: db.theme_color || '#C8960C',
});

// ── Unified Database Service ──

export const dbService = {
  /**
   * Fetch all Tirthankars.
   * If Supabase is not configured or fails, it falls back to local TIRTHANKARS.
   */
  async getTirthankars(): Promise<Tirthankar[]> {
    if (!isSupabaseConfigured()) {
      console.log('[dbService] Supabase not configured. Using local Tirthankars.');
      return TIRTHANKARS;
    }

    try {
      const { data, error } = await supabase
        .from('tirthankars')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDbTirthankarToFrontend);
      }

      console.warn('[dbService] No data found in tirthankars table. Falling back to local data.');
      return TIRTHANKARS;
    } catch (err) {
      console.error('[dbService] Error fetching Tirthankars from Supabase:', err);
      return TIRTHANKARS;
    }
  },

  /**
   * Fetch a single Tirthankar by ID.
   */
  async getTirthankarById(id: number): Promise<Tirthankar | null> {
    if (!isSupabaseConfigured()) {
      const local = TIRTHANKARS.find(x => x.id === id);
      return local || null;
    }

    try {
      const { data, error } = await supabase
        .from('tirthankars')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data ? mapDbTirthankarToFrontend(data) : null;
    } catch (err) {
      console.error(`[dbService] Error fetching Tirthankar #${id} from Supabase:`, err);
      // Fallback
      const local = TIRTHANKARS.find(x => x.id === id);
      return local || null;
    }
  },

  /**
   * Fetch all Tirths.
   * If Supabase is not configured or fails, it falls back to local TIRTHS.
   */
  async getTirths(): Promise<Tirth[]> {
    if (!isSupabaseConfigured()) {
      console.log('[dbService] Supabase not configured. Using local Tirths.');
      return TIRTHS;
    }

    try {
      const { data, error } = await supabase
        .from('tirths')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDbTirthToFrontend);
      }

      console.warn('[dbService] No data found in tirths table. Falling back to local data.');
      return TIRTHS;
    } catch (err) {
      console.error('[dbService] Error fetching Tirths from Supabase:', err);
      return TIRTHS;
    }
  },

  /**
   * Fetch a single Tirth by ID.
   */
  async getTirthById(id: string): Promise<Tirth | null> {
    if (!isSupabaseConfigured()) {
      const local = TIRTHS.find(x => x.id === id || x.name.toLowerCase() === id.toLowerCase());
      return local || null;
    }

    try {
      // Try fetching matching ID first
      const { data, error } = await supabase
        .from('tirths')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        return mapDbTirthToFrontend(data);
      }

      // If not found by ID, try matching case-insensitive name
      const { data: nameData, error: nameError } = await supabase
        .from('tirths')
        .select('*')
        .ilike('name', id)
        .maybeSingle();

      if (nameError) {
        throw nameError;
      }

      return nameData ? mapDbTirthToFrontend(nameData) : null;
    } catch (err) {
      console.error(`[dbService] Error fetching Tirth ${id} from Supabase:`, err);
      // Fallback
      const local = TIRTHS.find(x => x.id === id || x.name.toLowerCase() === id.toLowerCase());
      return local || null;
    }
  },

  /**
   * Fetch all Reels.
   * If Supabase is not configured or fails, it falls back to local REELS_DATA.
   */
  async getReels(): Promise<ReelData[]> {
    if (!isSupabaseConfigured()) {
      console.log('[dbService] Supabase not configured. Using local Reels.');
      return REELS_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('reels')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDbReelToFrontend);
      }

      console.warn('[dbService] No data found in reels table. Falling back to local data.');
      return REELS_DATA;
    } catch (err) {
      console.error('[dbService] Error fetching Reels from Supabase:', err);
      return REELS_DATA;
    }
  },

  /**
   * Update dynamic stats on a reel (likes, comments, or shares).
   */
  async updateReelLikes(id: string, count: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase
        .from('reels')
        .update({ likes: count })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(`[dbService] Error updating likes for reel ${id}:`, err);
    }
  },

  async updateReelCommentsCount(id: string, count: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase
        .from('reels')
        .update({ comments: count })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(`[dbService] Error updating comments count for reel ${id}:`, err);
    }
  },

  async updateReelSharesCount(id: string, count: string): Promise<void> {
    if (!isSupabaseConfigured()) return;
    try {
      const { error } = await supabase
        .from('reels')
        .update({ shares: count })
        .eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error(`[dbService] Error updating shares count for reel ${id}:`, err);
    }
  },

  /**
   * Fetch comments for a reel.
   */
  async getReelComments(reelId: string): Promise<any[]> {
    if (!isSupabaseConfigured()) {
      return [];
    }
    try {
      const { data, error } = await supabase
        .from('reel_comments')
        .select('*')
        .eq('reel_id', reelId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error(`[dbService] Error fetching comments for reel ${reelId}:`, err);
      return [];
    }
  },

  /**
   * Add a new comment to a reel.
   */
  async addReelComment(reelId: string, userName: string, avatarUrl: string, commentText: string): Promise<any> {
    if (!isSupabaseConfigured()) {
      return {
        id: Math.random().toString(),
        reel_id: reelId,
        user_name: userName,
        avatar_url: avatarUrl,
        comment_text: commentText,
        created_at: new Date().toISOString()
      };
    }
    try {
      const { data, error } = await supabase
        .from('reel_comments')
        .insert({
          reel_id: reelId,
          user_name: userName,
          avatar_url: avatarUrl,
          comment_text: commentText
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error(`[dbService] Error adding comment to reel ${reelId}:`, err);
      throw err;
    }
  },

  /**
   * Fetch all Spiritual Chants & Shlokas.
   * If Supabase is not configured or fails, it falls back to local CHANTS_DATA.
   */
  async getChants(): Promise<Chant[]> {
    if (!isSupabaseConfigured()) {
      console.log('[dbService] Supabase not configured. Using local Chants.');
      return CHANTS_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('chants')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDbChantToFrontend);
      }

      console.warn('[dbService] No data found in chants table. Falling back to local data.');
      return CHANTS_DATA;
    } catch (err) {
      console.error('[dbService] Error fetching Chants from Supabase:', err);
      return CHANTS_DATA;
    }
  },

  /**
   * Fetch all Daily Wisdom Quotes.
   * If Supabase is not configured or fails, it falls back to local WISDOM_DATA.
   */
  async getWisdom(): Promise<WisdomQuote[]> {
    if (!isSupabaseConfigured()) {
      console.log('[dbService] Supabase not configured. Using local Wisdom.');
      return WISDOM_DATA;
    }

    try {
      const { data, error } = await supabase
        .from('wisdom')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        return data.map(mapDbWisdomToFrontend);
      }

      console.warn('[dbService] No data found in wisdom table. Falling back to local data.');
      return WISDOM_DATA;
    } catch (err) {
      console.error('[dbService] Error fetching Wisdom from Supabase:', err);
      return WISDOM_DATA;
    }
  }
};
