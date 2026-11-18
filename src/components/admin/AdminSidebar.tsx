"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Settings,
  LogOut,
  ExternalLink,
  UtensilsCrossed,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAdminAction } from "@/lib/actions/auth.actions";

const ADMIN_NAV_ITEMS = [
  {
    href: "/admin",
    label: "Ringkasan Dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/products",
    label: "Kelola Produk",
    icon: Package,
    exact: false,
  },
  {
    href: "/admin/categories",
    label: "Kelola Kategori",
    icon: FolderTree,
    exact: false,
  },
  {
    href: "/admin/settings",
    label: "Pengaturan Toko & WA",
    icon: Settings,
    exact: false,
  },
];

export function AdminSidebar({ adminEmail }: { adminEmail: string | null }) {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-brand-beige bg-brand-white">
      <div className="flex flex-col h-full p-5 justify-between gap-6">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center justify-between lg:justify-start gap-3 pb-4 border-b border-brand-beige/70">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-chocolate text-brand-white">
                <UtensilsCrossed className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-brand-darkBrown leading-none">
                  By Dimo
                </p>
                <span className="text-[11px] font-medium uppercase tracking-wider text-brand-softBrown">
                  Admin Panel
                </span>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="lg:hidden inline-flex items-center gap-1 rounded-lg border border-brand-beige px-2.5 py-1.5 text-xs font-medium text-brand-chocolate"
            >
              <span>Lihat Toko</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          {/* Menu Navigasi */}
          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-all",
                    isActive
                      ? "bg-brand-chocolate text-brand-white shadow-sm"
                      : "text-brand-darkBrown/75 hover:bg-brand-beige/45 hover:text-brand-darkBrown"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar: Info Akun & Logout */}
        <div className="space-y-3 pt-4 border-t border-brand-beige/70">
          <Link
            href="/"
            target="_blank"
            className="hidden lg:flex items-center justify-between rounded-xl border border-brand-beige bg-brand-cream/70 px-3.5 py-2.5 text-xs font-medium text-brand-darkBrown hover:bg-brand-beige/50 transition-colors"
          >
            <span>Lihat Website Toko</span>
            <ExternalLink className="h-3.5 w-3.5 text-brand-chocolate" />
          </Link>

          <div className="px-1">
            <p className="text-[11px] uppercase tracking-wider text-brand-darkBrown/50">
              Status Sesi
            </p>
            <p className="truncate text-xs font-medium text-brand-darkBrown">
              {adminEmail || "Mode Pratinjau (Supabase Belum Diatur)"}
            </p>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-2.5 text-xs font-semibold text-red-800 hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Logout Admin</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
