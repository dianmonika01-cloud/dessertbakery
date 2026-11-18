"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export interface ActionResponse {
  success: boolean;
  message: string;
}

const LOCAL_SESSION_COOKIE = "by_dimo_admin_session";

export async function loginAdminAction(
  formData: FormData
): Promise<ActionResponse> {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");

  if (!identifier || !password) {
    return {
      success: false,
      message: "Username/Email dan password wajib diisi.",
    };
  }

  // 1. Jika Supabase sudah dikonfigurasi, gunakan Supabase Auth
  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const envUsername = process.env.ADMIN_LOCAL_USERNAME || "admin_dimo";
    const envEmail = process.env.ADMIN_LOCAL_EMAIL || "admin@bydimo.com";

    // Jika pengguna mengetikkan username (tanpa '@'), konversi ke email admin terdaftar
    const loginEmail =
      !identifier.includes("@") &&
      identifier.toLowerCase() === envUsername.toLowerCase()
        ? envEmail
        : identifier;

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (!error && data.user) {
      // Cek baris profile di tabel public.profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle();

      // Jika akun dibuat di Supabase Auth sebelum trigger profiles aktif, daftarkan otomatis sebagai admin
      if (!profile) {
        await supabase.from("profiles").upsert(
          {
            id: data.user.id,
            full_name:
              data.user.user_metadata?.full_name ||
              data.user.email ||
              "Admin By Dimo",
            role: "admin",
          },
          { onConflict: "id" }
        );
      } else if (profile.role && profile.role !== "admin") {
        await supabase.auth.signOut();
        return {
          success: false,
          message: "Akun Anda tidak memiliki hak akses sebagai administrator.",
        };
      }

      // Simpan juga cookie sesi server agar navigasi admin stabil
      const cookieStore = await cookies();
      cookieStore.set(
        LOCAL_SESSION_COOKIE,
        `${data.user.email || loginEmail}:admin`,
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24,
        }
      );

      revalidatePath("/admin", "layout");
      return {
        success: true,
        message: "Berhasil masuk ke Admin Dashboard.",
      };
    }
  }

  // 2. Fallback Autentikasi Server-Side menggunakan Environment Variable (.env.local)
  const expectedUsername = process.env.ADMIN_LOCAL_USERNAME || "admin_dimo";
  const expectedEmail = process.env.ADMIN_LOCAL_EMAIL || "admin@bydimo.com";
  const expectedPassword = process.env.ADMIN_LOCAL_PASSWORD;

  if (!expectedPassword) {
    return {
      success: false,
      message: "Email atau password tidak valid. Silakan periksa kembali.",
    };
  }

  const isUserMatch =
    identifier.toLowerCase() === expectedUsername.toLowerCase() ||
    identifier.toLowerCase() === expectedEmail.toLowerCase();

  if (!isUserMatch || password !== expectedPassword) {
    return {
      success: false,
      message: "Username/Email atau password tidak valid. Silakan coba lagi.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCAL_SESSION_COOKIE, `${expectedEmail}:admin`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  revalidatePath("/admin", "layout");
  return {
    success: true,
    message: "Berhasil masuk ke Admin Dashboard.",
  };
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(LOCAL_SESSION_COOKIE);

  if (isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
  }

  revalidatePath("/admin", "layout");
  redirect("/admin/login");
}
