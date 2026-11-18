"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  User,
  UtensilsCrossed,
  ArrowLeft,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { loginAdminAction } from "@/lib/actions/auth.actions";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginAdminAction(formData);

    if (!result.success) {
      setErrorMessage(result.message);
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-brand-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-chocolate text-brand-white shadow-card">
            <UtensilsCrossed className="h-7 w-7" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-bold text-brand-darkBrown">
              Admin By Dimo
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-brand-darkBrown/70">
              Masuk menggunakan Username atau Email Administrator
            </p>
          </div>
        </div>

        {/* Kartu Login */}
        <div className="card-surface p-6 sm:p-8 space-y-6">
          {errorMessage && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs sm:text-sm text-red-800">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
              >
                Username atau Email Admin
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-darkBrown/45" />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="Masukkan username atau email admin"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-wider text-brand-darkBrown/80"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-darkBrown/45" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Masukkan password admin"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memverifikasi Sesi...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          <div className="border-t border-brand-beige/70 pt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-chocolate hover:text-brand-darkBrown"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Halaman Toko</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
