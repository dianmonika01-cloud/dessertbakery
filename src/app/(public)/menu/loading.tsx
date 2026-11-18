import React from "react";

export default function MenuLoading() {
  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom space-y-10">
        <div className="space-y-3 max-w-xl">
          <div className="h-4 w-32 rounded bg-brand-beige/60 animate-pulse" />
          <div className="h-10 w-72 rounded bg-brand-beige/70 animate-pulse" />
          <div className="h-4 w-full rounded bg-brand-beige/50 animate-pulse" />
        </div>

        <div className="card-surface p-6 space-y-4">
          <div className="h-11 w-full rounded-xl bg-brand-beige/40 animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="h-9 w-28 rounded-xl bg-brand-beige/40 animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="card-surface h-80 animate-pulse bg-brand-beige/30"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
