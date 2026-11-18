import React from "react";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="py-20">
      <div className="container-custom">
        <div className="card-surface max-w-lg mx-auto p-8 sm:p-10 text-center space-y-5">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-beige/60 text-brand-chocolate">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-brand-darkBrown sm:text-3xl">
            Produk Tidak Ditemukan
          </h1>
          <p className="text-sm text-brand-darkBrown/75 leading-relaxed">
            Maaf, produk yang Anda cari tidak tersedia atau telah dihapus dari
            katalog menu kami.
          </p>
          <div className="pt-2">
            <Link href="/menu" className="btn-primary">
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Menu Produk</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
