"use client";

import { useState, useMemo } from "react";

type Mod = {
  id: string;
  name: string;
  slug: string;
  type: string;
  rarity: string;
  description: string | null;
  isUniversal: boolean;
};

const RARITY_COLORS: Record<string, string> = {
  PRESTIGE: "#f59e0b",
  SUPERIOR: "#8b5cf6",
  DELUXE: "#038adf",
  ENHANCED: "#10b981",
  STANDARD: "#6b7280",
};

const TYPE_ORDER = ["BARREL", "GRIP", "MAGAZINE", "OPTIC", "SHIELD", "GENERATOR", "CHIP"];
const RARITIES = ["PRESTIGE", "SUPERIOR", "DELUXE", "ENHANCED", "STANDARD"];

function RarityBadge({ rarity }: { rarity: string }) {
  const color = RARITY_COLORS[rarity] ?? "#6b7280";
  return (
    <span
      className="rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {rarity}
    </span>
  );
}

export function WeaponModsSection({
  linkedMods,
  universalMods,
}: {
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [activeRarity, setActiveRarity] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allMods = useMemo(() => [...linkedMods, ...universalMods], [linkedMods, universalMods]);

  const filtered = useMemo(() => {
    return allMods.filter((mod) => {
      if (activeRarity && mod.rarity !== activeRarity) return false;
      if (search && !mod.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allMods, activeRarity, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, Mod[]>();
    for (const type of TYPE_ORDER) {
      const modsOfType = filtered.filter((m) => m.type === type);
      if (modsOfType.length > 0) map.set(type, modsOfType);
    }
    return map;
  }, [filtered]);

  if (allMods.length === 0) return null;

  return (
    <div>
      <h2 className="text-heading mb-4 font-mono text-xs uppercase tracking-widest">
        Mods & Attachments
      </h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search mods..."
        className="bg-panel border-border text-foreground placeholder:text-dim mb-3 w-full rounded border px-3 py-1.5 font-mono text-xs outline-none focus:border-accent"
      />

      {/* Rarity filter */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveRarity(null)}
          className={`rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors ${
            activeRarity === null
              ? "bg-accent text-background"
              : "bg-panel text-dim hover:text-foreground border border-border"
          }`}
        >
          All
        </button>
        {RARITIES.map((r) => {
          const color = RARITY_COLORS[r]!;
          const isActive = activeRarity === r;
          return (
            <button
              key={r}
              onClick={() => setActiveRarity(isActive ? null : r)}
              className="rounded px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors border"
              style={{
                backgroundColor: isActive ? `${color}30` : undefined,
                borderColor: isActive ? color : "var(--color-border)",
                color: isActive ? color : "var(--color-dim)",
              }}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Grouped mods */}
      {grouped.size === 0 ? (
        <p className="text-dim font-mono text-xs">No mods match your filters.</p>
      ) : (
        <div className="grid gap-3">
          {Array.from(grouped.entries()).map(([type, modsInGroup]) => {
            const isChip = type === "CHIP";
            return (
              <div key={type} className="cryo-panel rounded-lg p-4">
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    {type}
                  </h3>
                  {isChip && (
                    <span className="text-dim font-mono text-[10px] uppercase tracking-wide">
                      — Applies to all weapons
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {modsInGroup.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="text-foreground text-sm font-mono">
                        {mod.name}
                      </span>
                      <RarityBadge rarity={mod.rarity} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
