"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Check, Eye } from "lucide-react";
import { Product } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group card-surface overflow-hidden flex flex-col hover:shadow-card hover:-translate-y-1">
      {/* Gambar Produk */}
      <Link
        href={`/menu/${product.slug}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-brand-beige/40"
      >
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge Kategori & Best Seller */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.category && (
            <span className="rounded-lg bg-brand-cream/95 px-2.5 py-1 text-[11px] font-medium text-brand-darkBrown shadow-sm backdrop-blur-sm">
              {product.category.name}
            </span>
          )}
          {product.is_best_seller && (
            <span className="rounded-lg bg-brand-chocolate/95 px-2.5 py-1 text-[11px] font-medium text-brand-white shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Badge Ketersediaan Stok */}
        <div className="absolute bottom-3 right-3">
          {isOutOfStock ? (
            <span className="rounded-lg bg-red-800/90 px-2.5 py-1 text-[11px] font-medium text-white">
              Stok Habis
            </span>
          ) : (
            <span className="rounded-lg bg-brand-darkBrown/80 px-2.5 py-1 text-[11px] font-medium text-brand-cream backdrop-blur-sm">
              Stok: {product.stock}
            </span>
          )}
        </div>
      </Link>

      {/* Informasi Produk */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Link href={`/menu/${product.slug}`}>
            <h3 className="font-serif text-lg font-semibold text-brand-darkBrown group-hover:text-brand-chocolate transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1.5 text-xs leading-relaxed text-brand-darkBrown/70 line-clamp-2">
            {product.description}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-brand-beige/60 flex items-center justify-between gap-2">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-brand-darkBrown/50">
              Harga
            </span>
            <span className="font-serif text-lg font-bold text-brand-chocolate">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/menu/${product.slug}`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-beige bg-brand-cream/60 text-brand-darkBrown hover:bg-brand-beige transition-colors"
              aria-label={`Detail ${product.name}`}
              title="Lihat Detail"
            >
              <Eye className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl bg-brand-chocolate px-3.5 text-xs font-medium text-brand-white transition-all hover:bg-brand-darkBrown disabled:opacity-40 disabled:pointer-events-none"
            >
              {added ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Ditambah</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>+ Keranjang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
