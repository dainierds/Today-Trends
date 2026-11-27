"use client";

import { useCallback, useMemo, useState } from "react";
import { useTvNavigation } from "@/hooks/useTvNavigation";
import type {
  CatalogResponse,
  CatalogRow,
  MediaItem,
  MediaType,
  PlatformId,
} from "@/lib/types";
import { DetailModal } from "./DetailModal";
import { HeroBanner } from "./HeroBanner";
import { MediaRow } from "./MediaRow";
import { Navbar } from "./Navbar";
import { PlatformBar } from "./PlatformBar";

interface TrendsAppProps {
  initialData: CatalogResponse;
}

export function TrendsApp({ initialData }: TrendsAppProps) {
  const [catalog, setCatalog] = useState<CatalogResponse>(initialData);
  const [mediaFilter, setMediaFilter] = useState<"all" | MediaType>("all");
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformId>("all");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleCloseModal = useCallback(() => {
    setSelectedItem(null);
  }, []);

  useTvNavigation({
    isModalOpen: Boolean(selectedItem),
    onCloseModal: handleCloseModal,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/catalog", { cache: "no-store" });
      if (res.ok) {
        const fresh = (await res.json()) as CatalogResponse;
        setCatalog(fresh);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRows: CatalogRow[] = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return catalog.rows
      .filter((row) => {
        if (
          selectedPlatform !== "all" &&
          row.category === "platform" &&
          row.platformId &&
          row.platformId !== selectedPlatform
        ) {
          return false;
        }
        return true;
      })
      .map((row) => {
        const items = row.items.filter((item) => {
          if (mediaFilter !== "all" && item.mediaType !== mediaFilter) {
            return false;
          }
          if (
            selectedPlatform !== "all" &&
            row.platformId !== selectedPlatform &&
            item.platforms.length > 0 &&
            !item.platforms.some((p) => p.id === selectedPlatform)
          ) {
            return false;
          }
          if (
            selectedGenre !== "all" &&
            !item.genres.some((g) =>
              g.toLowerCase().includes(selectedGenre.toLowerCase())
            )
          ) {
            return false;
          }
          if (q) {
            const haystack = `${item.title} ${item.originalTitle || ""} ${
              item.overview
            } ${item.genres.join(" ")}`.toLowerCase();
            if (!haystack.includes(q)) return false;
          }
          return true;
        });

        return { ...row, items };
      })
      .filter((row) => row.items.length > 0);
  }, [catalog.rows, mediaFilter, selectedPlatform, selectedGenre, searchQuery]);

  const heroItem = useMemo(() => {
    for (const row of filteredRows) {
      if (row.items.length > 0) return row.items[0];
    }
    return catalog.hero;
  }, [filteredRows, catalog.hero]);

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white">
      <Navbar
        mode={catalog.mode}
        hasTrakt={catalog.hasTrakt}
        mediaFilter={mediaFilter}
        onMediaFilterChange={setMediaFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      <PlatformBar
        selectedPlatform={selectedPlatform}
        onSelectPlatform={setSelectedPlatform}
        selectedGenre={selectedGenre}
        onSelectGenre={setSelectedGenre}
      />

      {catalog.mode === "demo" && (
        <div className="border-b border-amber-500/20 bg-amber-500/10 px-4 py-2 text-center text-xs text-amber-200 sm:px-8">
          Mostrando <strong>catálogo de demostración</strong>. Agrega{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5">TMDB_API_KEY</code>{" "}
          (y opcionalmente{" "}
          <code className="rounded bg-black/40 px-1.5 py-0.5">
            TRAKT_CLIENT_ID
          </code>
          ) en tu archivo <code className="rounded bg-black/40 px-1.5 py-0.5">.env.local</code>{" "}
          o en Vercel para monitorear tendencias reales en vivo.
        </div>
      )}

      {!searchQuery && <HeroBanner item={heroItem} onOpenDetails={setSelectedItem} />}

      <main className="mx-auto max-w-[1600px] space-y-10 py-8">
        {filteredRows.length === 0 ? (
          <div className="px-4 py-20 text-center text-zinc-400 sm:px-8">
            <p className="text-lg font-semibold text-white">
              No se encontraron títulos con los filtros actuales
            </p>
            <p className="mt-1 text-sm">
              Prueba cambiando de plataforma, género o limpiando la búsqueda.
            </p>
          </div>
        ) : (
          filteredRows.map((row) => (
            <MediaRow key={row.id} row={row} onSelectItem={setSelectedItem} />
          ))
        )}
      </main>

      <footer className="border-t border-white/10 px-4 py-6 text-center text-xs text-zinc-500 sm:px-8">
        <p>
          Today Trends · Monitor de tendencias (TMDB + Trakt). Compatible con
          Web (Vercel) y control remoto Fire TV (D-Pad).
        </p>
      </footer>

      <DetailModal item={selectedItem} onClose={handleCloseModal} />
    </div>
  );
}
