"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Upload,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Category, Product } from "@/types/database";
import { slugify } from "@/lib/utils";
import {
  saveProductAction,
  uploadProductImageAction,
} from "@/lib/actions/product.actions";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const isEditing = Boolean(product?.id);

  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [categoryId, setCategoryId] = useState(
    product?.category_id || categories[0]?.id || ""
  );
  const [price, setPrice] = useState(
    product?.price !== undefined ? String(product.price) : ""
  );
  const [stock, setStock] = useState(
    product?.stock !== undefined ? String(product.stock) : "10"
  );
  const [description, setDescription] = useState(product?.description || "");
  const [imageUrl, setImageUrl] = useState(product?.image_url || "");
  const [isBestSeller, setIsBestSeller] = useState(
    product?.is_best_seller ?? false
  );
  const [isActive, setIsActive] = useState(product?.is_active ?? true);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProductImageAction(formData);
    setUploadingImage(false);

    if (!result.success || !result.url) {
      setFeedback({ type: "error", text: result.message });
      return;
    }

    setImageUrl(result.url);
    setFeedback({ type: "success", text: result.message });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const formData = new FormData();
    if (product?.id) formData.append("id", product.id);
    formData.append("name", name);
    formData.append("slug", slug || slugify(name));
    formData.append("category_id", categoryId);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("image_url", imageUrl);
    formData.append("is_best_seller", String(isBestSeller));
    formData.append("is_active", String(isActive));

    const result = await saveProductAction(formData);
    setSaving(false);

    if (!result.success) {
      setFeedback({ type: "error", text: result.message });
      return;
    }

    setFeedback({ type: "success", text: result.message });
    setTimeout(() => {
      router.push("/admin/products");
      router.refresh();
    }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
        {/* Kolom Kiri: Data Utama Produk */}
        <div className="lg:col-span-8 card-surface p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
                Nama Produk <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Contoh: Chocolate Dessert Box"
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
                Slug URL Produk <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                placeholder="chocolate-dessert-box"
                className="input-field"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
                Kategori <span className="text-red-600">*</span>
              </label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="input-field"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
                Harga (Rp) <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                step="500"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="65000"
                className="input-field"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
                Jumlah Stok <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="20"
                className="input-field"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Deskripsi Produk <span className="text-red-600">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan cita rasa, bahan pilihan, ukuran/porsi, dan keunggulan produk..."
              className="input-field resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-beige/70">
            <label className="flex items-center gap-3 rounded-xl border border-brand-beige bg-brand-cream/60 p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border-brand-chocolate text-brand-chocolate focus:ring-brand-chocolate"
              />
              <div>
                <span className="block text-xs font-semibold text-brand-darkBrown">
                  Tampilkan Produk (Status Aktif)
                </span>
                <span className="text-[11px] text-brand-darkBrown/65">
                  Jika dinonaktifkan, produk disembunyikan dari halaman pelanggan
                </span>
              </div>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-brand-beige bg-brand-cream/60 p-3.5 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={(e) => setIsBestSeller(e.target.checked)}
                className="h-4 w-4 rounded border-brand-chocolate text-brand-chocolate focus:ring-brand-chocolate"
              />
              <div>
                <span className="block text-xs font-semibold text-brand-darkBrown">
                  Tandai sebagai Best Seller
                </span>
                <span className="text-[11px] text-brand-darkBrown/65">
                  Ditampilkan pada seksi Best Seller di Homepage
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Kolom Kanan: Upload Foto Produk & Simpan */}
        <div className="lg:col-span-4 card-surface p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="font-serif text-lg font-bold text-brand-darkBrown">
              Foto Produk
            </h2>
            <p className="text-xs text-brand-darkBrown/65">
              Unggah ke Supabase Storage (Bucket <code>product-images</code>)
              atau masukkan URL gambar.
            </p>
          </div>

          {/* Pratinjau Gambar */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-brand-beige bg-brand-beige/35 flex items-center justify-center">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name || "Pratinjau Produk"}
                fill
                sizes="320px"
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-brand-darkBrown/50 px-4 text-center">
                Belum ada foto produk yang dipilih
              </span>
            )}
          </div>

          {/* Tombol Upload ke Supabase Storage */}
          <div>
            <label className="btn-secondary w-full py-2.5 text-xs cursor-pointer">
              {uploadingImage ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Mengunggah Foto...</span>
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Upload Foto dari Perangkat</span>
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/75">
              Atau URL Foto Produk <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="input-field text-xs"
            />
          </div>

          <div className="pt-4 border-t border-brand-beige space-y-3">
            <button
              type="submit"
              disabled={saving || uploadingImage}
              className="btn-primary w-full py-3.5 text-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>
                    {isEditing ? "Simpan Perubahan" : "Tambahkan Produk"}
                  </span>
                </>
              )}
            </button>

            <Link
              href="/admin/products"
              className="btn-outline w-full py-2.5 text-xs"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Daftar Produk</span>
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
