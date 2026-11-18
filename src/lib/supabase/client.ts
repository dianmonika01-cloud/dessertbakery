import { createBrowserClient } from "@supabase/ssr";

const DEFAULT_SUPABASE_URL = "https://ekrobqntcozhuotdvrfl.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_T-uPkEQMSxoWRSIxzG_SvA_lcVWqvHL";

export function getSupabaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  if (envUrl && envUrl !== "https://your-project-id.supabase.co") {
    return envUrl;
  }
  return DEFAULT_SUPABASE_URL;
}

export function getSupabasePublishableKey(): string {
  const envKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (envKey && envKey !== "your-supabase-anon-public-key") {
    return envKey;
  }
  return DEFAULT_SUPABASE_PUBLISHABLE_KEY;
}

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  return Boolean(url && key);
}

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublishableKey());
}
