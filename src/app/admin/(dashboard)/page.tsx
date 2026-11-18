import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  FolderTree,
  Plus,
  Settings,
  CheckCircle2,
  AlertCircle,
  Star,
} from "lucide-react";
import {
  getAllCategoriesForAdmin,
  getAllProductsForAdmin,
  getSiteSettingsForAdmin,
} from "@/lib/services/admin.service";
import { formatRupiah } from "@/lib/utils";

export default async function AdminOverviewPage() {
  const [products, categories, settings] = await Promise.all([
    getAllProductsForAdmin(),
    getAllCategoriesForAdmin(),
    getSiteSettingsForAdmin(),
  ]);

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const totalStock = products.reduce((acc, p) => acc + Number(p.stock), 0);
  const bestSellerCount = products.filter((p) => p.is_best_seller).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) <= 0).length;

  return (
    <div className="space-y-8">
      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Panel Kendali Toko
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
            Dashboard Ringkasan
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
            Kelola katalog produk, stok, kategori, dan pengaturan WhatsApp{" "}
            <strong>{settings.store_name}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/products/new"
            className="btn-primary py-2.5 px-4 text-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk Baru</span>
          </Link>
          <Link
            href="/admin/settings"
            className="btn-secondary py-2.5 px-4 text-xs"
          >
            <Settings className="h-4 w-4" />
            <span>Atur Nomor WhatsApp</span>
          </Link>
        </div>
      </div>

      {/* Kartu Statistik Utama */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-darkBrown/65">
              Total Produk
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-beige/60 text-brand-chocolate">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brand-darkBrown">
            {totalProducts}
          </p>
          <p className="text-xs text-brand-darkBrown/60">
            {outOfStockCount > 0
              ? `${outOfStockCount} produk stok habis`
              : "Seluruh produk memiliki stok"}
          </p>
        </div>

        <div className="card-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-darkBrown/65">
              Total Kategori
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-beige/60 text-brand-chocolate">
              <FolderTree className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brand-darkBrown">
            {totalCategories}
          </p>
          <p className="text-xs text-brand-darkBrown/60">
            Kategori produk terdaftar
          </p>
        </div>

        <div className="card-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-darkBrown/65">
              Total Unit Stok
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-beige/60 text-brand-chocolate">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brand-darkBrown">
            {totalStock}
          </p>
          <p className="text-xs text-brand-darkBrown/60">
            Akumulasi stok seluruh menu
          </p>
        </div>

        <div className="card-surface p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-brand-darkBrown/65">
              Produk Best Seller
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-beige/60 text-brand-chocolate">
              <Star className="h-4 w-4" />
            </div>
          </div>
          <p className="font-serif text-3xl font-bold text-brand-darkBrown">
            {bestSellerCount}
          </p>
          <p className="text-xs text-brand-darkBrown/60">
            Ditampilkan di halaman utama
          </p>
        </div>
      </div>

      {/* Ringkasan Informasi WhatsApp & Toko */}
      <div className="card-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-beige/30">
        <div className="space-y-1">
          <h2 className="font-serif text-lg font-bold text-brand-darkBrown">
            Nomor WhatsApp Checkout Aktif: +{settings.whatsapp_number}
          </h2>
          <p className="text-xs text-brand-darkBrown/75">
            Alamat Toko: {settings.address} | Jam Buka:{" "}
            {settings.operating_hours}
          </p>
        </div>
        <Link
          href="/admin/settings"
          className="btn-outline py-2 px-4 text-xs shrink-0"
        >
          Ubah Pengaturan
        </Link>
      </div>

      {/* Tabel Ringkas Daftar Produk */}
      <div className="card-surface overflow-hidden">
        <div className="p-6 border-b border-brand-beige flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-brand-darkBrown">
              Daftar Produk Terkini
            </h2>
            <p className="text-xs text-brand-darkBrown/65">
              Ringkasan harga dan ketersediaan stok produk
            </p>
          </div>
          <Link
            href="/admin/products"
            className="text-xs font-semibold text-brand-chocolate hover:text-brand-darkBrown"
          >
            Kelola Semua Produk &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-beige bg-brand-cream/60 text-[11px] font-semibold uppercase tracking-wider text-brand-darkBrown/70">
                <th className="py-3.5 px-5">Produk</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-beige/60 text-xs sm:text-sm">
              {products.slice(0, 6).map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-brand-cream/40 transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-14 shrink-0 overflow-hidden rounded-lg border border-brand-beige bg-brand-beige/40">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-semibold text-brand-darkBrown">
                          {product.name}
                        </p>
                        {product.is_best_seller && (
                          <span className="inline-block text-[10px] font-medium text-brand-softBrown">
                            ★ Best Seller
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-brand-darkBrown/80">
                    {product.category?.name || "-"}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-brand-chocolate">
                    {formatRupiah(product.price)}
                  </td>
                  <td className="py-3.5 px-4">
                    {product.stock > 0 ? (
                      <span className="font-medium text-brand-darkBrown">
                        {product.stock}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">
                        <AlertCircle className="h-3.5 w-3.5" /> Habis
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {product.is_active ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800 border border-emerald-200">
                        Aktif
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600">
                        Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="font-semibold text-brand-chocolate hover:text-brand-darkBrown"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
