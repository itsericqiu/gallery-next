import type { Photo } from '@/data/photos';
import { getImage } from 'astro:assets';
import type { GetImageResult, ImageOutputFormat, ImageQuality } from 'astro';
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

export async function photoPlaceholder(photo: Photo): Promise<string> {
  const image = await getPhotoImage(photo, {
    format: 'webp',
    quality: 35,
    width: 64,
  });

  return image.src;
}

function imageOptions(
  photo: Photo,
  variant: 'grid' | 'detail',
): { widths: number[]; format: ImageOutputFormat; quality: ImageQuality } {
  if (variant === 'detail') {
    return {
      format: 'webp',
      quality: 'high',
      widths: boundedWidths(photo.width, [1200, 2000]),
    };
  }

  return {
    format: 'webp',
    quality: 'mid',
    widths: boundedWidths(photo.width, [480, 960]),
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
