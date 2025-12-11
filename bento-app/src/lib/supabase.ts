import { createClient } from '@supabase/supabase-js'

// 1. Read the variables from Vite environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 2. Safety Check: Warn if keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("🚨 Supabase Keys are MISSING in .env file! 🚨");
}

// 3. Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)