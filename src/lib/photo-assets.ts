import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>('/src/assets/photos/**/*.jpg', {
  eager: true,
});

const assets = new Map(
  Object.entries(modules).map(([path, module]) => [
    path.replace('/src/assets/photos/', ''),
    module.default,
  ]),
);

export function photoAsset(key: string): ImageMetadata {
  const asset = assets.get(key);

  if (!asset) {
    throw new Error(`Missing photo asset: ${key}`);
  }

  return asset;
}
