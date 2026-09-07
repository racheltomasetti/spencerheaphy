# Handoff: Spencer Heaphy — one-page site (hero carousel + selected work + bio)

## Overview
Redesign of spencerheaphy.com as a **single scrolling page** for a director/creator portfolio:
a full-viewport hero carousel of featured projects, a Selected Work section with a Grid/Index
toggle, and a Bio section with contact links. Project detail opens as a dark full-screen
lightbox rather than a separate route.

The site's job: extend Spencer's Instagram into somewhere clean and professional that gets
him bookings. Delivery target Sept 30.

## About the Design Files
`Spencer Heaphy v2.dc.html` in this bundle is a **design reference created in HTML** — a
prototype showing intended look and behavior. It is **not production code to copy**.

The task is to recreate it in the existing codebase: **Next.js (App Router) + Tailwind v4 +
Sanity**, in `racheltomasetti/spencerheaphy` (`web/` and `studio/`). Use the components and
patterns already there (`VideoHero`, `ProjectGrid`, `ProjectCard`, `ProjectLightbox`,
`LazyVideo`, `MediaItemView`, `Nav`, `SiteFooter`). The prototype's inline styles are an
artifact of the prototyping environment — translate them to Tailwind classes.

`Spencer Heaphy.dc.html` is the earlier multi-page version, included for reference only.
**Build v2.**

## Fidelity
**High-fidelity for layout, type, color, and interaction** — exact values below and in the
prototype source. Two deliberate exceptions:

- **All media is placeholder.** Every image/video is a diagonal-hatch box labelled with the
  Sanity field it maps to (`coverMedia`, `gallery[0]`, "Reel 01"). Real assets pending.
- **All copy is placeholder** except nav/section labels. Project titles, clients, and
  descriptions are invented. Bio copy is pending from Spencer.

---

## THE MAIN PUSH: featured-projects hero

This is the one thing the current schema cannot express, and it blocks the hero.

### Current state
- `siteSettings` has a single `heroVideoDesktop` / `heroVideoMobile` pair — **one** hero asset.
- `VideoHero.tsx` renders that one file, full-bleed, autoplay/muted/loop, with a
  `PlaceholderHero` gradient fallback.
- `project` has no way to mark a project as belonging in the hero.

### Target state
The hero is a **carousel of featured projects**. Each slide is a project's own hero clip,
captioned with that project's real metadata, and clicking through opens that project.
So the hero *is* the featured work — which is why the design drops the separate
"Featured" grid section that existed in v1.

### Schema changes required (`studio/schemaTypes/documents/project.ts`)

```ts
defineField({
  name: 'featured',
  title: 'Featured on home',
  description: 'Show this project in the hero carousel.',
  type: 'boolean',
  initialValue: false,
}),
defineField({
  name: 'featuredOrder',
  title: 'Featured order',
  description: 'Lower numbers appear first in the hero carousel.',
  type: 'number',
  hidden: ({document}) => !document?.featured,
}),
defineField({
  name: 'heroMedia',
  title: 'Hero media',
  description: 'Optional override for the hero carousel. Falls back to cover media. A cover still is often not the right hero clip — use a landscape loop here.',
  type: 'mediaItem',
  hidden: ({document}) => !document?.featured,
}),
```

Then in `siteSettings.ts`: **remove** `heroVideoDesktop` and `heroVideoMobile`. The hero no
longer comes from settings. (Migration: whatever clip is in there today should become the
`heroMedia` of the first featured project.)

### Query changes (`web/src/sanity/lib/queries.ts`)
Add `featured`, `featuredOrder`, and `heroMedia ${MEDIA_ITEM_PROJECTION}` to
`PROJECTS_QUERY`; drop the `heroVideo*` projections from `SITE_SETTINGS_QUERY`. Either add a
dedicated query or derive in the page:

```groq
*[_type == "project" && hidden != true && featured == true]
  | order(featuredOrder asc, order asc) { ... }
```

### Types (`web/src/sanity/lib/types.ts`)
Add to `Project`: `featured?: boolean`, `featuredOrder?: number`, `heroMedia?: MediaItem`.
Remove `heroVideoDesktop` / `heroVideoMobile` from `SiteSettings`.

