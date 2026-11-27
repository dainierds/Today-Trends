export type MediaType = "movie" | "tv";

export type PlatformId =
  | "all"
  | "netflix"
  | "prime"
  | "max"
  | "disney"
  | "paramount"
  | "peacock"
  | "apple";

export interface PlatformInfo {
  id: Exclude<PlatformId, "all">;
  name: string;
  shortName: string;
  color: string;
  tmdbIds: number[];
}

export interface MediaItem {
  id: string;
  tmdbId: number;
  mediaType: MediaType;
  title: string;
  originalTitle?: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  releaseDate: string;
  year: string;
  rating: number;
  voteCount: number;
  popularity: number;
  genres: string[];
  platforms: PlatformInfo[];
  traktWatchers?: number;
  traktPlays?: number;
  rank?: number;
  sourceTag?: string;
}

export interface CatalogRow {
  id: string;
  title: string;
  subtitle: string;
  category: "trending" | "trakt-live" | "all-time" | "platform" | "genre";
  platformId?: Exclude<PlatformId, "all">;
  items: MediaItem[];
}

export interface CatalogResponse {
  mode: "live" | "demo";
  hasTmdb: boolean;
  hasTrakt: boolean;
  updatedAt: string;
  region: string;
  language: string;
  hero: MediaItem;
  rows: CatalogRow[];
}

export interface MediaDetails extends MediaItem {
  runtimeMinutes?: number;
  seasons?: number;
  episodes?: number;
  status?: string;
  tagline?: string;
  cast: { name: string; character: string }[];
  trailerUrl?: string;
  watchProviders: {
    name: string;
    logoUrl?: string;
    type: "flatrate" | "free" | "ads" | "rent" | "buy";
  }[];
}
