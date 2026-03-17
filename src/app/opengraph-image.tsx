import { ImageResponse } from "next/og";

export const alt = "Marathon Weapon Wiki — Tactical Weapon Database";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b0f",
          fontFamily: "monospace",
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

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#e8eaed",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          MARATHON
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#038adf",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginTop: 8,
          }}
        >
          WEAPON WIKI
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 20,
            color: "#6b7280",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: 32,
          }}
        >
          TACTICAL WEAPON DATABASE
        </div>

        {/* Footer stats */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            gap: 48,
            fontSize: 16,
            color: "#9ca3af",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          <span>30 WEAPONS</span>
          <span style={{ color: "#038adf" }}>|</span>
          <span>FULL STATS</span>
          <span style={{ color: "#038adf" }}>|</span>
          <span>COMBAT DATA</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
