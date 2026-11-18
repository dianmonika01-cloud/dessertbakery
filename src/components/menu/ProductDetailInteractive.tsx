"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, CheckCircle2, ArrowRight } from "lucide-react";
import { Product } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { useCart } from "@/context/CartContext";

export function ProductDetailInteractive({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotification, setAddedNotification] = useState<boolean>(false);

  const isOutOfStock = product.stock <= 0;

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(product.stock, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  return (
    <div className="space-y-6 pt-4 border-t border-brand-beige">
      {/* Pilihan Jumlah & Subtotal */}
      {!isOutOfStock ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/70">
              Pilih Jumlah
            </label>
            <div className="inline-flex items-center rounded-xl border border-brand-beige bg-brand-white p-1 shadow-sm">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-darkBrown transition-colors hover:bg-brand-beige/50 disabled:opacity-35"
                aria-label="Kurangi Jumlah"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-serif text-base font-bold text-brand-darkBrown">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= product.stock}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-brand-darkBrown transition-colors hover:bg-brand-beige/50 disabled:opacity-35"
                aria-label="Tambah Jumlah"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="sm:text-right">
            <span className="block text-xs font-medium text-brand-darkBrown/60">
              Estimasi Subtotal
            </span>
            <span className="font-serif text-2xl font-bold text-brand-chocolate">
              {formatRupiah(Number(product.price) * quantity)}
            </span>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-800">
          Maaf, stok untuk produk ini sedang habis. Silakan pilih menu lainnya
          atau hubungi kami via WhatsApp untuk pre-order.
        </div>
      )}

      {/* Tombol Add to Cart & Lihat Keranjang */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="btn-primary flex-1 py-4 text-base"
        >
          <ShoppingBag className="h-5 w-5" />
          <span>{isOutOfStock ? "Stok Habis" : "Add to Cart"}</span>
        </button>

        <Link
          href="/cart"
          className="btn-secondary py-4 px-6 text-base text-center"
        >
          <span>Lihat Keranjang</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Feedback ketika produk berhasil dimasukkan ke keranjang */}
      {addedNotification && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-softBrown/40 bg-brand-beige/45 px-4 py-3 text-xs sm:text-sm text-brand-darkBrown">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-brand-chocolate shrink-0" />
            <span>
              <strong>
                {quantity}x {product.name}
              </strong>{" "}
              berhasil ditambahkan ke keranjang belanja.
            </span>
          </div>
          <Link
            href="/checkout"
            className="font-semibold text-brand-chocolate underline hover:text-brand-darkBrown shrink-0"
          >
            Lanjut Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
