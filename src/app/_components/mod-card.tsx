"use client";

import { useDraggable } from "@dnd-kit/core";
import { RarityBadge, RARITY_COLORS } from "./rarity-badge";

type Mod = {
  id: string;
  name: string;
  type: string;
  rarity: string;
  description: string | null;
  price: number | null;
};

export function ModCard({
  mod,
  selected,
  onClick,
}: {
  mod: Mod;
  selected: boolean;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: mod.id,
    data: { mod },
  });

  const color = RARITY_COLORS[mod.rarity] ?? "#6b7280";

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      {...listeners}
      {...attributes}
      className={`w-full cursor-pointer rounded-md border p-2.5 text-left transition-all ${
        selected
          ? "border-accent bg-panel-hover"
          : "border-border bg-panel hover:border-border-accent hover:bg-panel-hover"
      }`}
      style={{
        borderLeftWidth: "3px",
        borderLeftColor: selected ? color : "transparent",
        opacity: isDragging ? 0.5 : 1,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-sm text-foreground">
          {mod.name}
        </span>
        <div className="flex shrink-0 items-center gap-2">
          {mod.price != null && (
            <span className="font-mono text-[10px] text-dim">
              {mod.price === 0 ? "Free" : `${mod.price.toLocaleString()}cr`}
            </span>
          )}
          <RarityBadge rarity={mod.rarity} />
        </div>
      </div>
      {mod.description && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-foreground/60">
          {mod.description}
        </p>
      )}
    </button>
  );
}
