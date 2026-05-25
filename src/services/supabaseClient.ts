import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SUPABASE_CONFIG, isSupabaseConfigured } from '../config/supabase';

// Fail-safe placeholders to prevent initialization exceptions when not configured
const supabaseUrl = isSupabaseConfigured() 
  ? SUPABASE_CONFIG.URL 
  : 'https://placeholder-dont-use.supabase.co';

const supabaseAnonKey = isSupabaseConfigured() 
  ? SUPABASE_CONFIG.ANON_KEY 
  : 'placeholder-key';

/**
 * Shared Supabase client instance.
 * Automatically handles persistence using AsyncStorage for React Native.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Disables standard web redirect detection
  },
});
