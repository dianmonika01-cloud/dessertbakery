import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import {
  getActiveCategories,
  getSiteSettings,
} from "@/lib/services/store.service";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita brand, filosofi usaha, dan informasi produk Dessert & Bakery By Dimo.",
};

export default async function AboutPage() {
  const [settings, categories] = await Promise.all([
    getSiteSettings(),
    getActiveCategories(),
  ]);

  return (
    <div className="py-14 sm:py-20 space-y-20">
      {/* Header Section */}
      <section className="container-custom">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-beige/60 px-4 py-1.5 text-xs font-medium text-brand-chocolate">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{settings.tagline}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-brand-darkBrown sm:text-5xl">
            Cerita di Balik {settings.store_name}
          </h1>
          <p className="text-base text-brand-darkBrown/75 leading-relaxed">
            Menghadirkan kehangatan hidangan penutup dan bakery homemade
            berkualitas tinggi untuk setiap momen berharga Anda.
          </p>
        </div>
      </section>

      {/* Cerita & Filosofi */}
      <section className="container-custom">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-brand-white shadow-card">
              <Image
                src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&q=80"
                alt="Proses Pembuatan Bakery By Dimo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
                Sejarah & Perjalanan
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-brand-darkBrown sm:text-3xl">
                Cerita Brand By Dimo
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-darkBrown/80">
                {settings.about_story}
              </p>
            </div>

            <div className="pt-4 border-t border-brand-beige">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
                Komitmen Kualitas
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-brand-darkBrown sm:text-3xl">
                Filosofi Usaha Kami
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-brand-darkBrown/80">
                {settings.about_philosophy}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                "Bahan Baku Segar & Halal",
                "Dipanggang & Diracak Setiap Hari",
                "Tanpa Pemanis & Pengawet Buatan",
                "Kemasan Higienis & Siap Hantaran",
              ].map((point, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-brand-chocolate shrink-0" />
                  <span className="font-medium text-brand-darkBrown">
                    {point}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Informasi Ragam Produk */}
      <section className="bg-brand-beige/35 py-16 border-y border-brand-beige/70">
        <div className="container-custom space-y-10">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
              Ragam Sajian
            </span>
            <h2 className="mt-1 font-serif text-3xl font-bold text-brand-darkBrown">
              Informasi Kategori Produk Kami
            </h2>
            <p className="mt-2 text-sm text-brand-darkBrown/75">
              Kami menyediakan 7 lini produk utama yang dapat dipesan setiap
              hari sesuai ketersediaan stok.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="card-surface p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-xl font-semibold text-brand-darkBrown">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-sm text-brand-darkBrown/75 leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-brand-beige/60">
                  <Link
                    href={`/menu?category=${category.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-chocolate hover:text-brand-darkBrown"
                  >
                    <span>Lihat Produk {category.name}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
