import { PLATFORM_MAP } from "./platforms";
import type { CatalogResponse, CatalogRow, MediaDetails, MediaItem } from "./types";

function makePosterSvg(title: string, accent: string, tag: string): string {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#141418"/>
        <stop offset="55%" stop-color="${accent}" stop-opacity="0.55"/>
        <stop offset="100%" stop-color="#09090b"/>
      </linearGradient>
    </defs>
    <rect width="500" height="750" fill="url(#g)"/>
    <circle cx="400" cy="140" r="150" fill="${accent}" fill-opacity="0.22"/>
    <rect x="36" y="42" width="160" height="34" rx="17" fill="#000000" fill-opacity="0.65"/>
    <text x="116" y="64" fill="#ffffff" font-family="Arial,sans-serif" font-size="14" font-weight="bold" text-anchor="middle">${tag}</text>
    <text x="36" y="600" fill="#ffffff" font-family="Arial,sans-serif" font-size="34" font-weight="bold">${safeTitle.slice(0, 22)}</text>
    <text x="36" y="642" fill="#d4d4d8" font-family="Arial,sans-serif" font-size="22">${safeTitle.length > 22 ? safeTitle.slice(22, 44) : "TODAY TRENDS DEMO"}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function makeBackdropSvg(title: string, accent: string): string {
  const safeTitle = title.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#09090b"/>
        <stop offset="55%" stop-color="${accent}" stop-opacity="0.45"/>
        <stop offset="100%" stop-color="#18181b"/>
      </linearGradient>
    </defs>
    <rect width="1280" height="720" fill="url(#bg)"/>
    <circle cx="960" cy="240" r="280" fill="${accent}" fill-opacity="0.2"/>
    <text x="900" y="650" fill="#ffffff" fill-opacity="0.12" font-family="Arial,sans-serif" font-size="72" font-weight="bold">${safeTitle.slice(0, 18)}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DEMO_ITEMS: MediaItem[] = [
  {
    id: "tv-1396",
    tmdbId: 1396,
    mediaType: "tv",
    title: "Breaking Bad",
    overview:
      "Un profesor de química diagnosticado con cáncer terminal se asocia con un exestudiante para asegurar el futuro de su familia mediante un imperio clandestino.",
    posterUrl: makePosterSvg("Breaking Bad", "#16a34a", "NETFLIX"),
    backdropUrl: makeBackdropSvg("Breaking Bad", "#16a34a"),
    releaseDate: "2008-01-20",
    year: "2008",
    rating: 8.9,
    voteCount: 14200,
    popularity: 980,
    genres: ["Drama", "Crimen"],
    platforms: [PLATFORM_MAP.netflix],
    traktWatchers: 4820,
    traktPlays: 92000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-100088",
    tmdbId: 100088,
    mediaType: "tv",
    title: "The Last of Us",
    overview:
      "Veinte años después de que una infección destruyera la civilización moderna, un sobreviviente endurecido es contratado para escoltar a una joven clave para la humanidad.",
    posterUrl: makePosterSvg("The Last of Us", "#2563eb", "MAX"),
    backdropUrl: makeBackdropSvg("The Last of Us", "#2563eb"),
    releaseDate: "2023-01-15",
    year: "2023",
    rating: 8.6,
    voteCount: 5400,
    popularity: 940,
    genres: ["Drama", "Ciencia Ficción", "Acción"],
    platforms: [PLATFORM_MAP.max],
    traktWatchers: 3910,
    traktPlays: 41000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-76479",
    tmdbId: 76479,
    mediaType: "tv",
    title: "The Boys",
    overview:
      "Un grupo de vigilantes se propone derribar a superhéroes corruptos que abusan de sus superpoderes mientras son protegidos por una megacorporación.",
    posterUrl: makePosterSvg("The Boys", "#00A8E1", "PRIME VIDEO"),
    backdropUrl: makeBackdropSvg("The Boys", "#00A8E1"),
    releaseDate: "2019-07-25",
    year: "2019",
    rating: 8.5,
    voteCount: 9800,
    popularity: 910,
    genres: ["Acción", "Ciencia Ficción", "Crimen"],
    platforms: [PLATFORM_MAP.prime],
    traktWatchers: 3420,
    traktPlays: 38000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-136315",
    tmdbId: 136315,
    mediaType: "tv",
    title: "The Bear",
    overview:
      "Un joven chef de alta cocina regresa a Chicago para hacerse cargo de la sandwichería familiar tras una tragedia, enfrentando caos en la cocina y deudas.",
    posterUrl: makePosterSvg("The Bear", "#113CCF", "DISNEY+"),
    backdropUrl: makeBackdropSvg("The Bear", "#113CCF"),
    releaseDate: "2022-06-23",
    year: "2022",
    rating: 8.4,
    voteCount: 2400,
    popularity: 850,
    genres: ["Drama", "Comedia"],
    platforms: [PLATFORM_MAP.disney],
    traktWatchers: 2890,
    traktPlays: 19500000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-73586",
    tmdbId: 73586,
    mediaType: "tv",
    title: "Yellowstone",
    overview:
      "La familia Dutton lucha por defender el rancho contiguo más grande de Estados Unidos frente a desarrolladores inmobiliarios y conflictos políticos.",
    posterUrl: makePosterSvg("Yellowstone", "#0064FF", "PARAMOUNT+"),
    backdropUrl: makeBackdropSvg("Yellowstone", "#0064FF"),
    releaseDate: "2018-06-20",
    year: "2018",
    rating: 8.2,
    voteCount: 2300,
    popularity: 820,
    genres: ["Drama", "Acción"],
    platforms: [PLATFORM_MAP.paramount, PLATFORM_MAP.peacock],
    traktWatchers: 2650,
    traktPlays: 22400000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-95396",
    tmdbId: 95396,
    mediaType: "tv",
    title: "Severance",
    overview:
      "Los empleados de Lumon Industries se someten a un procedimiento quirúrgico que separa sus recuerdos laborales de los personales, desatando un misterio corporativo.",
    posterUrl: makePosterSvg("Severance", "#52525b", "APPLE TV+"),
    backdropUrl: makeBackdropSvg("Severance", "#52525b"),
    releaseDate: "2022-02-18",
    year: "2022",
    rating: 8.5,
    voteCount: 1900,
    popularity: 880,
    genres: ["Drama", "Ciencia Ficción", "Suspenso"],
    platforms: [PLATFORM_MAP.apple],
    traktWatchers: 3180,
    traktPlays: 14800000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "movie-693134",
    tmdbId: 693134,
    mediaType: "movie",
    title: "Dune: Parte Dos",
    overview:
      "Paul Atreides se une a Chani y a los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia y enfrenta un destino inevitable.",
    posterUrl: makePosterSvg("Dune: Parte Dos", "#d97706", "MAX"),
    backdropUrl: makeBackdropSvg("Dune: Parte Dos", "#d97706"),
    releaseDate: "2024-02-27",
    year: "2024",
    rating: 8.3,
    voteCount: 5700,
    popularity: 960,
    genres: ["Ciencia Ficción", "Acción", "Drama"],
    platforms: [PLATFORM_MAP.max],
    traktWatchers: 4120,
    traktPlays: 29000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "movie-872585",
    tmdbId: 872585,
    mediaType: "movie",
    title: "Oppenheimer",
    overview:
      "La historia del físico J. Robert Oppenheimer y su papel decisivo en el Proyecto Manhattan que cambió para siempre la historia del siglo XX.",
    posterUrl: makePosterSvg("Oppenheimer", "#F4B400", "PEACOCK"),
    backdropUrl: makeBackdropSvg("Oppenheimer", "#F4B400"),
    releaseDate: "2023-07-19",
    year: "2023",
    rating: 8.1,
    voteCount: 9200,
    popularity: 890,
    genres: ["Drama", "Suspenso"],
    platforms: [PLATFORM_MAP.peacock, PLATFORM_MAP.prime],
    traktWatchers: 2740,
    traktPlays: 34000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "movie-533535",
    tmdbId: 533535,
    mediaType: "movie",
    title: "Deadpool & Wolverine",
    overview:
      "Wade Wilson deja atrás su vida tranquila cuando la Autoridad de Variación Temporal lo recluta junto a un Wolverine reacio para salvar su universo.",
    posterUrl: makePosterSvg("Deadpool & Wolverine", "#dc2626", "DISNEY+"),
    backdropUrl: makeBackdropSvg("Deadpool & Wolverine", "#dc2626"),
    releaseDate: "2024-07-24",
    year: "2024",
    rating: 7.7,
    voteCount: 6100,
    popularity: 950,
    genres: ["Acción", "Comedia", "Ciencia Ficción"],
    platforms: [PLATFORM_MAP.disney],
    traktWatchers: 3650,
    traktPlays: 27500000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "movie-157336",
    tmdbId: 157336,
    mediaType: "movie",
    title: "Interstellar",
    overview:
      "Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.",
    posterUrl: makePosterSvg("Interstellar", "#0284c7", "PARAMOUNT+"),
    backdropUrl: makeBackdropSvg("Interstellar", "#0284c7"),
    releaseDate: "2014-11-05",
    year: "2014",
    rating: 8.4,
    voteCount: 35600,
    popularity: 870,
    genres: ["Ciencia Ficción", "Drama"],
    platforms: [PLATFORM_MAP.paramount, PLATFORM_MAP.prime],
    traktWatchers: 2150,
    traktPlays: 84000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "tv-66732",
    tmdbId: 66732,
    mediaType: "tv",
    title: "Stranger Things",
    overview:
      "Cuando un niño desaparece en un pequeño pueblo de Indiana, sus amigos descubren experimentos secretos del gobierno y una dimensión paralela aterradora.",
    posterUrl: makePosterSvg("Stranger Things", "#E50914", "NETFLIX"),
    backdropUrl: makeBackdropSvg("Stranger Things", "#E50914"),
    releaseDate: "2016-07-15",
    year: "2016",
    rating: 8.6,
    voteCount: 17600,
    popularity: 925,
    genres: ["Ciencia Ficción", "Suspenso", "Drama"],
    platforms: [PLATFORM_MAP.netflix],
    traktWatchers: 3340,
    traktPlays: 99000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
  {
    id: "movie-569094",
    tmdbId: 569094,
    mediaType: "movie",
    title: "Spider-Man: A través del Spider-Verso",
    overview:
      "Miles Morales se catapulta a través del Multiverso, donde encuentra a un equipo de Spider-Personas encargadas de proteger su propia existencia.",
    posterUrl: makePosterSvg("Spider-Verse", "#e11d48", "NETFLIX"),
    backdropUrl: makeBackdropSvg("Spider-Verse", "#e11d48"),
    releaseDate: "2023-05-31",
    year: "2023",
    rating: 8.4,
    voteCount: 7100,
    popularity: 860,
    genres: ["Animación", "Acción", "Ciencia Ficción"],
    platforms: [PLATFORM_MAP.netflix],
    traktWatchers: 1940,
    traktPlays: 31000000,
    sourceTag: "Demo · TMDB + Trakt",
  },
];

function rankItems(items: MediaItem[]): MediaItem[] {
  return items.map((item, idx) => ({ ...item, rank: idx + 1 }));
}

export function getDemoCatalog(): CatalogResponse {
  const trending = rankItems(
    [...DEMO_ITEMS].sort((a, b) => b.popularity - a.popularity)
  );
  const traktLive = rankItems(
    [...DEMO_ITEMS].sort((a, b) => (b.traktWatchers ?? 0) - (a.traktWatchers ?? 0))
  );
  const allTime = rankItems(
    [...DEMO_ITEMS].sort((a, b) => (b.traktPlays ?? 0) - (a.traktPlays ?? 0))
  );
  const topRated = rankItems(
    [...DEMO_ITEMS].sort((a, b) => b.rating - a.rating)
  );

  const byPlatform = (platformId: string) =>
    rankItems(
      DEMO_ITEMS.filter((i) => i.platforms.some((p) => p.id === platformId))
    );

  const rawRows: CatalogRow[] = [
    {
      id: "trending-now",
      title: "Tendencia Ahora Mismo",
      subtitle: "Lo más comentado y buscado hoy en todas las plataformas",
      category: "trending",
      items: trending,
    },
    {
      id: "trakt-live",
      title: "Más Vistas en Tiempo Real (Trakt Live)",
      subtitle: "Conteo de usuarios reproduciendo ahora mismo",
      category: "trakt-live",
      items: traktLive,
    },
    {
      id: "top-netflix",
      title: "Top en Netflix",
      subtitle: "Series y películas líderes en Netflix",
      category: "platform",
      platformId: "netflix",
      items: byPlatform("netflix"),
    },
    {
      id: "top-prime",
      title: "Top en Amazon Prime Video",
      subtitle: "Lo más popular en Prime Video",
      category: "platform",
      platformId: "prime",
      items: byPlatform("prime"),
    },
    {
      id: "top-max",
      title: "Top en Max (HBO)",
      subtitle: "Estrenos y éxitos de HBO Max",
      category: "platform",
      platformId: "max",
      items: byPlatform("max"),
    },
    {
      id: "top-disney",
      title: "Top en Disney+",
      subtitle: "Series, Marvel, Pixar y Star Wars en tendencia",
      category: "platform",
      platformId: "disney",
      items: byPlatform("disney"),
    },
    {
      id: "top-paramount-peacock",
      title: "Top en Paramount+ y Peacock",
      subtitle: "Éxitos de Paramount+, Peacock y Apple TV+",
      category: "platform",
      platformId: "paramount",
      items: rankItems(
        DEMO_ITEMS.filter((i) =>
          i.platforms.some((p) =>
            ["paramount", "peacock", "apple"].includes(p.id)
          )
        )
      ),
    },
    {
      id: "all-time-watched",
      title: "Más Vistas de Todos los Tiempos",
      subtitle: "Histórico acumulado de reproducciones",
      category: "all-time",
      items: allTime,
    },
    {
      id: "top-rated",
      title: "Mejor Valoradas (Opiniones y Crítica)",
      subtitle: "Las puntuaciones más altas de audiencia y crítica",
      category: "all-time",
      items: topRated,
    },
  ];
  const rows = rawRows.filter((r) => r.items.length > 0);

  return {
    mode: "demo",
    hasTmdb: false,
    hasTrakt: false,
    updatedAt: new Date().toISOString(),
    region: process.env.DEFAULT_REGION || "US",
    language: process.env.DEFAULT_LANGUAGE || "es-MX",
    hero: trending[0],
    rows,
  };
}

export function getDemoDetails(tmdbId: number): MediaDetails {
  const found = DEMO_ITEMS.find((i) => i.tmdbId === tmdbId) ?? DEMO_ITEMS[0];
  return {
    ...found,
    runtimeMinutes: found.mediaType === "movie" ? 148 : 52,
    seasons: found.mediaType === "tv" ? 4 : undefined,
    episodes: found.mediaType === "tv" ? 42 : undefined,
    status: "Disponible en streaming",
    tagline: "Catálogo de demostración — agrega tu TMDB_API_KEY para datos reales en vivo",
    cast: [
      { name: "Reparto Principal (Demo)", character: "Protagonista" },
      { name: "Actriz / Actor Invitado", character: "Co-protagonista" },
    ],
    trailerUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(
      found.title + " trailer"
    )}`,
    watchProviders: found.platforms.map((p) => ({
      name: p.name,
      type: "flatrate" as const,
    })),
  };
}
