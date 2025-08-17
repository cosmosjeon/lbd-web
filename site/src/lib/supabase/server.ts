import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const get = (name: string) => cookieStore.get(name)?.value;
  const set = (name: string, value: string, options: CookieOptions) => {
    cookieStore.set({ name, value, ...options });
  };
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: { get, set },
    }
  );
}


