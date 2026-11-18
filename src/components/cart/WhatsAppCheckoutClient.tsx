"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CheckoutFormData, SiteSettings } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import {
  buildWhatsAppOrderMessage,
  generateWhatsAppCheckoutUrl,
} from "@/lib/whatsapp";

export function WhatsAppCheckoutClient({
  settings,
}: {
  settings: SiteSettings;
}) {
  const { items, totalItems, subtotal, isHydrated, clearCart } = useCart();

  const [formData, setFormData] = useState<CheckoutFormData>({
    customerName: "",
    phoneNumber: "",
    deliveryAddress: "",
    orderNotes: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSent, setOrderSent] = useState<boolean>(false);

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 card-surface h-96 animate-pulse bg-brand-beige/30" />
        <div className="lg:col-span-5 card-surface h-96 animate-pulse bg-brand-beige/30" />
      </div>
    );
  }

  if (items.length === 0 && !orderSent) {
    return (
      <div className="card-surface max-w-xl mx-auto py-16 px-6 text-center space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-beige/60 text-brand-chocolate">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-brand-darkBrown">
          Belum Ada Produk untuk Checkout
        </h2>
        <p className="text-sm text-brand-darkBrown/75 max-w-md mx-auto">
          Keranjang belanja Anda masih kosong. Silakan pilih produk dessert atau
          bakery terlebih dahulu sebelum melanjutkan ke pemesanan WhatsApp.
        </p>
        <div className="pt-2">
          <Link href="/menu" className="btn-primary">
            Pilih Produk di Menu
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const validateForm = (): string | null => {
    if (formData.customerName.trim().length < 2) {
      return "Mohon isi nama lengkap pelanggan dengan benar.";
    }
    const cleanPhone = formData.phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 9) {
      return "Mohon isi nomor telepon/WhatsApp aktif yang valid (minimal 9 digit).";
    }
    if (formData.deliveryAddress.trim().length < 8) {
      return "Mohon lengkapi alamat pengiriman agar pesanan dapat diantar dengan tepat.";
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    const whatsappUrl = generateWhatsAppCheckoutUrl({
      storeName: settings.store_name,
      adminWhatsAppNumber: settings.whatsapp_number,
      customer: formData,
      items,
      totalAmount: subtotal,
    });

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setOrderSent(true);
  };

  const messagePreview = buildWhatsAppOrderMessage({
    storeName: settings.store_name,
    customer: {
      customerName: formData.customerName || "[Nama Pelanggan]",
      phoneNumber: formData.phoneNumber || "[Nomor Telepon]",
      deliveryAddress: formData.deliveryAddress || "[Alamat Pengiriman]",
      orderNotes: formData.orderNotes,
    },
    items,
    totalAmount: subtotal,
  });

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* Kolom Kiri: Form Informasi Pelanggan */}
      <form
        onSubmit={handleSubmit}
        className="lg:col-span-7 card-surface p-6 sm:p-8 space-y-6"
        noValidate
      >
        <div className="space-y-1 border-b border-brand-beige pb-4">
          <h2 className="font-serif text-2xl font-bold text-brand-darkBrown">
            Informasi Pengiriman & Pemesan
          </h2>
          <p className="text-xs sm:text-sm text-brand-darkBrown/70">
            Lengkapi data di bawah ini untuk membuat format pesanan WhatsApp
            secara otomatis.
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-800">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {orderSent && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-4 space-y-3 text-xs sm:text-sm text-emerald-900">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
              <span>Jendela WhatsApp Telah Dibuka</span>
            </div>
            <p className="leading-relaxed">
              Silakan kirim pesan yang telah terisi otomatis di aplikasi
              WhatsApp Anda. Jika pesanan sudah terkirim, Anda dapat
              mengosongkan keranjang belanja.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setOrderSent(false);
                }}
                className="rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-emerald-800 transition-colors"
              >
                Selesai & Kosongkan Keranjang
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Nama Pelanggan */}
          <div className="space-y-1.5">
            <label
              htmlFor="customerName"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
            >
              Nama Pelanggan <span className="text-red-600">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              className="input-field"
            />
          </div>

          {/* Nomor Telepon */}
          <div className="space-y-1.5">
            <label
              htmlFor="phoneNumber"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
            >
              Nomor Telepon / WhatsApp <span className="text-red-600">*</span>
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Contoh: 081234567890"
              className="input-field"
            />
          </div>

          {/* Alamat Pengiriman */}
          <div className="space-y-1.5">
            <label
              htmlFor="deliveryAddress"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
            >
              Alamat Lengkap Pengiriman <span className="text-red-600">*</span>
            </label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              rows={3}
              required
              value={formData.deliveryAddress}
              onChange={handleChange}
              placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan patokan lokasi"
              className="input-field resize-none"
            />
          </div>

          {/* Catatan Pesanan */}
          <div className="space-y-1.5">
            <label
              htmlFor="orderNotes"
              className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
            >
              Catatan Pesanan (Opsional)
            </label>
            <textarea
              id="orderNotes"
              name="orderNotes"
              rows={2}
              value={formData.orderNotes}
              onChange={handleChange}
              placeholder="Contoh: Kirim pukul 14.00 siang, ucapan kartu hantaran, dll."
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Pratinjau Format Pesan WhatsApp */}
        <div className="space-y-2 pt-2">
          <span className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/60">
            Pratinjau Pesan WhatsApp Otomatis
          </span>
          <pre className="whitespace-pre-wrap rounded-xl border border-brand-beige bg-brand-cream/70 p-4 font-sans text-xs leading-relaxed text-brand-darkBrown/85 max-h-56 overflow-y-auto">
            {messagePreview}
          </pre>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-brand-darkBrown/75 hover:text-brand-chocolate"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Keranjang</span>
          </Link>

          <button type="submit" className="btn-primary py-4 px-8 text-base">
            <MessageSquare className="h-5 w-5" />
            <span>Order via WhatsApp</span>
          </button>
        </div>
      </form>

      {/* Kolom Kanan: Rincian Produk & Total Pembayaran */}
      <div className="lg:col-span-5">
        <div className="card-surface p-6 sm:p-7 space-y-6 sticky top-28">
          <div className="flex items-center justify-between border-b border-brand-beige pb-4">
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              Rincian Produk ({totalItems})
            </h2>
            <Link
              href="/cart"
              className="text-xs font-semibold text-brand-chocolate hover:text-brand-darkBrown"
            >
              Ubah Keranjang
            </Link>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 border-b border-brand-beige/50 pb-3 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-brand-beige bg-brand-beige/40">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif text-sm font-semibold text-brand-darkBrown">
                      {product.name}
                    </h3>
                    <p className="text-xs text-brand-darkBrown/65">
                      {quantity} x {formatRupiah(Number(product.price))}
                    </p>
                  </div>
                </div>

                <span className="font-serif text-sm font-bold text-brand-chocolate shrink-0">
                  {formatRupiah(Number(product.price) * quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-brand-beige pt-4 space-y-3">
            <div className="flex items-center justify-between text-sm text-brand-darkBrown/75">
              <span>Subtotal Produk</span>
              <span>{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-brand-darkBrown/60">
              <span>Biaya Pengiriman</span>
              <span>Dikonfirmasi via WhatsApp</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-brand-beige/70">
              <span className="font-serif text-lg font-semibold text-brand-darkBrown">
                Total Pembayaran
              </span>
              <span className="font-serif text-2xl font-bold text-brand-chocolate">
                {formatRupiah(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
