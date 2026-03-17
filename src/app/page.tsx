import { Suspense } from "react";
import { api } from "@/trpc/server";
import { WeaponGrid } from "./_components/weapon-grid";

export const dynamic = "force-dynamic";

function WeaponGridSkeleton() {
  return (
    <div>
      <div className="mb-8 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-panel h-8 w-20 animate-pulse rounded" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="cryo-panel h-72 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

async function WeaponGridLoader() {
  const [weapons, types] = await Promise.all([
    api.weapon.getAll(),
    api.weapon.getTypes(),
  ]);

  return <WeaponGrid weapons={weapons} types={types} />;
}

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      {/* Static shell — served instantly */}
      <div className="mb-10">
        <h1 className="font-mono text-3xl font-bold uppercase tracking-widest text-foreground">
          Marathon Weapon Wiki
        </h1>
        <p className="text-dim mt-2 font-mono text-sm uppercase tracking-wide">
          Tactical Weapon Database
        </p>
      </div>

      {/* Dynamic part — streamed in */}
      <Suspense fallback={<WeaponGridSkeleton />}>
        <WeaponGridLoader />
      </Suspense>
    </main>
  );
}
