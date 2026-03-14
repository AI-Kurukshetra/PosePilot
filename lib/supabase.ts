import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabaseConfigErrorMessage =
  "Authentication is unavailable right now. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

let browserSupabaseClient: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  browserSupabaseClient ??= createClient(supabaseUrl, supabaseAnonKey);
  return browserSupabaseClient;
}