### `VideoHero.tsx` rewrite
Takes `projects: Project[]` (the featured set) instead of two URLs.
- All slides absolutely positioned, stacked, crossfading on `opacity` — **1100ms
  cubic-bezier(.4,0,.2,1)**. Only opacity animates; no transform, no slide.
- Auto-advance every **6500ms**. Pause while the lightbox or menu is open.
- Slide media resolves `heroMedia ?? coverMedia`; video renders autoplay/muted/loop/playsInline
  `object-cover`; keep `PlaceholderHero` for the empty state.
- Preload the next slide's asset; don't mount all N videos at once.
- Wrap-around prev/next, so `(i + n - 1) % n` and `(i + 1) % n`.
- Keep the existing mobile-vs-desktop source logic per-project if he supplies both orientations;
  otherwise `object-cover` handles it.

---

## Screens / Views

### 1. Nav (fixed, always present)
**Purpose:** wordmark + the only navigation. **This is the piece Spencer disliked most about
the current site** ("I don't like the opaque light color") — it must not be a solid cream bar
over the hero.

- `position: fixed; top/left/right: 0; z-index: 80`. Row: `padding: 20px 32px`, wordmark left,
  hamburger right, `align-items: center; justify-content: space-between`.
- Wordmark: IBM Plex Mono 500, 13px, `letter-spacing: 0.22em`, uppercase, links to `#top`.
- **Two states, cross-fading over 500ms** (`background`, `border-color`, and `color` all transition):
  - **Over the hero:** `background: rgba(20,19,16,0)`, `border-bottom: 1px solid rgba(250,249,246,0)`,
    `backdrop-filter: none`, ink `#faf9f6`. Fully transparent — the film reads through it.
  - **Scrolled past hero:** `background: rgba(250,249,246,.92)`,
    `border-bottom: 1px solid rgba(20,19,16,.12)`, `backdrop-filter: saturate(140%) blur(10px)`,
    ink `#141310`.
- **Critical implementation note:** drive this from an **IntersectionObserver on the hero
  element**, not `window.scrollY`. Options: `{rootMargin: '-70px 0px 0px 0px', threshold: 0}`;
  set `scrolled = !entry.isIntersecting`. Attach via a **callback ref on the hero node**, not
  `getElementById` in an effect — this cost three debugging rounds in the prototype because the
  lookup ran before the node existed.
- **Menu open** forces the transparent/cream-ink state even when scrolled — otherwise you paint
  a cream bar with cream text on top of the dark overlay. Condition is
  `dark = !scrolled || menuOpen`.
- Hamburger: three 26×1px `currentColor` bars, 5px gap, 44px hit area
  (`padding: 6px 0 6px 20px`). Animates to an X: top bar `translateY(6px) rotate(45deg)`,
  middle `opacity: 0`, bottom `translateY(-6px) rotate(-45deg)`, 300ms/200ms ease.
- A desktop text-link row (`Selected Work` / `Bio`) exists in the markup at `display: none`.
  **Decision needed** — see Open Questions.

### 2. Hamburger menu overlay
- `position: fixed; inset: 0; z-index: 70`, `background: #141310`, ink `#faf9f6`.
- Vertically centered stack, `gap: 6px`, `padding: 0 32px`. Fades in 320ms ease.
- Links: `clamp(38px, 7vw, 86px)`, `line-height: 1.12`, `letter-spacing: -0.03em`.
  Hover `#c8a27a`. Items: Selected Work (`#work`), Bio (`#bio`), Contact (mailto).
- Below, `margin-top: 44px`: Instagram / Vimeo, Plex Mono 11px, `letter-spacing: 0.16em`,
  uppercase, `#8a877d`, `gap: 26px`.
- Anchor clicks close the menu; `html { scroll-behavior: smooth }` (already in `globals.css`)
  handles the scroll.

### 3. Hero (`#top`)
- `height: 100vh` (use `h-dvh` as the repo already does), `min-height: 540px`, `overflow: hidden`,
  `background: #141310`.
- Scrim, `pointer-events: none`, over the media:
  `linear-gradient(to bottom, rgba(20,19,16,.5) 0, rgba(20,19,16,0) 26%, rgba(20,19,16,0) 55%, rgba(20,19,16,.62) 100%)`
  — darkens top for the nav and bottom for the caption, leaves the middle of the frame clean.
