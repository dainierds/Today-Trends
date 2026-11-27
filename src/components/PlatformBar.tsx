"use client";

import { GENRE_FILTERS, STREAMING_PLATFORMS } from "@/lib/platforms";
import type { PlatformId } from "@/lib/types";

interface PlatformBarProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (id: PlatformId) => void;
  selectedGenre: string;
  onSelectGenre: (genre: string) => void;
}

export function PlatformBar({
  selectedPlatform,
  onSelectPlatform,
  selectedGenre,
  onSelectGenre,
}: PlatformBarProps) {
  return (
    <div className="border-b border-white/5 bg-[#0e0e14]/80">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-2.5 px-4 py-3 sm:px-8">
        {/* Streaming Platforms */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Plataformas:
          </span>
          <button
            type="button"
            data-tv-focusable="true"
            onClick={() => onSelectPlatform("all")}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition outline-none focus:ring-2 focus:ring-white ${
              selectedPlatform === "all"
                ? "bg-white text-black"
                : "bg-white/10 text-zinc-300 hover:bg-white/20"
            }`}
          >
            Todas
          </button>
          {STREAMING_PLATFORMS.map((platform) => {
            const active = selectedPlatform === platform.id;
            return (
              <button
                key={platform.id}
                type="button"
                data-tv-focusable="true"
                onClick={() => onSelectPlatform(platform.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition outline-none focus:ring-2 focus:ring-white ${
                  active
                    ? "text-white shadow-lg"
                    : "bg-white/5 text-zinc-300 hover:bg-white/15"
                }`}
                style={active ? { backgroundColor: platform.color } : undefined}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: active ? "#ffffff" : platform.color }}
                />
                {platform.name}
              </button>
            );
          })}
        </div>

        {/* Genres */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Géneros:
          </span>
          {GENRE_FILTERS.map((genre) => {
            const active = selectedGenre === genre.id;
            return (
              <button
                key={genre.id}
                type="button"
                data-tv-focusable="true"
                onClick={() => onSelectGenre(genre.id)}
                className={`shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition outline-none focus:ring-2 focus:ring-white ${
                  active
                    ? "bg-[#e50914] text-white"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                {genre.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
