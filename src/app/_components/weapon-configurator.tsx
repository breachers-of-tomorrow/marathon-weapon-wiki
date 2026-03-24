"use client";

import { useState, useRef, useMemo, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Crosshair,
  Grip,
  Layers,
  Eye,
  ShieldHalf,
  Zap,
  Cpu,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";
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

const SLOT_ORDER = [
  "BARREL",
  "GRIP",
  "MAGAZINE",
  "OPTIC",
  "SHIELD",
  "GENERATOR",
  "CHIP",
] as const;

type SlotIconComponent = React.FC<LucideProps>;

const SLOT_ICON_COMPONENTS: Record<string, SlotIconComponent> = {
  BARREL: Crosshair,
  GRIP: Grip,
  MAGAZINE: Layers,
  OPTIC: Eye,
  SHIELD: ShieldHalf,
  GENERATOR: Zap,
  CHIP: Cpu,
};

const RARITY_ORDER = ["PRESTIGE", "SUPERIOR", "DELUXE", "ENHANCED", "STANDARD"];

/** Small icon badge for a mod type, with colored background */
function ModTypeIcon({
  type,
  color,
  size = 14,
}: {
  type: string;
  color: string;
  size?: number;
}) {
  const IconComponent = SLOT_ICON_COMPONENTS[type];
  if (!IconComponent) return null;
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded border"
      style={{
        width: size + 12,
        height: size + 12,
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
      }}
    >
      <IconComponent size={size} strokeWidth={1.5} style={{ color }} />
    </div>
  );
}

/* ─── Tooltip position logic ─── */

type TooltipAnchor = {
  mod: Mod;
  rect: DOMRect;
  side: "left" | "top";
};