- Caption bar, bottom, `padding: 32px`, `align-items: flex-end; justify-content: space-between`:
  - Left: counter (`01 / 04`, Plex Mono 10px, `0.2em`, `rgba(250,249,246,.55)`) → project title
    (`clamp(28px, 3.6vw, 50px)`, `line-height: 1`, `letter-spacing: -0.025em`) → meta
    (`client · category · year`, Plex Mono 11px, `0.14em`, uppercase, `rgba(250,249,246,.62)`).
    `gap: 10px`.
  - Right: "View project" (Plex Mono 11px, `0.16em`, uppercase,
    `border-bottom: 1px solid rgba(250,249,246,.5)`, opaque on hover) then two 44×44px arrow
    buttons, `border: 1px solid rgba(250,249,246,.34)`, hover `background: rgba(250,249,246,.14)`,
    `gap: 10px`.

### 4. Selected Work (`#work`, `scroll-margin-top: 70px`)
Header row: `padding: 78px 32px 16px`, `border-bottom: 1px solid rgba(20,19,16,.14)`, wrapping.
- `h2` "Selected Work": `clamp(26px, 3.4vw, 46px)`, `line-height: 1`, `letter-spacing: -0.025em`, weight 400.
- Right: "12 projects" (`rgba(20,19,16,.58)`) + **Grid / Index** toggle. Active gets `#141310` ink
  and a `1px` bottom rule; inactive `rgba(20,19,16,.6)` and a transparent rule (so nothing shifts).

**Grid view** — `grid-template-columns: repeat(12, 1fr)`, `gap: 18px`, `padding: 24px 32px 60px`.
Cards span **8 / 4 / 4 / 8 / 4 / 8 / 4 / 4 / 8 / 4 / 4 / 4** columns with aspect ratios
**16/9, 4/5, 4/3, 16/9, 1/1, 16/9, 4/5, 4/3, 16/9, 4/5, 1/1, 4/3** — a deliberate irregular
rhythm so it reads editorial, not like a product catalog. Ratio and span should come from the
project's own shape; store them or derive from the asset's dimensions
(`coverMedia.image.asset.metadata.dimensions` is already in the query).
Caption under each card, `gap: 10px` from media, `gap: 3px` internally:
client (Plex Mono 500, 11px, `0.16em`, uppercase, `rgba(20,19,16,.8)`), then a row of
title (15px, `rgba(20,19,16,.6)`) and year (Plex Mono 11px, `rgba(20,19,16,.62)`, right-aligned).

**Index view** — a table. Columns `52px 1.6fr 1.1fr 1fr 64px`, `gap: 16px`:
No. / Project / Client / Category / Year (year right-aligned). Header row Plex Mono 10px,
`0.18em`, uppercase, `rgba(20,19,16,.58)`, `border-bottom: 1px solid rgba(20,19,16,.14)`.
Rows `padding: 16px 0`, `border-bottom: 1px solid rgba(20,19,16,.08)`, hover
`background: rgba(20,19,16,.04)`. Project title 19px `-0.015em`; other cells Plex Mono 11px,
`0.12em`, uppercase, `rgba(20,19,16,.72)`.
**Row hover shows a preview thumbnail** `position: fixed; right: 32px; bottom: 32px`,
`width: 290px`, `aspect-ratio: 4/3`, `pointer-events: none`, `z-index: 40` — the index stays
scannable without losing the imagery.

**Undisclosed / in-production cards:** `status` is already modeled. Those render the hatch box
labelled "Undisclosed" instead of media, and are not clickable
(`ProjectCard.tsx` already implements exactly this — keep it).

### 5. Bio (`#bio`, `scroll-margin-top: 70px`)
`border-top: 1px solid rgba(20,19,16,.14)`, 12-col grid, `gap: 28px`, `padding: 78px 32px 90px`.
- Portrait `grid-column: span 4`, `aspect-ratio: 4/5`.
- Text `grid-column: 6 / span 6`, `gap: 34px`: lead `h2` `clamp(22px, 2.7vw, 34px)`,
  `line-height: 1.24`, `letter-spacing: -0.022em`, weight 400 → body 16px, `line-height: 1.65`,
  `rgba(20,19,16,.7)`, `max-width: 56ch` → a two-column block (Plex Mono 11px, `line-height: 2`,
  `0.13em`, uppercase) of **Selected clients** and **Connect** (email, Instagram, Vimeo, location).
  Labels `rgba(20,19,16,.6)`, values `rgba(20,19,16,.7)`.
