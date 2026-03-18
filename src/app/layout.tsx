import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { SubmitDataButton } from "@/app/_components/submit-data-button";

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
        <TRPCReactProvider>
          {children}
          <SubmitDataButton />
          <a
            href="https://github.com/LeonardM01/marathon-weapon-wiki/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contribute on GitHub"
            className="fixed bottom-6 right-6 z-50 cryo-panel rounded-lg border-border p-2.5 text-dim transition-all hover:border-border-accent hover:text-foreground hover:shadow-[0_0_12px_rgba(3,138,223,0.3)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
