"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, UtensilsCrossed, UserCheck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/menu", label: "Menu Produk" },
  { href: "/about", label: "Tentang Kami" },
  { href: "/contact", label: "Kontak" },
];

export function Navbar({ storeName }: { storeName?: string }) {
  const pathname = usePathname();
  const { totalItems, isHydrated } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-brand-beige/70 bg-brand-cream/95 backdrop-blur-md">
      <div className="container-custom flex h-20 items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-chocolate text-brand-white shadow-soft transition-transform duration-300 group-hover:scale-105">
            <UtensilsCrossed className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold tracking-tight text-brand-darkBrown sm:text-2xl">
              By Dimo
            </span>
            <span className="text-[11px] font-medium uppercase tracking-widest text-brand-softBrown">
              {storeName || "Dessert & Bakery"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors duration-200",
                  isActive
                    ? "text-brand-chocolate font-semibold"
                    : "text-brand-darkBrown/75 hover:text-brand-chocolate"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-brand-chocolate" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions: Cart, Admin Login & Mobile Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/admin/login"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-brand-beige bg-transparent px-3.5 py-2.5 text-sm font-medium text-brand-darkBrown transition-all duration-200 hover:border-brand-chocolate hover:bg-brand-beige/40"
            aria-label="Login Admin"
          >
            <UserCheck className="h-4 w-4 text-brand-chocolate" />
            <span>Login Admin</span>
          </Link>

          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2.5 rounded-xl border border-brand-beige bg-brand-white px-4 py-2.5 text-sm font-medium text-brand-darkBrown shadow-soft transition-all duration-200 hover:border-brand-chocolate hover:bg-brand-beige/40"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="h-4 w-4 text-brand-chocolate" />
            <span className="hidden sm:inline">Keranjang</span>
            {isHydrated && totalItems > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-chocolate px-1.5 text-xs font-semibold text-brand-white">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-beige bg-brand-white text-brand-darkBrown md:hidden"
            aria-label="Buka Menu Navigasi"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-brand-beige/70 bg-brand-cream px-4 pt-3 pb-6 md:hidden">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-brand-chocolate text-brand-white"
                      : "text-brand-darkBrown hover:bg-brand-beige/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 pt-2 border-t border-brand-beige/60 flex items-center justify-between px-2">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-chocolate hover:text-brand-darkBrown"
              >
                <UserCheck className="h-3.5 w-3.5" />
                <span>Login Admin</span>
              </Link>
              <Link
                href="/menu"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary py-2 px-4 text-xs"
              >
                Lihat Katalog
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