- Note the deliberate empty column 5 — the gutter between portrait and text is the layout.

### 6. Footer
`padding: 20px 32px`, `border-top: 1px solid rgba(20,19,16,.14)`, Plex Mono 10px, `0.16em`,
uppercase, `rgba(20,19,16,.6)`. "Spencer Heaphy © 2026" left, "Available for commissions"
(mailto) right.

### 7. Project lightbox
Maps onto the existing `ProjectLightbox.tsx` + `?project=<slug>` URL pattern — **keep that**,
so project views are linkable and shareable.
- `position: fixed; inset: 0; z-index: 90`, `background: rgba(20,19,16,.97)`, ink `#faf9f6`,
  `overflow-y: auto`, fade in 260ms ease.
- Sticky top bar, `padding: 20px 32px`: "01 / 12" counter left
  (`rgba(250,249,246,.66)`), "Close ✕" right. Both Plex Mono 11px, `0.16em`, uppercase.
- Hero: `aspect-ratio: 16/9`, full film (Vimeo/Mux embed — **not** a Sanity file).
- Below, 12-col `gap: 28px`: description `grid-column: span 5` (title
  `clamp(26px, 3.4vw, 44px)` `-0.028em`; body 16px/1.6 `rgba(250,249,246,.72)`);
  credits `grid-column: 7 / span 6` as a 2-col grid of label/value pairs
  (Client, Year, Category, Status), Plex Mono 11px, `0.13em`, uppercase, labels
  `rgba(250,249,246,.68)`.
- Gallery: 12-col `gap: 14px`, spans **8 / 4 / 4 / 4 / 4**, ratios **16/10, 4/5, 1/1, 1/1, 1/1**.
  Drives off `gallery[]`; mixes stills and loops.
- Footer button: `border-top: 1px solid rgba(250,249,246,.16)`, `padding: 30px 0 44px`,
  "Next project" label left, next title `clamp(20px, 2.6vw, 34px)` right, wrapping `% n`.

---

## Interactions & Behavior
- **Nav state:** IntersectionObserver on hero (above). 500ms cross-fade.
- **Hamburger:** toggles overlay; bars animate to X; anchors close it.
- **Hero carousel:** auto-advance 6500ms, paused when lightbox or menu is open; wrap-around
  prev/next; 1100ms opacity crossfade. Add keyboard arrows and swipe (the prototype has neither).
- **Grid ⇄ Index:** instant, no transition. Persist the choice (`localStorage`) — a returning
  producer who prefers the index shouldn't have to re-pick.
- **Index hover:** fixed bottom-right preview follows the hovered row.
- **Card / row click:** opens lightbox at that project, sets `?project=<slug>`.
- **Lightbox:** Close returns to the grid; "Next project" advances with wrap. Should also close
  on Escape and lock body scroll — **neither is in the prototype**, both needed.
- **Moving thumbnails:** `LazyVideo.tsx` already does the right thing (IntersectionObserver,
  `preload="none"`, 200px `rootMargin`, only sets `src` in view). Keep it and use it everywhere.

## State Management
Local UI state only — everything else is server-fetched Sanity content.
- `slide: number` — hero index.
- `scrolled: boolean` — from IntersectionObserver; drives nav.
- `menu: boolean` — hamburger overlay.
- `layout: 'grid' | 'index'` — work section; persist.
- `hover: string | null` — index preview.
- Active project — **from the `?project=` search param, not local state** (already the repo's
  pattern; keeps deep links working).

## Design Tokens
Matches `globals.css` (`--background: #faf9f6`, `--foreground: #141310`) — no new base colors.

