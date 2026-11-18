"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Save,
  Loader2,
  Phone,
  Store,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { SiteSettings } from "@/types/database";
import { updateSiteSettingsAction } from "@/lib/actions/settings.actions";

export function StoreSettingsFormClient({
  initialSettings,
}: {
  initialSettings: SiteSettings;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateSiteSettingsAction(formData);
    setSaving(false);

    if (!res.success) {
      setFeedback({ type: "error", text: res.message });
      return;
    }

    setFeedback({ type: "success", text: res.message });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input type="hidden" name="id" value={initialSettings.id} />

      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Bagian 1: Pengaturan Nomor WhatsApp & Kontak */}
      <div className="card-surface p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-brand-beige pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-beige/70 text-brand-chocolate">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              Pengaturan Nomor WhatsApp & Kontak
            </h2>
            <p className="text-xs text-brand-darkBrown/65">
              Nomor WhatsApp ini digunakan secara otomatis untuk tombol Checkout
              WhatsApp dan tombol kontak pelanggan.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Nomor WhatsApp Penerima Pesanan{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="whatsapp_number"
              required
              defaultValue={initialSettings.whatsapp_number}
              placeholder="Contoh: 6281234567890 atau 081234567890"
              className="input-field"
            />
            <p className="text-[11px] text-brand-darkBrown/60">
              Gunakan format angka (misal <code>62812...</code> atau{" "}
              <code>0812...</code>). Sistem akan menyesuaikan kode negara{" "}
              <code>62</code> secara otomatis.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Username Instagram
            </label>
            <input
              type="text"
              name="instagram_handle"
              defaultValue={initialSettings.instagram_handle}
              placeholder="@bydimo.official"
              className="input-field"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Alamat Lengkap Usaha
            </label>
            <input
              type="text"
              name="address"
              defaultValue={initialSettings.address}
              placeholder="Jl. Contoh Alamat Toko No. 10, Kota Anda"
              className="input-field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Jam Operasional Toko
            </label>
            <input
              type="text"
              name="operating_hours"
              defaultValue={initialSettings.operating_hours}
              placeholder="Senin - Minggu: 09.00 - 20.00 WIB"
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Bagian 2: Identitas & Cerita Toko */}
      <div className="card-surface p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-3 border-b border-brand-beige pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-beige/70 text-brand-chocolate">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              Identitas Brand & Halaman Tentang Kami
            </h2>
            <p className="text-xs text-brand-darkBrown/65">
              Informasi yang ditampilkan pada Homepage, Tentang Kami, dan
              Footer.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Nama Brand / Toko <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="store_name"
              required
              defaultValue={initialSettings.store_name}
              className="input-field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Tagline Brand
            </label>
            <input
              type="text"
              name="tagline"
              defaultValue={initialSettings.tagline}
              className="input-field"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
            Cerita Brand By Dimo
          </label>
          <textarea
            name="about_story"
            rows={3}
            defaultValue={initialSettings.about_story}
            className="input-field resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
            Filosofi Usaha
          </label>
          <textarea
            name="about_philosophy"
            rows={3}
            defaultValue={initialSettings.about_philosophy}
            className="input-field resize-none"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3.5 px-8 text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan Pengaturan...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Pengaturan Toko</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
