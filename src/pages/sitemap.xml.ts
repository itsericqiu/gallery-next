import { collections } from '@/data/collections';
import { photos } from '@/data/photos';
import { absoluteUrl } from '@/lib/urls';

export function GET() {
  const paths = [
    '/',
    '/places/',
    '/series/',
    '/archive/',
    '/about/',
    ...collections.filter((collection) => collection.slug !== '/' && collection.slug !== '/archive/').map((collection) => collection.slug),
    ...photos.map((photo) => `/photos/${photo.id}/`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${absoluteUrl(path)}</loc></url>`).join('\n')}
</urlset>`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
