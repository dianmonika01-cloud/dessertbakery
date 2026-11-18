-- ============================================================================
-- DESSERT & BAKERY BY DIMO - DATA SEED AWAL (7 KATEGORI & PRODUK UTAMA)
-- ============================================================================

-- 1. Seed Pengaturan Toko (site_settings)
INSERT INTO public.site_settings (
  id,
  store_name,
  tagline,
  whatsapp_number,
  instagram_handle,
  address,
  operating_hours,
  about_story,
  about_philosophy
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Dessert & Bakery By Dimo',
  'Sweet Moments, Made with Love.',
  '6281200000000',
  '@bydimo.official',
  'Jl. Contoh Alamat Usaha No. 10, Kota Anda (Ubah via Admin)',
  'Senin - Minggu: 09.00 - 20.00 WIB',
  'Dessert & Bakery By Dimo hadir untuk menyajikan aneka kreasi hidangan penutup dan bakery homemade dengan cita rasa autentik dan tampilan elegan.',
  'Kami mengutamakan bahan baku segar pilihan dan proses pembuatan yang higienis setiap hari agar setiap sajian menghadirkan momen manis bersama orang terdekat.'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed 7 Kategori Produk Utama
INSERT INTO public.categories (id, name, slug, description, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Dessert Box', 'dessert-box', 'Hidangan penutup berlapis dalam kemasan kotak praktis.', TRUE),
  ('11111111-1111-1111-1111-111111111102', 'Fudgy Brownies', 'fudgy-brownies', 'Brownies panggang dengan tekstur lembut dan rasa cokelat pekat.', TRUE),
  ('11111111-1111-1111-1111-111111111103', 'Cheesecake', 'cheesecake', 'Kue keju lembut dari bahan cream cheese pilihan.', TRUE),
  ('11111111-1111-1111-1111-111111111104', 'Pudding Buah', 'pudding-buah', 'Pudding lembut dengan aneka potongan buah segar.', TRUE),
  ('11111111-1111-1111-1111-111111111105', 'Pancake Durian', 'pancake-durian', 'Pancake kulit tipis dengan isian daging durian asli dan krim.', TRUE),
  ('11111111-1111-1111-1111-111111111106', 'Pizza', 'pizza', 'Pizza homemade dengan topping ayam, sosis, dan bakso.', TRUE),
  ('11111111-1111-1111-1111-111111111107', 'Salad Buah Premium', 'salad-buah-premium', 'Perpaduan buah segar dengan saus creamy dan taburan keju.', TRUE)
ON CONFLICT (slug) DO NOTHING;

-- 3. Seed Produk Utama
INSERT INTO public.products (
  category_id,
  name,
  slug,
  description,
  price,
  stock,
  image_url,
  is_best_seller,
  is_active
) VALUES
  (
    '11111111-1111-1111-1111-111111111101',
    'Chocolate Dessert Box',
    'chocolate-dessert-box',
    'Cake cokelat berlapis krim lembut dan siraman saus cokelat pilihan.',
    65000,
    20,
    'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    TRUE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111101',
    'Cheesecake Dessert Box',
    'cheesecake-dessert-box',
    'Perpaduan remahan biskuit gurih dan lapisan krim keju lembut dalam kemasan box.',
    68000,
    15,
    'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80',
    FALSE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111102',
    'Fudgy Brownies',
    'fudgy-brownies',
    'Brownies cokelat panggang dengan bagian atas renyah dan bagian dalam lembut.',
    85000,
    18,
    'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=800&q=80',
    TRUE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111103',
    'Creamy Cheesecake',
    'creamy-cheesecake',
    'Kue keju panggang bertekstur lembut yang dibuat dari cream cheese berkualitas.',
    95000,
    12,
    'https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=800&q=80',
    TRUE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111104',
    'Fruit Pudding',
    'fruit-pudding',
    'Pudding susu lembut dengan topping aneka buah segar pilihan.',
    55000,
    25,
    'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80',
    FALSE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111105',
    'Durian Pancake',
    'durian-pancake',
    'Pancake lembut berisi daging durian asli dan krim kocok ringan.',
    75000,
    14,
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
    FALSE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    'Pizza Slice',
    'pizza-slice',
    'Pizza potongan dengan roti empuk serta topping ayam, sosis, dan bakso.',
    22000,
    30,
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    FALSE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111106',
    'Pizza Full Loyang',
    'pizza-full-loyang',
    'Pizza satu loyang penuh dengan topping ayam, sosis, dan bakso serta keju leleh.',
    110000,
    10,
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    TRUE,
    TRUE
  ),
  (
    '11111111-1111-1111-1111-111111111107',
    'Premium Fruit Salad',
    'premium-fruit-salad',
    'Potongan buah segar dengan balutan saus creamy spesial dan keju parut.',
    60000,
    22,
    'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=800&q=80',
    TRUE,
    TRUE
  )
ON CONFLICT (slug) DO NOTHING;
