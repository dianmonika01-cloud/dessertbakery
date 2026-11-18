import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Clock,
  Heart,
  Sparkles,
  Star,
  Phone,
} from "lucide-react";
import {
  getActiveCategories,
  getBestSellerProducts,
  getSiteSettings,
} from "@/lib/services/store.service";
import { ProductCard } from "@/components/menu/ProductCard";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

const FEATURES = [
  {
    icon: Award,
    title: "Bahan Baku Pilihan",
    description:
      "Menggunakan cokelat berkualitas, keju pilihan, dan buah segar setiap hari untuk rasa yang konsisten.",
  },
  {
    icon: Clock,
    title: "Dibuat Baru Setiap Hari",
    description:
      "Setiap pesanan dipanggang dan diracik segar agar tiba di tangan Anda dalam kondisi terbaik.",
  },
  {
    icon: Heart,
    title: "Homemade Penuh Cinta",
    description:
      "Resep rumahan autentik dengan takaran manis yang seimbang dan tekstur lembut di mulut.",
  },
  {
    icon: Sparkles,
    title: "Kemasan Bersih & Elegan",
    description:
      "Dikemas secara higienis dan rapi sehingga cocok untuk dinikmati sendiri maupun dijadikan hantaran.",
  },
];

const TESTIMONIALS = [
  {
    name: "Rina Wulandari",
    role: "Pelanggan Setia",
    comment:
      "Chocolate Dessert Box dan Fudgy Brownies dari By Dimo benar-benar lembut dan cokelatnya terasa mewah tapi tidak bikin enek.",
  },
  {
    name: "Budi Santoso",
    role: "Pecinta Kuliner",
    comment:
      "Pizza Full Loyang dengan topping ayam, sosis, dan bakso sangat mengenyangkan. Rotinya empuk bahkan saat sudah dingin.",
  },
  {
    name: "Nadia Putri",
    role: "Pelanggan Hantaran",
    comment:
      "Sering pesan Creamy Cheesecake dan Salad Buah Premium untuk acara keluarga. Kemasannya rapi dan pengirimannya cepat.",
  },
];

export default async function HomePage() {
  const [settings, bestSellers, categories] = await Promise.all([
    getSiteSettings(),
    getBestSellerProducts(4),
    getActiveCategories(),
  ]);

  const cleanWa = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Halo ${settings.store_name}, saya ingin memesan produk dessert & bakery.`
  )}`;

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-brand-beige/60 bg-gradient-to-b from-brand-beige/35 to-brand-cream pt-12 pb-20 lg:py-24">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Hero Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-softBrown/30 bg-brand-white px-4 py-1.5 text-xs font-medium text-brand-chocolate shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-brand-softBrown" />
                <span>{settings.tagline}</span>
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight text-brand-darkBrown sm:text-5xl lg:text-6xl">
                Sweet Treats,{" "}
                <span className="text-brand-chocolate italic">
                  Happy Moments.
                </span>
              </h1>

              <p className="max-w-xl text-base leading-relaxed text-brand-darkBrown/80 sm:text-lg">
                Nikmati sajian homemade premium dessert dan bakery dari{" "}
                <strong className="font-semibold text-brand-darkBrown">
                  {settings.store_name}
                </strong>
                . Mulai dari Dessert Box, Fudgy Brownies, Creamy Cheesecake,
                hingga Pizza hangat dan Salad Buah segar.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link href="/menu" className="btn-primary px-8 py-4 text-base">
                  <span>Explore Menu</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/about" className="btn-outline px-7 py-4 text-base">
                  Tentang By Dimo
                </Link>
              </div>

              {/* Kategori Singkat */}
              <div className="pt-6 border-t border-brand-beige/80">
                <p className="text-xs font-medium uppercase tracking-wider text-brand-darkBrown/55 mb-3">
                  Pilihan Kategori Favorit
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/menu?category=${cat.slug}`}
                      className="rounded-lg border border-brand-beige bg-brand-white px-3 py-1.5 text-xs font-medium text-brand-darkBrown transition-colors hover:border-brand-chocolate hover:bg-brand-beige/40"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-brand-white shadow-card">
                  <Image
                    src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=85"
                    alt="Koleksi Dessert & Bakery By Dimo"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Floating Card */}
                <div className="mt-4 sm:mt-0 sm:absolute sm:-bottom-6 sm:-left-6 rounded-2xl border border-brand-beige bg-brand-white p-4 shadow-card max-w-xs">
                  <p className="font-serif text-sm font-semibold text-brand-darkBrown">
                    100% Homemade & Fresh
                  </p>
                  <p className="mt-1 text-xs text-brand-darkBrown/70">
                    Dibuat setiap hari dengan bahan pilihan berkualitas untuk
                    menjaga cita rasa terbaik.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BEST SELLER PRODUCTS */}
      <section className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
              Pilihan Favorit
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
              Best Seller Products
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-chocolate hover:text-brand-darkBrown transition-colors"
          >
            <span>Lihat Seluruh Menu</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 3. ABOUT BY DIMO */}
      <section className="bg-brand-beige/40 py-20 border-y border-brand-beige/70">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-brand-white shadow-card">
                <Image
                  src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=900&q=80"
                  alt="Dapur Bakery By Dimo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
                Cerita Kami
              </span>
              <h2 className="font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
                Tentang {settings.store_name}
              </h2>
              <p className="text-base leading-relaxed text-brand-darkBrown/80">
                {settings.about_story}
              </p>
              <p className="text-base leading-relaxed text-brand-darkBrown/80">
                {settings.about_philosophy}
              </p>
              <div className="pt-2">
                <Link href="/about" className="btn-primary">
                  <span>Pelajari Selengkapnya</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEUNGGULAN PRODUK */}
      <section className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Mengapa Memilih Kami
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
            Keunggulan Produk By Dimo
          </h2>
          <p className="mt-3 text-sm text-brand-darkBrown/75">
            Standar kualitas yang selalu kami jaga di setiap loyang dan kemasan.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="card-surface p-6 space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-brand-darkBrown">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-darkBrown/75">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. TESTIMONIAL PELANGGAN */}
      <section className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Ulasan Pelanggan
          </span>
          <h2 className="mt-1 font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
            Momen Manis Bersama By Dimo
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={index}
              className="card-surface p-7 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-brand-softBrown">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm italic leading-relaxed text-brand-darkBrown/80">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>
              <div className="border-t border-brand-beige/60 pt-4">
                <p className="font-serif font-semibold text-brand-darkBrown">
                  {item.name}
                </p>
                <p className="text-xs text-brand-softBrown">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION WHATSAPP */}
      <section className="container-custom">
        <div className="rounded-3xl bg-brand-chocolate px-6 py-14 sm:px-12 sm:py-16 text-center text-brand-white shadow-card">
          <h2 className="font-serif text-3xl font-bold text-brand-white sm:text-4xl">
            Siap Menikmati Hidangan Manis Hari Ini?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-brand-beige/90">
            Pilih produk favorit Anda melalui katalog kami atau hubungi kami
            langsung melalui WhatsApp untuk pemesanan cepat dan acara spesial.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-white px-7 py-3.5 text-sm font-semibold text-brand-darkBrown transition-all hover:bg-brand-beige"
            >
              <span>Pesan dari Menu</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-brand-beige/40 bg-brand-darkBrown px-7 py-3.5 text-sm font-semibold text-brand-white transition-all hover:bg-brand-softBrown"
            >
              <Phone className="h-4 w-4" />
              <span>Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
