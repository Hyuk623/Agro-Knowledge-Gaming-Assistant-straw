import { createClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────
// Supabase client
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
// If env vars are missing the app falls back to mock data automatically.
// ─────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co';

/**
 * Supabase client – only safe to use when `isSupabaseConfigured` is true.
 * In development / MVP mode the app uses mock data instead.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// TODO (Phase 2): Replace mock data calls with typed Supabase queries:
//   const { data, error } = await supabase!.from('scenarios').select('*');
