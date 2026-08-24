import path from 'node:path';
import type { Photo } from '@/data/photos';
import { getImage } from 'astro:assets';
import type { GetImageResult, ImageOutputFormat, ImageQuality } from 'astro';
import sharp from 'sharp';
import { photoAsset } from './photo-assets';

export type RenderedPhotoImage = {
  src: string;
  srcset: string;
  width: number;
  height: number;
};

export function aspectRatio(photo: Photo): string {
  return `${photo.width} / ${photo.height}`;
}

export async function photoImage(photo: Photo, variant: 'grid' | 'detail'): Promise<RenderedPhotoImage> {
  const image = await getPhotoImage(photo, imageOptions(photo, variant));

  return {
    src: image.src,
    srcset: image.srcSet.attribute,
    width: photo.width,
    height: photo.height,
  };
}

const placeholderCache = new Map<string, Promise<string>>();

export function photoPlaceholder(photo: Photo): Promise<string> {
  const cached = placeholderCache.get(photo.asset.key);
  if (cached) return cached;

  // Inline data URI (not a getImage file URL): placeholders as separate requests
  // are lowest-priority CSS fetches and starve behind photos on slow connections.
  const promise = sharp(path.join(process.cwd(), 'src/assets/photos', photo.asset.key))
    .resize({ width: 64 })
    .webp({ quality: 35 })
    .toBuffer()
    .then((buffer) => `data:image/webp;base64,${buffer.toString('base64')}`);

  placeholderCache.set(photo.asset.key, promise);
  return promise;
}

function imageOptions(
  photo: Photo,
  variant: 'grid' | 'detail',
): { width: number; widths: number[]; format: ImageOutputFormat; quality: ImageQuality } {
  // width caps the emitted fallback src at the top srcset rung; without it Astro
  // also generates a full-resolution transform per photo (80% of dist).
  if (variant === 'detail') {
    return {
      format: 'webp',
      quality: 'high',
      width: Math.min(photo.width, 2000),
      widths: boundedWidths(photo.width, [1200, 2000]),
    };
  }

  return {
    format: 'webp',
    quality: 'mid',
    width: Math.min(photo.width, 960),
    widths: boundedWidths(photo.width, [480, 640, 960]),
  };
}

function boundedWidths(originalWidth: number, widths: number[]): number[] {
  const bounded = widths.filter((width) => width < originalWidth);
  const finalWidth = Math.min(originalWidth, widths.at(-1) ?? originalWidth);

  return Array.from(new Set([...bounded, finalWidth]));
}

async function getPhotoImage(
  photo: Photo,
  options: { width?: number; widths?: number[]; format: ImageOutputFormat; quality: ImageQuality },
): Promise<GetImageResult> {
  return getImage({
    src: photoAsset(photo.asset.key),
    ...options,
  });
}

export function gridSizes(variant: 'editorial' | 'archive'): string {
  return variant === 'archive'
    ? '(max-width: 720px) 50vw, (max-width: 960px) 33vw, 25vw'
    : '(max-width: 720px) 50vw, 33vw';
}

export function detailSizes(): string {
  return '(max-width: 720px) 100vw, calc(100vw - 420px)';
}

export function collectionCardSizes(): string {
  return '(max-width: 720px) 100vw, 33vw';
}
