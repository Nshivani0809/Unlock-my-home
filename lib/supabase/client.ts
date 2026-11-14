import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  // NEXT_PUBLIC_ is required because this client runs in the browser.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local and Vercel, then restart/redeploy.");
  }
  return createBrowserClient(url, key);
}
