repo: racheltomasetti/spencerheaphy
branch: main

## Last sync
date: 2026-09-07T18:36:00Z

### Updated in this project
- Read the live Next.js + Sanity codebase to ground the redesign in real field names.
- Rebuilt the design as one scrolling page (hero → work → bio), matching the repo's existing `#work` / `#bio` anchors.
- Dropped the separate "Featured" section; hero carousel now draws from featured projects only.
- Nav restyled: transparent white-ink over the hero, flipping to solid cream after scroll.

## Screen map
| Project screen | Repo files |
| --- | --- |
| Hero carousel | web/src/components/VideoHero.tsx, studio/schemaTypes/documents/siteSettings.ts |
| Selected Work (grid / index) | web/src/components/ProjectGrid.tsx, ProjectCard.tsx, LazyVideo.tsx |
| Project lightbox | web/src/components/ProjectLightbox.tsx, MediaItemView.tsx |
| Bio + footer | web/src/app/page.tsx, web/src/components/SiteFooter.tsx |
| Nav | web/src/components/Nav.tsx |
| Data model | studio/schemaTypes/documents/project.ts, objects/mediaItem.ts, web/src/sanity/lib/queries.ts |

## Notes / gaps
- `project` has no `featured` boolean — the hero carousel needs one (plus a `heroMedia` override, since a cover still isn't always the right hero clip). `siteSettings` currently holds a single `heroVideoDesktop`/`heroVideoMobile` pair, which only supports one hero asset.
- `status: 'in production' | 'undisclosed'` is already modeled; the design now renders an undisclosed card state for it.
