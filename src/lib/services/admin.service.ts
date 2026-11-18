import { cookies } from "next/headers";
import { Category, Product, Profile, SiteSettings } from "@/types/database";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_SETTINGS,
} from "./initial-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const LOCAL_SESSION_COOKIE = "by_dimo_admin_session";

function attachCategoryToProducts(
  products: Product[],
  categories: Category[]
): Product[] {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));
  return products.map((product) => ({
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    category: product.category || categoryMap.get(product.category_id),
  }));
}

/**
 * Memverifikasi sesi pengguna melalui Supabase Auth atau Cookie HTTP-Only Server
 */
export async function verifyAdminSession(): Promise<{
  isAdmin: boolean;
  email: string | null;
  profile: Profile | null;
}> {
  // 1. Cek Cookie Sesi Server Lokal (.env.local)
  // 1. Cek Sesi Supabase Auth terlebih dahulu
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!userError && user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profile && profile.role && profile.role !== "admin") {
          return { isAdmin: false, email: user.email ?? null, profile: null };
        }

        const resolvedProfile: Profile = (profile as Profile) || {
          id: user.id,
          full_name:
            user.user_metadata?.full_name || user.email || "Admin By Dimo",
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        return {
          isAdmin: true,
          email: user.email ?? null,
          profile: resolvedProfile,
        };
      }
    } catch {
      // Lanjut ke pengecekan cookie lokal jika gagal
    }
  }

  // 2. Cek Cookie Sesi Server Lokal
  try {
    const cookieStore = await cookies();
    const localSession = cookieStore.get(LOCAL_SESSION_COOKIE)?.value;
    if (localSession && localSession.endsWith(":admin")) {
      const username = localSession.split(":")[0];
      return {
        isAdmin: true,
        email: username,
        profile: {
          id: "local-admin-id",
          full_name: "Admin By Dimo",
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }
  } catch {
    // Abaikan jika gagal membaca cookie
  }

  // 2. Cek Sesi Supabase Auth jika Supabase telah dikonfigurasi
  if (!isSupabaseConfigured()) {
    return { isAdmin: false, email: null, profile: null };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { isAdmin: false, email: null, profile: null };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return { isAdmin: false, email: user.email ?? null, profile: null };
    }

    return {
      isAdmin: true,
      email: user.email ?? null,
      profile: profile as Profile,
    };
  } catch {
    return { isAdmin: false, email: null, profile: null };
  }
  return { isAdmin: false, email: null, profile: null };
}

export async function getAllCategoriesForAdmin(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_CATEGORIES;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES;
    }

    return data as Category[];
  } catch {
    return INITIAL_CATEGORIES;
  }
}

export async function getAllProductsForAdmin(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return attachCategoryToProducts(INITIAL_PRODUCTS, INITIAL_CATEGORIES);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return attachCategoryToProducts(INITIAL_PRODUCTS, INITIAL_CATEGORIES);
    }

    return (data as Product[]).map((item) => ({
      ...item,
      price: Number(item.price),
      stock: Number(item.stock),
    }));
  } catch {
    return attachCategoryToProducts(INITIAL_PRODUCTS, INITIAL_CATEGORIES);
  }
}

export async function getProductByIdForAdmin(
  id: string
): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = INITIAL_PRODUCTS.find((p) => p.id === id);
    return found
      ? attachCategoryToProducts([found], INITIAL_CATEGORIES)[0]
      : null;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .single();

    if (error || !data) {
      const fallback = INITIAL_PRODUCTS.find((p) => p.id === id);
      return fallback
        ? attachCategoryToProducts([fallback], INITIAL_CATEGORIES)[0]
        : null;
    }

    return {
      ...(data as Product),
      price: Number(data.price),
      stock: Number(data.stock),
    };
  } catch {
    const fallback = INITIAL_PRODUCTS.find((p) => p.id === id);
    return fallback
      ? attachCategoryToProducts([fallback], INITIAL_CATEGORIES)[0]
      : null;
  }
}

export async function getSiteSettingsForAdmin(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return INITIAL_SITE_SETTINGS;
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return INITIAL_SITE_SETTINGS;
    }

    return data as SiteSettings;
  } catch {
    return INITIAL_SITE_SETTINGS;
  }
}
