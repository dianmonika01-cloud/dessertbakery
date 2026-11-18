"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatRupiah } from "@/lib/utils";

export function ShoppingCartClient() {
  const {
    items,
    totalItems,
    subtotal,
    isHydrated,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="card-surface h-28 animate-pulse bg-brand-beige/30"
            />
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="card-surface h-64 animate-pulse bg-brand-beige/30" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="card-surface max-w-xl mx-auto py-16 px-6 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-beige/60 text-brand-chocolate">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-brand-darkBrown sm:text-3xl">
            Keranjang Belanja Kosong
          </h2>
          <p className="text-sm text-brand-darkBrown/75 max-w-md mx-auto leading-relaxed">
            Anda belum memilih produk dessert atau bakery. Mari jelajahi menu
            kami untuk menemukan sajian manis favorit Anda.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/menu" className="btn-primary">
            <span>Jelajahi Menu Produk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* Daftar Produk di Keranjang */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between pb-2">
          <p className="text-sm font-medium text-brand-darkBrown/75">
            Terdapat{" "}
            <strong className="font-semibold text-brand-darkBrown">
              {totalItems} item
            </strong>{" "}
            di dalam keranjang Anda
          </p>
          <button
            type="button"
            onClick={clearCart}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Kosongkan Keranjang</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map(({ product, quantity }) => {
            const itemSubtotal = Number(product.price) * quantity;

            return (
              <div
                key={product.id}
                className="card-surface p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <Link
                    href={`/menu/${product.slug}`}
                    className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-beige/40 border border-brand-beige"
                  >
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </Link>

                  <div className="space-y-1">
                    {product.category && (
                      <span className="text-[11px] font-medium uppercase tracking-wider text-brand-softBrown">
                        {product.category.name}
                      </span>
                    )}
                    <Link
                      href={`/menu/${product.slug}`}
                      className="block font-serif text-lg font-semibold text-brand-darkBrown hover:text-brand-chocolate transition-colors"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs font-medium text-brand-darkBrown/70">
                      Harga Satuan:{" "}
                      <span className="text-brand-chocolate font-semibold">
                        {formatRupiah(Number(product.price))}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Kontrol Jumlah, Subtotal Item & Hapus */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-brand-beige/60">
                  {/* Tambah & Kurangi Jumlah */}
                  <div className="inline-flex items-center rounded-xl border border-brand-beige bg-brand-cream/60 p-1">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-darkBrown hover:bg-brand-beige transition-colors"
                      aria-label={`Kurangi jumlah ${product.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center font-serif text-sm font-bold text-brand-darkBrown">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-brand-darkBrown hover:bg-brand-beige transition-colors disabled:opacity-35"
                      aria-label={`Tambah jumlah ${product.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item */}
                  <div className="text-right min-w-[110px]">
                    <span className="block text-[11px] text-brand-darkBrown/55">
                      Subtotal
                    </span>
                    <span className="font-serif text-base font-bold text-brand-chocolate">
                      {formatRupiah(itemSubtotal)}
                    </span>
                  </div>

                  {/* Tombol Hapus Produk */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-brand-beige text-brand-darkBrown/60 hover:border-red-300 hover:bg-red-50 hover:text-red-700 transition-colors"
                    aria-label={`Hapus ${product.name}`}
                    title="Hapus Produk"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-brand-chocolate hover:text-brand-darkBrown"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Tambah Produk Lainnya</span>
          </Link>
        </div>
      </div>

      {/* Ringkasan Belanja */}
      <div className="lg:col-span-4">
        <div className="card-surface p-6 sm:p-7 space-y-6 sticky top-28">
          <h2 className="font-serif text-2xl font-bold text-brand-darkBrown">
            Ringkasan Belanja
          </h2>

          <div className="space-y-3 text-sm border-y border-brand-beige py-4">
            <div className="flex items-center justify-between text-brand-darkBrown/75">
              <span>Total Jumlah Produk</span>
              <span className="font-medium text-brand-darkBrown">
                {totalItems} item
              </span>
            </div>
            <div className="flex items-center justify-between text-brand-darkBrown/75">
              <span>Subtotal Produk</span>
              <span className="font-medium text-brand-darkBrown">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-serif text-lg font-semibold text-brand-darkBrown">
              Total Pembayaran
            </span>
            <span className="font-serif text-2xl font-bold text-brand-chocolate">
              {formatRupiah(subtotal)}
            </span>
          </div>

          <Link href="/checkout" className="btn-primary w-full py-4 text-base">
            <span>Lanjut ke Checkout WhatsApp</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="text-center text-xs text-brand-darkBrown/60 leading-relaxed">
            Pesanan akan diteruskan ke WhatsApp resmi kami dengan rincian
            produk yang telah disusun secara otomatis.
          </p>
        </div>
      </div>
    </div>
  );
}
