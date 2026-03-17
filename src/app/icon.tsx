import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontSize: 20,
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
