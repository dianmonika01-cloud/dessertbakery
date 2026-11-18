import React from "react";
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-brand-cream">
      <Loader2 className="h-7 w-7 animate-spin text-brand-chocolate" />
      <p className="text-xs font-medium tracking-wider uppercase text-brand-darkBrown/65">
        Memuat Halaman By Dimo...
      </p>
    </div>
  );
}
