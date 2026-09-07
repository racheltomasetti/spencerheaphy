# Spencer Heaphy Website — Project Context Package

*Compiled reference for building the site. This is the source of truth for scope, structure, and design direction going into the build.*

---

## 1. Project Overview

Spencer Heaphy is a director, photographer, and storyteller based in NYC. This is a full redesign of his existing Squarespace portfolio site, moving to a Next.js + Sanity CMS stack to support faster load times and self-service content updates.

**Skeleton due:** August 28, 2026
**Note:** Much of the featured work is still in production/shooting, so the build needs to support placeholder/"undisclosed" project states from day one.

**Vision (in his words):** Elevated, easy to use, straightforward, clean, light color scheme.

---

## 2. Site Structure

| Page | Notes |
|---|---|
| **Home** | "Spencer Heaphy" — needs a video-forward hero, not a static title card |
| **Selected Work** | Project grid/index |
| **Bio** | About/bio content |
| **Creator** | *Hidden* — not in main nav; doubles as the Sanity Studio entry route |

**Nav should stay flat** — 2–4 items max, no dropdown/flyout submenus (a pattern flagged as clunky on the current site).

### Projects within Selected Work
- Kiehl's
- Levi McConaughey
- Foundrae
- Viceroy
- Personal

---

## 3. Current Site Audit (spencerheaphy.com)

- **Platform:** Squarespace, lightly customized template
- **Current nav:** Home / Projects (flyout: Chloe, St Regis, Equinox Hotels, The Edition, Apollo Bagels, The Joy of Film) / Photos / About
- **Homepage tagline:** *"Spencer is a Director, Photographer, and Storyteller based out of NYC with a global presence"*
- **Bio:** Started in the CAA mailroom, learned the industry, focuses on emotion + brand fit in his storytelling
- **Current clients:** Ritz-Carlton, The Edition, Equinox Hotels, Chloe — skews hospitality/lifestyle
- **Project page pattern (works well, worth keeping):** Title → location → year → one-line description → optional social link → straight image grid with lightbox
- **Footer:** Location + email, Instagram/YouTube/LinkedIn icons

**Key gap to solve:** current site reads as "hospitality/lifestyle content photographer." New project roster (Kiehl's, Foundrae, Viceroy, etc.) is fashion/beauty/culture-coded and video-forward — this is a repositioning to "director," not just a visual refresh. No video/reel currently exists on the homepage.

---

## 4. Design Inspiration — Key Takeaways

Sites reviewed: Parker Schmidt, Duncan Wolfe, Rabit Haus, Ty Rogers, Cole Ferguson, Mason Charles, Beauregard Media.

**Spencer specifically called out Parker Schmidt and Cole Ferguson as favorites.**

- **Parker Schmidt** (parkerinfocus.com) — custom-built, numbered grid index of looping video thumbnails, zero chrome, "UNDISCLOSED" placeholder pattern for unreleased work, footer doubles as press/representation credits.
- **Cole Ferguson** (colelferguson.com) — Next.js + Sanity CMS. Most "designed" of the set: entry preloader, large single hero image with numbered caption, minimal collapsed nav. Editorial/gallery feel.

**Patterns shared across all inspiration sites:**
- Nav limited to 2–4 items, always
- Thumbnail = looping video/GIF, not static image, as the default grid unit
- Caption convention: brand name (caps) + campaign title
- Light, editorial typography — serif or clean sans italics, generous negative space, minimal color blocking
- "Undisclosed"/"soon" placeholder states are an established convention for in-progress work

---

## 5. Tech Stack — Decided

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js** | Adaptive image serving, native video handling (autoplay/loop `<video>` instead of heavy GIFs), lazy loading, static generation for fast first paint |
| CMS | **Sanity** | Headless CMS — Spencer edits/adds projects himself via Sanity Studio, no code, no calling a developer for routine updates |
| Hosting | **Vercel** | Native Next.js host, CDN-backed, generous free tier |
| Domain | Vercel's default `*.vercel.app` URL for now → DNS cutover to spencerheaphy.com once ready | |

**Sanity account:** Being created under Ray's name/login. Free tier is more than sufficient for this project's scale (10K document cap, 100GB assets/bandwidth — a personal portfolio site won't approach these limits). Other collaborators (Spencer, etc.) can be added as project members with any role at any time — account creator identity doesn't lock in long-term ownership. Worth a future conversation with Spencer about who holds Administrator access long-term.

**Schema philosophy:** Sanity schema is code, deployed like any other change. Adding fields or content types is low-cost and can happen anytime. Changing an existing field's *type* after real content exists has minor cleanup cost (old documents won't auto-conform). → **Approach: ship bare-bones now, extend iteratively.**

---

## 6. Media Architecture — Grid Thumbnails vs. Full Video

Confirmed via direct inspection of a real sample clip (`EDIT_V2.mov`): Spencer's raw footage is exported from DaVinci Resolve at high bitrate (e.g. 1080×1920 vertical, 5.7 sec, ~8MB — roughly 11 Mbps). This is far too heavy to autoplay on a page as-is, and confirms real project work includes **vertical (9:16) social-style edits, not just horizontal/widescreen film** — the grid can't assume one fixed aspect ratio.

**Two different jobs, two different tools — don't solve both with one field:**

1. **Grid thumbnails ("GIF-like" autoplaying loops)** — store as a *compressed* short video file (not an actual animated GIF), rendered via native `<video autoPlay muted loop playsInline>`. Visually identical to a GIF, a fraction of the file size. Raw exports need a compression pass (e.g. `ffmpeg` re-encode at web bitrate/resolution) before going live — ideally automated as part of the upload/build pipeline, not a manual step Spencer has to think about.
2. **Full project videos** — store only the **Vimeo video ID/URL** on the project document; embed via Vimeo's `<iframe>` player (Next.js's own recommended approach for third-party video hosting). Strip Vimeo's chrome via embed params (`title=0&byline=0&portfolio=0`) so it feels native to the site. Requires confirming Spencer has a Vimeo Plus/Pro account (free tier limits embed customization + has upload caps).

