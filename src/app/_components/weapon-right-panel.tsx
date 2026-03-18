"use client";

import { useState } from "react";
import { WeaponModsSection } from "./weapon-mods-section";
import { WeaponBuildsSection } from "./weapon-builds-section";

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

const TABS = [
  { key: "mods", label: "Mods" },
  { key: "builds", label: "Builds" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function WeaponRightPanel({
  weaponSlug,
  linkedMods,
  universalMods,
}: {
  weaponSlug: string;
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("mods");

  return (
    <div>
      {/* Tab buttons */}
      <div className="mb-4 flex gap-1.5">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
              activeTab === tab.key
                ? "bg-accent text-background"
                : "border border-border bg-panel text-dim hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "mods" ? (
        <WeaponModsSection linkedMods={linkedMods} universalMods={universalMods} />
      ) : (
        <WeaponBuildsSection
          weaponSlug={weaponSlug}
          linkedMods={linkedMods}
          universalMods={universalMods}
        />
      )}
    </div>
  );
}
