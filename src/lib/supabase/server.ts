import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublishableKey, getSupabaseUrl } from "./client";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    getSupabaseUrl() || "https://placeholder.supabase.co",
    getSupabasePublishableKey() || "placeholder-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Diabaikan jika dipanggil dari Server Component murni
          }
        },
      },
    }
  );
}
