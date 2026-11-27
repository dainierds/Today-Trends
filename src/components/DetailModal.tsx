"use client";

import { Clock, Eye, Play, Star, Tv, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { MediaDetails, MediaItem } from "@/lib/types";

interface DetailModalProps {
  item: MediaItem | null;
  onClose: () => void;
}

export function DetailModal({ item, onClose }: DetailModalProps) {
  const [details, setDetails] = useState<MediaDetails | null>(null);

  useEffect(() => {
    if (!item) return;

    let cancelled = false;
    fetch(`/api/details?type=${item.mediaType}&id=${item.tmdbId}`)
      .then((res) => res.json())
      .then((data: MediaDetails) => {
        if (!cancelled) {
          setDetails({
            ...item,
            ...data,
            traktWatchers: item.traktWatchers ?? data.traktWatchers,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDetails({
            ...item,
            cast: [],
            watchProviders: item.platforms.map((p) => ({
              name: p.name,
              type: "flatrate",
            })),
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [item]);

  if (!item) return null;

  const activeDetails = details?.id === item.id ? details : null;
  const loading = activeDetails === null;
  const active = activeDetails ?? item;

  return (
    <div
      data-tv-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/15 bg-[#14141b] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          data-tv-focusable="true"
          autoFocus
          onClick={onClose}
          aria-label="Cerrar detalles"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white outline-none transition hover:bg-[#e50914] focus:ring-2 focus:ring-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Backdrop Header */}
        <div className="relative h-60 w-full overflow-hidden sm:h-80">
          <img
            src={active.backdropUrl}
            alt={active.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#14141b] via-[#14141b]/40 to-transparent" />
          <div className="absolute bottom-4 left-6 right-16">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-[#e50914] px-2 py-0.5 text-xs font-bold uppercase text-white">
                {active.mediaType === "tv" ? "Serie" : "Película"}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-amber-400">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {active.rating.toFixed(1)} ({active.voteCount.toLocaleString()} votos)
              </span>
              <span className="text-xs font-medium text-zinc-200">
                {active.year}
              </span>
              {active.traktWatchers ? (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  <Eye className="h-3.5 w-3.5" />
                  {active.traktWatchers.toLocaleString()} viendo ahora
                </span>
              ) : null}
            </div>
            <h2 className="text-2xl font-black text-white sm:text-3xl">
              {active.title}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {activeDetails?.tagline ? (
            <p className="text-sm italic text-zinc-400">“{activeDetails.tagline}”</p>
          ) : null}

          <p className="text-sm leading-relaxed text-zinc-200 sm:text-base">
            {active.overview}
          </p>

          {/* Meta stats */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
            {activeDetails?.runtimeMinutes ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
                {activeDetails.runtimeMinutes} min
              </span>
            ) : null}
            {activeDetails?.seasons ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1">
                <Tv className="h-3.5 w-3.5 text-zinc-400" />
                {activeDetails.seasons} temporadas · {activeDetails.episodes} episodios
              </span>
            ) : null}
            {active.genres.map((g) => (
              <span
                key={g}
                className="rounded-md bg-white/10 px-2.5 py-1 text-zinc-200"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Where to Watch */}
          <div className="space-y-2.5 rounded-xl border border-white/10 bg-black/30 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Dónde verla (Streaming)
            </h3>
            {loading ? (
              <p className="text-sm text-zinc-400">Consultando plataformas...</p>
            ) : activeDetails && activeDetails.watchProviders.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {activeDetails.watchProviders.map((wp, idx) => (
                  <div
                    key={`${wp.name}-${idx}`}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    {wp.logoUrl ? (
                      <img
                        src={wp.logoUrl}
                        alt={wp.name}
                        className="h-5 w-5 rounded"
                      />
                    ) : null}
                    <span>{wp.name}</span>
                  </div>
                ))}
              </div>
            ) : active.platforms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {active.platforms.map((p) => (
                  <span
                    key={p.id}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold text-white"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400">
                Disponibilidad por región sujeta a catálogo local.
              </p>
            )}
          </div>

          {/* Cast */}
          {activeDetails && activeDetails.cast.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Reparto principal
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {activeDetails.cast.map((c) => (
                  <div
                    key={c.name}
                    className="rounded-lg bg-white/5 px-3 py-2 text-xs"
                  >
                    <div className="font-semibold text-white">{c.name}</div>
                    <div className="line-clamp-1 text-zinc-400">
                      {c.character}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            {activeDetails?.trailerUrl ? (
              <a
                href={activeDetails.trailerUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-tv-focusable="true"
                className="inline-flex items-center gap-2 rounded-lg bg-[#e50914] px-5 py-2.5 text-sm font-bold text-white outline-none transition hover:bg-red-700 focus:ring-2 focus:ring-white"
              >
                <Play className="h-4 w-4 fill-white" />
                Ver Tráiler en YouTube
              </a>
            ) : (
              <div />
            )}

            <button
              type="button"
              data-tv-focusable="true"
              onClick={onClose}
              className="rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 outline-none transition hover:bg-white/15 focus:ring-2 focus:ring-white"
            >
              Cerrar (Atrás)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
