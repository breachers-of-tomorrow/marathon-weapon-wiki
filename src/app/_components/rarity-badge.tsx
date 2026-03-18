export const RARITY_COLORS: Record<string, string> = {
  PRESTIGE: "#f59e0b",
  SUPERIOR: "#8b5cf6",
  DELUXE: "#00d4ff",
  ENHANCED: "#00ff9d",
  STANDARD: "#6b7280",
};

export function RarityBadge({ rarity }: { rarity: string }) {
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
