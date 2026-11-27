import { normalizeTmdbItem, tmdbFetch } from "./tmdb";
import type { MediaItem, MediaType } from "./types";

const TRAKT_BASE = "https://api.trakt.tv";

export function isTraktConfigured(): boolean {
  return Boolean(process.env.TRAKT_CLIENT_ID);
}

interface TraktMediaObj {
  title: string;
  year?: number;
  ids?: {
    trakt?: number;
    imdb?: string;
    tmdb?: number;
  };
}

interface TraktTrendingEntry {
  watchers?: number;
  movie?: TraktMediaObj;
  show?: TraktMediaObj;
}

interface TraktWatchedEntry {
  watcher_count?: number;
  play_count?: number;
  movie?: TraktMediaObj;
  show?: TraktMediaObj;
}

async function traktFetch<T>(path: string): Promise<T | null> {
  const clientId = process.env.TRAKT_CLIENT_ID;
  if (!clientId) return null;

  try {
    const res = await fetch(`${TRAKT_BASE}${path}`, {
      headers: {
        "Content-Type": "application/json",
        "trakt-api-version": "2",
        "trakt-api-key": clientId,
      },
      next: { revalidate: 900 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function enrichWithTmdb(
  tmdbId: number,
  mediaType: MediaType,
  language: string,
  extra: { traktWatchers?: number; traktPlays?: number }
): Promise<MediaItem | null> {
  const raw = await tmdbFetch<Record<string, unknown>>(`/${mediaType}/${tmdbId}`, {
    language,
  });
  if (!raw) return null;
  const item = normalizeTmdbItem(raw as unknown as { id: number }, mediaType);
  if (!item) return null;
  return {
    ...item,
    traktWatchers: extra.traktWatchers,
    traktPlays: extra.traktPlays,
    sourceTag: "Trakt + TMDB",
  };
}

export async function fetchTraktTrending(
  language: string,
  limit = 10
): Promise<MediaItem[]> {
  const [movies, shows] = await Promise.all([
    traktFetch<TraktTrendingEntry[]>(`/movies/trending?limit=${limit}`),
    traktFetch<TraktTrendingEntry[]>(`/shows/trending?limit=${limit}`),
  ]);

  const combined: {
    tmdbId: number;
    mediaType: MediaType;
    watchers: number;
  }[] = [];

  for (const m of movies || []) {
    if (m.movie?.ids?.tmdb) {
      combined.push({
        tmdbId: m.movie.ids.tmdb,
        mediaType: "movie",
        watchers: m.watchers ?? 0,
      });
    }
  }
  for (const s of shows || []) {
    if (s.show?.ids?.tmdb) {
      combined.push({
        tmdbId: s.show.ids.tmdb,
        mediaType: "tv",
        watchers: s.watchers ?? 0,
      });
    }
  }

  combined.sort((a, b) => b.watchers - a.watchers);

  const enriched = await Promise.all(
    combined.slice(0, 14).map((entry) =>
      enrichWithTmdb(entry.tmdbId, entry.mediaType, language, {
        traktWatchers: entry.watchers,
      })
    )
  );

  return enriched
    .filter((i): i is MediaItem => i !== null)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export async function fetchTraktAllTimeWatched(
  language: string,
  limit = 10
): Promise<MediaItem[]> {
  const [movies, shows] = await Promise.all([
    traktFetch<TraktWatchedEntry[]>(`/movies/watched/all?limit=${limit}`),
    traktFetch<TraktWatchedEntry[]>(`/shows/watched/all?limit=${limit}`),
  ]);

  const combined: {
    tmdbId: number;
    mediaType: MediaType;
    plays: number;
    watchers: number;
  }[] = [];

  for (const m of movies || []) {
    if (m.movie?.ids?.tmdb) {
      combined.push({
        tmdbId: m.movie.ids.tmdb,
        mediaType: "movie",
        plays: m.play_count ?? 0,
        watchers: m.watcher_count ?? 0,
      });
    }
  }
  for (const s of shows || []) {
    if (s.show?.ids?.tmdb) {
      combined.push({
        tmdbId: s.show.ids.tmdb,
        mediaType: "tv",
        plays: s.play_count ?? 0,
        watchers: s.watcher_count ?? 0,
      });
    }
  }

  combined.sort((a, b) => b.plays - a.plays);

  const enriched = await Promise.all(
    combined.slice(0, 14).map((entry) =>
      enrichWithTmdb(entry.tmdbId, entry.mediaType, language, {
        traktPlays: entry.plays,
        traktWatchers: entry.watchers,
      })
    )
  );

  return enriched
    .filter((i): i is MediaItem => i !== null)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}
