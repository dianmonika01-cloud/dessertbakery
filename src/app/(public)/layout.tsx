import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/services/store.service";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <Navbar storeName={settings.store_name} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
