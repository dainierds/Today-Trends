import { connection } from "next/server";
import { Suspense } from "react";
import { TrendsApp } from "@/components/TrendsApp";
import { getCatalogData } from "@/lib/catalog";

async function CatalogLoader() {
  await connection();
  const initialData = await getCatalogData();
  return <TrendsApp initialData={initialData} />;
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-[#0b0b0f] p-8 text-white">
      <div className="mx-auto max-w-[1600px] space-y-8 animate-pulse">
        <div className="h-12 w-64 rounded-lg bg-white/10" />
        <div className="h-[420px] w-full rounded-2xl bg-white/5" />
        <div className="space-y-4">
          <div className="h-6 w-48 rounded bg-white/10" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-[2/3] w-44 shrink-0 rounded-xl bg-white/10"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <CatalogLoader />
    </Suspense>
  );
}
