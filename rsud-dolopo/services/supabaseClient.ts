import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with a fallback to prevent build errors.
// import.meta.env is the standard way to access env vars in Vite.
const env = ((typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {}) as Record<string, any>;

const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

// Check if configuration is valid (must start with http/https and have a key)
const isValidConfig = !!supabaseUrl && !!supabaseKey && supabaseUrl.startsWith('http');

// Initialize Supabase client
// We create the client even if keys are missing to avoid runtime import errors,
// but we flag it as disabled.
export const supabase = createClient(
  isValidConfig ? supabaseUrl : 'https://placeholder.supabase.co', 
  isValidConfig ? supabaseKey : 'placeholder'
);

export const isSupabaseEnabled = isValidConfig;