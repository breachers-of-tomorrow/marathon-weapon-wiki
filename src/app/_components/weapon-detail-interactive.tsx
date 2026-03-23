"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { WeaponBadges } from "./weapon-badges";
import { WeaponConfigurator } from "./weapon-configurator";
import { parseStatModifiers } from "@/lib/stat-modifiers";

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
  statModifiers: unknown;
};

type WeaponData = {
  name: string;
  slug: string;
  type: string;
  slot: string;
  ammoType: string;
  rarity: string | null;
  price: number | null;
  description: string | null;
  imageUrl: string | null;
  firepower: number | null;
  damage: number | null;
  precisionMultiplier: number | null;
  rateOfFire: number | null;
  range: number | null;
  accuracy: number | null;
  hipfireSpread: number | null;
  adsSpread: number | null;
  crouchSpreadBonus: number | null;
  movingInaccuracy: number | null;
  handling: number | null;
  equipSpeed: number | null;
  adsSpeed: number | null;
  reloadSpeed: number | null;
  weight: number | null;
  recoil: number | null;
  aimAssist: number | null;
  magazineSize: number | null;
  zoom: number | null;
  pelletCount: number | null;
  spreadAngle: number | null;
  voltDrain: number | null;
  chargeTime: number | null;
};

interface StatRow {
  label: string;
  value: number | null;
  max?: number;
  modEffect?: "up" | "down" | null;
}

export function WeaponDetailInteractive({
  weapon,
  linkedMods,
  universalMods,
}: {
  weapon: WeaponData;
  linkedMods: Mod[];
  universalMods: Mod[];
}) {
  const [equippedMods, setEquippedMods] = useState<Mod[]>([]);

  // Compute which stats are affected by equipped mods
  const affectedStats = useMemo(() => {
    const map = new Map<string, "up" | "down">();
    for (const mod of equippedMods) {
      const modifiers = parseStatModifiers(mod.statModifiers);
      for (const m of modifiers) {
        // Use the label to match against stat labels
        const existing = map.get(m.label);
        if (!existing) {
          map.set(m.label, m.direction);
        } else if (existing !== m.direction) {
          // Conflicting effects - use the last one
          map.set(m.label, m.direction);
        }
      }
    }
    return map;
  }, [equippedMods]);

  const handleModsChange = useCallback((mods: Mod[]) => {
    setEquippedMods(mods);
  }, []);

  type StatKey =
    | "firepower"
    | "damage"
    | "precisionMultiplier"
    | "rateOfFire"
    | "range"
    | "accuracy"
    | "hipfireSpread"
    | "adsSpread"
    | "crouchSpreadBonus"
    | "movingInaccuracy"
    | "handling"
    | "equipSpeed"
    | "adsSpeed"
    | "reloadSpeed"
    | "weight"
    | "recoil"
    | "aimAssist"
    | "magazineSize"
    | "zoom"
    | "pelletCount"
    | "spreadAngle"
    | "voltDrain"
    | "chargeTime";

  const buildStats = (
    entries: [StatKey, string, number?][],
  ): StatRow[] =>
    entries.map(([key, label, max]) => ({
      label,
      value: weapon[key] ?? null,
      max,
      modEffect: affectedStats.get(label) ?? null,
    }));

  // Each section: title, a "headline" stat (shown with bar next to title), and sub-stats
  const sections: {
    title: string;
    headline: StatRow | null;
    stats: StatRow[];
  }[] = [
    {
      title: "Firepower",
      headline: buildStats([["firepower", "Firepower", 200]])[0] ?? null,
      stats: buildStats([
        ["damage", "Damage"],
        ["precisionMultiplier", "Precision"],
        ["rateOfFire", "Rate of Fire"],
      ]),
    },
    {
      title: "Accuracy",
      headline: buildStats([["accuracy", "Accuracy", 100]])[0] ?? null,
      stats: buildStats([
        ["hipfireSpread", "Hipfire Spread"],
        ["adsSpread", "ADS Spread"],
        ["crouchSpreadBonus", "Crouch Spread"],
        ["movingInaccuracy", "Moving Inaccuracy"],
      ]),
    },
    {
      title: "Handling",
      headline: buildStats([["handling", "Handling", 100]])[0] ?? null,
      stats: buildStats([
        ["equipSpeed", "Equip Speed"],
        ["adsSpeed", "ADS Speed"],
        ["weight", "Weight"],
        ["recoil", "Recoil"],
        ["aimAssist", "Aim Assist"],
        ["reloadSpeed", "Reload Speed"],
      ]),
    },
    {
      title: "Range",
      headline: buildStats([["range", "Range", 100]])[0] ?? null,
      stats: [],
    },
    {
      title: "Magazine",
      headline: buildStats([["magazineSize", "Magazine"]])[0] ?? null,
      stats: buildStats([
        ["zoom", "Zoom"],
      ]),
    },
    {
      title: "Special",
      headline: null,
      stats: buildStats([
        ["spreadAngle", "Spread Angle"],
        ["pelletCount", "Pellet Count"],
        ["voltDrain", "Volt Drain"],
        ["chargeTime", "Charge Time"],
      ]),
    },
  ];

  // Filter out sections where headline and all stats are null
  const visibleSections = sections.filter(
    (s) =>
      (s.headline?.value != null) ||
      s.stats.some((st) => st.value != null),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr_320px]">
      {/* Left column: Compact stat panel */}
      <div className="order-2 lg:order-1">
        <CompactStatsPanel sections={visibleSections} />
      </div>

      {/* Center column: Info + Image */}
      <div className="order-1 lg:order-2">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-foreground heading-glow">
            {weapon.name}
          </h1>
          <div className="shrink-0 text-right">
            <div className="text-dim flex flex-wrap justify-end gap-x-4 gap-y-1 font-mono text-xs">
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

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <WeaponBadges
            type={weapon.type}
            slot={weapon.slot}
            ammoType={weapon.ammoType}
          />
        </div>

        {weapon.description && (
          <p className="text-dim mb-4 text-sm leading-relaxed">
            {weapon.description}
          </p>
        )}

        {/* Big weapon image */}
        <div className="cryo-panel relative flex min-h-72 items-center justify-center rounded-lg lg:min-h-[28rem]">
          {weapon.imageUrl ? (
            <Image
              src={weapon.imageUrl}
              alt={weapon.name}
              fill
              className="rounded-lg object-contain p-6"
            />
          ) : (
            <div className="text-dim flex h-72 w-full items-center justify-center font-mono text-sm uppercase tracking-wide">
              No Image Available
            </div>
          )}
        </div>
      </div>

      {/* Right column: Configurator */}
      <div className="order-3">
        <WeaponConfigurator
          linkedMods={linkedMods}
          universalMods={universalMods}
          onModsChange={handleModsChange}
        />
      </div>
    </div>
  );
}

