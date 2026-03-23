"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import {
  Search,
  X,
  Crosshair,
  Cpu,
  ArrowRight,
  Grip,
  Layers,
  Eye,
  ShieldHalf,
  Zap,
  BookOpen,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { api } from "@/trpc/react";

/* ─── Types ─── */

type WeaponHit = {
  kind: "weapon";
  id: string;
  name: string;
  slug: string;
  type: string;
  slot: string;
  rarity: string | null;
  imageUrl: string | null;
};

type ModHit = {
  kind: "mod";
  id: string;
  name: string;
  slug: string;
  type: string;
  rarity: string;
  isUniversal: boolean;
};

type GuideHit = {
  kind: "guide";
  id: string;
  name: string;
  slug: string;
  category: string;
};

type SearchHit = WeaponHit | ModHit | GuideHit;

/* ─── Static guides data (matches src/app/guides/page.tsx) ─── */

const GUIDES = [
  {
    id: "guide-ar",
    name: "The Assault Rifle Meta",
    slug: "best-assault-rifles",
    category: "Primary Weapons",
  },
  {
    id: "guide-smg",
    name: "SMG Comparison: CQC Dominance",
    slug: "best-smgs",
    category: "Primary Weapons",
  },
  {
    id: "guide-pr",
    name: "Precision Rifles: Long Range Analysis",
    slug: "best-precision-rifles",
    category: "Precision Weapons",
  },
  {
    id: "guide-overall",
    name: "The Ultimate Arsenal: Best Overall",
    slug: "best-overall-weapon",
    category: "Meta Analysis",
  },
];

/* ─── Labels & icons ─── */

const WEAPON_TYPE_LABELS: Record<string, string> = {
  ASSAULT_RIFLE: "Assault Rifle",
  SMG: "SMG",
  LMG: "LMG",
  PISTOL: "Pistol",
  SNIPER_RIFLE: "Sniper Rifle",
  SHOTGUN: "Shotgun",
  PRECISION_RIFLE: "Precision Rifle",
  RAILGUN: "Railgun",
};

const MOD_TYPE_LABELS: Record<string, string> = {
  BARREL: "Barrel",
  GRIP: "Grip",
  MAGAZINE: "Magazine",
  OPTIC: "Optic",
  SHIELD: "Shield",
  GENERATOR: "Generator",
  CHIP: "Chip",
};

type IconComponent = React.FC<LucideProps>;

const MOD_TYPE_ICONS: Record<string, IconComponent> = {
  BARREL: Crosshair,
  GRIP: Grip,
  MAGAZINE: Layers,
  OPTIC: Eye,
  SHIELD: ShieldHalf,
  GENERATOR: Zap,
  CHIP: Cpu,
};

const MOD_CATEGORIES = [
  "BARREL",
  "GRIP",
  "MAGAZINE",
  "OPTIC",
  "SHIELD",
  "GENERATOR",
  "CHIP",
] as const;

/* ─── Suggested items — a mix of weapons, guides, and a mod ─── */

const SUGGESTED_WEAPON_SLUGS = [
  "m77-assault-rifle",
  "wstr-combat-shotgun",
  "misriah-2442",
];

/* ─── Fuse index types (flat list for searching) ─── */

type FuseItem = {
  kind: "weapon" | "mod" | "guide";
  id: string;
  name: string;
  slug: string;
  itemType: string;
  itemTypeLabel: string;
  rarity: string | null;
  slot?: string;
  imageUrl?: string | null;
  isUniversal?: boolean;
  category?: string;
};

/* ─── OS detection for modifier key ─── */

function useModifierKey() {
  const [isMac, setIsMac] = useState(false);
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().includes("MAC") ||
      navigator.userAgent.toUpperCase().includes("MAC"));
  }, []);
  return isMac ? "⌘" : "Ctrl";
}

/* ─── Debounce hook ─── */

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

