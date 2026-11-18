import React from "react";
import Link from "next/link";
import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  UtensilsCrossed,
  ShieldCheck,
} from "lucide-react";
import { SiteSettings } from "@/types/database";
import { sanitizeWhatsAppNumber } from "@/lib/utils";

export function Footer({ settings }: { settings: SiteSettings }) {
  const cleanWa = sanitizeWhatsAppNumber(settings.whatsapp_number);
  const waMessage = encodeURIComponent(
    `Halo ${settings.store_name}, saya ingin bertanya mengenai menu dessert & bakery yang tersedia.`
  );
  const waUrl = `https://wa.me/${cleanWa}?text=${waMessage}`;

  return (
    <footer className="bg-brand-darkBrown text-brand-cream border-t border-brand-chocolate/30 mt-auto">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Kolom 1: Identitas Brand */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-softBrown text-brand-white">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-xl font-bold text-brand-white">
                  {settings.store_name}
                </p>
                <p className="text-xs text-brand-beige/80">
                  {settings.tagline}
                </p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-brand-beige/80">
              Toko dessert, bakery, dan hidangan penutup homemade berkualitas
              premium. Dibuat segar setiap hari dengan bahan-bahan pilihan.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-white mb-4">
              Navigasi
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-beige/80">
              <li>
                <Link
                  href="/"
                  className="hover:text-brand-white transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/menu"
                  className="hover:text-brand-white transition-colors"
                >
                  Menu Produk
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="hover:text-brand-white transition-colors"
                >
                  Keranjang Belanja
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-brand-white transition-colors"
                >
                  Tentang By Dimo
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-brand-white transition-colors"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kategori Unggulan */}
          <div>
            <h3 className="font-serif text-lg font-semibold text-brand-white mb-4">
              Kategori Menu
            </h3>
            <ul className="space-y-2.5 text-sm text-brand-beige/80">
              <li>
                <Link
                  href="/menu?category=dessert-box"
                  className="hover:text-brand-white transition-colors"
                >
                  Dessert Box
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=fudgy-brownies"
                  className="hover:text-brand-white transition-colors"
                >
                  Fudgy Brownies
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=cheesecake"
                  className="hover:text-brand-white transition-colors"
                >
                  Cheesecake
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=pizza"
                  className="hover:text-brand-white transition-colors"
                >
                  Pizza Homemade
                </Link>
              </li>
              <li>
                <Link
                  href="/menu?category=salad-buah-premium"
                  className="hover:text-brand-white transition-colors"
                >
                  Salad Buah Premium
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Lokasi */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-semibold text-brand-white">
              Kontak & Jam Buka
            </h3>
            <ul className="space-y-3 text-sm text-brand-beige/85">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-softBrown shrink-0 mt-1" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-brand-softBrown shrink-0 mt-1" />
                <span>{settings.operating_hours}</span>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="h-4 w-4 text-brand-softBrown shrink-0" />
                <span>{settings.instagram_handle}</span>
              </li>
            </ul>

            <div className="pt-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-softBrown px-5 py-3 text-sm font-medium text-brand-white transition-all hover:bg-brand-chocolate"
              >
                <Phone className="h-4 w-4" />
                <span>Chat WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Admin Link */}
        <div className="mt-12 border-t border-brand-beige/15 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-beige/65">
          <p>
            &copy; {new Date().getFullYear()} {settings.store_name}. Seluruh hak
            cipta dilindungi.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-brand-beige/70 hover:text-brand-white transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