/* ─── Compact stats panel — mirrors Marathon's in-game stat layout ─── */

function CompactStatsPanel({
  sections,
}: {
  sections: {
    title: string;
    headline: StatRow | null;
    stats: StatRow[];
  }[];
}) {
  return (
    <div className="cryo-panel rounded-lg px-3 py-2">
      {sections.map((section, i) => {
        const visibleStats = section.stats.filter((s) => s.value != null);

        return (
          <div
            key={section.title}
            className={i > 0 ? "mt-2.5 border-t border-border/40 pt-2.5" : ""}
          >
            {/* Section header with headline bar */}
            <div className="mb-1 flex items-center gap-2">
              <span
                className={`font-display text-[13px] font-bold uppercase tracking-wider ${
                  section.headline?.modEffect === "up"
                    ? "text-accent2"
                    : section.headline?.modEffect === "down"
                      ? "text-danger"
                      : "text-foreground"
                }`}
              >
                {section.headline?.modEffect === "up" && (
                  <span className="mr-0.5 text-accent2">+</span>
                )}
                {section.headline?.modEffect === "down" && (
                  <span className="mr-0.5 text-danger">-</span>
                )}
                {section.title}
              </span>

              {/* Headline bar + value */}
              {section.headline?.value != null && (
                <>
                  {section.headline.max != null && section.headline.max > 0 && (
                    <div className="h-[3px] flex-1 rounded-full bg-border/60">
                      <div
                        className="h-[3px] rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (section.headline.value / section.headline.max) * 100)}%`,
                          backgroundColor:
                            section.headline.modEffect === "up"
                              ? "#00ff9d"
                              : section.headline.modEffect === "down"
                                ? "#ff2244"
                                : "var(--color-accent)",
                        }}
                      />
                    </div>
                  )}
                  <span
                    className={`font-mono text-[14px] font-bold tabular-nums transition-colors ${
                      section.headline.modEffect === "up"
                        ? "text-accent2"
                        : section.headline.modEffect === "down"
                          ? "text-danger"
                          : "text-foreground"
                    }`}
                  >
                    {section.headline.value}
                    {section.headline.modEffect && (
                      <span
                        className="ml-0.5 text-[10px]"
                        style={{
                          color:
                            section.headline.modEffect === "up"
                              ? "#00ff9d"
                              : "#ff2244",
                        }}
                      >
                        {section.headline.modEffect === "up" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Sub-stats in compact rows */}
            {visibleStats.length > 0 && (
              <div className="space-y-px pl-1">
                {visibleStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between py-[1px]"
                  >
                    <span
                      className={`text-[13px] transition-colors ${
                        stat.modEffect === "up"
                          ? "text-accent2"
                          : stat.modEffect === "down"
                            ? "text-danger"
                            : "text-dim"
                      }`}
                    >
                      {stat.label}
                    </span>
                    <span
                      className={`font-mono text-[13px] tabular-nums transition-colors ${
                        stat.modEffect === "up"
                          ? "text-accent2"
                          : stat.modEffect === "down"
                            ? "text-danger"
                            : "text-foreground"
                      }`}
                    >
                      {stat.value}
                      {stat.modEffect && (
                        <span
                          className="ml-0.5 text-[10px]"
                          style={{
                            color:
                              stat.modEffect === "up" ? "#00ff9d" : "#ff2244",
                          }}
                        >
                          {stat.modEffect === "up" ? "▲" : "▼"}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
