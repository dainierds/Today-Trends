"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { CatalogRow, MediaItem } from "@/lib/types";
import { MediaCard } from "./MediaCard";

interface MediaRowProps {
  row: CatalogRow;
  onSelectItem: (item: MediaItem) => void;
}

export function MediaRow({ row, onSelectItem }: MediaRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.78);
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  if (row.items.length === 0) return null;

  const showRank =
    row.category === "trending" ||
    row.category === "trakt-live" ||
    row.category === "platform" ||
    row.category === "all-time";

  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between px-4 sm:px-8">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white sm:text-xl">
            {row.title}
          </h3>
          <p className="text-xs text-zinc-400 sm:text-sm">{row.subtitle}</p>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          <button
            type="button"
            onClick={() => scrollByAmount("left")}
            aria-label={`Desplazar ${row.title} a la izquierda`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount("right")}
            aria-label={`Desplazar ${row.title} a la derecha`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/25"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        className="flex gap-3.5 overflow-x-auto px-4 py-2 scrollbar-none sm:gap-4 sm:px-8"
      >
        {row.items.map((item) => (
          <MediaCard
            key={`${row.id}-${item.id}`}
            item={item}
            showRank={showRank}
            onSelect={onSelectItem}
          />
        ))}
      </div>
    </section>
  );
}
