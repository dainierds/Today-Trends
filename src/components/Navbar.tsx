"use client";

import { RefreshCw, Search, Tv, Film, Flame, X } from "lucide-react";
import type { MediaType } from "@/lib/types";

interface NavbarProps {
  mode: "live" | "demo";
  hasTrakt: boolean;
  mediaFilter: "all" | MediaType;
  onMediaFilterChange: (filter: "all" | MediaType) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Navbar({
  mode,
  hasTrakt,
  mediaFilter,
  onMediaFilterChange,
  searchQuery,
  onSearchChange,
  onRefresh,
  isRefreshing,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0b0f]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-8">
        {/* Brand + Live Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e50914] text-white shadow-lg shadow-red-900/40">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-lg font-extrabold tracking-wider text-white sm:text-xl">
                TODAY <span className="text-[#e50914]">TRENDS</span>
              </h1>
              <p className="text-[11px] text-zinc-400">
                Monitor de Streaming Global
              </p>
            </div>
          </div>

          <span
            className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium sm:inline-flex ${
              mode === "live"
                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                mode === "live" ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
              }`}
            />
            {mode === "live"
              ? hasTrakt
                ? "EN VIVO · TMDB + Trakt"
                : "EN VIVO · TMDB"
              : "MODO DEMO"}
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 rounded-full bg-white/5 p-1">
          {[
            { id: "all", label: "Todo", icon: Flame },
            { id: "tv", label: "Series", icon: Tv },
            { id: "movie", label: "Películas", icon: Film },
          ].map(({ id, label, icon: Icon }) => {
            const active = mediaFilter === id;
            return (
              <button
                key={id}
                type="button"
                data-tv-focusable="true"
                onClick={() => onMediaFilterChange(id as "all" | MediaType)}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition outline-none focus:ring-2 focus:ring-white ${
                  active
                    ? "bg-[#e50914] text-white shadow"
                    : "text-zinc-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Search + Refresh */}
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              data-tv-focusable="true"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar serie o película..."
              className="w-44 rounded-full border border-white/15 bg-white/5 py-1.5 pl-9 pr-8 text-sm text-white placeholder:text-zinc-400 outline-none transition focus:w-60 focus:border-white focus:bg-white/10 sm:w-56"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Limpiar búsqueda"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            data-tv-focusable="true"
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Actualizar tendencias ahora"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm font-medium text-zinc-200 outline-none transition hover:bg-white/15 focus:ring-2 focus:ring-white disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            <span className="hidden md:inline">Actualizar</span>
          </button>
        </div>
      </div>
    </header>
  );
}
