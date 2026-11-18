"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal, RotateCcw, PackageOpen } from "lucide-react";
import { Category, Product } from "@/types/database";
import { ProductCard } from "@/components/menu/ProductCard";
import { cn } from "@/lib/utils";

type SortOption = "newest" | "price-asc" | "price-desc" | "name-asc";

interface ProductCatalogClientProps {
  initialProducts: Product[];
  categories: Category[];
}

export function ProductCatalogClient({
  initialProducts,
  categories,
}: ProductCatalogClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryFromUrl = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] =
    useState<string>(categoryFromUrl);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    const queryString = params.toString();
    router.replace(queryString ? `/menu?${queryString}` : "/menu", {
      scroll: false,
    });
  };

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSearchQuery("");
    setSortBy("newest");
    router.replace("/menu", { scroll: false });
  };

  const filteredAndSortedProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = initialProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug === selectedCategory;

      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        (product.category?.name.toLowerCase().includes(query) ?? false);

      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") {
        return Number(a.price) - Number(b.price);
      }
      if (sortBy === "price-desc") {
        return Number(b.price) - Number(a.price);
      }
      if (sortBy === "name-asc") {
        return a.name.localeCompare(b.name, "id");
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8">
      {/* Bar Pencarian dan Pengurutan Harga */}
      <div className="card-surface p-5 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Input Pencarian Produk */}
          <div className="md:col-span-7 lg:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-darkBrown/45" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari dessert box, brownies, cheesecake, pizza, atau salad..."
              className="input-field pl-11"
              aria-label="Cari Produk"
            />
          </div>

          {/* Dropdown Sorting Harga */}
          <div className="md:col-span-5 lg:col-span-4 flex items-center gap-2.5">
            <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-beige bg-brand-cream text-brand-chocolate">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-field cursor-pointer"
              aria-label="Urutkan Produk"
            >
              <option value="newest">Urutkan: Terbaru</option>
              <option value="price-asc">Harga: Terendah ke Tertinggi</option>
              <option value="price-desc">Harga: Tertinggi ke Terendah</option>
              <option value="name-asc">Nama Produk: A - Z</option>
            </select>
          </div>
        </div>

        {/* Filter Kategori */}
        <div className="pt-2 border-t border-brand-beige/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/60">
              Filter Kategori
            </span>
            {(selectedCategory !== "all" ||
              searchQuery.trim() !== "" ||
              sortBy !== "newest") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-chocolate hover:text-brand-darkBrown"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Filter</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleCategoryChange("all")}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-medium transition-all",
                selectedCategory === "all"
                  ? "bg-brand-chocolate text-brand-white shadow-sm"
                  : "border border-brand-beige bg-brand-cream/70 text-brand-darkBrown hover:bg-brand-beige/60"
              )}
            >
              Semua Menu ({initialProducts.length})
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={cn(
                    "rounded-xl px-4 py-2 text-xs font-medium transition-all",
                    isSelected
                      ? "bg-brand-chocolate text-brand-white shadow-sm"
                      : "border border-brand-beige bg-brand-cream/70 text-brand-darkBrown hover:bg-brand-beige/60"
                  )}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ringkasan Hasil Pencarian */}
      <div className="flex items-center justify-between text-xs sm:text-sm text-brand-darkBrown/75">
        <p>
          Menampilkan{" "}
          <strong className="font-semibold text-brand-darkBrown">
            {filteredAndSortedProducts.length}
          </strong>{" "}
          produk
          {selectedCategory !== "all" && (
            <>
              {" "}
              dalam kategori{" "}
              <strong className="font-semibold text-brand-chocolate">
                {categories.find((c) => c.slug === selectedCategory)?.name ||
                  selectedCategory}
              </strong>
            </>
          )}
        </p>
      </div>

      {/* Daftar Produk atau Empty State */}
      {filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="card-surface py-16 px-6 text-center max-w-lg mx-auto my-8 space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-beige/60 text-brand-chocolate">
            <PackageOpen className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-2xl font-semibold text-brand-darkBrown">
            Produk Tidak Ditemukan
          </h3>
          <p className="text-sm text-brand-darkBrown/70">
            Maaf, tidak ada produk yang sesuai dengan kata kunci pencarian atau
            filter kategori yang Anda pilih.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn-primary text-xs px-5 py-2.5"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Tampilkan Semua Produk</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
