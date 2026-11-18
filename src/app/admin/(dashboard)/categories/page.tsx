import React from "react";
import { getAllCategoriesForAdmin } from "@/lib/services/admin.service";
import { CategoryManagerClient } from "@/components/admin/CategoryManagerClient";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
          Struktur Katalog
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
          Kelola Kategori Produk
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
          Atur kategori utama produk yang ditampilkan pada filter katalog
          pelanggan.
        </p>
      </div>

      <CategoryManagerClient initialCategories={categories} />
    </div>
  );
}