**Confirmed via Astra Studios (astrastudios.co, another reference Spencer provided):** built on the identical stack — Next.js + Sanity (`cdn.sanity.io` asset URLs throughout) + Vimeo linked out for reel — done by a professional dev studio ("Site by Studio Hyperlink") for the same category of site. Third confirmation (alongside Cole Ferguson and the stack we independently chose) that this is the standard professional pattern here, not over-engineering.

### Vertical vs. horizontal handling
Grid must support mixed orientation without forcing a crop that fights the source material:
- **Recommended: masonry/variable-height grid** (tile height follows asset aspect ratio) — shows vertical and horizontal work honestly, reads editorial rather than templated. Matches the loose, mixed-dimension grid Astra Studios itself uses.
- Rejected default: fixed-ratio crop container — cleaner alignment, but crops vertical content awkwardly.

---

## 7. Homepage Structure — Spencer's Direction

Spencer's own outline for Home ("Spencer Heaphy"):
- Sliding carousel — likely a **rotating hero of featured looping clips**, similar role to Astra's single large hero image but with looping video
- Grid — a **browsable section below the hero**, distinct zone/job from the carousel (hero sells the vibe, grid lets people browse everything)
- "Play around with design" / GIFs — explicit openness to experimentation here; this is the most iterative page

**Selected Work fields, per Spencer directly:** name, date, client, description — confirms the `project` schema fields already drafted (`title`, `year`, `client`, `description`) are correctly scoped.

**Bio:** content still to come from Spencer — page shell only for now.

---

## 8. Sanity Schema — Working Draft (updated)

### `Project` (core content type)
| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `client` | string | Kiehl's, Levi McConaughey, Foundrae, Viceroy, Personal |
| `category` | string/reference | Allows Selected Work and Creator to pull from a shared pool if needed |
| `year` | number | |
| `description` | text | |
| `coverMedia` | video file (compressed) | Grid thumbnail — autoplay loop, not a static image or literal GIF |
| `aspectRatio` | string (portrait/landscape) or auto-detected | Drives masonry grid layout logic |
| `gallery` | array (image/video, mixed orientation) | |
| `vimeoId` | string | Full project video, embedded via iframe |
| `status` | string | `published` / `in production` / `undisclosed` — supports skeleton-first workflow |
| `order` | number | Manual grid ordering |
| `hidden` | boolean | Optional per-project control over Creator-only visibility |

### `SiteSettings` (singleton)
Name, tagline, contact email, social links, client-logo list — keeps header/footer editable without a redeploy.

---

## 9. Open Questions / Not Yet Decided

- Final palette, type scale, and motion/hover rules (style guide still to be drafted)
- Whether "Creator" is a nav-hidden route or something more gated
- Long-term Sanity account ownership/admin access between Ray and Spencer
- Whether `category` should be a plain string or a proper reference type (affects Selected Work vs. Creator content pooling)
- Whether Spencer has a Vimeo Plus/Pro account, or needs to get one
- Bio page content — still to come from Spencer
- Exact carousel mechanic on Home (autoplay interval, manual swipe, number of featured slots)