import React from "react";
import type { Metadata } from "next";
import { MapPin, Phone, Instagram, Clock, MessageSquare } from "lucide-react";
import { getSiteSettings } from "@/lib/services/store.service";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Kontak & Lokasi",
  description:
    "Informasi kontak WhatsApp, Instagram, alamat usaha, dan jam operasional Dessert & Bakery By Dimo.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cleanWa = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const waUrl = `https://wa.me/${cleanWa}?text=${encodeURIComponent(
    `Halo ${settings.store_name}, saya ingin bertanya mengenai informasi pemesanan produk.`
  )}`;

  return (
    <div className="py-14 sm:py-20">
      <div className="container-custom space-y-12">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Hubungi Kami
          </span>
          <h1 className="font-serif text-4xl font-bold text-brand-darkBrown sm:text-5xl">
            Kontak & Informasi Toko
          </h1>
          <p className="text-sm sm:text-base text-brand-darkBrown/75">
            Punya pertanyaan mengenai stok harian, pesanan jumlah besar, atau
            hantaran spesial? Tim {settings.store_name} siap membantu Anda.
          </p>
        </div>

        {/* Kartu Informasi Kontak */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* WhatsApp */}
          <div className="card-surface p-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
              <Phone className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand-darkBrown">
                Nomor WhatsApp
              </h2>
              <p className="mt-1 text-sm font-medium text-brand-chocolate">
                +{cleanWa}
              </p>
              <p className="mt-1 text-xs text-brand-darkBrown/65">
                Layanan pemesanan & konsultasi menu via chat.
              </p>
            </div>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-2.5 text-xs"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat Sekarang</span>
            </a>
          </div>

          {/* Instagram */}
          <div className="card-surface p-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
              <Instagram className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand-darkBrown">
                Instagram Resmi
              </h2>
              <p className="mt-1 text-sm font-medium text-brand-chocolate">
                {settings.instagram_handle}
              </p>
              <p className="mt-1 text-xs text-brand-darkBrown/65">
                Update katalog harian, promo, dan testimoni pelanggan.
              </p>
            </div>
          </div>

          {/* Lokasi Usaha */}
          <div className="card-surface p-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand-darkBrown">
                Lokasi Usaha
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-brand-darkBrown/80">
                {settings.address}
              </p>
            </div>
          </div>

          {/* Jam Operasional */}
          <div className="card-surface p-6 space-y-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-semibold text-brand-darkBrown">
                Jam Operasional
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-brand-darkBrown/80">
                {settings.operating_hours}
              </p>
              <p className="mt-1 text-xs text-brand-darkBrown/65">
                Pesanan di luar jam operasional akan diproses di hari
                berikutnya.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
