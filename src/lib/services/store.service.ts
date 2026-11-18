import { Category, Product, SiteSettings } from "@/types/database";
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_SITE_SETTINGS,
} from "./initial-data";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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

export async function getSiteSettings(): Promise<SiteSettings> {
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

export async function getActiveCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return INITIAL_CATEGORIES.filter((c) => c.is_active);
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return INITIAL_CATEGORIES.filter((c) => c.is_active);
    }

    return data as Category[];
  } catch {
    return INITIAL_CATEGORIES.filter((c) => c.is_active);
  }
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return attachCategoryToProducts(
      INITIAL_PRODUCTS.filter((p) => p.is_active),
      INITIAL_CATEGORIES
    );
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return attachCategoryToProducts(
        INITIAL_PRODUCTS.filter((p) => p.is_active),
        INITIAL_CATEGORIES
      );
    }

    return (data as Product[]).map((item) => ({
      ...item,
      price: Number(item.price),
      stock: Number(item.stock),
    }));
  } catch {
    return attachCategoryToProducts(
      INITIAL_PRODUCTS.filter((p) => p.is_active),
      INITIAL_CATEGORIES
    );
  }
}

export async function getBestSellerProducts(limit = 4): Promise<Product[]> {
  const allProducts = await getActiveProducts();
  const bestSellers = allProducts.filter((p) => p.is_best_seller);
  return (bestSellers.length > 0 ? bestSellers : allProducts).slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = INITIAL_PRODUCTS.find(
      (p) => p.slug === slug && p.is_active
    );
    if (!found) return null;
    return attachCategoryToProducts([found], INITIAL_CATEGORIES)[0];
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      const fallback = INITIAL_PRODUCTS.find(
        (p) => p.slug === slug && p.is_active
      );
      if (!fallback) return null;
      return attachCategoryToProducts([fallback], INITIAL_CATEGORIES)[0];
    }

    return {
      ...(data as Product),
      price: Number(data.price),
      stock: Number(data.stock),
    };
  } catch {
    const fallback = INITIAL_PRODUCTS.find(
      (p) => p.slug === slug && p.is_active
    );
    if (!fallback) return null;
    return attachCategoryToProducts([fallback], INITIAL_CATEGORIES)[0];
  }
}
