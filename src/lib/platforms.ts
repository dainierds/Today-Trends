import type { PlatformId, PlatformInfo } from "./types";

export const STREAMING_PLATFORMS: PlatformInfo[] = [
  {
    id: "netflix",
    name: "Netflix",
    shortName: "Netflix",
    color: "#E50914",
    tmdbIds: [8],
  },
  {
    id: "prime",
    name: "Amazon Prime Video",
    shortName: "Prime",
    color: "#00A8E1",
    tmdbIds: [9, 119],
  },
  {
    id: "max",
    name: "Max (HBO)",
    shortName: "Max",
    color: "#002BE7",
    tmdbIds: [1899, 384],
  },
  {
    id: "disney",
    name: "Disney+",
    shortName: "Disney+",
    color: "#113CCF",
    tmdbIds: [337],
  },
  {
    id: "paramount",
    name: "Paramount+",
    shortName: "Paramount+",
    color: "#0064FF",
    tmdbIds: [531],
  },
  {
    id: "peacock",
    name: "Peacock",
    shortName: "Peacock",
    color: "#F4B400",
    tmdbIds: [386, 387],
  },
  {
    id: "apple",
    name: "Apple TV+",
    shortName: "Apple TV+",
    color: "#555555",
    tmdbIds: [350],
  },
];

export const PLATFORM_MAP: Record<Exclude<PlatformId, "all">, PlatformInfo> =
  STREAMING_PLATFORMS.reduce(
    (acc, p) => {
      acc[p.id] = p;
      return acc;
    },
    {} as Record<Exclude<PlatformId, "all">, PlatformInfo>
  );

export const TMDB_GENRES: Record<number, string> = {
  28: "Acción",
  12: "Aventura",
  16: "Animación",
  35: "Comedia",
  80: "Crimen",
  99: "Documental",
  18: "Drama",
  10751: "Familia",
  14: "Fantasía",
  36: "Historia",
  27: "Terror",
  10402: "Música",
  9648: "Misterio",
  10749: "Romance",
  878: "Ciencia Ficción",
  53: "Suspenso",
  10752: "Bélica",
  37: "Western",
  10759: "Acción y Aventura",
  10765: "Sci-Fi y Fantasía",
  10768: "Guerra y Política",
};

export const GENRE_FILTERS = [
  { id: "all", label: "Todos los géneros" },
  { id: "Acción", label: "Acción", movieGenreId: 28, tvGenreId: 10759 },
  { id: "Ciencia Ficción", label: "Sci-Fi y Fantasía", movieGenreId: 878, tvGenreId: 10765 },
  { id: "Drama", label: "Drama", movieGenreId: 18, tvGenreId: 18 },
  { id: "Comedia", label: "Comedia", movieGenreId: 35, tvGenreId: 35 },
  { id: "Crimen", label: "Crimen y Misterio", movieGenreId: 80, tvGenreId: 80 },
  { id: "Suspenso", label: "Suspenso y Terror", movieGenreId: 53, tvGenreId: 9648 },
  { id: "Animación", label: "Animación", movieGenreId: 16, tvGenreId: 16 },
];
