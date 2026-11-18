"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream px-4 py-16">
      <div className="card-surface max-w-md w-full p-8 text-center space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-700 border border-red-200">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-bold text-brand-darkBrown">
            Terjadi Kendala Teknis
          </h1>
          <p className="text-xs sm:text-sm text-brand-darkBrown/75 leading-relaxed">
            Maaf, terjadi gangguan saat memuat halaman ini. Silakan muat ulang
            halaman atau kembali ke beranda.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="btn-primary w-full sm:w-auto py-2.5 px-5 text-xs"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/"
            className="btn-outline w-full sm:w-auto py-2.5 px-5 text-xs"
          >
            <Home className="h-4 w-4" />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
