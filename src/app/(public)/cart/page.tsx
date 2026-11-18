import React from "react";
import type { Metadata } from "next";
import { ShoppingCartClient } from "@/components/cart/ShoppingCartClient";

export const metadata: Metadata = {
  title: "Keranjang Belanja",
  description:
    "Daftar produk dessert dan bakery pilihan Anda di Keranjang Belanja Dessert & Bakery By Dimo.",
};

export default function CartPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Pesanan Anda
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
            Shopping Cart
          </h1>
        </div>

        <ShoppingCartClient />
      </div>
    </div>
  );
}
