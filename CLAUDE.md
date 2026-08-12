# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # development server at localhost:3000
npm run build    # production build (runs TypeScript check internally)
npm run lint     # ESLint check
npx tsc --noEmit # explicit type check (no separate typecheck script)
```

There are no tests. Lint and `tsc --noEmit` are the primary correctness checks before committing.

## Next.js version notice

This project runs **Next.js 16.3.0** — a version with breaking changes relative to widely-known releases. Before writing any Next.js-specific code (routing, metadata, server actions, image optimisation, font loading), read the relevant guide in `node_modules/next/dist/docs/`. Do not rely on training-data assumptions about the App Router API.

## Architecture

### Stack

- **Next.js 16.3.0** App Router, all pages are Server Components by default
- **React 19**, TypeScript strict mode
- **Tailwind v4** — configured via `@import "tailwindcss"` in `globals.css` and `@theme inline` block; there is **no `tailwind.config.ts`**
- No database. No CMS. No external API dependencies.

### Data layer

All content lives in TypeScript files under `src/data/`:

| File | What it contains |
|---|---|
| `business.ts` | Global brand info, contact, social, GA4 ID — all placeholders marked |
| `projects.ts` | Portfolio projects with typed `Project` interface |
| `services.ts` | Service pages with typed `Service` interface including FAQ, process steps |
| `journal.ts` | Blog articles with typed `JournalArticle` interface |
| `navigation.ts` | Main nav and footer links |

Changing content means editing these files — no build step beyond `npm run build` needed.

### Styling approach

Styling is a deliberate mix of two systems:

1. **Tailwind utility classes** for responsive visibility (`hidden md:flex`, `md:hidden`) and a small number of layout helpers.
2. **Inline `style` props** for almost all component-level styling (colors, spacing, typography, layout values).

Responsive grid layouts that can't be expressed with Tailwind utilities use **inline `<style>` blocks** with named CSS classes, e.g.:

```tsx
<div className="service-hero-grid" style={{ display: "grid" }}>
  ...
</div>
<style>{`
  @media (min-width: 900px) {
    .service-hero-grid { grid-template-columns: 1fr 1fr !important; }
  }
`}</style>
```

Design tokens are CSS custom properties defined in `globals.css` under `:root` and `@theme inline`. Use `var(--token-name)` in inline styles.

### Client Components

Only four components use `"use client"`:
- `Header` — scroll state, mobile menu toggle
- `VideoFacade` — deferred iframe load on click
- `ContactForm` — form state and submission
- `Analytics` — GA4 script injection (no-ops outside production)

Everything else is a Server Component.

### Shared page components

- `ServicePage` (`src/components/ui/ServicePage.tsx`) — renders all four service pages; the individual `/uslugi/[slug]/page.tsx` files just call `generateStaticParams` and pass data into it.
- `ProjectCard` — detects placeholder poster images by checking for hardcoded `/images/placeholder-*.jpg` filenames and renders an editorial gradient instead.
- `VideoFacade` — facade pattern: shows a poster/placeholder, loads the actual Vimeo or YouTube iframe only after user clicks.

### SEO / structured data

`src/components/seo/JsonLd.tsx` exports typed helpers for: `OrganizationJsonLd`, `WebSiteJsonLd`, `BreadcrumbJsonLd`, `ArticleJsonLd`, `VideoObjectJsonLd`, `ServiceJsonLd`, `FaqJsonLd`. Each renders a `<script type="application/ld+json">` tag. They guard against outputting schema when required data (e.g. video ID) is missing.

Sitemap and robots are at `src/app/sitemap.ts` and `src/app/robots.ts`.

### Journal content rendering

`src/app/journal/[slug]/page.tsx` contains a custom lightweight Markdown parser (`renderContent`) that handles `##`, `###`, `- ` lists, and plain paragraphs. It does **not** use MDX or `next-mdx-remote` despite that dependency being present. Journal article content is stored as plain template-literal strings in `src/data/journal.ts`.

### Placeholders requiring real data

The following are clearly marked `PLACEHOLDER` in source and must be replaced before launch:

- `business.ts`: `email`, `phone`, `social.*`, `ga4Id`, `gscVerification`
- `projects.ts`: every `vimeoId` / `youtubeId` and `posterImage` path
- `ContactForm.tsx`: form submission logic (currently simulates success after 800ms delay)
- `o-nas/page.tsx`: studio bio card content

### Header layout

The header uses `display: grid; grid-template-columns: 1fr auto 1fr` to centre the desktop navigation at exactly 50 vw regardless of logo or icon width. Logo is auto-placed in column 1, nav has explicit `gridColumn: 2`, mobile button has `gridColumn: 3` with `justifySelf: end`.
