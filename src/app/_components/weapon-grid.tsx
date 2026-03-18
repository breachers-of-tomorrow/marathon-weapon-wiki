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
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () =>
      weapons.filter((w) => {
        if (activeType && w.type !== activeType) return false;
        if (search && !w.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [weapons, activeType, search],
  );

  const format = (s: string) => s.replace(/_/g, " ");

  return (
    <div>
      {/* Search bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search weapons..."
        className="bg-panel border-border text-foreground placeholder:text-dim mb-4 w-full rounded border px-4 py-2 font-mono text-sm outline-none focus:border-accent sm:max-w-sm"
      />

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap gap-2" data-tour="filters">
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-tour="weapon-grid">
        {filtered.map((weapon) => (
          <WeaponCard key={weapon.id} weapon={weapon} />
        ))}
      </div>
    </div>
  );
}
