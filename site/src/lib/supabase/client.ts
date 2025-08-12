import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!url || !anon) {
  // Avoid throwing during build; runtime pages that need supabase should guard
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "[supabase] URL or ANON KEY is missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }
}

export const supabase: SupabaseClient | undefined = url && anon ? createClient(url, anon) : undefined;


