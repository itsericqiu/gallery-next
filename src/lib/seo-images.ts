import type { Collection } from '@/data/collections';
import { getPhoto, type Photo } from '@/data/photos';
import { getImage } from 'astro:assets';
import { photoAsset } from './photo-assets';

export type SeoImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export async function photoSeoImage(photo: Photo): Promise<SeoImage> {
  // Dedicated share transform: chat/social scrapers cap card images around 5MB
  // and some still mishandle webp, so serve a ~1200px jpeg with its real dims.
  const targetWidth = Math.min(photo.width, 1200);
  const image = await getImage({
    src: photoAsset(photo.asset.key),
    width: targetWidth,
    format: 'jpeg',
    quality: 'mid',
  });

  const width = Number(image.attributes.width ?? targetWidth);
  const height = Number(
    image.attributes.height ?? Math.round(targetWidth * (photo.height / photo.width)),
  );

  return {
    src: image.src,
    width,
    height,
    alt: photo.alt,
  };
}

export function collectionCoverPhoto(collection: Collection): Photo {
  return getPhoto(collection.coverPhotoId);
}

export async function collectionSeoImage(collection: Collection): Promise<SeoImage> {
  if (collection.id === 'selected') {
    return {
      src: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Photo mosaic with images from Iceland, Japan, Spain, and other places.',
    };
  }
  return photoSeoImage(collectionCoverPhoto(collection));
}
