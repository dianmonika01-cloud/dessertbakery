import React from "react";
import {
  getAllCategoriesForAdmin,
  getAllProductsForAdmin,
} from "@/lib/services/admin.service";
import { AdminProductListClient } from "@/components/admin/AdminProductListClient";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getAllCategoriesForAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
          Manajemen Katalog
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
          Kelola Produk
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
          Tambah produk baru, ubah harga, perbarui ketersediaan stok, atau
          unggah foto produk.
        </p>
      </div>

      <AdminProductListClient
        initialProducts={products}
        categories={categories}
      />
    </div>
  );
}
