import { NextRequest, NextResponse } from "next/server";
import { getDemoDetails } from "@/lib/demo-data";
import { fetchTmdbDetails, isTmdbConfigured } from "@/lib/tmdb";
import type { MediaType } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const typeParam = searchParams.get("type");
  const idParam = searchParams.get("id");

  const mediaType: MediaType = typeParam === "tv" ? "tv" : "movie";
  const tmdbId = Number(idParam);

  if (!tmdbId || Number.isNaN(tmdbId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  if (!isTmdbConfigured()) {
    return NextResponse.json(getDemoDetails(tmdbId));
  }

  const region = process.env.DEFAULT_REGION || "US";
  const language = process.env.DEFAULT_LANGUAGE || "es-MX";

  const details = await fetchTmdbDetails(mediaType, tmdbId, region, language);
  if (!details) {
    return NextResponse.json(getDemoDetails(tmdbId));
  }

  return NextResponse.json(details, {
    headers: {
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
    },
  });
}
