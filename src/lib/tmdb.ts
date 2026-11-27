import { PLATFORM_MAP, STREAMING_PLATFORMS, TMDB_GENRES } from "./platforms";
import type { MediaDetails, MediaItem, MediaType, PlatformInfo } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG_POSTER = "https://image.tmdb.org/t/p/w500";
const TMDB_IMG_BACKDROP = "https://image.tmdb.org/t/p/w1280";
const TMDB_IMG_LOGO = "https://image.tmdb.org/t/p/w92";

export function isTmdbConfigured(): boolean {
  return Boolean(process.env.TMDB_API_KEY || process.env.TMDB_READ_ACCESS_TOKEN);
}

interface TmdbRawItem {
  id: number;
  media_type?: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | undefined> = {}
): Promise<T | null> {
  const apiKey = process.env.TMDB_API_KEY;
  const bearer = process.env.TMDB_READ_ACCESS_TOKEN;
  if (!apiKey && !bearer) return null;

  const url = new URL(`${TMDB_BASE}${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  if (!bearer && apiKey) {
    url.searchParams.set("api_key", apiKey);
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        accept: "application/json",
        ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
      },
      next: { revalidate: 1800 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export function normalizeTmdbItem(
  raw: TmdbRawItem,
  fallbackType: MediaType,
  knownPlatforms: PlatformInfo[] = []
): MediaItem | null {
  if (raw.media_type === "person") return null;
  const mediaType: MediaType =
    raw.media_type === "movie" || raw.media_type === "tv"
      ? raw.media_type
      : fallbackType;

  const title = raw.title || raw.name || raw.original_title || raw.original_name;
  if (!title || !raw.poster_path) return null;

  const releaseDate = raw.release_date || raw.first_air_date || "";
  const year = releaseDate ? releaseDate.slice(0, 4) : "—";

  const genres = raw.genres
    ? raw.genres.map((g) => g.name)
    : (raw.genre_ids || [])
        .map((id) => TMDB_GENRES[id])
        .filter((g): g is string => Boolean(g));

  return {
    id: `${mediaType}-${raw.id}`,
    tmdbId: raw.id,
    mediaType,
    title,
    originalTitle: raw.original_title || raw.original_name,
    overview:
      raw.overview?.trim() ||
      "Sin sinopsis disponible en español para este título.",
    posterUrl: `${TMDB_IMG_POSTER}${raw.poster_path}`,
    backdropUrl: raw.backdrop_path
      ? `${TMDB_IMG_BACKDROP}${raw.backdrop_path}`
      : `${TMDB_IMG_POSTER}${raw.poster_path}`,
    releaseDate,
    year,
    rating: Number((raw.vote_average ?? 0).toFixed(1)),
    voteCount: raw.vote_count ?? 0,
    popularity: Math.round(raw.popularity ?? 0),
    genres: genres.slice(0, 4),
    platforms: knownPlatforms,
    sourceTag: "TMDB",
  };
}

export async function fetchTmdbList(
  path: string,
  fallbackType: MediaType,
  params: Record<string, string | number | undefined> = {},
  knownPlatforms: PlatformInfo[] = []
): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results?: TmdbRawItem[] }>(path, params);
  if (!data?.results) return [];
  return data.results
    .map((item) => normalizeTmdbItem(item, fallbackType, knownPlatforms))
    .filter((item): item is MediaItem => item !== null)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export async function fetchTmdbByPlatform(
  platformId: Exclude<keyof typeof PLATFORM_MAP, never>,
  region: string,
  language: string
): Promise<MediaItem[]> {
  const platform = PLATFORM_MAP[platformId];
  const providerParam = platform.tmdbIds.join("|");

  const [movies, tv] = await Promise.all([
    fetchTmdbList(
      "/discover/movie",
      "movie",
      {
        language,
        watch_region: region,
        with_watch_providers: providerParam,
        with_monetization_types: "flatrate",
        sort_by: "popularity.desc",
      },
      [platform]
    ),
    fetchTmdbList(
      "/discover/tv",
      "tv",
      {
        language,
        watch_region: region,
        with_watch_providers: providerParam,
        with_monetization_types: "flatrate",
        sort_by: "popularity.desc",
      },
      [platform]
    ),
  ]);

  // Interleave movies and series sorted by popularity
  return [...tv, ...movies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export async function fetchTmdbDetails(
  mediaType: MediaType,
  tmdbId: number,
  region: string,
  language: string
): Promise<MediaDetails | null> {
  interface RawDetail extends TmdbRawItem {
    runtime?: number;
    episode_run_time?: number[];
    number_of_seasons?: number;
    number_of_episodes?: number;
    status?: string;
    tagline?: string;
    credits?: {
      cast?: { name: string; character: string }[];
    };
    videos?: {
      results?: { key: string; site: string; type: string }[];
    };
    "watch/providers"?: {
      results?: Record<
        string,
        {
          flatrate?: { provider_id: number; provider_name: string; logo_path?: string }[];
          free?: { provider_id: number; provider_name: string; logo_path?: string }[];
          ads?: { provider_id: number; provider_name: string; logo_path?: string }[];
        }
      >;
    };
  }

  const raw = await tmdbFetch<RawDetail>(`/${mediaType}/${tmdbId}`, {
    language,
    append_to_response: "credits,videos,watch/providers",
  });
  if (!raw) return null;

  const regionProviders =
    raw["watch/providers"]?.results?.[region] ||
    raw["watch/providers"]?.results?.["US"];

  const flatrate = regionProviders?.flatrate ?? [];
  const matchedPlatforms: PlatformInfo[] = [];
  for (const p of STREAMING_PLATFORMS) {
    if (flatrate.some((fp) => p.tmdbIds.includes(fp.provider_id))) {
      matchedPlatforms.push(p);
    }
  }

  const base = normalizeTmdbItem(raw, mediaType, matchedPlatforms);
  if (!base) return null;

  const ytTrailer =
    raw.videos?.results?.find(
      (v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
    ) || raw.videos?.results?.find((v) => v.site === "YouTube");

  const watchProviders = [
    ...(regionProviders?.flatrate || []).map((p) => ({
      name: p.provider_name,
      logoUrl: p.logo_path ? `${TMDB_IMG_LOGO}${p.logo_path}` : undefined,
      type: "flatrate" as const,
    })),
    ...(regionProviders?.free || []).map((p) => ({
      name: p.provider_name,
      logoUrl: p.logo_path ? `${TMDB_IMG_LOGO}${p.logo_path}` : undefined,
      type: "free" as const,
    })),
  ];

  return {
    ...base,
    runtimeMinutes: raw.runtime ?? raw.episode_run_time?.[0],
    seasons: raw.number_of_seasons,
    episodes: raw.number_of_episodes,
    status: raw.status,
    tagline: raw.tagline,
    cast: (raw.credits?.cast || []).slice(0, 6).map((c) => ({
      name: c.name,
      character: c.character,
    })),
    trailerUrl: ytTrailer
      ? `https://www.youtube.com/watch?v=${ytTrailer.key}`
      : `https://www.youtube.com/results?search_query=${encodeURIComponent(
          base.title + " trailer"
        )}`,
    watchProviders,
  };
}
