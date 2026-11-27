"use client";

import { Eye, Info, Star, TrendingUp } from "lucide-react";
import type { MediaItem } from "@/lib/types";

interface HeroBannerProps {
  item: MediaItem;
  onOpenDetails: (item: MediaItem) => void;
}

export function HeroBanner({ item, onOpenDetails }: HeroBannerProps) {
  return (
    <section className="relative h-[56vh] min-h-[420px] max-h-[640px] w-full overflow-hidden">
      {/* Backdrop */}
      <img
        src={item.backdropUrl}
        alt={item.title}
        className="h-full w-full object-cover object-center"
      />

      {/* Cinema Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b0f] via-[#0b0b0f]/65 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 mx-auto flex max-w-[1600px] flex-col justify-end px-4 pb-12 sm:px-8 lg:pb-16">
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#e50914] px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-white">
              <TrendingUp className="h-3.5 w-3.5" />#1 Tendencia Hoy
            </span>
            <span className="rounded bg-white/15 px-2.5 py-0.5 text-xs font-semibold uppercase text-zinc-200 backdrop-blur-sm">
              {item.mediaType === "tv" ? "Serie" : "Película"}
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-black/50 px-2.5 py-0.5 text-xs font-semibold text-amber-400 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 fill-amber-400" />
              {item.rating.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-zinc-300">
              {item.year}
            </span>
            {item.traktWatchers ? (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                <Eye className="h-3.5 w-3.5" />
                {item.traktWatchers.toLocaleString()} viendo ahora
              </span>
            ) : null}
          </div>

          <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md sm:text-5xl">
            {item.title}
          </h2>

          <p className="line-clamp-3 text-sm leading-relaxed text-zinc-200 sm:text-base">
            {item.overview}
          </p>

          {item.platforms.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {item.platforms.map((p) => (
                <span
                  key={p.id}
                  className="rounded-full px-3 py-0.5 text-xs font-bold text-white shadow"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="button"
              data-tv-focusable="true"
              onClick={() => onOpenDetails(item)}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-black shadow-lg transition hover:bg-zinc-200 outline-none focus:ring-4 focus:ring-[#e50914]"
            >
              <Info className="h-4 w-4" />
              Ver Detalles y Dónde Ver
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
