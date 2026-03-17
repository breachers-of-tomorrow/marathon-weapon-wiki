import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          borderRadius: 32,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 700,
            color: "#038adf",
            lineHeight: 1,
          }}
        >
          M
        </div>
      </div>
    ),
    { ...size },
  );
}
