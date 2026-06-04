/**
 * Supabase Connection Configuration
 * 
 * Replace the placeholder values with your actual Supabase Project credentials.
 * If these values are left empty or set to placeholder text, the application
 * will gracefully fall back to local mock data to prevent crashes.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';

export const SUPABASE_CONFIG = {
  // Your Supabase Project URL (e.g., 'https://xyzcompany.supabase.co')
  URL: SUPABASE_URL,

  // Your Supabase Anonymous API Key (Anon Key)
  ANON_KEY: SUPABASE_ANON_KEY,
};

export const isSupabaseConfigured = (): boolean => {
  const url = SUPABASE_CONFIG.URL?.trim();
  const key = SUPABASE_CONFIG.ANON_KEY?.trim();

  return (
    !!url &&
    !!key &&
    url !== 'YOUR_SUPABASE_URL' &&
    key !== 'YOUR_SUPABASE_ANON_KEY' &&
    url !== '' &&
    key !== '' &&
    url.startsWith('https://')
  );
};