function useModTooltip() {
  const [anchor, setAnchor] = useState<TooltipAnchor | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback(
    (mod: Mod, el: HTMLElement, side: "left" | "top" = "left") => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const rect = el.getBoundingClientRect();
      setAnchor({ mod, rect, side });
    },
    [],
  );

  const hide = useCallback(() => {
    // Small delay so the tooltip doesn't flicker between adjacent items
    timeoutRef.current = setTimeout(() => setAnchor(null), 80);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { anchor, show, hide };
}

export function WeaponConfigurator({
  linkedMods,
  universalMods,
  onModsChange,
  onSaveBuild,
  isSaving,
}: {
  linkedMods: Mod[];
  universalMods: Mod[];
  onModsChange?: (equippedMods: Mod[]) => void;
  onSaveBuild?: (equippedMods: Record<string, Mod>) => void;
  isSaving?: boolean;
}) {
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [equippedMods, setEquippedMods] = useState<Record<string, Mod>>({});
  const [filterRarity, setFilterRarity] = useState<string | null>(null);
  const tooltip = useModTooltip();

  // Notify parent of mod changes via effect to avoid setState-during-render
  useEffect(() => {
    onModsChange?.(Object.values(equippedMods));
  }, [equippedMods, onModsChange]);

  const allMods = useMemo(
    () => [...linkedMods, ...universalMods],
    [linkedMods, universalMods],
  );

  const availableSlots = useMemo(() => {
    return SLOT_ORDER.filter((type) => allMods.some((m) => m.type === type));
  }, [allMods]);

  const slotMods = useMemo(() => {
    if (!activeSlot) return [];
    let mods = allMods.filter((m) => m.type === activeSlot);
    if (filterRarity) {
      mods = mods.filter((m) => m.rarity === filterRarity);
    }
    return mods.sort(
      (a, b) =>
        RARITY_ORDER.indexOf(a.rarity) - RARITY_ORDER.indexOf(b.rarity),
    );
  }, [allMods, activeSlot, filterRarity]);

  const slotRarities = useMemo(() => {
    if (!activeSlot) return [];
    const rarities = new Set(
      allMods.filter((m) => m.type === activeSlot).map((m) => m.rarity),
    );
    return RARITY_ORDER.filter((r) => rarities.has(r));
  }, [allMods, activeSlot]);

  const equipMod = useCallback((mod: Mod) => {
    setEquippedMods((prev) => {
      const next = { ...prev };
      if (prev[mod.type]?.id === mod.id) {
        delete next[mod.type];
      } else {
        next[mod.type] = mod;
      }
      return next;
    });
  }, []);

  const unequipSlot = useCallback((type: string) => {
    setEquippedMods((prev) => {
      const next = { ...prev };
      delete next[type];
      return next;
    });
  }, []);

  const equippedCount = Object.keys(equippedMods).length;

  if (allMods.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading font-display text-xs uppercase tracking-widest heading-glow">
          Attachments
        </h2>
        {equippedCount > 0 && (
          <span className="font-mono text-[10px] uppercase tracking-wide text-dim">
            {equippedCount} equipped
          </span>
        )}
      </div>

      {/* Save Build CTA — prominent, always visible when mods are equipped */}
      {onSaveBuild && equippedCount > 0 && (
        <button
          type="button"
          onClick={() => onSaveBuild(equippedMods)}
          disabled={isSaving}
          className="w-full cursor-pointer rounded-lg border border-accent/50 bg-accent/10 px-4 py-2.5 font-display text-sm uppercase tracking-wider text-accent transition-all hover:border-accent hover:bg-accent/20 hover:shadow-[0_0_12px_rgba(0,212,255,0.2)] active:bg-accent/30 disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Save Build"}
        </button>
      )}

      {/* Slot Bar */}
      <div className="grid grid-cols-4 gap-1.5">
        {availableSlots.map((type) => {
          const isActive = activeSlot === type;
          const hasEquipped = !!equippedMods[type];
          const color = hasEquipped
            ? (RARITY_COLORS[equippedMods[type]!.rarity] ?? "#6b7280")
            : undefined;
          const IconComponent = SLOT_ICON_COMPONENTS[type];

          return (
            <button
              key={type}
              type="button"
              onClick={() => {
                setActiveSlot(isActive ? null : type);
                setFilterRarity(null);
              }}
              className={`group relative flex cursor-pointer flex-col items-center gap-1 rounded-lg border px-1 py-1.5 transition-all ${
                isActive && !hasEquipped
                  ? "border-border-accent bg-panel-hover"
                  : !hasEquipped
                    ? "border-border bg-panel hover:border-border-accent/50"
                    : ""
              }`}
              style={
                hasEquipped
                  ? {
                      borderColor: isActive ? color : `${color}60`,
                      backgroundColor: isActive
                        ? `${color}25`
                        : `${color}15`,
                    }
                  : undefined
              }
            >
              {hasEquipped && equippedMods[type]!.imageUrl ? (
                <img
                  src={equippedMods[type]!.imageUrl!}
                  alt={equippedMods[type]!.name}
                  width={36}
                  height={36}
                  className="rounded object-contain"
                  style={{ filter: `drop-shadow(0 0 4px ${color}50)` }}
                />
              ) : (
                IconComponent && (
                  <IconComponent
                    size={28}
                    strokeWidth={hasEquipped ? 2.5 : 1.5}
                    className={`transition-colors ${
                      hasEquipped
                        ? ""
                        : isActive
                          ? "text-accent"
                          : "text-dim group-hover:text-foreground"
                    }`}
                    style={hasEquipped ? { color } : undefined}
                  />
                )
              )}
              <span
                className={`font-mono text-[9px] uppercase leading-none tracking-wider transition-colors ${
                  hasEquipped
                    ? ""
                    : isActive
                      ? "text-accent"
                      : "text-dim"
                }`}
                style={hasEquipped ? { color } : undefined}
              >
                {type === "MAGAZINE"
                  ? "MAG"
                  : type === "GENERATOR"
                    ? "GEN"
                    : type}
              </span>
            </button>
          );
        })}
      </div>

      {/* Currently Equipped in Active Slot */}
      {activeSlot && equippedMods[activeSlot] && (
        <div className="cryo-panel rounded-lg p-3">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
              Currently Equipped
            </span>
            <button
              type="button"
              onClick={() => unequipSlot(activeSlot)}
              className="cursor-pointer font-mono text-[10px] uppercase tracking-wide text-danger transition-colors hover:text-danger/80"
            >
              Remove
            </button>
          </div>
          <EquippedModRow mod={equippedMods[activeSlot]} />
        </div>
      )}

      {/* Vault Grid */}
      {activeSlot && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-dim">
              From Vault
            </span>
            {slotRarities.length > 1 && (
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setFilterRarity(null)}
                  className={`cursor-pointer rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide transition-colors ${
                    !filterRarity
                      ? "bg-accent/20 text-accent"
                      : "text-dim hover:text-foreground"
                  }`}
                >
                  All
                </button>
                {slotRarities.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() =>
                      setFilterRarity(filterRarity === r ? null : r)
                    }
                    className="cursor-pointer rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide transition-colors"
                    style={{
                      backgroundColor:
                        filterRarity === r
                          ? `${RARITY_COLORS[r]}30`
                          : "transparent",
                      color:
                        filterRarity === r
                          ? RARITY_COLORS[r]
                          : "var(--color-dim)",
                    }}
                  >
                    {r.slice(0, 3)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {slotMods.length > 0 ? (
            <div className="grid grid-cols-2 gap-1.5">
              {slotMods.map((mod) => (
                <VaultModTile
                  key={mod.id}
                  mod={mod}
                  isEquipped={equippedMods[mod.type]?.id === mod.id}
                  onEquip={equipMod}
                  onHoverStart={(m, el) => tooltip.show(m, el, "left")}
                  onHoverEnd={tooltip.hide}
                />
              ))}
            </div>
          ) : (
            <p className="py-4 text-center font-mono text-xs text-dim">
              No mods match your filters.
            </p>
          )}
        </div>
      )}

      {/* All Equipped Summary */}
      {!activeSlot && equippedCount > 0 && (
        <div className="cryo-panel rounded-lg p-3">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-dim">
            Loadout
          </span>
          <div className="space-y-1.5">
            {SLOT_ORDER.filter((t) => equippedMods[t]).map((type) => {
              const mod = equippedMods[type]!;
              return (
                <LoadoutRow
                  key={type}
                  type={type}
                  mod={mod}
                  onUnequip={unequipSlot}
                  onHoverStart={(m, el) => tooltip.show(m, el, "left")}
                  onHoverEnd={tooltip.hide}
                />
              );
            })}
          </div>
          <AggregateStatSummary equippedMods={Object.values(equippedMods)} />
        </div>
      )}

      {/* Hint when no slot selected */}
      {!activeSlot && equippedCount === 0 && (
        <div className="cryo-panel flex flex-col items-center gap-2 rounded-lg py-6">
          <span className="text-base text-dim">◆</span>
          <p className="font-mono text-xs text-dim">
            Select a slot to browse attachments
          </p>
        </div>
      )}

      {/* Floating Tooltip — rendered via portal so it's above everything */}
      {tooltip.anchor && <FloatingTooltip anchor={tooltip.anchor} equippedMods={equippedMods} />}
    </div>
  );
}

/* ─── Vault grid tile ─── */

function VaultModTile({
  mod,
  isEquipped,
  onEquip,
  onHoverStart,
  onHoverEnd,
}: {
  mod: Mod;
  isEquipped: boolean;
  onEquip: (mod: Mod) => void;
  onHoverStart: (mod: Mod, el: HTMLElement) => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const rarityColor = RARITY_COLORS[mod.rarity] ?? "#6b7280";

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onEquip(mod)}
      onMouseEnter={() => ref.current && onHoverStart(mod, ref.current)}
      onMouseLeave={onHoverEnd}
      className={`group relative cursor-pointer rounded-md border p-2 text-left transition-all ${
        isEquipped
          ? "border-border-accent bg-panel-hover"
          : "border-border bg-panel hover:border-border-accent/50 hover:bg-panel-hover"
      }`}
    >
      {/* Rarity accent stripe */}
      <div
        className="absolute top-0 left-0 h-full w-0.5 rounded-l-md"
        style={{
          backgroundColor: isEquipped ? rarityColor : "transparent",
        }}
      />

      {mod.imageUrl ? (
        <>
          <div className="mb-1 flex items-center justify-between gap-1">
            <img
              src={mod.imageUrl}
              alt={mod.name}
              width={36}
              height={36}
              className="rounded object-contain"
              style={{ filter: `drop-shadow(0 0 4px ${rarityColor}40)` }}
            />
            {isEquipped && (
              <span className="font-mono text-[8px] uppercase tracking-wide text-accent">
                EQ
              </span>
            )}
          </div>
        </>
      ) : (
        <div className="mb-1 flex items-center justify-between gap-1">
          <ModTypeIcon type={mod.type} color={rarityColor} size={14} />
          {isEquipped && (
            <span className="font-mono text-[8px] uppercase tracking-wide text-accent">
              EQ
            </span>
          )}
        </div>
      )}

      <span className="line-clamp-1 font-mono text-[11px] leading-tight text-foreground">
        {mod.name}
      </span>

      <div className="mt-0.5 flex items-center gap-1.5">
        <RarityBadge rarity={mod.rarity} />
        {mod.price != null && mod.price > 0 && (
          <span className="font-mono text-[9px] text-dim">
            {mod.price.toLocaleString()}cr
          </span>
        )}
      </div>
    </button>
  );
}

