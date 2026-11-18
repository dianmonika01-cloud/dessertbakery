import React from "react";
import { getAllCategoriesForAdmin } from "@/lib/services/admin.service";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function AdminNewProductPage() {
  const categories = await getAllCategoriesForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
          Tambah Menu
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
          Tambah Produk Baru
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
          Masukkan informasi produk, harga, jumlah stok, dan foto produk.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
