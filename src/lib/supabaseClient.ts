import { createClient, SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey, {
      global: {
        fetch: (input, init = {}) =>
          fetch(input, {
            ...init,
            cache: 'no-store',
          }),
      },
    });
  }

  return browserClient;
}