/* ─── Loadout row with hover ─── */

function LoadoutRow({
  type,
  mod,
  onUnequip,
  onHoverStart,
  onHoverEnd,
}: {
  type: string;
  mod: Mod;
  onUnequip: (type: string) => void;
  onHoverStart: (mod: Mod, el: HTMLElement) => void;
  onHoverEnd: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseEnter={() => ref.current && onHoverStart(mod, ref.current)}
      onMouseLeave={onHoverEnd}
      className="flex items-center gap-2 rounded border border-border bg-background/30 px-2 py-1.5"
    >
      {mod.imageUrl ? (
        <img
          src={mod.imageUrl}
          alt={mod.name}
          width={36}
          height={36}
          className="shrink-0 rounded object-contain"
        />
      ) : (
        <span className="w-12 shrink-0 font-mono text-[9px] uppercase tracking-wider text-dim">
          {type === "MAGAZINE" ? "MAG" : type === "GENERATOR" ? "GEN" : type}
        </span>
      )}
      <span
        className="h-3 w-0.5 shrink-0 rounded-full"
        style={{
          backgroundColor: RARITY_COLORS[mod.rarity] ?? "#6b7280",
        }}
      />
      <span className="min-w-0 flex-1 truncate font-mono text-[11px] text-foreground">
        {mod.name}
      </span>
      <button
        type="button"
        onClick={() => onUnequip(type)}
        className="shrink-0 cursor-pointer font-mono text-xs text-dim transition-colors hover:text-danger"
      >
        &times;
      </button>
    </div>
  );
}

