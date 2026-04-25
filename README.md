# Gallery Next

Static photography archive for Eric Qiu, built with Astro. This is intended to replace the current site at `photos.ericqiu.io` once the custom domain is moved over.

During development, it is configured for a GitHub Pages project URL at `https://ericqiu.github.io/gallery-next/`.

## Development

```bash
npm install
npm run dev
```

## Media

The site currently uses a local media provider. Copy photos into `public/photos` with the same folder/key structure used by `src/data/photos.ts`.

Later, individual photo records can switch from `provider: 'local'` to `provider: 'r2'` without changing the page architecture.
