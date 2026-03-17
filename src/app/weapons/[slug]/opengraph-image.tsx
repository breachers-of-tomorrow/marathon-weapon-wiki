import { ImageResponse } from "next/og";
import { unstable_cache } from "next/cache";
import { db } from "@/server/db";

export const alt = "Weapon details";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const getWeapon = unstable_cache(
  (slug: string) =>
    db.weapon.findUnique({
      where: { slug },
      select: {
        name: true,
        type: true,
        damage: true,
        rateOfFire: true,
        magazineSize: true,
        imageUrl: true,
      },
    }),
  ["weapon-og"],
  { revalidate: 3600, tags: ["weapons"] },
);

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const weapon = await getWeapon(slug);

  if (!weapon) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0a0b0f",
            color: "#e8eaed",
            fontSize: 48,
            fontFamily: "monospace",
          }}
        >
          Weapon Not Found
        </div>
      ),
      { ...size },
    );
  }

  const typeBadge = weapon.type.replace(/_/g, " ");

  const stats = [
    { label: "DMG", value: weapon.damage },
    { label: "ROF", value: weapon.rateOfFire },
    { label: "MAG", value: weapon.magazineSize },
  ].filter((s) => s.value != null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0a0b0f",
          fontFamily: "monospace",
          padding: 60,
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "#038adf",
          }}
        />

        {/* Main content */}
        <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
          {/* Left: weapon image area */}
          <div
            style={{
              width: 400,
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#12141a",
              borderRadius: 16,
              border: "1px solid #2a2d3a",
              marginRight: 60,
              flexShrink: 0,
            }}
          >
            {weapon.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${weapon.imageUrl}`}
                alt={weapon.name}
                width={320}
                height={320}
                style={{ objectFit: "contain" }}
              />
            ) : (
              <div style={{ color: "#6b7280", fontSize: 18 }}>NO IMAGE</div>
            )}
          </div>

          {/* Right: weapon info */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
            }}
          >
            {/* Type badge */}
            <div
              style={{
                fontSize: 16,
                color: "#038adf",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginBottom: 16,
              }}
            >
              {typeBadge}
            </div>

            {/* Weapon name */}
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "#e8eaed",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                lineHeight: 1.1,
              }}
            >
              {weapon.name}
            </div>

            {/* Stats row */}
            <div
              style={{
                display: "flex",
                gap: 40,
                marginTop: 40,
              }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      fontSize: 14,
                      color: "#6b7280",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 700,
                      color: "#038adf",
                      marginTop: 4,
                    }}
                  >
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            borderTop: "1px solid #2a2d3a",
            paddingTop: 20,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "#6b7280",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
            }}
          >
            MARATHON WEAPON WIKI
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
