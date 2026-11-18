"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Category } from "@/types/database";
import {
  deleteCategoryAction,
  saveCategoryAction,
} from "@/lib/actions/category.actions";

export function CategoryManagerClient({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSelectEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsActive(cat.is_active);
    setFeedback(null);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIsActive(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    const formData = new FormData();
    if (editingCategory?.id) formData.append("id", editingCategory.id);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("is_active", String(isActive));

    const res = await saveCategoryAction(formData);
    setSaving(false);

    if (!res.success) {
      setFeedback({ type: "error", text: res.message });
      return;
    }

    setFeedback({ type: "success", text: res.message });
    handleCancelEdit();
    router.refresh();
  };

  const handleDelete = async (cat: Category) => {
    const confirmed = window.confirm(
      `Hapus kategori "${cat.name}"? Kategori yang masih memiliki produk tidak dapat dihapus.`
    );
    if (!confirmed) return;

    setDeletingId(cat.id);
    setFeedback(null);

    const res = await deleteCategoryAction(cat.id);
    setDeletingId(null);

    if (!res.success) {
      setFeedback({ type: "error", text: res.message });
      return;
    }

    setFeedback({ type: "success", text: res.message });
    router.refresh();
  };

  return (
    <div className="space-y-6">
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
        {/* Form Tambah / Edit Kategori */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-5 card-surface p-6 space-y-5"
        >
          <div className="flex items-center justify-between border-b border-brand-beige pb-3">
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              {editingCategory
                ? `Edit Kategori: ${editingCategory.name}`
                : "Tambah Kategori Baru"}
            </h2>
            {editingCategory && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-xs font-medium text-brand-darkBrown/60 hover:text-brand-darkBrown inline-flex items-center gap-1"
              >
                <X className="h-3.5 w-3.5" />
                <span>Batal</span>
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Nama Kategori <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dessert Box"
              className="input-field"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80">
              Deskripsi Singkat
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Penjelasan singkat mengenai kategori produk ini..."
              className="input-field resize-none"
            />
          </div>

          <label className="flex items-center gap-3 rounded-xl border border-brand-beige bg-brand-cream/60 p-3.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-brand-chocolate text-brand-chocolate"
            />
            <span className="text-xs font-semibold text-brand-darkBrown">
              Kategori Aktif (Ditampilkan di Filter Menu)
            </span>
          </label>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-full py-3 text-xs sm:text-sm"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : editingCategory ? (
              <>
                <Save className="h-4 w-4" />
                <span>Simpan Perubahan Kategori</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Tambah Kategori</span>
              </>
            )}
          </button>
        </form>

        {/* Daftar Kategori */}
        <div className="lg:col-span-7 card-surface overflow-hidden">
          <div className="p-5 border-b border-brand-beige">
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              Daftar Kategori ({initialCategories.length})
            </h2>
          </div>

          <div className="divide-y divide-brand-beige/60">
            {initialCategories.map((cat) => (
              <div
                key={cat.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-cream/40 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold text-brand-darkBrown">
                      {cat.name}
                    </h3>
                    <span className="text-xs text-brand-darkBrown/50">
                      ({cat.slug})
                    </span>
                    {cat.is_active ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800 border border-emerald-200">
                        Aktif
                      </span>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-[11px] font-medium text-stone-600">
                        Nonaktif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-brand-darkBrown/70">
                    {cat.description || "Tidak ada deskripsi"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSelectEdit(cat)}
                    className="inline-flex items-center gap-1 rounded-lg border border-brand-beige bg-brand-white px-3 py-1.5 text-xs font-medium text-brand-darkBrown hover:border-brand-chocolate hover:text-brand-chocolate"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    disabled={deletingId === cat.id}
                    className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 disabled:opacity-50"
                  >
                    {deletingId === cat.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
