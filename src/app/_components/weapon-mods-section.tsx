"use client";

import { useState, useMemo } from "react";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";

type Mod = {
  id: string;
  name: string;
  slug: string;
  type: string;
  rarity: string;
  description: string | null;
  price: number | null;
  imageUrl: string | null;
  isUniversal: boolean;
};

const TYPE_ORDER = ["BARREL", "GRIP", "MAGAZINE", "OPTIC", "SHIELD", "GENERATOR", "CHIP"];
const RARITIES = ["PRESTIGE", "SUPERIOR", "DELUXE", "ENHANCED", "STANDARD"];

export function WeaponModsSection({
  linkedMods,
  universalMods,
}: {
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [activeRarity, setActiveRarity] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const allMods = useMemo(() => [...linkedMods, ...universalMods], [linkedMods, universalMods]);

  // Only show type buttons for types that actually exist in this weapon's mods
  const availableTypes = useMemo(() => {
    return TYPE_ORDER.filter((type) => allMods.some((m) => m.type === type));
  }, [allMods]);

  const filtered = useMemo(() => {
    return allMods.filter((mod) => {
      if (activeRarity && mod.rarity !== activeRarity) return false;
      if (activeType && mod.type !== activeType) return false;
      if (search && !mod.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [allMods, activeRarity, activeType, search]);

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
      <h2 className="text-heading mb-4 font-display text-xs uppercase tracking-widest heading-glow">
        Mods & Attachments
      </h2>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search mods..."
        className="bg-panel border-border text-foreground placeholder:text-dim mb-2 w-full rounded border px-3 py-1.5 font-mono text-xs outline-none focus:border-accent"
      />

      {/* Filter dropdowns */}
      <div className="mb-4 flex gap-2">
        <select
          value={activeType ?? ""}
          onChange={(e) => setActiveType(e.target.value || null)}
          className="bg-panel border-border text-foreground rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wide outline-none focus:border-accent"
        >
          <option value="">All Types</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={activeRarity ?? ""}
          onChange={(e) => setActiveRarity(e.target.value || null)}
          className="bg-panel border-border text-foreground rounded border px-3 py-1.5 font-mono text-xs uppercase tracking-wide outline-none focus:border-accent"
        >
          <option value="">All Rarities</option>
          {RARITIES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
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
                <div className="space-y-3">
                  {modsInGroup.map((mod) => (
                    <div
                      key={mod.id}
                      className="border-border border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-foreground text-sm font-mono">
                          {mod.name}
                        </span>
                        <div className="flex shrink-0 items-center gap-2">
                          {mod.price != null && (
                            <span className="text-foreground/70 font-mono text-xs">
                              {mod.price === 0 ? "Free" : `${mod.price.toLocaleString()}cr`}
                            </span>
                          )}
                          <RarityBadge rarity={mod.rarity} />
                        </div>
                      </div>
                      {mod.description && (
                        <p className="text-foreground/60 mt-1 text-xs leading-relaxed">
                          {mod.description}
                        </p>
                      )}
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
