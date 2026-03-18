"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { Weapon, WeaponTTK } from "../../../generated/prisma";
import { getTtkColor, shieldTiers, formatTtk } from "@/lib/ttk-utils";

type WeaponWithTTK = Weapon & { ttk: WeaponTTK | null };

const ttkBodyKeys = [
  "ttkWhite",
  "ttkGreen",
  "ttkBlue",
  "ttkPurple",
] as const;

const ttkHeadKeys = [
  "ttkHeadWhite",
  "ttkHeadGreen",
  "ttkHeadBlue",
  "ttkHeadPurple",
] as const;

function WeaponSelector({
  label,
  value,
  onChange,
  weapons,
  excludeSlug,
}: {
  label: string;
  value: string;
  onChange: (slug: string) => void;
  weapons: WeaponWithTTK[];
  excludeSlug?: string;
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = weapons.find((w) => w.slug === value);

  const filtered = useMemo(() => {
    const available = weapons.filter((w) => w.slug !== excludeSlug);
    if (!search) return available;
    const q = search.toLowerCase();
    return available.filter(
      (w) =>
        w.name.toLowerCase().includes(q) ||
        w.type.replace(/_/g, " ").toLowerCase().includes(q),
    );
  }, [weapons, excludeSlug, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, WeaponWithTTK[]> = {};
    for (const w of filtered) {
      const type = w.type.replace(/_/g, " ");
      (groups[type] ??= []).push(w);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  // Flat list for keyboard navigation
  const flatItems = useMemo(
    () => grouped.flatMap(([, items]) => items),
    [grouped],
  );

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${highlightIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightIndex]);

  const selectWeapon = useCallback(
    (slug: string) => {
      onChange(slug);
      setSearch("");
      setOpen(false);
      setHighlightIndex(-1);
    },
    [onChange],
  );

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((i) =>
          i < flatItems.length - 1 ? i + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((i) =>
          i > 0 ? i - 1 : flatItems.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && flatItems[highlightIndex]) {
          selectWeapon(flatItems[highlightIndex].slug);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightIndex(-1);
        break;
    }
  }

  return (
    <div className="relative flex-1" ref={containerRef}>
      <label className="text-dim mb-2 block font-mono text-xs tracking-widest uppercase">
        {label}
      </label>
      <div
        className="cryo-panel border-border flex w-full items-center gap-2 rounded-lg border px-3 py-2 focus-within:border-[var(--color-accent)]"
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
      >
        <svg
          className="text-dim h-4 w-4 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={open ? search : selected?.name ?? ""}
          placeholder="Search weapons..."
          className="text-foreground w-full bg-transparent font-mono text-base outline-none placeholder:text-[var(--color-dim)]"
          onChange={(e) => {
            setSearch(e.target.value);
            setHighlightIndex(-1);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setSearch("");
          }}
          onKeyDown={handleKeyDown}
        />
        {value && (
          <button
            type="button"
            className="text-dim hover:text-foreground shrink-0 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
              setSearch("");
              setOpen(false);
            }}
            aria-label="Clear selection"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <div
          ref={listRef}
          className="cryo-panel border-border absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border shadow-lg"
        >
          {grouped.length === 0 ? (
            <div className="text-dim p-3 text-center font-mono text-base">
              No weapons found
            </div>
          ) : (
            grouped.map(([type, items]) => (
              <div key={type}>
                <div className="text-dim sticky top-0 bg-[var(--color-panel)] px-3 py-1.5 font-mono text-xs tracking-widest uppercase">
                  {type}
                </div>
                {items.map((w) => {
                  const flatIdx = flatItems.indexOf(w);
                  return (
                    <button
                      key={w.slug}
                      type="button"
                      data-index={flatIdx}
                      className={`text-foreground w-full px-3 py-2 text-left font-mono text-base transition-colors ${
                        flatIdx === highlightIndex
                          ? "bg-[var(--color-accent)]/10 text-accent"
                          : "hover:bg-[var(--color-border)]/30"
                      } ${w.slug === value ? "text-accent" : ""}`}
                      onMouseEnter={() => setHighlightIndex(flatIdx)}
                      onClick={() => selectWeapon(w.slug)}
                    >
                      {w.name}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function StatCompareCard({
  label,
  valueA,
  valueB,
  higherIsBetter = true,
}: {
  label: string;
  valueA: string;
  valueB: string;
  higherIsBetter?: boolean;
}) {
  const numA = parseFloat(valueA);
  const numB = parseFloat(valueB);
  const aWins = higherIsBetter ? numA > numB : numA < numB;
  const bWins = higherIsBetter ? numB > numA : numB < numA;

  return (
    <div className="cryo-panel rounded-lg p-3">
      <div className="text-dim mb-2 text-center font-mono text-xs tracking-widest uppercase">
        {label}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span
          className={`font-display text-xl font-bold ${aWins ? "text-accent" : "text-foreground"}`}
        >
          {valueA}
        </span>
        <span className="text-dim font-mono text-sm">vs</span>
        <span
          className={`font-display text-xl font-bold ${bWins ? "text-accent" : "text-foreground"}`}
        >
          {valueB}
        </span>
      </div>
    </div>
  );
}

function DeltaCell({ a, b }: { a: number; b: number }) {
  const diff = a - b;
  if (diff === 0) {
    return (
      <td className="text-dim p-3 text-center font-mono text-sm">—</td>
    );
  }
  const faster = diff < 0;
  return (
    <td
      className={`p-3 text-center font-mono text-sm font-bold ${faster ? "text-green-400" : "text-red-400"}`}
    >
      {diff > 0 ? "+" : ""}
      {diff.toFixed(3)}s {faster ? "▼" : "▲"}
    </td>
  );
}

export function WeaponCompare({ weapons }: { weapons: WeaponWithTTK[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const slugA = searchParams.get("a") ?? "";
  const slugB = searchParams.get("b") ?? "";

  const weaponA = weapons.find((w) => w.slug === slugA);
  const weaponB = weapons.find((w) => w.slug === slugB);

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  }

  const ttkA = weaponA?.ttk;
  const ttkB = weaponB?.ttk;
  const bothSelected = ttkA && ttkB;

  return (
    <div>
      {/* Weapon selectors */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <WeaponSelector
          label="Weapon A"
          value={slugA}
          onChange={(slug) => setParam("a", slug)}
          weapons={weapons}
          excludeSlug={slugB}
        />
        <WeaponSelector
          label="Weapon B"
          value={slugB}
          onChange={(slug) => setParam("b", slug)}
          weapons={weapons}
          excludeSlug={slugA}
        />
      </div>

      {bothSelected ? (
        <div>
          {/* Stat comparison cards */}
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCompareCard
              label="Damage"
              valueA={String(ttkA.damage)}
              valueB={String(ttkB.damage)}
            />
            <StatCompareCard
              label="RPM"
              valueA={String(ttkA.rpm)}
              valueB={String(ttkB.rpm)}
            />
            <StatCompareCard
              label="DPS"
              valueA={ttkA.dps.toFixed(1)}
              valueB={ttkB.dps.toFixed(1)}
            />
            <StatCompareCard
              label="HS Multiplier"
              valueA={`${ttkA.headshotMultiplier}x`}
              valueB={`${ttkB.headshotMultiplier}x`}
            />
            <StatCompareCard
              label="Range"
              valueA={`${ttkA.range}m`}
              valueB={`${ttkB.range}m`}
            />
            <StatCompareCard
              label="Shots to Kill"
              valueA={ttkA.shotsToKill}
              valueB={ttkB.shotsToKill}
              higherIsBetter={false}
            />
          </div>

          {/* TTK comparison table */}
          <div className="cryo-panel overflow-x-auto rounded-lg">
            <table className="w-full text-base">
              <thead>
                <tr className="border-border border-b">
                  <th className="text-dim p-3 text-left font-mono text-sm tracking-widest uppercase">
                    Shield Tier
                  </th>
                  {shieldTiers.map((tier) => (
                    <th
                      key={tier.key}
                      className={`p-3 text-center font-mono text-sm tracking-widest uppercase ${tier.color}`}
                    >
                      {tier.key}
                      <div className="text-dim mt-0.5 text-xs font-normal">
                        {tier.hp} HP
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Body TTK header */}
                <tr className="border-border/50 border-b">
                  <td
                    colSpan={5}
                    className="text-heading p-3 font-mono text-sm font-bold tracking-widest uppercase"
                  >
                    Body TTK
                  </td>
                </tr>
                {/* Weapon A body */}
                <tr className="border-border/50 border-b">
                  <td className="text-dim p-3 font-mono text-sm">
                    {weaponA.name}
                  </td>
                  {ttkBodyKeys.map((key) => (
                    <td
                      key={key}
                      className={`p-3 text-center font-mono font-bold ${getTtkColor(ttkA[key])}`}
                    >
                      {formatTtk(ttkA[key])}
                    </td>
                  ))}
                </tr>
                {/* Weapon B body */}
                <tr className="border-border/50 border-b">
                  <td className="text-dim p-3 font-mono text-sm">
                    {weaponB.name}
                  </td>
                  {ttkBodyKeys.map((key) => (
                    <td
                      key={key}
                      className={`p-3 text-center font-mono font-bold ${getTtkColor(ttkB[key])}`}
                    >
                      {formatTtk(ttkB[key])}
                    </td>
                  ))}
                </tr>
                {/* Body diff */}
                <tr className="border-border border-b">
                  <td className="text-dim p-3 font-mono text-xs tracking-widest uppercase">
                    Diff (A − B)
                  </td>
                  {ttkBodyKeys.map((key) => (
                    <DeltaCell key={key} a={ttkA[key]} b={ttkB[key]} />
                  ))}
                </tr>

                {/* Headshot TTK header */}
                <tr className="border-border/50 border-b">
                  <td
                    colSpan={5}
                    className="text-heading p-3 font-mono text-sm font-bold tracking-widest uppercase"
                  >
                    Headshot TTK
                  </td>
                </tr>
                {/* Weapon A head */}
                <tr className="border-border/50 border-b">
                  <td className="text-dim p-3 font-mono text-sm">
                    {weaponA.name}
                  </td>
                  {ttkHeadKeys.map((key) => (
                    <td
                      key={key}
                      className={`p-3 text-center font-mono font-bold ${getTtkColor(ttkA[key])}`}
                    >
                      {formatTtk(ttkA[key])}
                    </td>
                  ))}
                </tr>
                {/* Weapon B head */}
                <tr className="border-border/50 border-b">
                  <td className="text-dim p-3 font-mono text-sm">
                    {weaponB.name}
                  </td>
                  {ttkHeadKeys.map((key) => (
                    <td
                      key={key}
                      className={`p-3 text-center font-mono font-bold ${getTtkColor(ttkB[key])}`}
                    >
                      {formatTtk(ttkB[key])}
                    </td>
                  ))}
                </tr>
                {/* Head diff */}
                <tr>
                  <td className="text-dim p-3 font-mono text-xs tracking-widest uppercase">
                    Diff (A − B)
                  </td>
                  {ttkHeadKeys.map((key) => (
                    <DeltaCell key={key} a={ttkA[key]} b={ttkB[key]} />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Credit */}
          <div className="mt-4 text-right">
            <a
              href="https://docs.google.com/spreadsheets/d/1xiBwYPWsJbQKErFKXBS89ZKFSEXM3BcF9XXASIkjAak/edit?gid=0#gid=0"
              className="text-dim font-mono text-xs underline"
            >
              Data by CoolGuy
            </a>
          </div>
        </div>
      ) : (
        <div className="cryo-panel rounded-lg p-8 text-center">
          <p className="text-dim font-mono text-base">
            Select two weapons above to compare their TTK stats side-by-side.
          </p>
        </div>
      )}
    </div>
  );
}
