import { getDemoCatalog } from "./demo-data";
import { GENRE_FILTERS } from "./platforms";
import { fetchTmdbByPlatform, fetchTmdbList, isTmdbConfigured } from "./tmdb";
import {
  fetchTraktAllTimeWatched,
  fetchTraktTrending,
  isTraktConfigured,
} from "./trakt";
import type { CatalogResponse, CatalogRow } from "./types";

export async function getCatalogData(): Promise<CatalogResponse> {
  const hasTmdb = isTmdbConfigured();
  const hasTrakt = isTraktConfigured();

  if (!hasTmdb) {
    return getDemoCatalog();
  }

  const region = process.env.DEFAULT_REGION || "US";
  const language = process.env.DEFAULT_LANGUAGE || "es-MX";

  const [
    trendingAll,
    popularMovies,
    popularTv,
    topRatedMovies,
    topRatedTv,
    netflix,
    prime,
    max,
    disney,
    paramount,
    peacock,
    apple,
    traktLive,
    traktAllTime,
    actionMovies,
    sciFiTv,
  ] = await Promise.all([
    fetchTmdbList("/trending/all/day", "movie", { language }),
    fetchTmdbList("/movie/popular", "movie", { language, region }),
    fetchTmdbList("/tv/popular", "tv", { language }),
    fetchTmdbList("/movie/top_rated", "movie", { language, region }),
    fetchTmdbList("/tv/top_rated", "tv", { language }),
    fetchTmdbByPlatform("netflix", region, language),
    fetchTmdbByPlatform("prime", region, language),
    fetchTmdbByPlatform("max", region, language),
    fetchTmdbByPlatform("disney", region, language),
    fetchTmdbByPlatform("paramount", region, language),
    fetchTmdbByPlatform("peacock", region, language),
    fetchTmdbByPlatform("apple", region, language),
    hasTrakt ? fetchTraktTrending(language) : Promise.resolve([]),
    hasTrakt ? fetchTraktAllTimeWatched(language) : Promise.resolve([]),
    fetchTmdbList("/discover/movie", "movie", {
      language,
      with_genres: String(
        GENRE_FILTERS.find((g) => g.id === "Acción")?.movieGenreId ?? 28
      ),
      sort_by: "popularity.desc",
    }),
    fetchTmdbList("/discover/tv", "tv", {
      language,
      with_genres: String(
        GENRE_FILTERS.find((g) => g.id === "Ciencia Ficción")?.tvGenreId ?? 10765
      ),
      sort_by: "popularity.desc",
    }),
  ]);

  if (trendingAll.length === 0) {
    return getDemoCatalog();
  }

  const topRatedMixed = [...topRatedTv, ...topRatedMovies]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const popularMixed = [...popularTv, ...popularMovies]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const rawRows: CatalogRow[] = [
    {
      id: "trending-now",
      title: "Tendencia Ahora Mismo",
      subtitle: "Lo más buscado y comentado hoy a nivel global",
      category: "trending",
      items: trendingAll,
    },
    ...(traktLive.length > 0
      ? [
          {
            id: "trakt-live",
            title: "Más Vistas en Tiempo Real (Trakt Live)",
            subtitle: "Personas reproduciendo estos títulos ahora mismo",
            category: "trakt-live" as const,
            items: traktLive,
          },
        ]
      : [
          {
            id: "popular-now",
            title: "Más Populares del Momento",
            subtitle: "Series y películas con mayor impulso semanal",
            category: "trending" as const,
            items: popularMixed,
          },
        ]),
    {
      id: "top-netflix",
      title: "Top en Netflix",
      subtitle: "Series y películas destacadas en Netflix",
      category: "platform",
      platformId: "netflix",
      items: netflix,
    },
    {
      id: "top-prime",
      title: "Top en Amazon Prime Video",
      subtitle: "Lo más popular en Prime Video",
      category: "platform",
      platformId: "prime",
      items: prime,
    },
    {
      id: "top-max",
      title: "Top en Max (HBO)",
      subtitle: "Éxitos y estrenos en HBO Max",
      category: "platform",
      platformId: "max",
      items: max,
    },
    {
      id: "top-disney",
      title: "Top en Disney+",
      subtitle: "Tendencias en Disney+, Marvel, Pixar y Star Wars",
      category: "platform",
      platformId: "disney",
      items: disney,
    },
    {
      id: "top-paramount",
      title: "Top en Paramount+",
      subtitle: "Lo más visto en Paramount+",
      category: "platform",
      platformId: "paramount",
      items: paramount,
    },
    {
      id: "top-peacock",
      title: "Top en Peacock",
      subtitle: "Series y estrenos populares en Peacock",
      category: "platform",
      platformId: "peacock",
      items: peacock,
    },
    {
      id: "top-apple",
      title: "Top en Apple TV+",
      subtitle: "Originales mejor posicionados en Apple TV+",
      category: "platform",
      platformId: "apple",
      items: apple,
    },
    {
      id: "all-time-watched",
      title:
        traktAllTime.length > 0
          ? "Más Vistas de Todos los Tiempos (Trakt)"
          : "Clásicos y Mejor Valoradas de Todos los Tiempos",
      subtitle:
        traktAllTime.length > 0
          ? "Histórico acumulado de reproducciones globales"
          : "Las series y películas con mejor calificación histórica",
      category: "all-time",
      items: traktAllTime.length > 0 ? traktAllTime : topRatedMixed,
    },
    ...(traktAllTime.length > 0
      ? [
          {
            id: "top-rated",
            title: "Mejor Valoradas (Opiniones y Crítica)",
            subtitle: "Consenso más alto en calificaciones",
            category: "all-time" as const,
            items: topRatedMixed,
          },
        ]
      : []),
    {
      id: "genre-action",
      title: "Acción y Adrenalina",
      subtitle: "Películas de acción en tendencia",
      category: "genre",
      items: actionMovies,
    },
    {
      id: "genre-scifi",
      title: "Sci-Fi y Fantasía",
      subtitle: "Series de ciencia ficción y mundos fantásticos",
      category: "genre",
      items: sciFiTv,
    },
  ];
  const rows = rawRows.filter((row) => row.items.length > 0);

  return {
    mode: "live",
    hasTmdb,
    hasTrakt,
    updatedAt: new Date().toISOString(),
    region,
    language,
    hero: trendingAll[0],
    rows,
  };
}