| Token | Value |
| --- | --- |
| Cream (bg) | `#faf9f6` |
| Ink (fg) | `#141310` |
| Hover accent | `#9c4a24` |
| Menu hover accent | `#c8a27a` |
| Muted ink (mono) | `#8a877d` |
| Hatch placeholder (light) | `repeating-linear-gradient(135deg, #eceae4 0 9px, #f4f2ec 9px 18px)` |
| Hatch placeholder (dark) | `repeating-linear-gradient(135deg, #22201b 0 9px, #2b2822 9px 18px)` |

**Ink opacities on cream:** `.8` client · `.72` index cells · `.7` body · `.62` year ·
`.6` title / labels / footer · `.58` headers · `.14` section rules · `.12` nav border · `.08` row rules · `.04` row hover.
**Cream opacities on dark:** `.72` body · `.68` labels · `.66` counters · `.62` hero meta ·
`.55` hero counter · `.34` arrow borders · `.16` rules · `.14` arrow hover fill.

Every value carrying real content clears **4.5:1** — this was the finding of three
verification rounds, so please don't re-mute them. Sub-4.5:1 alphas are decorative only
(borders, hover fills).

**Type:** body/display `Helvetica Neue, Helvetica, Arial, sans-serif`; all meta, labels, and
nav `IBM Plex Mono` 400/500. Note this differs from the repo, which currently loads a
`--font-serif-display` and uses `font-serif` for headings — **the design is all-sans**; the
serif should be dropped or the decision revisited (see Open Questions).
Display sizes always `clamp()`; `letter-spacing` tightens as size grows (`-0.015em` → `-0.03em`);
mono always tracked out (`0.12em`–`0.22em`) and uppercase.

**Spacing:** 32px page gutter · 78px section top · 60–90px section bottom · 18px grid gap ·
14px gallery gap · 28px bio/lightbox gap · 12-col grid throughout · `scroll-margin-top: 70px`.

## Assets
**None final.** Every media box is a labelled hatch placeholder naming its Sanity field.
Needed from Spencer: hero clips for each featured project (landscape, H.264 `.mp4`, tightly
compressed), cover media per project, gallery stills/loops, and a 4:5 portrait.
`web/public/hero-placeholder.jpg` exists in the repo but is unused by this design.

**Video hosting — decide before content load.** Short silent loops (thumbnails, hero) can live
in Sanity. Full films **should not** — put them on Vimeo or Mux and embed. `mediaItem.ts`
already warns about this. Also: **no real GIFs** — silent looping MP4/WebM is ~10× lighter and
visually identical, which is what `LazyVideo` assumes.

## Files
- `Spencer Heaphy v2.dc.html` — **the design to build.**
- `Spencer Heaphy.dc.html` — earlier multi-page version, reference only.
- `github.md` — repo association, screen map, and schema gaps.
- `uploads/pasted-1788805998014-0.png` — current live site (the opaque nav being replaced).
- `uploads/IMG_1746.jpeg` — Spencer's hand sketches, dated 8/4/2026: Home (single framed asset,
  ← → arrows), Home v2 (peek carousel with adjacent slides visible), Work and Work v2 (mixed
  grids). The wordmark-left / hamburger-right nav comes from these.

## Open Questions
1. **Desktop nav links.** The text-link row is `display: none` — hamburger-only everywhere
   (matches Spencer's sketches, more gallery-like) or links on desktop and hamburger on mobile
   (fewer taps to the work)? Sketches say hamburger-only; usability says the latter.
2. **Serif or not.** The repo loads a serif display face and the current live site sets the
   wordmark in serif; this design is all-sans with mono meta. Worth confirming with Spencer.
3. **Mobile.** The prototype is desktop-first and **has not had a mobile pass** — the 12-col grid
   needs to collapse (2-up, or 1-up for 8-span cards), the hero caption restacks, the index table
   drops to title + year, and the lightbox goes single-column. Both this design and Spencer's
   Instagram audience make mobile the primary surface, so this is the biggest remaining chunk.
4. **Hero on mobile.** Per-project vertical hero media, or `object-cover` the landscape clip?
   The old `heroVideoMobile` field suggests he has vertical cuts.
5. **Contact.** Currently mailto only. A form needs a third-party service; rep/agency details
   may need a field in `siteSettings`.
6. **Peek carousel.** Spencer's "Home v2" sketch shows adjacent slides partially visible at the
   edges rather than a clean crossfade. Worth prototyping as an alternative.