/* ─── Floating tooltip rendered via portal ─── */

function FloatingTooltip({
  anchor,
  equippedMods,
}: {
  anchor: TooltipAnchor;
  equippedMods: Record<string, Mod>;
}) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const { mod, rect, side } = anchor;

  useEffect(() => {
    const el = tooltipRef.current;
    if (!el) return;

    const ttW = el.offsetWidth;
    const ttH = el.offsetHeight;
    const gap = 8;
    const vpW = window.innerWidth;
    const vpH = window.innerHeight;

    let top: number;
    let left: number;

    if (side === "left") {
      // Try to place to the left of the element
      left = rect.left - ttW - gap;
      top = rect.top + rect.height / 2 - ttH / 2;

      // If it would overflow left, place above or below instead
      if (left < gap) {
        left = rect.left + rect.width / 2 - ttW / 2;
        // Prefer above
        top = rect.top - ttH - gap;
        if (top < gap) {
          // Fall back to below
          top = rect.bottom + gap;
        }
      }
    } else {
      // "top" — place above the element
      left = rect.left + rect.width / 2 - ttW / 2;
      top = rect.top - ttH - gap;
      if (top < gap) {
        top = rect.bottom + gap;
      }
    }

    // Clamp to viewport
    top = Math.max(gap, Math.min(top, vpH - ttH - gap));
    left = Math.max(gap, Math.min(left, vpW - ttW - gap));

    setPos({ top, left });
  }, [rect, side]);

  const color = RARITY_COLORS[mod.rarity] ?? "#6b7280";
  const modifiers = parseStatModifiers(mod.statModifiers);
  const isEquipped = equippedMods[mod.type]?.id === mod.id;

  const content = (
    <div
      ref={tooltipRef}
      className="pointer-events-none fixed z-[9999] w-64 rounded-lg border p-3 shadow-2xl"
      style={{
        borderColor: `${color}50`,
        backgroundColor: "#060f17",
        boxShadow: `0 0 24px ${color}15, 0 8px 32px rgba(0,0,0,0.7)`,
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        opacity: pos ? 1 : 0,
        transition: "opacity 0.12s ease-out",
      }}
    >
      {/* Mod image */}
      {mod.imageUrl && (
        <div className="mb-2 flex justify-center">
          <img
            src={mod.imageUrl}
            alt={mod.name}
            width={80}
            height={80}
            className="rounded object-contain"
            style={{
              filter: `drop-shadow(0 0 6px ${color}40)`,
            }}
          />
        </div>
      )}

      {/* Header row */}
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wide text-dim">
          {mod.type} Mod
        </span>
        <div className="flex items-center gap-2">
          {mod.price != null && (
            <span className="font-mono text-[11px] text-foreground">
              {mod.price === 0 ? "Free" : `${mod.price.toLocaleString()}cr`}
            </span>
          )}
          <RarityBadge rarity={mod.rarity} />
        </div>
      </div>

      {/* Name */}
      <h3
        className="mb-1 font-display text-sm uppercase tracking-wide"
        style={{ color }}
      >
        {mod.name}
      </h3>

      {/* Description */}
      {mod.description && (
        <p className="mb-2 text-xs leading-relaxed text-foreground/60">
          {mod.description}
        </p>
      )}

      {/* Universal indicator */}
      {mod.isUniversal && (
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-accent">
          Universal — fits any weapon
        </p>
      )}

      {/* Stat Modifiers */}
      {modifiers.length > 0 && (
        <div className="border-t border-border/50 pt-2">
          <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-dim">
            Stat Changes
          </span>
          <div className="space-y-0.5">
            {modifiers.map((m, i) => (
              <div
                key={`${m.stat}-${i}`}
                className="flex items-center justify-between"
              >
                <span className="font-mono text-[11px] text-foreground/80">
                  {m.label}
                </span>
                <span
                  className="font-mono text-[11px] font-bold"
                  style={{
                    color: m.direction === "up" ? "#00ff9d" : "#ff2244",
                  }}
                >
                  {m.direction === "up" ? "▲" : "▼"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isEquipped && (
        <div className="mt-2 border-t border-border/50 pt-2">
          <span className="font-mono text-[10px] uppercase tracking-wide text-accent">
            Currently Equipped
          </span>
        </div>
      )}
    </div>
  );

  // Portal to body so it's above all layout
  if (typeof document === "undefined") return null;
  return createPortal(content, document.body);
}

/* ─── Sub-components ─── */

function EquippedModRow({ mod }: { mod: Mod }) {
  const color = RARITY_COLORS[mod.rarity] ?? "#6b7280";
  return (
    <div className="flex items-center gap-2">
      {mod.imageUrl ? (
        <img
          src={mod.imageUrl}
          alt={mod.name}
          width={48}
          height={48}
          className="shrink-0 rounded object-contain"
          style={{
            filter: `drop-shadow(0 0 4px ${color}40)`,
          }}
        />
      ) : (
        <ModTypeIcon type={mod.type} color={color} size={18} />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-mono text-sm text-foreground">
            {mod.name}
          </span>
          <RarityBadge rarity={mod.rarity} />
        </div>
        {mod.price != null && mod.price > 0 && (
          <span className="font-mono text-[10px] text-dim">
            {mod.price.toLocaleString()}cr
          </span>
        )}
      </div>
    </div>
  );
}

function AggregateStatSummary({ equippedMods }: { equippedMods: Mod[] }) {
  const allModifiers = useMemo(() => {
    const statMap = new Map<
      string,
      { label: string; ups: number; downs: number }
    >();
    for (const mod of equippedMods) {
      const modifiers = parseStatModifiers(mod.statModifiers);
      for (const m of modifiers) {
        const existing = statMap.get(m.stat);
        if (existing) {
          if (m.direction === "up") existing.ups++;
          else existing.downs++;
        } else {
          statMap.set(m.stat, {
            label: m.label,
            ups: m.direction === "up" ? 1 : 0,
            downs: m.direction === "down" ? 1 : 0,
          });
        }
      }
    }
    return statMap;
  }, [equippedMods]);

  if (allModifiers.size === 0) return null;

  return (
    <div className="mt-2 border-t border-border pt-2">
      <span className="mb-1 block font-mono text-[9px] uppercase tracking-widest text-dim">
        Combined Effects
      </span>
      <div className="flex flex-wrap gap-1">
        {Array.from(allModifiers.entries()).map(([stat, data]) => {
          const net = data.ups - data.downs;
          if (net === 0) return null;
          const isPositive = net > 0;
          return (
            <span
              key={stat}
              className="rounded px-1.5 py-0.5 font-mono text-[10px]"
              style={{
                backgroundColor: isPositive ? "#00ff9d20" : "#ff224420",
                color: isPositive ? "#00ff9d" : "#ff2244",
              }}
            >
              {isPositive ? "↑" : "↓"} {data.label}
              {Math.abs(net) > 1 && ` x${Math.abs(net)}`}
            </span>
          );
        })}
      </div>
    </div>
  );
}