/* ─── Main component ─── */

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const [modCategoryFilter, setModCategoryFilter] = useState<string | null>(
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const modKey = useModifierKey();

  const debouncedQuery = useDebouncedValue(query.trim(), 150);

  // Fetch the full index once — cached for 1hr server-side, staleTime client-side
  const { data: index } = api.search.getIndex.useQuery(undefined, {
    staleTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Build a flat Fuse index from the data (weapons + mods + guides)
  const { fuse, flatItems } = useMemo(() => {
    if (!index) return { fuse: null, flatItems: [] };

    const items: FuseItem[] = [
      ...index.weapons.map((w) => ({
        kind: "weapon" as const,
        id: w.id,
        name: w.name,
        slug: w.slug,
        itemType: w.type,
        itemTypeLabel: WEAPON_TYPE_LABELS[w.type] ?? w.type,
        rarity: w.rarity,
        slot: w.slot,
        imageUrl: w.imageUrl,
      })),
      ...index.mods.map((m) => ({
        kind: "mod" as const,
        id: m.id,
        name: m.name,
        slug: m.slug,
        itemType: m.type,
        itemTypeLabel: MOD_TYPE_LABELS[m.type] ?? m.type,
        rarity: m.rarity,
        isUniversal: m.isUniversal,
      })),
      ...GUIDES.map((g) => ({
        kind: "guide" as const,
        id: g.id,
        name: g.name,
        slug: g.slug,
        itemType: "guide",
        itemTypeLabel: "Guide",
        rarity: null,
        category: g.category,
      })),
    ];

    const fuseInstance = new Fuse(items, {
      keys: [
        { name: "name", weight: 1 },
        { name: "itemTypeLabel", weight: 0.5 },
        { name: "category", weight: 0.4 },
        { name: "rarity", weight: 0.2 },
      ],
      threshold: 0.35,
      distance: 100,
      includeScore: true,
      minMatchCharLength: 1,
    });

    return { fuse: fuseInstance, flatItems: items };
  }, [index]);

  // Search results
  const results = useMemo<SearchHit[]>(() => {
    if (!fuse) return [];

    // If we have a mod category filter but no text, show all mods of that category
    if (modCategoryFilter && !debouncedQuery) {
      return flatItems
        .filter(
          (item) =>
            item.kind === "mod" && item.itemType === modCategoryFilter,
        )
        .slice(0, 14)
        .map(fuseItemToHit);
    }

    if (!debouncedQuery) return [];

    let fuseResults = fuse.search(debouncedQuery, { limit: 20 });

    // If mod category filter is active, filter results to that mod type
    if (modCategoryFilter) {
      fuseResults = fuseResults.filter(
        (r) =>
          r.item.kind === "mod" && r.item.itemType === modCategoryFilter,
      );
    }

    return fuseResults.map((r) => fuseItemToHit(r.item));
  }, [fuse, flatItems, debouncedQuery, modCategoryFilter]);

  // Suggested items when query is empty and no filter — a mix of weapons, guides, mods
  const suggestedItems = useMemo<SearchHit[]>(() => {
    if (!index) return [];

    const items: SearchHit[] = [];

    // 3 popular weapons
    const weapons = index.weapons
      .filter((w) => SUGGESTED_WEAPON_SLUGS.includes(w.slug))
      .sort(
        (a, b) =>
          SUGGESTED_WEAPON_SLUGS.indexOf(a.slug) -
          SUGGESTED_WEAPON_SLUGS.indexOf(b.slug),
      );
    for (const w of weapons) {
      items.push({ kind: "weapon", ...w });
    }

    // 2 guides
    items.push({ kind: "guide", ...GUIDES[0]! });
    items.push({ kind: "guide", ...GUIDES[3]! });

    // 2 popular mods (first chip mod and first barrel mod)
    const chipMod = index.mods.find(
      (m) => m.type === "CHIP" && m.rarity === "SUPERIOR",
    );
    const barrelMod = index.mods.find(
      (m) => m.type === "BARREL" && m.rarity === "PRESTIGE",
    );
    if (chipMod) {
      items.push({ kind: "mod", ...chipMod });
    }
    if (barrelMod) {
      items.push({ kind: "mod", ...barrelMod });
    }

    return items;
  }, [index]);

  const showSuggested = !debouncedQuery && !modCategoryFilter;
  const displayItems = showSuggested ? suggestedItems : results;

  // Reset active index when results change
  useEffect(() => {
    setActiveIdx(0);
  }, [displayItems.length, debouncedQuery, modCategoryFilter]);

  // Navigate to a result
  const navigateTo = useCallback(
    (hit: SearchHit) => {
      setOpen(false);
      setQuery("");
      setModCategoryFilter(null);
      if (hit.kind === "weapon") {
        router.push(`/weapons/${hit.slug}`);
      } else if (hit.kind === "guide") {
        router.push(`/guides/${hit.slug}`);
      } else {
        // Mods don't have individual pages yet
        router.push(`/`);
      }
    },
    [router],
  );

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery("");
            setModCategoryFilter(null);
          }
          return !prev;
        });
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        if (modCategoryFilter) {
          setModCategoryFilter(null);
        } else {
          setOpen(false);
          setQuery("");
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, modCategoryFilter]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Arrow key navigation + enter to select
  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, displayItems.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && displayItems[activeIdx]) {
        e.preventDefault();
        navigateTo(displayItems[activeIdx]);
      }
    },
    [displayItems, activeIdx, navigateTo],
  );

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector("[data-active=true]") as
      | HTMLElement
      | undefined;
    active?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  if (!open) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-background/70 backdrop-blur-sm"
        onClick={() => {
          setOpen(false);
          setQuery("");
          setModCategoryFilter(null);
        }}
      />

      {/* Palette */}
      <div className="fixed inset-x-0 top-[12vh] z-[9999] mx-auto w-full max-w-xl px-4">
        <div
          className="overflow-hidden rounded-xl border border-border-accent/60 bg-panel shadow-2xl"
          style={{
            boxShadow:
              "0 0 40px rgba(0,212,255,0.12), 0 16px 48px rgba(0,0,0,0.6)",
          }}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search size={16} className="shrink-0 text-accent" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder={
                modCategoryFilter
                  ? `Search ${MOD_TYPE_LABELS[modCategoryFilter]} mods...`
                  : "Search weapons, mods & guides..."
              }
              className="flex-1 bg-transparent font-mono text-sm text-foreground outline-none placeholder:text-dim"
            />
            {(query || modCategoryFilter) && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setModCategoryFilter(null);
                  inputRef.current?.focus();
                }}
                className="shrink-0 cursor-pointer text-dim transition-colors hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
            <kbd className="shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-dim">
              ESC
            </kbd>
          </div>

          {/* Mod category quick-filters */}
          <div className="flex gap-1 overflow-x-auto border-b border-border/50 px-4 py-2">
            {MOD_CATEGORIES.map((cat) => {
              const isActive = modCategoryFilter === cat;
              const Icon = MOD_TYPE_ICONS[cat];
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setModCategoryFilter(isActive ? null : cat);
                    inputRef.current?.focus();
                  }}
                  className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border px-2 py-1 font-mono text-[11px] transition-all ${
                    isActive
                      ? "border-accent/50 bg-accent/10 text-accent"
                      : "border-border text-dim hover:border-border-accent/40 hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {MOD_TYPE_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Results list */}
          <div
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto overscroll-contain py-1"
          >
            {/* Section label */}
            {showSuggested && suggestedItems.length > 0 && (
              <div className="px-4 pt-2 pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
                  Suggested
                </span>
              </div>
            )}

            {modCategoryFilter && !debouncedQuery && results.length > 0 && (
              <div className="px-4 pt-2 pb-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
                  {MOD_TYPE_LABELS[modCategoryFilter]} Mods
                </span>
              </div>
            )}

            {/* No results */}
            {!showSuggested && displayItems.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="font-mono text-sm text-dim">
                  {debouncedQuery
                    ? `No results for "${debouncedQuery}"${modCategoryFilter ? ` in ${MOD_TYPE_LABELS[modCategoryFilter]}` : ""}`
                    : "No mods found"}
                </p>
              </div>
            )}

            {/* Result rows */}
            {displayItems.map((hit, i) => {
              const isActive = i === activeIdx;

              if (hit.kind === "weapon") {
                return (
                  <button
                    key={`w-${hit.id}`}
                    type="button"
                    data-active={isActive}
                    onClick={() => navigateTo(hit)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                      isActive ? "bg-panel-hover" : ""
                    }`}
                  >
                    <Crosshair
                      size={14}
                      className="shrink-0 text-accent"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[13px] text-foreground">
                        {hit.name}
                      </span>
                      <span className="font-mono text-[10px] text-dim">
                        {WEAPON_TYPE_LABELS[hit.type] ?? hit.type}
                        {hit.rarity && ` · ${hit.rarity}`}
                      </span>
                    </div>
                    {isActive && (
                      <ArrowRight
                        size={12}
                        className="shrink-0 text-accent"
                      />
                    )}
                  </button>
                );
              }

              if (hit.kind === "guide") {
                return (
                  <button
                    key={`g-${hit.id}`}
                    type="button"
                    data-active={isActive}
                    onClick={() => navigateTo(hit)}
                    onMouseEnter={() => setActiveIdx(i)}
                    className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                      isActive ? "bg-panel-hover" : ""
                    }`}
                  >
                    <BookOpen
                      size={14}
                      className="shrink-0 text-warning"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[13px] text-foreground">
                        {hit.name}
                      </span>
                      <span className="font-mono text-[10px] text-dim">
                        Guide · {hit.category}
                      </span>
                    </div>
                    {isActive && (
                      <ArrowRight
                        size={12}
                        className="shrink-0 text-warning"
                      />
                    )}
                  </button>
                );
              }

              const ModIcon = MOD_TYPE_ICONS[hit.type] ?? Cpu;
              return (
                <button
                  key={`m-${hit.id}`}
                  type="button"
                  data-active={isActive}
                  onClick={() => navigateTo(hit)}
                  onMouseEnter={() => setActiveIdx(i)}
                  className={`flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors ${
                    isActive ? "bg-panel-hover" : ""
                  }`}
                >
                  <ModIcon size={14} className="shrink-0 text-accent2" />
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-[13px] text-foreground">
                      {hit.name}
                    </span>
                    <span className="font-mono text-[10px] text-dim">
                      {MOD_TYPE_LABELS[hit.type] ?? hit.type} Mod
                      {hit.isUniversal && " · Universal"}
                      {` · ${hit.rarity}`}
                    </span>
                  </div>
                  {isActive && (
                    <ArrowRight
                      size={12}
                      className="shrink-0 text-accent2"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer hint */}
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <div className="flex gap-3">
              <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
                <kbd className="rounded border border-border px-1 py-px text-[9px]">
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
                <kbd className="rounded border border-border px-1 py-px text-[9px]">
                  ↵
                </kbd>
                Open
              </span>
            </div>
            <span className="flex items-center gap-1 font-mono text-[10px] text-dim">
              <kbd className="rounded border border-border px-1 py-px text-[9px]">
                {modKey}
              </kbd>
              +
              <kbd className="rounded border border-border px-1 py-px text-[9px]">
                K
              </kbd>
              Toggle
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}

/* ─── Helpers ─── */

function fuseItemToHit(item: FuseItem): SearchHit {
  if (item.kind === "weapon") {
    return {
      kind: "weapon",
      id: item.id,
      name: item.name,
      slug: item.slug,
      type: item.itemType,
      slot: item.slot ?? "",
      rarity: item.rarity,
      imageUrl: item.imageUrl ?? null,
    };
  }
  if (item.kind === "guide") {
    return {
      kind: "guide",
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category ?? "",
    };
  }
  return {
    kind: "mod",
    id: item.id,
    name: item.name,
    slug: item.slug,
    type: item.itemType,
    rarity: item.rarity ?? "STANDARD",
    isUniversal: item.isUniversal ?? false,
  };
}

/* ─── Trigger button for navbar ─── */

export function CommandPaletteTrigger() {
  const modKey = useModifierKey();

  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
          }),
        );
      }}
      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-panel px-3 py-1.5 font-mono text-xs text-dim transition-all hover:border-border-accent hover:text-foreground"
    >
      <Search size={12} />
      <span className="hidden sm:inline">Search...</span>
      <kbd className="hidden rounded border border-border px-1 py-px text-[10px] sm:inline">
        {modKey}+K
      </kbd>
    </button>
  );
}
