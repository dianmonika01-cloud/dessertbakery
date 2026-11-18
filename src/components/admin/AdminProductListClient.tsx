"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Category, Product } from "@/types/database";
import { formatRupiah } from "@/lib/utils";
import { deleteProductAction } from "@/lib/actions/product.actions";

interface AdminProductListClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function AdminProductListClient({
  initialProducts,
  categories,
}: AdminProductListClientProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return initialProducts.filter((product) => {
      const matchesCat =
        categoryId === "all" || product.category_id === categoryId;
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.slug.toLowerCase().includes(q) ||
        product.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [initialProducts, search, categoryId]);

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus produk "${product.name}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    setDeletingId(product.id);
    setFeedback(null);

    const res = await deleteProductAction(product.id);
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

      {/* Filter & Search Bar */}
      <div className="card-surface p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-darkBrown/45" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama produk atau deskripsi..."
            className="input-field pl-10"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="input-field sm:w-56"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Link
            href="/admin/products/new"
            className="btn-primary py-3 px-5 text-xs shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* Tabel Produk */}
      <div className="card-surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-beige bg-brand-cream/70 text-[11px] font-semibold uppercase tracking-wider text-brand-darkBrown/70">
                <th className="py-3.5 px-5">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige/60 text-xs sm:text-sm">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-brand-cream/40 transition-colors"
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-brand-beige bg-brand-beige/40">
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs">
                          <p className="font-serif font-semibold text-brand-darkBrown">
                            {product.name}
                          </p>
                          <p className="text-xs text-brand-darkBrown/60 truncate">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-brand-darkBrown/80">
                      {product.category?.name || "-"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-brand-chocolate">
                      {formatRupiah(product.price)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={
                          product.stock > 0
                            ? "font-medium text-brand-darkBrown"
                            : "font-semibold text-red-700"
                        }
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.is_active ? (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                            Aktif
                          </span>
                        ) : (
                          <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                            Nonaktif
                          </span>
                        )}
                        {product.is_best_seller && (
                          <span className="rounded-full bg-brand-beige/70 px-2.5 py-0.5 text-xs font-medium text-brand-chocolate">
                            Best Seller
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-brand-beige bg-brand-white px-3 py-1.5 text-xs font-medium text-brand-darkBrown hover:border-brand-chocolate hover:text-brand-chocolate transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          disabled={deletingId === product.id}
                          className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50/70 px-3 py-1.5 text-xs font-medium text-red-800 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          <span>Hapus</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 px-6 text-center text-sm text-brand-darkBrown/65"
                  >
                    Tidak ada produk yang cocok dengan pencarian Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
