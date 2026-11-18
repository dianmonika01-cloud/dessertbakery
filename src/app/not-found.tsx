import React from "react";
import Link from "next/link";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-16">
      <div className="card-surface max-w-md w-full p-8 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-beige/70 text-brand-chocolate">
          <UtensilsCrossed className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-softBrown">
            Error 404
          </span>
          <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-brand-darkBrown/75 leading-relaxed">
            Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
          </p>
        </div>
        <div className="pt-2">
          <Link href="/" className="btn-primary py-3 px-6 text-xs sm:text-sm">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda By Dimo</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
