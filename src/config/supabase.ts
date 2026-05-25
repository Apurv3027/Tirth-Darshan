/**
 * Supabase Connection Configuration
 * 
 * Replace the placeholder values with your actual Supabase Project credentials.
 * If these values are left empty or set to placeholder text, the application
 * will gracefully fall back to local mock data to prevent crashes.
 */

export const SUPABASE_CONFIG = {
  // Your Supabase Project URL (e.g., 'https://xyzcompany.supabase.co')
  URL: 'https://mnhzjtedwqmebejywxii.supabase.co',

  // Your Supabase Anonymous API Key (Anon Key)
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uaHpqdGVkd3FtZWJlanl3eGlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3MTQyMjQsImV4cCI6MjA5NTI5MDIyNH0.0hvcHFCiMBWPQohmaEY5p-0BfkHrWqYY88woDT33NqU',
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
