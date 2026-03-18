import { Suspense } from "react";
import type { Metadata } from "next";

import { api } from "@/trpc/server";
import { WeaponCompare } from "@/app/_components/weapon-compare";

export const metadata: Metadata = {
  title: "Compare Weapons | Marathon Weapon Wiki",
  description:
    "Compare TTK stats side-by-side for any two weapons in Marathon.",
};

export default async function ComparePage() {
  const weapons = await api.weapon.getAllWithTTK();

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-12">
      <h1 className="font-display text-foreground heading-glow mb-8 text-2xl font-bold uppercase tracking-widest">
        Compare Weapons
      </h1>
      <Suspense
        fallback={
          <div className="cryo-panel h-96 animate-pulse rounded-lg" />
        }
      >
        <WeaponCompare weapons={weapons} />
      </Suspense>
    </main>
  );
}
