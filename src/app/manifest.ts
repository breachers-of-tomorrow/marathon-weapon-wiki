import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marathon Weapon Wiki",
    short_name: "MWW",
    description: "Tactical weapon database for Marathon",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0b0f",
    theme_color: "#038adf",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
