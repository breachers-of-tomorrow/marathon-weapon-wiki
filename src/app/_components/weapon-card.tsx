import Image from "next/image";
import Link from "next/link";
import type { Weapon } from "../../../generated/prisma";

export function WeaponCard({ weapon }: { weapon: Weapon }) {
  const format = (s: string) => s.replace(/_/g, " ");

  return (
    <Link
      href={`/weapons/${weapon.slug}`}
      className="cryo-panel group relative flex flex-col rounded-lg transition-all hover:border-border-accent hover:bg-panel-hover"
    >
      {/* Image placeholder */}
      <div className="bg-border/30 relative flex h-40 items-center justify-center rounded-t-lg">
        {weapon.imageUrl ? (
          <Image
            src={weapon.imageUrl}
            alt={weapon.name}
            fill
            className="rounded-t-lg object-contain p-2"
          />
        ) : (
          <span className="text-dim font-mono text-xs uppercase tracking-wide">
            No Image
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Name */}
        <h2 className="font-mono text-sm font-semibold uppercase tracking-wide text-foreground">
          {weapon.name}
        </h2>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          <span className="bg-accent-dim text-accent rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide">
            {format(weapon.type)}
          </span>
          <span className="bg-accent-dim text-accent rounded px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide">
            {format(weapon.slot)}
          </span>
        </div>

        {/* Key stats */}
        <div className="text-dim mt-auto space-y-1 pt-2 font-mono text-xs">
          {weapon.damage != null && (
            <div className="flex justify-between">
              <span>DMG</span>
              <span className="text-foreground">{weapon.damage}</span>
            </div>
          )}
          {weapon.rateOfFire != null && (
            <div className="flex justify-between">
              <span>ROF</span>
              <span className="text-foreground">{weapon.rateOfFire}</span>
            </div>
          )}
          {weapon.magazineSize != null && (
            <div className="flex justify-between">
              <span>MAG</span>
              <span className="text-foreground">{weapon.magazineSize}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hover arrow */}
      <div className="text-accent absolute right-3 top-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="text-lg">&rarr;</span>
      </div>
    </Link>
  );
}
