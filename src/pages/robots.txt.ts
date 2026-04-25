import { absoluteUrl } from '@/lib/urls';

export function GET() {
  return new Response(`User-agent: *\nAllow: /\nSitemap: ${absoluteUrl('/sitemap.xml')}\n`, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
