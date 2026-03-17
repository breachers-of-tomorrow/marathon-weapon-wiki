"use client";

import { useMemo, useState } from "react";
import type { RouterOutputs } from "@/trpc/react";
import { WeaponCard } from "./weapon-card";

type Weapon = RouterOutputs["weapon"]["getAll"][number];

export function WeaponGrid({
  weapons,
  types,
}: {
  weapons: Weapon[];
  types: string[];
}) {
  const [activeType, setActiveType] = useState<string | undefined>(undefined);

  const filtered = useMemo(
    () =>
      activeType
        ? weapons.filter((w) => w.type === activeType)
        : weapons,
    [weapons, activeType],
  );

  const format = (s: string) => s.replace(/_/g, " ");

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveType(undefined)}
          className={`rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
            activeType === undefined
              ? "bg-accent text-background"
              : "cryo-panel text-dim hover:text-foreground"
          }`}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type}
            onClick={() =>
              setActiveType(activeType === type ? undefined : type)
            }
            className={`rounded px-3 py-1.5 font-mono text-xs uppercase tracking-wide transition-colors ${
              activeType === type
                ? "bg-accent text-background"
                : "cryo-panel text-dim hover:text-foreground"
            }`}
          >
            {format(type)}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((weapon) => (
          <WeaponCard key={weapon.id} weapon={weapon} />
        ))}
      </div>
    </div>
  );
}
