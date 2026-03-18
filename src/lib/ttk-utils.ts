export function getTtkColor(value: number): string {
  if (value === 0) return "text-green-400";
  if (value <= 0.7) return "text-green-400";
  if (value <= 1.0) return "text-emerald-400";
  if (value <= 1.3) return "text-yellow-400";
  if (value <= 1.8) return "text-orange-400";
  return "text-red-400";
}

export const shieldTiers = [
  { key: "White", hp: 140, color: "text-gray-300" },
  { key: "Green", hp: 160, color: "text-green-400" },
  { key: "Blue", hp: 180, color: "text-blue-400" },
  { key: "Purple", hp: 200, color: "text-purple-400" },
] as const;

export function formatTtk(value: number): string {
  if (value === 0) return "0.000s";
  return `${value.toFixed(3)}s`;
}
