-- ============================================================================
-- DESSERT & BAKERY BY DIMO - SUPABASE POSTGRESQL SCHEMA & RLS MIGRATION
-- ============================================================================

-- Aktifkan ekstensi UUID / pgcrypto
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. FUNGSI TRIGGER UPDATED_AT OTOMATIS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. TABEL PROFILES (Terhubung dengan auth.users)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Trigger otomatis membuat baris profile saat akun dibuat di Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'admin'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 3. TABEL CATEGORIES
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON public.categories(is_active);

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. TABEL PRODUCTS (Relasi Foreign Key ke categories)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  image_url TEXT NOT NULL,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON public.products(is_best_seller);

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. TABEL SITE_SETTINGS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name TEXT NOT NULL DEFAULT 'Dessert & Bakery By Dimo',
  tagline TEXT NOT NULL DEFAULT 'Sweet Moments, Made with Love.',
  whatsapp_number TEXT NOT NULL DEFAULT '6281200000000',
  instagram_handle TEXT NOT NULL DEFAULT '@bydimo.official',
  address TEXT NOT NULL DEFAULT 'Jl. Contoh Alamat Usaha No. 10, Kota Anda',
  operating_hours TEXT NOT NULL DEFAULT 'Senin - Minggu: 09.00 - 20.00 WIB',
  about_story TEXT NOT NULL DEFAULT '',
  about_philosophy TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. FUNGSI HELPER PENGECEKAN ROLE ADMIN UNTUK RLS
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  RETURN NOT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
    WHERE id = auth.uid() AND role <> 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 7. KEBIJAKAN KEAMANAN ROW LEVEL SECURITY (RLS)
-- ----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policies untuk profiles
DROP POLICY IF EXISTS "Admin dapat melihat profilnya sendiri" ON public.profiles;
CREATE POLICY "Admin dapat melihat profilnya sendiri"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin dapat membuat profilnya sendiri" ON public.profiles;
CREATE POLICY "Admin dapat membuat profilnya sendiri"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Admin dapat mengubah profilnya sendiri" ON public.profiles;
CREATE POLICY "Admin dapat mengubah profilnya sendiri"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Backfill otomatis untuk user yang sudah dibuat di auth.users sebelum trigger aktif
INSERT INTO public.profiles (id, full_name, role)
SELECT id, COALESCE(raw_user_meta_data->>'full_name', email), 'admin'
FROM auth.users
ON CONFLICT (id) DO UPDATE SET role = 'admin';

-- Policies untuk categories
DROP POLICY IF EXISTS "Publik dapat melihat kategori aktif" ON public.categories;
CREATE POLICY "Publik dapat melihat kategori aktif"
  ON public.categories FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin dapat menambah kategori" ON public.categories;
CREATE POLICY "Admin dapat menambah kategori"
  ON public.categories FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin dapat mengubah kategori" ON public.categories;
CREATE POLICY "Admin dapat mengubah kategori"
  ON public.categories FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin dapat menghapus kategori" ON public.categories;
CREATE POLICY "Admin dapat menghapus kategori"
  ON public.categories FOR DELETE
  USING (public.is_admin());

-- Policies untuk products
DROP POLICY IF EXISTS "Publik dapat melihat produk aktif" ON public.products;
CREATE POLICY "Publik dapat melihat produk aktif"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin dapat menambah produk" ON public.products;
CREATE POLICY "Admin dapat menambah produk"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin dapat mengubah produk" ON public.products;
CREATE POLICY "Admin dapat mengubah produk"
  ON public.products FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin dapat menghapus produk" ON public.products;
CREATE POLICY "Admin dapat menghapus produk"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Policies untuk site_settings
DROP POLICY IF EXISTS "Publik dapat melihat pengaturan toko" ON public.site_settings;
CREATE POLICY "Publik dapat melihat pengaturan toko"
  ON public.site_settings FOR SELECT
  USING (TRUE);

DROP POLICY IF EXISTS "Admin dapat menambah pengaturan toko" ON public.site_settings;
CREATE POLICY "Admin dapat menambah pengaturan toko"
  ON public.site_settings FOR INSERT
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin dapat mengubah pengaturan toko" ON public.site_settings;
CREATE POLICY "Admin dapat mengubah pengaturan toko"
  ON public.site_settings FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 8. SUPABASE STORAGE BUCKET & RLS UNTUK FOTO PRODUK
-- ----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', TRUE)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Foto produk dapat diakses publik" ON storage.objects;
CREATE POLICY "Foto produk dapat diakses publik"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admin dapat mengunggah foto produk" ON storage.objects;
CREATE POLICY "Admin dapat mengunggah foto produk"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin dapat memperbarui foto produk" ON storage.objects;
CREATE POLICY "Admin dapat memperbarui foto produk"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admin dapat menghapus foto produk" ON storage.objects;
CREATE POLICY "Admin dapat menghapus foto produk"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product-images' AND public.is_admin());
