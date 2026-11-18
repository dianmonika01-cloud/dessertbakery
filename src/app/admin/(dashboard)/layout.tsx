import React from "react";
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { verifyAdminSession } from "@/lib/services/admin.service";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabaseReady = isSupabaseConfigured();
  const { isAdmin, email } = await verifyAdminSession();

  // Proteksi Server-Side: Wajib login terlebih dahulu untuk mengakses seluruh halaman Admin
  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-brand-cream">
      <AdminSidebar adminEmail={email} />

      <div className="flex-1 flex flex-col min-w-0">
        {!supabaseReady && (
          <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-xs text-amber-900 flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-700 shrink-0" />
            <span>
              <strong>Mode Lokal Aktif:</strong> Anda masuk menggunakan sesi
              server lokal (<code>{email}</code>). Untuk menghubungkan ke
              database PostgreSQL cloud, isi kredensial Supabase pada{" "}
              <code>.env.local</code>.
            </span>
          </div>
        )}

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
