# Dessert & Bakery By Dimo

> **Sweet Moments, Made with Love.**  
> Website Toko Online UMKM **Dessert & Bakery By Dimo** — dibangun dengan Next.js (App Router), React, TypeScript, Tailwind CSS, Supabase (PostgreSQL, Auth, Storage + RLS), dan fitur Checkout WhatsApp otomatis.

---

## Fitur Utama

### 1. Halaman Pelanggan (Storefront)
- **Homepage (`/`)**: Hero section, *Best Seller Products*, cerita singkat *About By Dimo*, keunggulan produk, testimonial pelanggan, dan CTA WhatsApp.
- **Menu Produk (`/menu`)**: Menampilkan seluruh produk dari 7 kategori utama dengan fitur filter kategori, pencarian produk (*search*), pengurutan harga (*sorting*), dan informasi ketersediaan stok.
- **Detail Produk (`/menu/[slug]`)**: Foto produk resolusi tinggi, harga dinamis, deskripsi, status stok, pemilih jumlah (*quantity selector*), dan tombol *Add to Cart*.
- **Shopping Cart (`/cart`)**: Daftar belanjaan, tambah/kurangi jumlah sesuai batas stok, hapus item, dan ringkasan pembayaran.
- **Checkout WhatsApp (`/checkout`)**: Form data pengiriman pelanggan dengan generator pesan WhatsApp terstruktur otomatis dan URL encoding (`encodeURIComponent`) ke nomor WhatsApp dinamis toko.
- **About Us (`/about`) & Contact (`/contact`)**: Cerita brand, filosofi usaha, 7 lini kategori produk, lokasi toko, Instagram, jam operasional, dan kontak WhatsApp.

### 2. Admin Dashboard (`/admin`)
- **Autentikasi Aman (`/admin/login`)**: Login & logout menggunakan Supabase Auth dengan validasi role `admin` pada tabel `profiles` serta proteksi server-side (`middleware.ts`).
- **Ringkasan Dashboard (`/admin`)**: Metrik total produk, total kategori, total unit stok, dan produk best seller.
- **Manajemen Produk (`/admin/products`)**: Tambah, edit, hapus produk, atur harga, stok, deskripsi, status aktif/best seller, serta **Upload Foto Produk** ke Supabase Storage (`product-images`).
- **Manajemen Kategori (`/admin/categories`)**: Tambah, edit, dan hapus kategori produk.
- **Pengaturan Toko & Nomor WhatsApp (`/admin/settings`)**: Ubah nomor WhatsApp penerima pesanan, akun Instagram, alamat toko, jam operasional, dan deskripsi profil usaha.

---

## Langkah 1: Persiapan & Menjalankan Secara Lokal

1. Pastikan **Node.js (versi 18.18+ atau 20+ LTS)** telah terinstal di komputer Anda.
2. Instal seluruh package dependensi:
   ```bash
   npm install
   ```
3. Salin file `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Jalankan server development:
   ```bash
   npm run dev
   ```
5. Buka `http://localhost:3000` di browser Anda.

---

## Langkah 2: Setup Database, Storage, & Auth di Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka menu **SQL Editor** di proyek Supabase Anda:
   - Salin dan jalankan seluruh isi file [`supabase/schema.sql`](./supabase/schema.sql) untuk membuat tabel `profiles`, `categories`, `products`, `site_settings`, bucket storage `product-images`, serta kebijakan keamanan **Row Level Security (RLS)**.
   - Salin dan jalankan seluruh isi file [`supabase/seed.sql`](./supabase/seed.sql) untuk mengisi 7 kategori utama, 9 produk awal By Dimo, dan pengaturan awal toko.
3. Buat akun Admin pertama Anda:
   - Buka menu **Authentication > Users** di Supabase Dashboard.
   - Klik **Add user > Create new user**, lalu masukkan email dan password admin Anda (centang *Auto Confirm User*).
   - Trigger otomatis dari `schema.sql` akan langsung mendaftarkan akun tersebut ke tabel `public.profiles` dengan `role = 'admin'`.
4. Ambil kredensial API dari menu **Project Settings > API** di Supabase:
   - Salin **Project URL** ke `NEXT_PUBLIC_SUPABASE_URL` di `.env.local`.
   - Salin **anon public key** ke `NEXT_PUBLIC_SUPABASE_ANON_KEY` di `.env.local`.
   - *(Penting: Jangan pernah memasukkan `service_role` key ke variabel `NEXT_PUBLIC_`)*.

---

## Langkah 3: Deployment ke Vercel

1. Unggah (*push*) kode proyek ini ke repositori GitHub / GitLab / Bitbucket Anda.
2. Buka [Vercel Dashboard](https://vercel.com/new) dan pilih **Import Project** dari repositori Git tersebut.
3. Pada bagian **Environment Variables** di Vercel, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://<project-id-anda>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `<anon-public-key-anda>`
   - `NEXT_PUBLIC_SITE_URL` = `https://<domain-vercel-anda>.vercel.app`
4. Klik **Deploy**.
5. Setelah deployment selesai, buka `https://<domain-vercel-anda>.vercel.app/admin/login` untuk masuk ke Admin Dashboard dan memperbarui nomor WhatsApp resmi serta informasi toko Anda di menu **Pengaturan Toko & WA**.
