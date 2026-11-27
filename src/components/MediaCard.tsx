"use client";

import { Eye, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";

interface MediaCardProps {
  item: MediaItem;
  showRank?: boolean;
  onSelect: (item: MediaItem) => void;
}

export function MediaCard({ item, showRank = false, onSelect }: MediaCardProps) {
  return (
    <button
      type="button"
      data-tv-focusable="true"
      onClick={() => onSelect(item)}
      className="group relative flex w-[155px] shrink-0 flex-col text-left outline-none transition-transform duration-200 hover:scale-105 focus:scale-105 sm:w-[185px] lg:w-[205px]"
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-zinc-900 shadow-lg ring-1 ring-white/10 transition group-hover:ring-2 group-hover:ring-white/60 group-focus:ring-4 group-focus:ring-white">
        <img
          src={item.posterUrl}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:brightness-110"
        />

        {/* Top Badges */}
        <div className="absolute inset-x-2 top-2 flex items-start justify-between gap-1">
          <span className="rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zinc-100 backdrop-blur-sm">
            {item.mediaType === "tv" ? "Serie" : "Película"}
          </span>

          <span className="inline-flex items-center gap-0.5 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-bold text-amber-400 backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400" />
            {item.rating.toFixed(1)}
          </span>
        </div>

        {/* Rank Badge */}
        {showRank && item.rank ? (
          <div className="absolute bottom-2 left-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#e50914] text-sm font-black text-white shadow-md">
            #{item.rank}
          </div>
        ) : null}

        {/* Platform Dots */}
        {item.platforms.length > 0 && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/75 px-2 py-1 backdrop-blur-sm">
            {item.platforms.slice(0, 2).map((p) => (
              <span
                key={p.id}
                title={p.name}
                className="text-[10px] font-bold text-white"
              >
                {p.shortName}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-2 space-y-0.5 px-0.5">
        <h4 className="line-clamp-1 text-sm font-semibold text-zinc-100 group-hover:text-white group-focus:text-white">
          {item.title}
        </h4>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>{item.year}</span>
          {item.traktWatchers ? (
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <Eye className="h-3 w-3" />
              {item.traktWatchers.toLocaleString()}
            </span>
          ) : (
            <span className="line-clamp-1">{item.genres[0] || "Trending"}</span>
          )}
        </div>
      </div>
    </button>
  );
}
