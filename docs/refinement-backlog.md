# Refinement Backlog

Notes captured after the large refinement pass that touched theme, navigation, grid behavior, collection cards, lightbox controls, footer, and layout helpers.

## Regressions To Revisit First

- Collection cards using per-photo aspect ratios looked good in single-column mobile, but bad in wider multi-column grids. Current fix: natural cover ratios on narrow viewports, consistent 4:3 on wider viewports.
- Theme toggle no longer switched visible sun/moon icons and appeared stuck on moon. Current fix: global `data-theme` selector for scoped Astro CSS.
- Header/nav had an unwanted double border between the header and page content. Current fix: remove added header `border-bottom`; page content keeps its existing top divider.

## Deferred Items

- C7: Add build-time photo ID validation so every `coverPhotoId` and every `photoIds[]` entry in `collections.ts` must exist in `photos.ts`.
- A2: Decide whether figcaption metadata should be visually de-emphasized, or whether photo IDs should become copy-link permalinks. Lean: visually de-emphasize only.
- R5: Review landscape photo detail pages to see whether the fixed 240-320px aside feels cramped; only add a landscape-specific layout if the issue is visible.
- C8: Consider changing the font stack from Avenir to `system-ui` for cross-platform consistency. Likely skip unless there is a clear reason.
- B8: Re-pack `PhotoGrid` when changing responsive column bands/browser zoom. Likely skip unless edge cases show up.
- C3: Masonry lookahead packing for more even columns. Likely skip until larger collections make uneven columns noticeable.
- A1: Add `aria-describedby` to photo tiles. Likely skip because image alt text already serves as the link name.

## Minor Code Polish Ideas

- Remove old `MediaQueryList.addListener` fallback in `SiteHeader.astro` if present.
- Deduplicate resize-to-desktop mobile-menu close logic by routing through the shared close helper.
- Consider whether the theme toggle `aria-pressed` initial value can be made correct before the first client update.
- Move `.visually-hidden` to `global.css` if reused outside the footer.
- Consider whether `theme-color` should avoid a first-frame light value for dark-theme users.
- Soften large overlay nav focus rings if the current keyboard focus style feels too harsh.

## Verified By Claude During The Pass

- `npm run build` passed after TypeScript fixes.
- Mobile nav overlay opened/closed with Menu, Close, Esc, and desktop resize.
- Focus trap and body scroll lock were tested.
- Skip link appeared first in tab order and targets `#main`.
- `window.__theme` existed and theme toggle `aria-pressed` updated live.
- Footer separators were `aria-hidden`; footer year used `<time datetime="2026">`.
- Lightbox prev/next controls rendered and arrow-key navigation worked.
- Archive used three columns around 800px.
- Collection-slug hero used a single-column variant.
- Contrast tokens reportedly passed AA.
