import React from "react";
import { notFound } from "next/navigation";
import {
  getAllCategoriesForAdmin,
  getProductByIdForAdmin,
} from "@/lib/services/admin.service";
import { ProductForm } from "@/components/admin/ProductForm";

interface AdminEditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductByIdForAdmin(id),
    getAllCategoriesForAdmin(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
          Perbarui Menu
        </span>
        <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
          Edit Produk: {product.name}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
          Perbarui harga, ketersediaan stok, deskripsi, atau ganti foto produk.
        </p>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
