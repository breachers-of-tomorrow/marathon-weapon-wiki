import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { api } from "@/trpc/server";
import { WeaponBadges } from "@/app/_components/weapon-badges";
import { WeaponStats } from "@/app/_components/stat-section";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const weapon = await api.weapon.getBySlug({ slug });
  if (!weapon) return { title: "Weapon Not Found" };

  return {
    title: `${weapon.name} — Marathon Weapon Wiki`,
    description: weapon.description ?? `${weapon.name} stats and details`,
  };
}

function DetailSkeleton() {
  return (
    <div className="mt-4">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="cryo-panel h-64 animate-pulse rounded-lg" />
        <div className="space-y-4">
          <div className="bg-panel h-8 w-48 animate-pulse rounded" />
          <div className="flex gap-2">
            <div className="bg-panel h-6 w-24 animate-pulse rounded" />
            <div className="bg-panel h-6 w-20 animate-pulse rounded" />
          </div>
          <div className="bg-panel h-20 w-full animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="cryo-panel h-40 animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}

async function WeaponDetail({ slug }: { slug: string }) {
  const weapon = await api.weapon.getBySlug({ slug });

  if (!weapon) notFound();

  return (
    <>
      {/* Hero section */}
      <div className="mt-4 grid gap-8 md:grid-cols-2">
        {/* Left: Image */}
        <div className="cryo-panel relative flex min-h-72 items-center justify-center rounded-lg">
          {weapon.imageUrl ? (
            <Image
              src={weapon.imageUrl}
              alt={weapon.name}
              fill
              className="rounded-lg object-contain p-4"
            />
          ) : (
            <div className="text-dim flex h-64 w-full items-center justify-center font-mono text-sm uppercase tracking-wide">
              No Image Available
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col gap-4">
          <h1 className="font-mono text-2xl font-bold uppercase tracking-widest text-foreground">
            {weapon.name}
          </h1>

          <WeaponBadges
            type={weapon.type}
            slot={weapon.slot}
            ammoType={weapon.ammoType}
          />

          {weapon.description && (
            <p className="text-dim text-sm leading-relaxed">
              {weapon.description}
            </p>
          )}

          <div className="text-dim mt-auto flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
            {weapon.rarity && (
              <div>
                <span className="text-heading uppercase">Rarity:</span>{" "}
                <span className="text-foreground">{weapon.rarity}</span>
              </div>
            )}
            {weapon.price != null && (
              <div>
                <span className="text-heading uppercase">Price:</span>{" "}
                <span className="text-foreground">{weapon.price}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-10">
        <h2 className="text-heading mb-4 font-mono text-xs uppercase tracking-widest">
          Weapon Statistics
        </h2>
        <WeaponStats weapon={weapon as unknown as Record<string, number | null | undefined>} />
      </div>
    </>
  );
}

export default async function WeaponDetailPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-12">
      {/* Static shell */}
      <Link
        href="/"
        className="text-dim hover:text-accent mb-8 inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide transition-colors"
      >
        &larr; All Weapons
      </Link>

      {/* Dynamic part */}
      <Suspense fallback={<DetailSkeleton />}>
        <WeaponDetail slug={slug} />
      </Suspense>
    </main>
  );
}
