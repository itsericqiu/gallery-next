# Maintainer Notes

This file is for humans and coding agents working on this repository. Read it before making changes.

## Product Direction

This is a personal photography archive, not a software portfolio. Preserve the quiet editorial feel: restrained typography, generous spacing, direct copy, and image-first pages.

The site should feel related to Eric's broader web presence but not like a clone of `ericqiu.dev`.

## Do Not Assume The Old Gallery Structure

The old gallery used static files under `photos/` or `public/photos`. This Astro project does not.

Current source photo path:

```text
src/assets/photos/<Place>/eric-qiu-gallery-NN.jpg
```

Do not add new photos to `public/photos`.

## Core Files

- `src/data/photos.ts`: canonical list of photos, dimensions, tags, titles, captions, and alt text.
- `src/data/collections.ts`: homepage selection, archive, places, and series order.
- `src/components/PhotoGrid.astro`: responsive masonry grid behavior.
- `src/lib/media.ts`: image sizes and Astro image optimization.
- `src/lib/photo-assets.ts`: asset lookup for files in `src/assets/photos`.
- `scripts/add-photo.mjs`: preferred intake script for new photos.
- `scripts/generate-icons.mjs`: generates favicon, Apple, and manifest icons from SVG sources.

## Before Editing

- Check `git status` and preserve unrelated user or agent changes.
- Prefer small, direct changes over broad rewrites.
- If changing photo data, check both `photos.ts` and `collections.ts`.
- If changing layout behavior, test homepage and archive at mobile and desktop widths.

## Adding Or Editing Photos

Preferred command:

```bash
npm run add-photo -- <Place> <file.jpg> [file2.jpg ...]
```

After using the script, manually review:

- title, caption, and alt text quality in `src/data/photos.ts`
- series ordering in `src/data/collections.ts`
- whether the photo belongs in `selected.photoIds`
- `coverPhotoId` values for affected collections
- `npm run build`

The script can add data, but it cannot make final editorial decisions.

## PhotoGrid Contract

`PhotoGrid.astro` intentionally uses JavaScript for masonry packing.

Why:

- CSS columns produce inconsistent browser-specific balancing.
- CSS Grid is reliable but leaves mixed-height row gaps.
- The JS packer gives consistent column distribution across Safari, Chrome, Firefox, desktop, and mobile.

Requirements to preserve:

- Render normal photo links in HTML before JS runs.
- Keep CSS Grid as the no-JS fallback.
- Preserve original collection order when repacking.
- Avoid waiting for image load; use known aspect ratios.
- Keep responsive counts aligned with CSS: 2 columns at `<=860px`, 3 editorial desktop columns, 4 archive desktop columns.
- If JS fails, the grid must remain visible and usable.

## Styling Guidance

- Preserve the existing visual language unless explicitly asked to redesign.
- Avoid adding external font dependencies.
- Keep CSS changes minimal and scoped.
- Test responsive behavior rather than only desktop.

## Icon Contract

Icons are source-SVG-first. Keep source candidates in `public/icons/source/` and generate production raster assets with:

```bash
npm run icons
```

The default production source is `archive-frame.svg` while candidates are still being evaluated. Use `npm run icons -- <source-name>` to switch candidates, then review `/icons/preview.html` locally.

Do not hand-edit generated PNG/ICO files. Keep the icon tone quiet, editorial, personal, and archive-like. Avoid generic camera/aperture marks, studio-logo polish, luxury gold branding, or `Eric Qiu Photography` lockups.

The generator intentionally scales targets differently: favicons are slightly enlarged, app icons use normal proportions, and maskable icons are inset. Preserve this unless changing the icon optical system deliberately.

## Build And Verification

Use:

```bash
npm run build
```

This runs `astro check` and `astro build`. A successful build should generate static pages and optimized images into `dist/`.

For local review:

```bash
npm run dev
```

## Deployment

Pushes to `main` deploy through `.github/workflows/astro.yml` to GitHub Pages. The production domain is configured by `public/CNAME` and `astro.config.mjs`.

Do not change deployment settings unless the target domain or Pages setup is intentionally changing.

## Common Mistakes

- Adding photos to `public/photos` instead of `src/assets/photos`.
- Forgetting to update `collections.ts` after changing tags or selected photos.
- Treating `seriesPhotoIds` as generated data; it is manually curated ordering.
- Removing the PhotoGrid fallback styles while changing the JS packer.
- Changing `site` or `CNAME` while testing locally.
- Committing `.claude/` or other local assistant settings unless explicitly requested.
