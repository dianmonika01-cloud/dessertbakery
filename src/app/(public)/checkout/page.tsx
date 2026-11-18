import React from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/lib/services/store.service";
import { WhatsAppCheckoutClient } from "@/components/cart/WhatsAppCheckoutClient";

export const metadata: Metadata = {
  title: "Checkout WhatsApp",
  description:
    "Selesaikan pemesanan produk Dessert & Bakery By Dimo secara cepat melalui WhatsApp.",
};

export default async function CheckoutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Konfirmasi Pesanan
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-darkBrown sm:text-4xl">
            Checkout via WhatsApp
          </h1>
          <p className="text-sm text-brand-darkBrown/75">
            Isi detail pengiriman Anda dan kirimkan rincian pesanan langsung ke
            WhatsApp resmi {settings.store_name}.
          </p>
        </div>

        <WhatsAppCheckoutClient settings={settings} />
      </div>
    </div>
  );
}
