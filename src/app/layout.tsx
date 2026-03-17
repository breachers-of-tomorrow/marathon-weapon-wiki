import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Marathon Weapon Wiki",
    template: "%s | Marathon Weapon Wiki",
  },
  description:
    "Tactical weapon database for Marathon — stats, damage, rate of fire, and combat data for every weapon.",
  keywords: [
    "Marathon",
    "weapons",
    "wiki",
    "stats",
    "damage",
    "weapon database",
    "tactical",
    "combat data",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Marathon Weapon Wiki",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${jetbrainsMono.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
