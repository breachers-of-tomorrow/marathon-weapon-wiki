export function WeaponBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-accent-dim text-accent rounded px-2 py-0.5 font-mono text-xs uppercase tracking-wide">
      {children}
    </span>
  );
}

export function WeaponBadges({
  type,
  slot,
  ammoType,
}: {
  type: string;
  slot: string;
  ammoType: string;
}) {
  const format = (s: string) => s.replace(/_/g, " ");

  return (
    <div className="flex flex-wrap gap-2">
      <WeaponBadge>{format(type)}</WeaponBadge>
      <WeaponBadge>{format(slot)}</WeaponBadge>
      <WeaponBadge>{format(ammoType)}</WeaponBadge>
    </div>
  );
}
