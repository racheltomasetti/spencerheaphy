Continue building in the existing repo — `studio` and `web` already exist and are connected to Sanity (project hef8mxdo, dataset production). Do not re-scaffold or reconfigure Studio; it stays standalone.

## 1. Update the `project` schema in `studio`

Update (or create, if not already present) the `project` document type with these fields:

- `title` (string)
- `client` (string)
- `category` (string)
- `year` (number)
- `description` (text)
- `coverMedia` (file — video, not image; this is the autoplay grid loop, not a static thumbnail)
- `aspectRatio` (string — options: `portrait`, `landscape`)
- `gallery` (array of image/file objects — mixed orientation supported)
- `vimeoId` (string — full project video ID/URL, for iframe embed)
- `status` (string — options: `published`, `in production`, `undisclosed`)
- `order` (number)
- `hidden` (boolean)

Also add/confirm the `siteSettings` singleton: `name`, `tagline`, `contactEmail`, `socialLinks`, `clientLogos`.

## 2. Build out `web` pages

**Home (`/`)**
- Hero: rotating/sliding carousel of featured looping clips (pull projects flagged as featured, or just the most recent `published` ones for now — use placeholder logic, this will be refined)
- Below the hero: a grid section pulling all `published` and `undisclosed` projects
- This page is expected to be the most experimental/iterative — build it modular enough to swap hero and grid treatments easily

**Selected Work (`/selected-work`)**
- Masonry/variable-height grid — tile height follows each project's `aspectRatio`, not a fixed crop
- Each tile: `coverMedia` as `<video autoPlay muted loop playsInline>`, caption with client name (caps) + title
- Projects with `status: undisclosed` render a placeholder state (no media, "undisclosed" label) instead of broken/empty media
- Clicking into a project shows: title → client → year → description → `gallery` grid with lightbox → embedded Vimeo player (via `vimeoId`) if present

**Bio (`/bio`)**
- Page shell only — content is still coming from Spencer, don't invent bio copy

**Creator (`/creator`)**
- Hidden route, not linked in main nav
- Links out to the Studio URL (placeholder link for now)

Nav: flat, top-level — Home / Selected Work / Bio only. No dropdowns.

## 3. Video handling — important

- `coverMedia` files are raw exports (e.g. DaVinci Resolve output, high bitrate) and are NOT web-optimized as uploaded. Build a compression step (e.g. `ffmpeg` re-encode to a reasonable web bitrate/resolution) into the upload or build pipeline — do not assume the raw file is safe to serve directly.
- Grid videos should lazy-load — only mount/play once scrolled into view, so a full grid isn't decoding multiple videos simultaneously on page load.
- Full Vimeo embeds should strip Vimeo's own chrome via embed params (`title=0&byline=0&portfolio=0`).

## Out of scope for this pass
- Final visual/style guide (palette, type scale, motion rules)
- Bio page content
- Vimeo account setup/confirmation (flag if `vimeoId` field is unused for now)
- Custom domain DNS

Confirm the current `project` schema state in `studio` before making changes, and flag anything that conflicts with what's already been built.