# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Marathon Weapon Wiki — a community weapon database for Bungie's Marathon game. Part of the BREACHER.NET ecosystem. Built with the T3 stack (create-t3-app).

## Commands

```bash
bun install            # Install dependencies
bun run dev            # Start dev server (Turbopack)
bun run build          # Build for production (runs prisma generate first)
bun run check          # Lint + typecheck combined
bun run lint           # ESLint only
bun run typecheck      # TypeScript only (tsc --noEmit)
bun run format:check   # Prettier check
bun run format:write   # Prettier fix

# Database (PostgreSQL via Prisma)
bun run db:push        # Push schema changes directly (dev)
bun run db:generate    # Run Prisma migrations (dev)
bun run db:migrate     # Deploy migrations (production)
bun run db:seed        # Seed weapon data (runs prisma/seed.ts via tsx)
bun run db:studio      # Open Prisma Studio GUI
```

Docker: `docker-compose up` starts both PostgreSQL and the dev server.

## Architecture

**T3 Stack**: Next.js 16 (App Router + RSC) → tRPC 11 → Prisma 6 → PostgreSQL. All public procedures (no auth).

**Prisma**: Schema at `prisma/schema.prisma`. Client output goes to `generated/prisma/` (non-standard — configured via `output` in generator block). Core models: `Weapon`, `Mod`, `WeaponMod` (join table), `Submission`.

**tRPC**: Routers in `src/server/api/routers/` (weapon, mod, submission). Combined in `src/server/api/root.ts`. Context provides `db` (Prisma client). All procedures use `publicProcedure` with a timing middleware that adds artificial delay in dev.

**Server-side tRPC calls**: RSC pages call tRPC via server-side caller (`src/trpc/server.ts`), not HTTP. Client components use `@trpc/react-query` (`src/trpc/react.tsx`).

**Environment**: Validated via `@t3-oss/env-nextjs` in `src/env.js`. Required: `DATABASE_URL`, `UPLOADTHING_TOKEN`. Optional: `NEXT_PUBLIC_SITE_URL`. Skip validation with `SKIP_ENV_VALIDATION=1`.

**File uploads**: UploadThing integration for user submissions (`src/server/uploadthing.ts`, `src/app/api/uploadthing/route.ts`).

**Pages**: Home page (`src/app/page.tsx`) shows weapon grid with filters. Weapon detail at `src/app/weapons/[slug]/page.tsx`. Dynamic OG images generated per-page.

**Styling**: Tailwind CSS 4 with custom dark theme in `src/styles/globals.css`. Images are unoptimized (configured in `next.config.js`) to save on CDN costs.

**SEO**: JSON-LD structured data helpers in `src/lib/structured-data.ts`. Dynamic sitemap, robots.txt, and manifest. Per-weapon OG images.
