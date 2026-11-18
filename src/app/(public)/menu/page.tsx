import React, { Suspense } from "react";
import type { Metadata } from "next";
import {
  getActiveCategories,
  getActiveProducts,
} from "@/lib/services/store.service";
import { ProductCatalogClient } from "@/components/menu/ProductCatalogClient";

export const metadata: Metadata = {
  title: "Menu Produk",
  description:
    "Katalog lengkap produk Dessert & Bakery By Dimo: Dessert Box, Fudgy Brownies, Cheesecake, Pudding Buah, Pancake Durian, Pizza, dan Salad Buah Premium.",
};

export default async function MenuPage() {
  const [products, categories] = await Promise.all([
    getActiveProducts(),
    getActiveCategories(),
  ]);

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom space-y-10">
        {/* Header Katalog */}
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Katalog Sajian
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-darkBrown sm:text-5xl">
            Menu Produk By Dimo
          </h1>
          <p className="text-sm sm:text-base text-brand-darkBrown/75 leading-relaxed">
            Pilih hidangan penutup dan bakery favorit Anda. Seluruh harga dan
            ketersediaan stok diperbarui secara berkala.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div
                  key={idx}
                  className="card-surface h-80 animate-pulse bg-brand-beige/30"
                />
              ))}
            </div>
          }
        >
          <ProductCatalogClient
            initialProducts={products}
            categories={categories}
          />
        </Suspense>
      </div>
    </div>
  );
}
