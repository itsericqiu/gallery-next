export function withBase(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (base && normalized.startsWith(`${base}/`)) {
    return normalized;
  }

  return `${base}${normalized}` || normalized;
}

export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  return new URL(withBase(path), import.meta.env.SITE).toString();
}
