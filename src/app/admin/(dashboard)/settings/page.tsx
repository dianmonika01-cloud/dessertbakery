import React from "react";
import { getSiteSettingsForAdmin } from "@/lib/services/admin.service";
import { StoreSettingsFormClient } from "@/components/admin/StoreSettingsFormClient";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettingsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
          Konfigurasi Website
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
          Pengaturan Nomor WhatsApp & Informasi Toko
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
          Perbarui nomor WhatsApp tujuan pesanan, akun Instagram, lokasi usaha,
          jam operasional, serta profil usaha Anda.
        </p>
      </div>

      <StoreSettingsFormClient initialSettings={settings} />
    </div>
  );
}
