import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle, Package, ShieldCheck } from "lucide-react";
import {
  getActiveProducts,
  getProductBySlug,
} from "@/lib/services/store.service";
import { formatRupiah } from "@/lib/utils";
import { ProductDetailInteractive } from "@/components/menu/ProductDetailInteractive";
import { ProductCard } from "@/components/menu/ProductCard";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk Tidak Ditemukan",
    };
  }

  return {
    title: product.name,
    description: product.description,
  };
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getActiveProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts
    .filter(
      (item) =>
        item.id !== product.id && item.category_id === product.category_id
    )
    .slice(0, 4);

  const fallbackRecommendations =
    relatedProducts.length > 0
      ? relatedProducts
      : allProducts.filter((item) => item.id !== product.id).slice(0, 4);

  return (
    <div className="py-12 sm:py-16 space-y-20">
      <div className="container-custom">
        {/* Breadcrumb / Back Navigation */}
        <div className="mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-darkBrown/75 hover:text-brand-chocolate transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Katalog Menu</span>
          </Link>
        </div>

        {/* Detail Produk Utama */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          {/* Foto Produk */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border-4 border-brand-white bg-brand-beige/40 shadow-card">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {product.is_best_seller && (
                <div className="absolute top-4 left-4 rounded-xl bg-brand-chocolate px-3.5 py-1.5 text-xs font-semibold text-brand-white shadow-sm">
                  Best Seller
                </div>
              )}
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="lg:col-span-6 card-surface p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {product.category && (
                  <Link
                    href={`/menu?category=${product.category.slug}`}
                    className="rounded-lg bg-brand-beige/70 px-3 py-1 text-xs font-semibold text-brand-chocolate hover:bg-brand-beige transition-colors"
                  >
                    {product.category.name}
                  </Link>
                )}

                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 border border-emerald-200">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>Stok Tersedia ({product.stock})</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1 text-xs font-medium text-red-800 border border-red-200">
                    <span>Stok Habis</span>
                  </span>
                )}
              </div>

              <h1 className="font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
                {product.name}
              </h1>

              <p className="font-serif text-2xl sm:text-3xl font-bold text-brand-chocolate pt-1">
                {formatRupiah(product.price)}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-brand-beige/70">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/60">
                Deskripsi Produk
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-brand-darkBrown/80">
                {product.description}
              </p>
            </div>

            {/* Keunggulan Singkat */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 rounded-xl bg-brand-cream px-3.5 py-2.5 text-xs text-brand-darkBrown/80 border border-brand-beige/60">
                <Package className="h-4 w-4 text-brand-softBrown shrink-0" />
                <span>Dikemas rapi & higienis</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-xl bg-brand-cream px-3.5 py-2.5 text-xs text-brand-darkBrown/80 border border-brand-beige/60">
                <ShieldCheck className="h-4 w-4 text-brand-softBrown shrink-0" />
                <span>100% Bahan segar pilihan</span>
              </div>
            </div>

            {/* Komponen Interaktif Pilih Jumlah & Add to Cart */}
            <ProductDetailInteractive product={product} />
          </div>
        </div>
      </div>

      {/* Rekomendasi Produk Lainnya */}
      {fallbackRecommendations.length > 0 && (
        <section className="container-custom pt-8 border-t border-brand-beige/70">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
              Rekomendasi Sajian
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-brand-darkBrown sm:text-3xl">
              Menu Lainnya yang Mungkin Anda Suka
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {fallbackRecommendations.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
